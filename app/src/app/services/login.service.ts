import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import { catchError} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

//import 'rxjs/add/observable/throw';
//import 'rxjs/add/operator/map';

import { SignupRequest } from '../models/signuprequest';
import { LoginRequest } from '../models/loginrequest';
import { LoginResponse } from '../models/loginresponse';
import { SignupResponse } from '../models/signupresponse';
import { ErrorResponse } from '../models/errorresponse';

@Injectable()
export class LoginService {

  private readonly loginUrl = 'http://localhost:4200/api/login';
  private readonly signupUrl = 'http://localhost:4200/api/signup';
  private readonly timeout = 20000;

  //===========================================================================
  // Public interface
  //===========================================================================
  constructor(private http: HttpClient) {}

  LoginUser(login: LoginRequest) {
        console.log('LoginService: login request ', login);
        return this.http.post<LoginResponse>(this.loginUrl, login, { observe: 'response' })
        .timeout(this.timeout)
        .pipe(catchError(this.HandleError));
  }

  SignupUser(signup: SignupRequest) {
        console.log('LoginService: signup request ', signup);
        //const token: string = window.localStorage.getItem('littlechatToken');
        //let headers: HttpHeaders = new HttpHeaders();
        //headers = headers.append('authorization', 'Bearer ' + token);
        return this.http.post<SignupResponse>(this.signupUrl, signup, { observe: 'response' })
            .timeout(this.timeout)
            .pipe(catchError(this.HandleError));
  }

  //___________________________________________________________________________
  // Private interface
  private HandleError(error, caught) {
        const er: ErrorResponse = {
          response: JSON.stringify(error),
          url: error.url ? error.url : '',
          status: error.status ? error.status : '',
          statusText: error.statusText ? error.statusText : '',
          message: error.message ? error.message : '',
        };
        console.log('LoginService: error: ', er);
        return new ErrorObservable(er);
  }
}
