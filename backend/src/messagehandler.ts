import WebSocketServer from './websocketserver';
import { Message, MessageAck }  from '../../app/src/app/models/message';
import {Md5} from 'ts-md5';

export default class MessageHandler {

    constructor(private webSocketServer:WebSocketServer) {
    }

    public HandleSocket(socket: any) {
      console.log(`MessageHandler: managing socket ${socket.id}`);
      console.log(`MessageHandler: socket ${socket.id} joining user room ${socket.userdata.email}`);
      socket.join(socket.userdata.email);
      socket.on('message', (m,ack) => { this.OnMessage(socket,m,ack); } );
    }

    //_________________________________________________________________________
    // OnMessage
    // Handle an incoming littlechat message
    public async OnMessage(socket: any, message: Message, ack: Function) {
      console.log(`MessageHandler:OnMessage: incoming message from ${message.from}:`,message);
      const msgHash = Md5.hashStr(message.timeSent + message.content) as string;
      const messageAck: MessageAck = {
        hashCode: msgHash,
        timeReceived: new Date().toISOString()
      }
      // Acknowledge message receipt to client 
      ack(messageAck);
      // Log the message to the database
      // Broadcast the message to the audience
      socket.broadcast.to('happy@happy.com').send(message.content);
    }
}