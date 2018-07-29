/*______________________________________________________________________________
  Home
  Home (main page) component for littlechat app.
  Uses 3 child components: UserList, MessageList, MessageEntry.
________________________________________________________________________________
*/
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { TokenService } from '../../services/token.service';
import { WebSocketService } from '../../services/websocket.service';
import { MonitorService } from '../../services/monitor.service';
import { MessageService } from '../../services/message.service';

const debug = require('debug')('Home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../app.component.css']
})

export class HomeComponent implements OnInit {

  chatContact: User;
  headerMessage = 'Select Chat Partner';
  WebSocketErrorText = '';

  constructor(private tokenService: TokenService,
      private webSocketService: WebSocketService,
      private messageService: MessageService
    ) {}

  public SetChatContact(contact: User) {
    debug(`HomeComponent::SetChatContact: chat contact set to ${contact.email}`);
    this.chatContact = contact;
    this.headerMessage = `${this.chatContact.firstname} ${this.chatContact.lastname}`;
  }

  public get CurrentUser(): User {
    return this.tokenService.CurrentUser;
  }

  ngOnInit() {
    debug(`HomeComponent::Init: user is ${this.CurrentUser.email}`);

    // Start web socket service
    debug(`HomeComponent::Init: starting client web socket service`);
    const authToken: string = this.tokenService.Retrieve();
    this.webSocketService.Start(authToken);

    // Start message service
    debug(`HomeComponent::Init: client message service start`);
    this.messageService.Start()
    .then(  () => { debug(`HomeComponent::Init: client message service start: ok`); })
    .catch( (err) => { console.error(`HomeComponent::Init: client message service start: ERROR: ${err.message}`); });

  }

}
