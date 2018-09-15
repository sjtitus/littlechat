/*______________________________________________________________________________
  Messagelist
  Fetches and displays the conversation with the current chat contact.
________________________________________________________________________________
*/
import { Component, Input, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { User } from '../../models/user';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { Conversation } from '../../models/conversation';
import { Subscription } from 'rxjs/Subscription';
import { TokenService } from '../../services/token.service';
import { MonitorService } from '../../services/monitor.service';
import { StatusMonitorStatus } from '../../models/statusmonitor';
import { isNull } from 'util';

const dbgpackage = require('debug');
const debug = dbgpackage('MessageList');

@Component({
  selector: 'app-messagelist',
  templateUrl: './messagelist.component.html',
  styleUrls: ['../../app.component.css']
})

export class MessagelistComponent implements OnInit, AfterViewChecked {

  conversation: Conversation | null;
  errorText: string;

  @ViewChild('msgarea') msgarea: ElementRef;  // #msgarea DOM element

  //newMessagesChannel: Subscription;         // incoming new messages

  // current chat contact
  private _chatContact: User;

  constructor(
      private messageService: MessageService,
      private tokenService: TokenService,
      private monitorService: MonitorService
  ) {
    this.conversation = {} as any;
    this.conversation.messages = [];
  }

  // targetUser: setter hook (prop is bound from parent)
  @Input() set chatContact(contact: User) {
    this._chatContact = contact;
    debug('MessageList: chat contact changed to ', contact);
    this.conversation = contact.conversation;
    if (!isNull(this.conversation)) {
      this.messageService.GetConversationMessages(this.conversation, true).then(
        () => { debug(`MessageList::ChatContact: got ${this.conversation.messages.length} conversation messages`); }
      );
    }
  }

  ngOnInit() {}

  // Lifecycle hook to keep msgs scrolled to the bottom when view changes (i.e. messages added)
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    // force the #msgarea DOM element to scroll to the bottom
    this.msgarea.nativeElement.scrollTop = this.msgarea.nativeElement.scrollHeight;
  }

}


