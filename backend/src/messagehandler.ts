import WebSocketServer from './websocketserver';
import { Message }  from '../../app/src/app/models/message';

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
      // Acknowledge that the message was received
      // Log the message to the database
      // Broadcast the message to the audience 
    }
}