import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../models/message';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class WebSocketService {
    private socket;

    constructor() {
        console.log(`WebSocketService: initializing (URL ${SERVER_URL})`);
        this.socket = socketIo(SERVER_URL, { autoConnect: true });
    }

    public send(event: string, message: Message, callback?: (returnmsg: any) => void): void {
        console.log(`WebSocketService: sending message:`, message);
        this.socket.emit(event, message, callback);
    }

    public onEvent(event: string): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    /*
    public onMessage(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('message', (data: string) => observer.next(data));
        });
    }
    */

}
