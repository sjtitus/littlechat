import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../models/message';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:4200';

@Injectable()
export class WebSocketService {
    private socket;
    private _authToken: string;

    constructor() {}

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
        console.log(`Client WebSocketService: installing error handler`);
        this.socket.on('error', (err) => { console.log('Client WebSocketService ERROR!: ', err); });
    }

    public get authToken(): string { return this._authToken; }

    public send(event: string, message: Message, callback?: (returnmsg: any) => void): void {
        console.log(`WebSocketService: sending message:`, message);
        this.socket.emit(event, message, callback);
    }

    public onEvent(event: string): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

}
