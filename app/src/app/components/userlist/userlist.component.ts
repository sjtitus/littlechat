/*______________________________________________________________________________
  Userlist
  Fetches and displays list of users from MessageService, allows user to
  select a chat target.
________________________________________________________________________________
*/
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['../../app.component.css']
})

export class UserlistComponent implements OnInit {
  userlist: User[];                                   // All users
  @Output() userSelected = new EventEmitter<User>();  // Output event: new user selected
  private _selectedUser: User;                        // Currently selected user

  constructor(private messageService: MessageService) {
    console.log('Userlist: fetching users from MessageService');
    this.userlist = this.messageService.GetUsers();
  }

  ngOnInit() {}

  // selectUser: select the new user (chat target)
  selectUser(user: User) {
    this._selectedUser = user;
    console.log('Userlist: new chat target', user);
    // selectUser: notify listeners when a new chat target is selected.
    this.userSelected.emit(this._selectedUser);
  }

}

