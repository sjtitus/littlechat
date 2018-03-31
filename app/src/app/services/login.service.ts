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

import { User } from '../models/user';

@Injectable()
export class LoginService {

  private loginUrl = 'http://localhost:4200/api/login';
  private signupUrl = 'http://localhost:4200/api/signup';

  //___________________________________________________________________________
  // Public interface
  constructor(private http: Http) {}

  LoginUser(user: User): Observable<LoginResponse> {
        console.log('LoginService: login request for user %s', user.email);
        return this.http.post(this.loginUrl, user)
            .pipe(catchError(this.filterError))
            .map(this.parseData)
            .catch(this.handleError);
  }

  SignupUser(user: User): Observable<SignupResponse> {
        console.log('LoginService: signup request for user %s', user.email);
        return this.http.post(this.signupUrl, user)
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
        let errorMessage: string;
        errorMessage = error.message ? error.message : error.toString();
        console.error('LoginService: handleError: %s', errorMessage);
        return Observable.throw(errorMessage);
  }

  private filterError(error: HttpErrorResponse) {
    let errMessage: string;
    if ('_body' in error)
    {
      console.log('filterError: WE HAVE BODY');
    }
    console.log('filterError: HttpErrorResponse: ', error);
    console.log('filterError: Body: ', (<any>error)._body);
    if (error.error instanceof ErrorEvent) {
      console.log('filterError: ErrorEvent: ', error.error);
      errMessage = error.error.message;
    } else {
      console.log('FilterError: NOT ErrorEvent, ' +
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    //throw new Error('throwing error FOO FOO');
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable('Something bad happened');
  }

}

export class LoginResponse {
   // TODO: implement
   foo: number;
}

export class SignupResponse {
   // TODO: implement
   foo: number;
}
