/*______________________________________________________________________________
  Messagelist
  Fetches and displays the messages for the current chat target.
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
  // _______________________________________________________
  // Properties
  private _chatContact: User;                  // current chat target
  messagelist: Message[];                     // message history for target
  @ViewChild('msgarea') msgarea: ElementRef;  // #msgarea DOM element
  newMessagesChannel: Subscription;           // incoming new messages
  private currentUser: User;

  // _______________________________________________________
  // I/O
  // targetUser: setter hook (prop is bound from parent)
  @Input() set chatContact(contact: User) {
    this._chatContact = contact;
    console.log('Messagelist: chat contact changed to ', contact);
    this.messagelist = this.messageService.GetMessages(contact);
  }


  // _______________________________________________________
  // Methods
  constructor(private messageService: MessageService, private tokenService: TokenService) {
    // subscribe to new messages being broadcast by messageservice
    // so we can show them in our list while they're being pushed to the back end.
    this.newMessagesChannel = this.messageService.newMessageSource$.subscribe(
      message => {
        this.messagelist.push(message);
      }
    );
  }

  ngOnInit() {
    this.currentUser = this.tokenService.CurrentUser;
  }

  // Lifecycle hook to keep msgs scrolled to the bottom when view changes
  // (i.e. messages added)
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    // force the #msgarea DOM element to scroll to the bottom
    this.msgarea.nativeElement.scrollTop = this.msgarea.nativeElement.scrollHeight;
  }

}


