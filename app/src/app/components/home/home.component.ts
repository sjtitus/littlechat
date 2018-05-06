/*______________________________________________________________________________
  Home
  Home (main page) component for littlechat app.
  Uses 3 child components: UserList, MessageList, MessageEntry.
________________________________________________________________________________
*/
import { Component, Output, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../app.component.css']
})

export class HomeComponent implements OnInit {

  targetUser: User;   // user we're chatting with
  headerMessage = 'Select Chat Partner';
  currentUser: User;

  constructor( private tokenService: TokenService ) {
  }

  setTargetUser(user: User) {
    this.targetUser = user;
    this.headerMessage = this.targetUser.email;
  }

  ngOnInit() {
    this.currentUser = this.tokenService.CurrentUser;
    console.log('HomeComponent: currentUser:', this.currentUser);
  }

}
