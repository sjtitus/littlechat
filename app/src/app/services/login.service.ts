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
  private readonly timeout = 500000;

  //===========================================================================
  // Public interface
  //===========================================================================
  constructor(private http: HttpClient) {}

  LoginUser(loginRequest: LoginRequest) {
        console.log('LoginService: login request ', loginRequest);
        return this.http.post<LoginResponse>(this.loginUrl, loginRequest, { observe: 'response' })
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
        console.log('LoginService: error response: ', httperr);
        console.log('LoginService: error object: ', er);
        return new ErrorObservable(er);
  }
}
