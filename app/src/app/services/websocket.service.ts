import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message, MessageAck } from '../models/message';
import { Md5 } from 'ts-md5';
import { MonitorService } from './monitor.service';
import * as socketIo from 'socket.io-client';
import { StatusMonitorStatus } from '../models/statusmonitor';

const SERVER_URL = 'http://localhost:4200';

const dbgpackage = require('debug');
const debug = dbgpackage('WebSocketService');

@Injectable()
export class WebSocketService {

    // socket used to send/receive msgs to/from backend
    private socket;

    // token for backend auth 
    private _authToken: string;

    // messages sent but not yet acknowledged
    private pendingMessages:  { [s: string]: Message; } = {};

    // messages that failed to send
    private failedMessages:   { [s: string]: Message; } = {};

    // messages corrupted in transit
    private corruptMessages:  { [s: string]: Message; } = {};

    // time to wait for backend 
    private readonly ackTimeout = 10;

    // publish/subscribe for incoming messages
    public OnIncomingMessage$: Subject<Message>;



    constructor(private monitorService: MonitorService) {
      this.OnIncomingMessage$ = new Subject<Message>();
    }

    //_________________________________________________________________________
    // Start 
    // Start the service: creates a socket connection to the backend and
    // connects the socket, sets up monitoring to make socket status and
    // errors available, and sets up publishing of incoming messages. 
    public Start(token: string) {
        debug(`WebSocketService: starting service (URL ${SERVER_URL})`);
        this._authToken = token;
        this.socket = socketIo(SERVER_URL, {
            path: '/mysock',
            autoConnect: true,
            transportOptions: {
              polling: {
                extraHeaders: {
                  'Authorization': this._authToken
                }
              }
            }
        });
        this.SetupMonitoring();
        // publish incoming messages 
        this.socket.on('message',
            (msg) =>  {
              debug(`WebSocketService: incoming message:`, msg);
              this.OnIncomingMessage$.next(msg);
            }
          );
    }


    //_________________________________________________________________________
    // Current connected to back end? 
    public get Connected(): boolean {
      return this.socket.connected;
    }


    //_________________________________________________________________________
    // SendMessage
    // Send a message on websocket 'message' channel
    public async SendMessage(message: Message) {
        debug(`WebSocketService::SendMessage: sending message '${message.content}' to user ${message.to}`);
        const msgId = Md5.hashStr(message.timeSent + message.content) as string;
        return new Promise( (resolve, reject) => {
          // Socket is disconnected, don't even try to send message
          if (!this.socket.connected) {
            reject(new Error('WebSocketService::SendMessage: send failed: websocket connection is down'));
          }
          else {
            // keep track of pending messages: sent but not acked
            this.pendingMessages[msgId] = message;
            // fail if message has not been acknowledged within timeout period
            const failTrigger = setTimeout(() => this.FailSend(msgId, reject), this.ackTimeout * 1000);
            // send the message, validate backend response
            this.socket.emit('message', message,
              (ack: MessageAck) => { this.ValidateSend(ack, msgId, resolve, reject, failTrigger); });
          }
        });
    }



    //
    // Private
    //

    //_________________________________________________________________________
    // SetupMonitoring 
    // Setup service monitoring: change the websocket service status based
    // on the state of the connection with the websocket back end. 
    private SetupMonitoring() {
        this.socket.on('connect', () => this.SetWebSocketStatus('connect', StatusMonitorStatus.Ok));
        this.socket.on('reconnect', () =>  this.SetWebSocketStatus('reconnect', StatusMonitorStatus.Ok));
        this.socket.on('reconnect_failed', (e) => this.SetWebSocketStatus('reconnect failed', StatusMonitorStatus.Error, e));
        this.socket.on('reconnect_error', (e) => this.SetWebSocketStatus('reconnect', StatusMonitorStatus.Error, e));
        this.socket.on('connect_error', (e) => this.SetWebSocketStatus('connect', StatusMonitorStatus.Error, e));
        this.socket.on('connect_timeout', (e) => this.SetWebSocketStatus('connect timeout', StatusMonitorStatus.Error, e));
        //this.socket.on('reconnect_attempt', () => { debug('reconnect_attempt'); });
        //this.socket.on('reconnecting', () => { debug('reconnecting'); });
    }

    //_________________________________________________________________________
    // WebSocketStatus
    // Set the monitorservice status of the Websocket service 
    private SetWebSocketStatus(eventName: string, s: StatusMonitorStatus, err?: any) {
      let msg: string;
      if (err !== undefined) {
        msg = `Websocket error: ${eventName}: ${err.message} (${err.description})`;
      } else {
        msg = `Websocket status: ${eventName}: ${StatusMonitorStatus[s]}`;
      }
      debug(`WebSocketService: status change to '${StatusMonitorStatus[s]}': ${msg} (${eventName})`);
      this.monitorService.ChangeStatus('Websocket', s, msg);
    }

    //_________________________________________________________________________
    // ValidateSend
    // Validate that a message was correctly received by the back end.
    // Invoked when we receive a message ack from the backend for a specified
    // local message.
    private ValidateSend( ack: MessageAck, localMsgId, resolve, reject, failTrigger) {
      // we got an ack: cancel the timeout that will fail this message
      clearTimeout(failTrigger);
      debug(`WebSocketService::ValidateSend: validating message '${localMsgId}'`);
      let err: string = null;
      // corner case: we've already failed (timed out) and are getting a late response.
      // warn and throw the message back into the pending state so we can process it below.
      if (localMsgId in this.failedMessages) {
        console.warn(`WebSocketService::ValidateSend: warning: late response for failed message '${localMsgId}`);
        this.pendingMessages[localMsgId] = this.failedMessages[localMsgId];
        delete this.failedMessages[localMsgId];
      }
      // We expect the message to be pending
      if (!(localMsgId in this.pendingMessages)) {
        err = `WebSocketService::ValidateSend: unexpected ack for non-pending message '${localMsgId}'`;
      }
      else {
        // integrity check: backend correctly received message we sent?
        const msgValid = (ack.hashCode === localMsgId);
        if (!msgValid) {
          this.corruptMessages[localMsgId] = this.pendingMessages[localMsgId];
          err = `WebSocketService::ValidateSend: message ${localMsgId} is corrupt`;
        }
        // valid or not, we delete it from pending
        delete this.pendingMessages[localMsgId];
      }
      // resolve or reject based on error
      if (err != null) {
        debug(`WebSocketService::ValidateSend: message ${localMsgId} validation failed`);
        reject(new Error(err));
      }
      else {
        debug(`WebSocketService::ValidateSend: message ${localMsgId} validated`);
        resolve(localMsgId);
      }
    }

    //_________________________________________________________________________
    // FailSend
    // Log a message send failure. Happens when back end has not acknowledged
    // message receipt in ackTimeout seconds. 
    private FailSend(pendingMsgId, reject) {
      if (pendingMsgId in this.pendingMessages) {
        debug(`MessageEntry::SendFailed: send failed for message '${pendingMsgId}'`);
        this.failedMessages[pendingMsgId] = this.pendingMessages[pendingMsgId];
        delete this.pendingMessages[pendingMsgId];
        reject(new Error(`MessageEntry: send failed for message '${pendingMsgId}': timeout`));
      }
    }

}
