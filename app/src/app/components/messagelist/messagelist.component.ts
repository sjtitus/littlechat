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

  constructor(private messageService: MessageService, private tokenService: TokenService) {}

  // targetUser: setter hook (prop is bound from parent)
  @Input() set chatContact(contact: User) {
    this._chatContact = contact;
    console.log('MessageList: chat contact changed to ', contact);
    // trick to do an await in a non async function
    (async () => this.conversation = await this.GetConversation(this._chatContact))();
  }

  private async GetConversation(contact: User) {
    let conversation: Message[];
    let resp: GetConversationResponse;
    try {
      console.log(`MessageList::GetConversation: retrieving conversation with ${contact.email}`);
      resp = await this.messageService.GetConversation(contact.email);
    }
    catch (err) {
      console.log(`MessageList::GetConversation: ERROR retrieving conversation with ${contact.email}:`, err);
      this.errorText = err.message;
    }
    return conversation;
  }

  ngOnInit() {
  }

  // Lifecycle hook to keep msgs scrolled to the bottom when view changes (i.e. messages added)
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    // force the #msgarea DOM element to scroll to the bottom
    this.msgarea.nativeElement.scrollTop = this.msgarea.nativeElement.scrollHeight;
  }

}


