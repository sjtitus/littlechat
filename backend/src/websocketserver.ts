import { Server } from 'http';
import * as socketIo from 'socket.io';
import MessageHandler from './messagehandler';

export default class WebSocketServer {
    private server: Server;
    private io: SocketIO.Server;
    private messageHandler: MessageHandler;

    constructor(server: Server) {
        this.server = server; 
        this.io = socketIo(this.server,{ 
          serveClient: false, 
          pingInterval: 10000, 
          pingTimeout: 5000, 
          cookie: false 
        });
        this.io.use((socket, next) => {
          let header = socket.handshake.headers['authorization'];
          console.log(`WebSocketServer: socket ${socket.id}, auth: ${header}`);
          if (true) {
            return next();
          }
          //return next(new Error('authentication error'));
        });
        this.messageHandler = new MessageHandler(this);
    }

    public Start(): void {
        this.io.listen(this.server);
        this.io.on('connect', (socket: any) => { this.OnSocketConnect(socket); });
    }

    public OnSocketConnect(socket: any) {
      console.log(`WebSocketServer: socket ${socket.id} connected`);
      socket.on('disconnect', () => { this.OnSocketDisconnect(socket); });
      socket.on('error', (err) => { this.OnSocketError(socket, err); });
      this.messageHandler.HandleSocket(socket);
    }
    
    public OnSocketDisconnect(socket: any) {
      console.log(`WebSocketServer: socket ${socket.id} disconnected`);
    }
    
    public OnSocketError(socket: any, err) {
      console.log(`WebSocketServer: socket ${socket.id} error:`,err);
    }
}

/* Auth with tokens
const client = io({
  transportOptions: {
    polling: {
      extraHeaders: {
        'Authorization': 'Bearer abc'
      }
    }
  }
});

// server-side
const io = require('socket.io')();

// middleware
io.use((socket, next) => {
  let header = socket.handshake.headers['authorization'];
  if (isValidJwt(header)) {
    return next();
  }
  return next(new Error('authentication error'));
});
*/