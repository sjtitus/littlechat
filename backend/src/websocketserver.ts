import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

export default class WebSocketServer {
    private server: Server;
    private io: SocketIO.Server;

    constructor(server: Server) {
        this.server = server; 
        this.io = socketIo(this.server,{ 
          serveClient: false, 
          pingInterval: 10000, 
          pingTimeout: 5000, 
          cookie: false 
        });
    }

    public Start(): void {
        this.io.listen(this.server);
        this.io.on('connect', (socket: any) => { this.OnSocketConnect(socket); });
    }

    public OnSocketConnect(socket: any) {
      console.log('WebSocketServer: connected client');
      socket.on('message', (m) => { this.OnSocketMessage(m); });
      socket.on('disconnect', () => { this.OnSocketDisconnect(); });

    }
    
    public OnSocketDisconnect() {
      console.log('WebSocketServer: socket disconnected');
    }

    public OnSocketMessage(msg: any) {
      console.log('WebSocketServer (message): %s', JSON.stringify(msg));
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