/*______________________________________________________________________________
  MessageEntryComponent
  Accepts a message and sends it to the selected user (via MessageService).
________________________________________________________________________________
*/
import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { User } from '../../models/user';
import { Message } from '../../models/message';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-messageentry',
  templateUrl: './messageentry.component.html',
  styleUrls: ['../../app.component.css']
})

export class MessageentryComponent implements OnInit {

  private currentUser: User;
  @Input() chatContact: User;

  constructor(private messageService: MessageService, private tokenService: TokenService) {}

  ngOnInit() {
    this.currentUser = this.tokenService.CurrentUser;
  }

  SendMessage(event: any) {
    const content = event.target.value;
    console.log('MessageEntry: sending message:', content, 'to user', this.chatContact);
    const message: Message = {
      to: this.chatContact.id,
      from: this.currentUser.id,
      content: content,
      sent: new Date().toISOString(),
      stored: null
    };
    this.messageService.SendMessage(message);
    event.target.value = '';  // clear the UI
  }
}
