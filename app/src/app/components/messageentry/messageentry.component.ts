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
//import {Md5} from 'ts-md5';
import { StatusMonitorStatus } from '../../models/statusmonitor';
import { MonitorService } from '../../services/monitor.service';

@Component({
  selector: 'app-messageentry',
  templateUrl: './messageentry.component.html',
  styleUrls: ['../../app.component.css']
})

export class MessageentryComponent implements OnInit {

  private _chatContact: User;   // Contact we're chatting with
  public errorText: string;

  //private pendingMessages: { [s: string]: Message; } = {};
  //private readonly ackTimeout = 10;

  @Input() set chatContact(contact: User) {
    console.log('MessageEntry: chat contact changed to ', contact);
    this._chatContact = contact;
  }

  constructor(private tokenService: TokenService, private webSocketService: WebSocketService,
      private monitorService: MonitorService) {}

  ngOnInit() {}

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
        this.monitorService.ChangeStatus('Websocket', StatusMonitorStatus.Error, this.errorText);
    }
    finally {
      event.target.value = '';
    }
  }

}
