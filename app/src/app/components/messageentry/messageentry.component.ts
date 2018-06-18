/*______________________________________________________________________________
  MessageEntryComponent
  Accepts a message and sends it to the selected user (via MessageService).
________________________________________________________________________________
*/
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { Message, MessageAck } from '../../models/message';
import { TokenService } from '../../services/token.service';
import { MessageService } from '../../services/message.service';
import { WebSocketService } from '../../services/websocket.service';
//import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-messageentry',
  templateUrl: './messageentry.component.html',
  styleUrls: ['../../app.component.css']
})

export class MessageentryComponent implements OnInit {

  private currentUser: User;
  @Input() chatContact: User;

  constructor(private messageService: MessageService, private tokenService: TokenService,
    private webSocketService: WebSocketService) {}

  ngOnInit() {
    console.log('MessageEntry Init: WebSocketService token:', this.webSocketService.authToken);
    this.currentUser = this.tokenService.CurrentUser;
    console.log('MessageEntry Init: current user', this.currentUser);
    this.webSocketService.onEvent('error').subscribe(
      (err) => {
          console.log('MessageEntry: catching websocketservice error: ', err);
      }
    );
  }

  SendMessage(event: any) {
    const content: string = event.target.value as string;
    console.log('MessageEntry: sending message:', content, 'to user', this.chatContact);
    const timeSent: string = new Date().toISOString();
    const hashCode = '';  //Md5.hashStr(timeSent + content) as string;
    const message: Message = {
      from: this.currentUser.id,
      to: this.chatContact.id,
      content: content,
      timeSent: timeSent,
      hashCode: hashCode
    };
    this.webSocketService.send('message', message, (ack: MessageAck) => { this.CheckAck(ack, hashCode); });
    event.target.value = '';  // clear the UI
  }

  private CheckAck(ack: MessageAck, hashCode: string) {
    console.log(`MessageEntry: ack received for message ${hashCode}`);
    if (ack.hashCode !== hashCode) {
      throw new Error(`MessageEntry: message acknowledgement failed: sent (${hashCode}) != received (${ack.hashCode})`);
    }
  }

}
