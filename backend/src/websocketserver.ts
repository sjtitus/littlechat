import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

export default class WebSocketServer {
    public static readonly PORT:number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.port = process.env.PORT || WebSocketServer.PORT;
        this.io = socketIo(this.server);
        //this.listen(); 
    }

    public Start(): void {
        this.server.listen(this.port, () => {
            console.log('WebSocketServer: starting server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('WebSocketServer: connected client on port %s.', this.port);
            socket.on('message', (m) => {
                console.log('WebSocketServer (message): %s', JSON.stringify(m));
                //this.io.emit('message', m);
            });
            socket.on('disconnect', () => {
                console.log('WebSocketServer: client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}