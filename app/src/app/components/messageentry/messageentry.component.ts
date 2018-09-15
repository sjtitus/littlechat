/*______________________________________________________________________________
  MessageEntryComponent
  Accepts a message and sends it to the selected contact.
________________________________________________________________________________
*/
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { Message, MessageAck } from '../../models/message';
import { MessageService } from '../../services/message.service';
import { TokenService } from '../../services/token.service';

const debug = require('debug')('MessageEntry');

@Component({
  selector: 'app-messageentry',
  templateUrl: './messageentry.component.html',
  styleUrls: ['../../app.component.css']
})

export class MessageentryComponent implements OnInit {

  private _chatContact: User;   // Contact we're chatting with

  //private pendingMessages: { [s: string]: Message; } = {};
  //private readonly ackTimeout = 10;

  @Input() set chatContact(contact: User) {
    debug('MessageEntry: chat contact changed to ', contact);
    this._chatContact = contact;
  }

  constructor(
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  public async SendMessage(event: any) {
    try {
      debug(`MessageEntry::SendMessage: send message to ${this._chatContact.email}`);
      // construct message
      const content: string = event.target.value as string;
      const timeSent: string = new Date().toISOString();
      const message: Message = {
        from: this.tokenService.CurrentUser.id,
        to: this._chatContact.id,
        content: content,
        timeSent: timeSent,
      };
      // send message 
      await this.messageService.SendMessage(message);
      //debug(`MessageEntry::SendMessage: send response: ${sendResp}`);
    }
    catch (err) {
        console.error(`MessageEntry::SendMessage: error`, err);
        //this.monitorService.ChangeStatus('Websocket', StatusMonitorStatus.Error, this.errorText);
    }
    finally {
      event.target.value = '';
    }
  }

}
