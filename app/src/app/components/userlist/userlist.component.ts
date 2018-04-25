/*______________________________________________________________________________
  Userlist
  Fetches and displays list of users from MessageService, allows user to
  select a chat target.
________________________________________________________________________________
*/
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { User, GetUsersRequest, GetUsersResponse } from '../../models/user';
import { ApiService } from '../../services/api.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ErrorResponse } from '../../models/errorresponse';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['../../app.component.css']
})

export class UserlistComponent implements OnInit {

  @Output() userSelected = new EventEmitter<User>();  // Event to broadcast currently selected contact
  userlist: User[];                                   // Chat contacts for current user
  applicationError: string;
  networkError: string;

  private _selectedUser: User;                        // Currently selected contact


  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.GetUsers();    // load user's contacts from back end
  }

  //___________________________________________________________________________
  // selectUser: select chat target user
  SelectUser(user: User) {
    this._selectedUser = user;
    console.log('Userlist: new chat target', user);
    // Notify listeners
    this.userSelected.emit(this._selectedUser);
  }


  //=======================================================
  // Backend Access Methods
  //=======================================================

  //___________________________________________________________________________
  // GetUsers
  // Load user's contacts from backend
  GetUsers() {
    const apiReq: GetUsersRequest = { userId: 100 };
    console.log(`Userlist: GetUsers (userId=${apiReq.userId})`);
    this.apiService.GetUsers(apiReq).subscribe(
        (resp) => { this.HandleGetUsersResponse(resp);       },
         (err) => { this.HandleError('GetUsers', err);  }
    );
  }

  private HandleGetUsersResponse(httpResponse: HttpResponse<GetUsersResponse>) {
    const apiResp: GetUsersResponse = httpResponse.body;
    console.log('Userlist: GetUsers response', apiResp);
    if (!apiResp.error) {
      this.userlist = apiResp.users;
    }
    else {
      // Handle backend logical errors
      console.log('Userlist: GetUsers application error:', apiResp.errorMessage);
      this.applicationError = `Userlist: GetUsers application error: '${apiResp.errorMessage}'`;
    }
  }

  //___________________________________________________________________________
  // Handle backend networking errors
  private HandleError(etype: string, errorResponse: ErrorResponse) {
    console.log(`Userlist: GetUsers network error [${etype}]`, errorResponse);
    this.networkError = `Userlist: GetUsers network error: '${errorResponse.message}'`;
  }


}

