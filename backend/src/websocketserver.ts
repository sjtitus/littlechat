import * as http from 'http';
import * as socketIo from 'socket.io';
import MessageHandler from './messagehandler';
import { Token } from './token';

export default class WebSocketServer {
    private server: http.Server;
    private io: SocketIO.Server;
    private messageHandler: MessageHandler;
    private port: number = 8080;

    private static instance: WebSocketServer;

    public static GetInstance(): WebSocketServer {
      if (!WebSocketServer.instance) {
        WebSocketServer.instance = new WebSocketServer();
      }
      return WebSocketServer.instance;
    }

    private constructor() {
        this.server = http.createServer();
        this.io = socketIo(this.server,{
          serveClient: false,
          pingInterval: 10000,
          pingTimeout: 5000,
          cookie: false
        });
        this.io.use((socket, next) => { return this.CheckSocketAuth(socket, next); });
        this.messageHandler = new MessageHandler(this);
    }

    public Broadcast(eventName: string, arg: any) {
      console.log(`WebSocketServer::Broadcast: broadcasting ${arg}`);
      this.io.sockets.emit(eventName, arg);
    }

    private CheckSocketAuth(socket, next) {
          let authToken: string = socket.handshake.headers['authorization'];
          console.log(`WebSocketServer::CheckSocketAuth: socket ${socket.id}`);
          if (authToken != null && authToken.length > 0)
          {
            console.log(`WebSocketServer::CheckSocketAuth: token: ${authToken}`);
            let authPayload;
            try {
              authPayload = Token.Verify(authToken);
              socket.userdata = authPayload;
              console.log(`WebSocketServer::CheckSocketAuth: auth payload:`,authPayload);
            }
            catch (err) {
              console.log(`WebSocketServer::CheckSocketAuth: error: token verify failed: ${err}`);
              return next(new Error(`WebSocketServer::CheckSocketAuth: error: authentication failed: ${err}`));
            }
          }
          else {
            return next(new Error(`WebSocketServer::CheckSocketAuth: error: authentication failed, missing auth header`));
          }
          console.log(`WebSocketServer::CheckSocketAuth: verify auth token success`);
          return next();
    }


    public Start(): void {
        console.log(`WebSocketServer: listening on port ${this.port}`);
        this.io.listen(this.port);
        this.io.on('connect', (socket: any) => { this.OnSocketConnect(socket); });
    }

    public OnSocketConnect(socket: any) {
      console.log(`WebSocketServer:OnSocketConnect: socket ${socket.id} connected`);
      console.log(`WebSocketServer:OnSocketConnect: socket ${socket.id} userdata`, socket.userdata);
      socket.on('disconnect', () => { this.OnSocketDisconnect(socket); });
      socket.on('error', (err) => { this.OnSocketError(socket, err); });
      this.messageHandler.HandleSocket(socket);
    }

    public OnSocketDisconnect(socket: any) {
      console.log(`WebSocketServer::OnSocketDisconnect: socket ${socket.id} disconnected`);
    }

    public OnSocketError(socket: any, err) {
      console.log(`WebSocketServer:OnSocketError: socket ${socket.id} error:`,err);
    }
}
