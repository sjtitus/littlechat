/*______________________________________________________________________________
  ContactList
  Lists the user's contacts, allows user to select a contact with which to
  chat.
________________________________________________________________________________
*/
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { User, GetContactsRequest, GetContactsResponse, GetConversationsRequest, GetConversationsResponse } from '../../models/user';
import { ApiService } from '../../services/api.service';
import { HttpResponse } from '@angular/common/http';
import { ErrorResponse } from '../../models/errorresponse';
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
  private currentUser: User;

  constructor( private apiService: ApiService,
    private tokenService: TokenService) {}

  ngOnInit() {
    this.currentUser = this.tokenService.CurrentUser;
    console.log(`ContactListComponent: OnInit: current user is `, this.currentUser);
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
  GetContacts() {
    const apiReq: GetContactsRequest = { userId: this.currentUser.id };
    console.log(`ContactList: GetContacts for userId=${apiReq.userId}`);
    this.apiService.GetContacts(apiReq).subscribe(
        (resp) => { this.HandleGetContactsResponse(resp);       },
         (err) => { this.HandleApiError('GetContacts', err);  }
    );
  }

  private HandleGetContactsResponse(httpResponse: HttpResponse<GetContactsResponse>) {
    const apiResp: GetContactsResponse = httpResponse.body;
    console.log('ContactList: GetContacts response', apiResp);
    if (!apiResp.error) {
      this.contactList = apiResp.contacts;
    }
    else {
      // API call succeeded, but there was an error on the backend
      console.log(`ContactList: GetContacts backend error: ${apiResp.errorMessage}`);
      this.applicationError = `ContactList: GetContacts backend error: '${apiResp.errorMessage}'`;
    }
  }

  //___________________________________________________________________________
  // API call failed
  private HandleApiError(etype: string, errorResponse: ErrorResponse) {
    console.log(`ContactList: ${etype} api error:`, errorResponse);
    this.networkError = `ContactList: ${etype} api error: ${errorResponse.message}`;
  }

}

