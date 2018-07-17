import WebSocketServer from './websocketserver';
import { Message, MessageAck }  from '../../app/src/app/models/message';
import {Md5} from 'ts-md5';

export default class MessageHandler {

    constructor(private webSocketServer:WebSocketServer) {
    }

    public HandleSocket(socket: any) {
      console.log(`MessageHandler: managing socket ${socket.id}`);
      console.log(`MessageHandler: socket ${socket.id} joining user room ${socket.userdata.email}`);
      socket.join(`room-${socket.userdata.id}`);
      socket.on('message', (m,ack) => { this.OnMessage(socket,m,ack); } );
    }

    //_________________________________________________________________________
    // OnMessage
    // Handle an incoming littlechat message
    public async OnMessage(socket: any, message: Message, ack: Function) {
      console.log(`MessageHandler::OnMessage: incoming message from ${message.from} to ${message.to}`);
      const msgHash = Md5.hashStr(message.timeSent + message.content) as string;
      const messageAck: MessageAck = {
        hashCode: msgHash,
        timeReceived: new Date().toISOString()
      }
      // Acknowledge message receipt to client
      console.log(`MessageHandler::OnMessage: acknowledging message`);
      ack(messageAck);
      // TODO: Log the message to the database
      // Broadcast to the recipient(s) (if they are logged in?)
      console.log(`MessageHandler::OnMessage: broadcasting message`);
      socket.broadcast.to(`room-${message.to}`).send(message.content);
    }
}