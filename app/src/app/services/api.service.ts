import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import { catchError} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

//import 'rxjs/add/observable/throw';
//import 'rxjs/add/operator/map';

import { GetUsersRequest, GetUsersResponse, UserMessagesRequest, UserMessagesResponse } from '../models/user';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from '../models/login';
import { ErrorResponse } from '../models/errorresponse';


@Injectable()
export class ApiService {

  private readonly loginUrl = 'http://localhost:4200/api/login';
  private readonly signupUrl = 'http://localhost:4200/api/signup';
  private readonly msgsUrl = 'http://localhost:4200/api/messages';
  private readonly usersUrl = 'http://localhost:4200/api/users';
  private readonly timeout = 20000;

  //===========================================================================
  // Public interface
  //===========================================================================
  constructor(private http: HttpClient) {}

  LoginUser(loginRequest: LoginRequest) {
        console.log('ApiService: login request ', loginRequest);
        return this.http.post<LoginResponse>(this.loginUrl, loginRequest, { observe: 'response' })
        .timeout(this.timeout)
        .pipe(catchError(this.HandleError));
  }

  SignupUser(signupRequest: SignupRequest) {
        console.log('ApiService: signup request ', signupRequest);
        //const token: string = window.localStorage.getItem('littlechatToken');
        //let headers: HttpHeaders = new HttpHeaders();
        //headers = headers.append('authorization', 'Bearer ' + token);
        return this.http.post<SignupResponse>(this.signupUrl, signupRequest, { observe: 'response' })
            .timeout(this.timeout)
            .pipe(catchError(this.HandleError));
  }

  GetUsers(req: GetUsersRequest) {
        console.log('ApiService: get users request', req);
        return this.http.post<GetUsersResponse>(this.usersUrl, req, { observe: 'response' })
            .timeout(this.timeout)
            .pipe(catchError(this.HandleError));
  }

  GetUserMessages(msgsRequest: UserMessagesRequest) {
        console.log('ApiService: get user message request ', msgsRequest);
        return this.http.post<UserMessagesResponse>(this.msgsUrl, msgsRequest, { observe: 'response' })
            .timeout(this.timeout)
            .pipe(catchError(this.HandleError));
  }

  //___________________________________________________________________________
  // Private interface
  private HandleError(httperr, caught) {
        const er: ErrorResponse = {
          response: httperr,
          url: httperr.url ? httperr.url : '',
          status: httperr.status ? httperr.status : '',
          statusText: httperr.statusText ? httperr.statusText : '',
          message: httperr.message ? httperr.message : '',
          error: httperr.error ? httperr.error : '',
          offline: ((httperr.status != null) && (+(httperr.status) <= 0))
        };
        console.log('ApiService: error response: ', httperr);
        console.log('ApiService: error object: ', er);
        return new ErrorObservable(er);
  }
}
