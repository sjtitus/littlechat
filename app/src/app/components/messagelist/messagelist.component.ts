/*______________________________________________________________________________
  Messagelist
  Fetches and displays the conversation with the current chat contact.
________________________________________________________________________________
*/
import { Component, Input, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { User } from '../../models/user';
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

  @ViewChild('msgarea') msgarea: ElementRef;  // #msgarea DOM element

  //newMessagesChannel: Subscription;         // incoming new messages

  // current chat contact
  private _chatContact: User;

  // targetUser: setter hook (prop is bound from parent)
  @Input() set chatContact(contact: User) {
    this._chatContact = contact;
    console.log('MessageList: chat contact changed to ', contact);
    this.GetConversation(this._chatContact);
  }

  private GetConversation(contact: User) {
    const convPromise = this.messageService.GetConversation(contact.email);
    convPromise.then(
      (conv) => { this.conversation = conv; },
      (err) => { console.log(`MessageList: GetConversation promise error`, err); }
    )
    .catch( (err) => console.log(`MessageList: GetConversation catch error`, err) );
  }

  // _______________________________________________________
  // Methods
  constructor(private messageService: MessageService, private tokenService: TokenService) {
    /*
    this.newMessagesChannel = this.messageService.newMessageSource$.subscribe(
      message => {
        this.messagelist.push(message);
      }
    );
    */
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


