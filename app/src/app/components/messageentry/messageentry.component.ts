/*______________________________________________________________________________
  MessageEntryComponent
  Accepts a message and sends it to the selected contact.
________________________________________________________________________________
*/
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { Message, MessageAck } from '../../models/message';
import { TokenService } from '../../services/token.service';
import { WebSocketService } from '../../services/websocket.service';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-messageentry',
  templateUrl: './messageentry.component.html',
  styleUrls: ['../../app.component.css']
})

export class MessageentryComponent implements OnInit {

  // Contact we're chatting with
  private _chatContact: User;

  private pendingMessages: { [s: string]: Message; } = {};

  private readonly ackTimeout = 10;

  public errorText: string;

  @Input() set chatContact(contact: User) {
    console.log('MessageEntry: chat contact changed to ', contact);
    this._chatContact = contact;
  }

  constructor(private tokenService: TokenService,
    private webSocketService: WebSocketService) {}

  ngOnInit() {
    //console.log('MessageEntry Init: WebSocketService token:', this.webSocketService.authToken);
    this.webSocketService.OnEvent('error').subscribe(
      (err) => {
          console.error('MessageEntry: caught websocketservice error: ', err);
      }
    );
  }

  public async SendMessage(event: any) {
    try {
      this.errorText = null;
      console.log(`MessageEntry::SendMessage: send message to ${this._chatContact.email}`);
      // construct message
      const content: string = event.target.value as string;
      const timeSent: string = new Date().toISOString();
      const message: Message = {
        from: this.tokenService.CurrentUser.id,
        to: this._chatContact.id,
        content: content,
        timeSent: timeSent,
      };
      // send message via websocket
      const sendResp = await this.webSocketService.SendMessage(message);
      console.log(`MessageEntry::SendMessage: send response: ${sendResp}`);
    }
    catch (err) {
        console.error(`MessageEntry::SendMessage: error`, err);
        this.errorText = err.message;
    }
    finally {
      event.target.value = '';
    }
  }

}
