/*______________________________________________________________________________
  Messagelist
  Fetches and displays the conversation with the current chat contact.
________________________________________________________________________________
*/
import { Component, Input, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { User, GetConversationResponse } from '../../models/user';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { Subscription } from 'rxjs/Subscription';
import { TokenService } from '../../services/token.service';
import { MonitorService } from '../../services/monitor.service';
import { StatusMonitorStatus } from '../../models/statusmonitor';

@Component({
  selector: 'app-messagelist',
  templateUrl: './messagelist.component.html',
  styleUrls: ['../../app.component.css']
})

export class MessagelistComponent implements OnInit, AfterViewChecked {

  conversation: Message[];
  errorText: string;

  @ViewChild('msgarea') msgarea: ElementRef;  // #msgarea DOM element

  //newMessagesChannel: Subscription;         // incoming new messages

  // current chat contact
  private _chatContact: User;

  constructor(private messageService: MessageService, private tokenService: TokenService,
      private monitorService: MonitorService ) {}

  // targetUser: setter hook (prop is bound from parent)
  @Input() set chatContact(contact: User) {
    this._chatContact = contact;
    console.log('MessageList: chat contact changed to ', contact);
    // trick to do an await in a non async function
    (async () => this.conversation = await this.GetConversation(this._chatContact))();
  }

  private async GetConversation(contact: User) {
    console.log(`MessageList::GetConversation: getting conversation with ${contact.email}`);
    this.errorText = null;
    const resp: GetConversationResponse = await this.messageService.GetConversation(contact);
    if (resp.error) {
      console.error(`MessageList::GetConversation: error: ${resp.errorMessage}`);
      this.errorText = resp.errorMessage;
      this.monitorService.ChangeStatus('API', StatusMonitorStatus.Error, this.errorText);
    }
    return resp.conversation;
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


