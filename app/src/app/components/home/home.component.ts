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

  chatContact: User;
  headerMessage = 'Select Chat Partner';
  WebSocketErrorText = '';

  constructor( private tokenService: TokenService, private webSocketService: WebSocketService) {}

  public SetChatContact(contact: User) {
    console.log(`HomeComponent::SetChatContact: chat contact set to ${contact.email}`);
    this.chatContact = contact;
    this.headerMessage = `${this.chatContact.firstname} ${this.chatContact.lastname}`;
  }

  public get CurrentUser(): User {
    return this.tokenService.CurrentUser;
  }

  ngOnInit() {
    console.log(`HomeComponent::Init: current user is ${this.CurrentUser.email}`);
    console.log(`HomeComponent::Init: instantiating client web socket service`);
    const authToken: string = this.tokenService.Retrieve();
    this.webSocketService.Start(authToken);
    this.webSocketService.OnEvent('error').subscribe((err) => this.HandleWebSocketError(err));
    this.webSocketService.OnEvent('message').subscribe(
      (msg) => {
          console.log('HomeComponent: received websocket message: ', msg);
      }
    );
  }

  private HandleWebSocketError(err: string) {
    console.error(`HomeComponent::HandleWebSocketError: client web socket service error: ${err}`);
    this.WebSocketErrorText = err;
  }

}
