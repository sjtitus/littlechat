import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError} from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

import { User } from '../models/user';
import { SignupRequest } from '../models/signuprequest';
import { LoginRequest } from '../models/loginrequest';
import { LoginResponse } from '../models/loginresponse';
import { SignupResponse } from '../models/signupresponse';

@Injectable()
export class LoginService {

  private readonly loginUrl = 'http://localhost:4200/api/login';
  private readonly signupUrl = 'http://localhost:4200/api/signup';
  private readonly timeout = 20000;

  //___________________________________________________________________________
  // Public interface
  constructor(private http: HttpClient) {}

  LoginUser(login: LoginRequest) {
        console.log('LoginService: login request ', login);
        return this.http.post<LoginResponse>(this.loginUrl, login)
            .timeout(this.timeout);
  }

  SignupUser(signup: SignupRequest) {
        console.log('LoginService: signup request ', signup);
        return this.http.post<SignupResponse>(this.signupUrl, signup)
            .timeout(this.timeout);
  }

  //___________________________________________________________________________
  // Private interface
  private handleError(error: Response | any) {
        const errorObject = {
          message: error.message ? error.message : error.toString(),
          response: error
        };
        console.error('LoginService: error: ', errorObject);
        return Observable.throw(errorObject);
  }
}
