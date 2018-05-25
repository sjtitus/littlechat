import WebSocketServer from './websocketserver';
import { Message, MessageAck }  from '../../app/src/app/models/message';

export default class MessageHandler {

    constructor(private webSocketServer:WebSocketServer) {
    }

    public HandleSocket(socket: any) {
      console.log(`MessageHandler: managing socket ${socket.id}`);
      socket.on('message', (m,ack) => { this.OnMessage(socket,m,ack); } ); 
    }

    //_________________________________________________________________________
    // OnMessage
    // Handle an incoming littlechat message 
    public async OnMessage(socket: any, message: Message, ack: Function) {
      console.log(`MessageHandler:OnMessage: incoming message from ${message.from}:`,message);
      const messageAck: MessageAck = {
        hashCode: message.hashCode,
        timeReceived: new Date().toISOString()
      }
      // Acknowledge message receipt to client 
      ack(messageAck); 
      // Log the message to the database
      // Broadcast the message to the audience 
    }
}