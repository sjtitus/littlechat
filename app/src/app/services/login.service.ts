import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError} from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

import { User } from '../models/user';
import { SignupRequest } from '../models/signuprequest';

@Injectable()
export class LoginService {

  private readonly loginUrl = 'http://localhost:4200/api/login';
  private readonly signupUrl = 'http://localhost:4200/api/signup';
  private readonly timeout = 20000;

  //___________________________________________________________________________
  // Public interface
  constructor(private http: Http) {}

  LoginUser(user) {
        console.log('LoginService: login request for user ', user.email);
        return this.http.post(this.loginUrl, user)
            .timeout(20000)
            .map(this.parseData)
            .catch(this.handleError);
  }

  SignupUser(signup: SignupRequest) {
        console.log('LoginService: signup request ', signup);
        return this.http.post(this.signupUrl, signup)
            .timeout(this.timeout)
            .map(this.parseData)
            .catch(this.handleError);
  }

  //___________________________________________________________________________
  // Private interface
  private parseData(res: Response)  {
        console.log('LoginService: received response %s', res.json());
        return res.json() || {};
  }

  private handleError(error: Response | any) {
        const errorObject = {
          message: error.message ? error.message : error.toString(),
          response: error
        };
        console.error('LoginService: error: ', errorObject);
        return Observable.throw(errorObject);
  }
}
