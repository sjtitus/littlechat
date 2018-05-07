/*______________________________________________________________________________
  Userlist
  Fetches and displays list of users from MessageService, allows user to
  select a chat target.
________________________________________________________________________________
*/
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { User, GetContactsRequest, GetContactsResponse } from '../../models/user';
import { ApiService } from '../../services/api.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ErrorResponse } from '../../models/errorresponse';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['../../app.component.css']
})

export class UserlistComponent implements OnInit {

  @Output() contactSelected = new EventEmitter<User>();  // Event to broadcast currently selected contact

  contactList: User[];             // Chat contacts for current user
  applicationError: string;
  networkError: string;

  private _selectedContact: User;
  private currentUser: User;

  constructor(private apiService: ApiService, private tokenService: TokenService) {}

  ngOnInit() {
    this.currentUser = this.tokenService.CurrentUser;
    console.log(`UserListComponent: OnInit: current user is ${this.currentUser.email}`);
    this.GetContacts();
  }

  //___________________________________________________________________________
  // Select contact to chat with
  SelectContact(contact: User) {
    this._selectedContact = contact;
    console.log('Userlist: new chat target', contact);
    // Notify listeners
    this.contactSelected.emit(this._selectedContact);
  }


  //=======================================================
  // Backend Access Methods
  //=======================================================

  //___________________________________________________________________________
  // Load user's contacts from backend
  GetContacts() {
    const apiReq: GetContactsRequest = { userId: this.currentUser.id };
    console.log(`Userlist: GetContacts (userId=${apiReq.userId})`);
    this.apiService.GetContacts(apiReq).subscribe(
        (resp) => { this.HandleGetContactsResponse(resp);       },
         (err) => { this.HandleError('GetContacts', err);  }
    );
  }

  private HandleGetContactsResponse(httpResponse: HttpResponse<GetContactsResponse>) {
    const apiResp: GetContactsResponse = httpResponse.body;
    console.log('Userlist: GetContacts response', apiResp);
    if (!apiResp.error) {
      this.contactList = apiResp.contacts;
    }
    else {
      // Handle backend logical errors
      console.log(`Userlist: GetContacts error: ${apiResp.errorMessage}`);
      this.applicationError = `Userlist: GetContacts error: '${apiResp.errorMessage}'`;
    }
  }

  //___________________________________________________________________________
  // Handle backend networking errors
  private HandleError(etype: string, errorResponse: ErrorResponse) {
    console.log(`Userlist: ${etype} network error:`, errorResponse);
    this.networkError = `Userlist: ${etype} network error: ${errorResponse.message}`;
  }


}

