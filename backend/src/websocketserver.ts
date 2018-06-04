import * as http from 'http';
import * as socketIo from 'socket.io';
import MessageHandler from './messagehandler';
import { Token } from './token';

export default class WebSocketServer {
    private server: http.Server;
    private io: SocketIO.Server;
    private messageHandler: MessageHandler;
    private port: number = 8080;

    constructor(server: http.Server) {
        this.server = http.createServer(); 
        this.io = socketIo(this.server,{ 
          serveClient: false, 
          pingInterval: 10000, 
          pingTimeout: 5000, 
          cookie: false 
        });
        this.io.use((socket, next) => {
          let authToken: string = socket.handshake.headers['authorization'];
          console.log(`WebSocketServer: socket ${socket.id}, auth: ${authToken}`);
          if (authToken != null && authToken.length > 0)
          { 
            console.log(`WebSocketServer: verify auth token: ${authToken}`);
            let authPayload;
            try {
              authPayload = Token.Verify(authToken);
            }
            catch (err) {
              console.log(`WebSocketServer: error: verify auth token failed: ${err}`);
            }
            console.log(`WebSocketServer: auth token payload`, authPayload);
          }
          if (true) {
            //return next();
            console.log(`WebSocketServer: throwing auth error`);
            return next(new Error('authentication error'));
          }
        }); 
        this.messageHandler = new MessageHandler(this);
    }

    public Start(): void {
        console.log(`WebSocketServer: listening on port ${this.port}`);
        this.io.listen(this.port);
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
