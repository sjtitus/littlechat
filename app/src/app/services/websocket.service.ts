import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Message, MessageAck } from '../models/message';
import { Md5 } from 'ts-md5';
import { MonitorService } from './monitor.service';
import * as socketIo from 'socket.io-client';
import { StatusMonitorStatus } from '../models/statusmonitor';

const SERVER_URL = 'http://localhost:4200';

@Injectable()
export class WebSocketService {
    private socket;
    private _authToken: string;
    private pendingMessages:  { [s: string]: Message; } = {};
    private failedMessages:   { [s: string]: Message; } = {};
    private corruptMessages:  { [s: string]: Message; } = {};
    private readonly ackTimeout = 10;

    constructor(private monitorService: MonitorService) {}

    public Start(token: string) {
        console.log(`WebSocketService: starting service (URL ${SERVER_URL})`);
        console.log(`WebSocketService: authToken: ${token})`);
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
        console.log('SocketIO object: ', this.socket);
        this.socket.on('connect', () => this.WebSocketStatus('connect', StatusMonitorStatus.Ok));
        this.socket.on('reconnect_failed', (e) => this.WebSocketStatus('reconnect failed', StatusMonitorStatus.Error, e));
        this.socket.on('reconnect_error', (e) => this.WebSocketStatus('reconnect', StatusMonitorStatus.Error, e));
        this.socket.on('connect_error', (e) => this.WebSocketStatus('connect', StatusMonitorStatus.Error, e));
        this.socket.on('connect_timeout', (e) => this.WebSocketStatus('connect timeout', StatusMonitorStatus.Error, e));
        this.socket.on('reconnect', () =>  this.WebSocketStatus('reconnect', StatusMonitorStatus.Ok));
        //this.socket.on('reconnect_attempt', () => { console.log('reconnect_attempt'); });
        //this.socket.on('reconnecting', () => { console.log('reconnecting'); });
    }

    public WebSocketStatus(eventName: string, s: StatusMonitorStatus, err?: any) {
      let msg: string;
      if (err !== undefined) {
        msg = `Websocket error: ${eventName}: ${err.message} (${err.description})`;
      } else {
        msg = `Websocket status: ${eventName}: ${StatusMonitorStatus[s]}`;
      }
      console.log(`WebSocketService: status change to '${StatusMonitorStatus[s]}': ${msg} (${eventName})`);
      this.monitorService.ChangeStatus('Websocket', s, msg);
    }

    public get authToken(): string { return this._authToken; }
    public get Connected(): boolean { return this.socket.connected; }

    public OnEvent(event: string): Observable<any> {
      console.log(`WebSocketService: Setting up event handler for '${event}'`);
      return new Observable<Event>(observer => {
          this.socket.on(event, (data) => observer.next(data));
      });
    }

    //_________________________________________________________________________
    // SendMessage
    // Send a message on websocket 'message' channel
    public async SendMessage(message: Message) {
        console.log(`WebSocketService::SendMessage: sending message '${message.content}' to user ${message.to}`);
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


    //=========================================
    // Private
    //=========================================

    //_________________________________________________________________________
    // ValidateSend
    // Validate that a message was correctly received by the back end.
    // Invoked when we receive a message ack from the backend for a specified
    // local message.
    private ValidateSend( ack: MessageAck, localMsgId, resolve, reject, failTrigger) {
      // we got an ack: cancel the timeout that will fail this message
      clearTimeout(failTrigger);
      console.log(`WebSocketService::ValidateSend: validating message '${localMsgId}'`);
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
        console.log(`WebSocketService::ValidateSend: message ${localMsgId} validation failed`);
        reject(new Error(err));
      }
      else {
        console.log(`WebSocketService::ValidateSend: message ${localMsgId} validated`);
        resolve(localMsgId);
      }
    }

    private FailSend(pendingMsgId, reject) {
      if (pendingMsgId in this.pendingMessages) {
        console.log(`MessageEntry::SendFailed: send failed for message '${pendingMsgId}'`);
        this.failedMessages[pendingMsgId] = this.pendingMessages[pendingMsgId];
        delete this.pendingMessages[pendingMsgId];
        reject(new Error(`MessageEntry: send failed for message '${pendingMsgId}': timeout`));
      }
    }


}
