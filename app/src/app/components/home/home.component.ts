/*______________________________________________________________________________
  Home
  Home (main page) component for littlechat app.
  Uses 3 child components: UserList, MessageList, MessageEntry.
________________________________________________________________________________
*/
import { Component, Output, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { TokenService } from '../../services/token.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../app.component.css']
})

export class HomeComponent implements OnInit {

  chatContact: User;   // user we're chatting with
  headerMessage = 'Select Chat Partner';
  currentUser: User;

  constructor( private tokenService: TokenService, private webSocketService: WebSocketService) {}

  public SetChatContact(contact: User) {
    this.chatContact = contact;
    this.headerMessage = this.chatContact.email;
  }

  ngOnInit() {
    this.currentUser = this.tokenService.CurrentUser;
    const authToken: string = this.tokenService.Get('littlechatToken');
    console.log('HomeComponent: currentUser:', this.currentUser);
    console.log(`HomeComponent: instantiating WebSocketService with token=${authToken}`);
    this.webSocketService.Start(authToken);
  }


}
