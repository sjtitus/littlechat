/*______________________________________________________________________________
  MessageEntryComponent
  Accepts a message and sends it to the selected user (via MessageService).
________________________________________________________________________________
*/
import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { User } from '../../models/user';
import { Message } from '../../models/message';

@Component({
  selector: 'app-messageentry',
  templateUrl: './messageentry.component.html',
  styleUrls: ['../../app.component.css']
})

export class MessageentryComponent implements OnInit {

  @Input() targetUser: User;  // bound to parent

  constructor(private messageService: MessageService) {}

  ngOnInit() {}

  SendMessage(event: any) {
    const msg: Message = {content: event.target.value};
    console.log('MessageEntry: sending message:', msg.content, 'to user', this.targetUser);
    this.messageService.SendMessage(this.targetUser, msg);
    event.target.value = '';  // clear the UI
  }
}
