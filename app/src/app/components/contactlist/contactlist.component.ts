/*______________________________________________________________________________
  ContactList
  Lists the user's contacts, allows user to select a contact with which to
  chat.
________________________________________________________________________________
*/
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { User, GetContactsRequest, GetContactsResponse, GetConversationRequest, GetConversationResponse } from '../../models/user';
import { ApiService } from '../../services/api.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['../../app.component.css']
})

export class ContactListComponent implements OnInit {

  // Contact selected for chat
  @Output() contactSelected = new EventEmitter<User>();

  // User contacts
  contactList: User[];

  // Error messages
  applicationError: string;
  networkError: string;

  private _selectedContact: User;

  constructor( private apiService: ApiService, private tokenService: TokenService ) {}

  ngOnInit() {
    console.log(`ContactListComponent: OnInit: current user is `, this.tokenService.CurrentUser.email);
    this.GetContacts();
  }

  //___________________________________________________________________________
  // Select contact to chat with
  SelectContact(contact: User) {
    this._selectedContact = contact;
    console.log('ContactList: new chat target', contact);
    // Notify listeners
    this.contactSelected.emit(this._selectedContact);
  }


  //=======================================================
  // Backend Access Methods
  //=======================================================

  //___________________________________________________________________________
  // Load user contacts
  public async GetContacts() {
    const apiReq: GetContactsRequest = { userId: this.tokenService.CurrentUser.id };
    console.log(`ContactList: GetContacts for userId=${apiReq.userId}`);
    const resp: GetContactsResponse = await this.apiService.GetContacts(apiReq);
    if (!resp.error) {
      this.contactList = resp.contacts;
      console.log(`ContactList: got contact list for userId=${apiReq.userId}`, this.contactList);
    }
    else {
      // API call succeeded, but there was an error on the backend
      console.error(`ContactList: GetContacts Error: ${resp.errorMessage}`);
      this.applicationError = `ContactList: GetContacts Error: ${resp.errorMessage}`;
    }
  }

}

