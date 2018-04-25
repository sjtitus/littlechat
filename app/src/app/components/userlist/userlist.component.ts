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
  userlist: User[];                                   // All users
  @Output() userSelected = new EventEmitter<User>();  // Output event: new user selected
  private _selectedUser: User;                        // Currently selected user

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.GetUsers();
  }

  GetUsers() {
    console.log('Userlist: fetching users from MessageService');
    const apiReq: GetUsersRequest = { userId: 100 };
    this.apiService.GetUsers(apiReq).subscribe(
        (resp) => { this.HandleGetUsersResponse(resp);       },
         (err) => { this.HandleError('GetUsers', err);  }
    );
  }

  private HandleGetUsersResponse(httpResponse: HttpResponse<GetUsersResponse>) {
    const apiResp: GetUsersResponse = httpResponse.body;
    console.log('GetUsers response', apiResp);
    if (!apiResp.error) {
      this.userlist = apiResp.users;
    }
    else {
      console.log('GetUsers error:', apiResp.errorMessage);
    }
  }

  //___________________________________________________________________________
  // Handle an API error
  private HandleError(etype: string, errorResponse: ErrorResponse) {
    console.log(`API Error [${etype}]`, errorResponse);
  }


  // selectUser: select the new user (chat target)
  SelectUser(user: User) {
    this._selectedUser = user;
    console.log('Userlist: new chat target', user);
    // selectUser: notify listeners when a new chat target is selected.
    this.userSelected.emit(this._selectedUser);
  }

}

