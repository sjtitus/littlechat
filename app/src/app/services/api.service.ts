import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import { catchError} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ApiError } from '../models/apierror';

//import 'rxjs/add/observable/throw';
//import 'rxjs/add/operator/map';

import { GetContactsRequest, GetContactsResponse, UserMessagesRequest, UserMessagesResponse,
         GetConversationRequest, GetConversationResponse } from '../models/user';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from '../models/login';


@Injectable()
export class ApiService {

  private readonly loginUrl = 'http://localhost:4200/api/login';
  private readonly signupUrl = 'http://localhost:4200/api/signup';
  private readonly msgsUrl = 'http://localhost:4200/api/messages';
  private readonly contactsUrl = 'http://localhost:4200/api/contacts';
  private readonly conversationUrl = 'http://localhost:4200/api/conversation';
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
        return this.http.post<SignupResponse>(this.signupUrl, signupRequest, { observe: 'response' })
            .timeout(this.timeout)
            .pipe(catchError(this.HandleError));
  }

  async GetConversation(req: GetConversationRequest) {
        console.log('ApiService::GetConversation: request', req);
        let resp: GetConversationResponse = {} as any;
        try {
          resp.conversation = [];
          const apiResp = await this.http.post<GetConversationResponse>(this.conversationUrl, req, { observe: 'response' })
              .timeout(this.timeout)
              .pipe(catchError(this.HandleError))
              .toPromise();
          resp = apiResp.body;
        }
        catch (e) {
          const err = e as ApiError;
          console.error(`ApiService::GetConversation: API error`, err);
          resp.error = true;
          resp.apiError = err;
          resp.errorMessage = err.message;
        }
        finally {
          return resp;
        }
  }

  GetContacts(req: GetContactsRequest) {
        console.log('ApiService: get contacts request', req);
        return this.http.post<GetContactsResponse>(this.contactsUrl, req, { observe: 'response' })
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
  private HandleError(httperr) {
        const er: ApiError = {
          response: httperr,
          url: httperr.url ? httperr.url : '',
          status: httperr.status ? httperr.status : '',
          statusText: httperr.statusText ? httperr.statusText : '',
          message: httperr.message ? httperr.message : '',
          error: httperr.error ? httperr.error : '',
          offline: ((httperr.status != null) && (+(httperr.status) <= 0))
        };
        console.log('ApiService: caught error: ', er);
        return new ErrorObservable(er);
  }

}
