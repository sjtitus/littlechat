/*______________________________________________________________________________
  Home
  Home (main page) component for littlechat app.
  Uses 3 child components: UserList, MessageList, MessageEntry.
________________________________________________________________________________
*/
import { Component, Output } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../app.component.css']
})

export class HomeComponent {
  targetUser: User;   // user we're chatting with
  headerMessage = 'Select Chat Partner';

  setTargetUser(user: User) {
    this.targetUser = user;
    this.headerMessage = this.targetUser.email;
  }

}
