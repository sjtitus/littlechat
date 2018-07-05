import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/catch';
import { catchError} from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ApiError } from '../models/apierror';
import { GetContactsRequest, GetContactsResponse, UserMessagesRequest, UserMessagesResponse,
         GetConversationRequest, GetConversationResponse } from '../models/user';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from '../models/login';


// Stub for testing
export const ApiServiceStub: Partial<ApiService> = {
  async GetContacts(req: GetContactsRequest) {
      const resp: GetContactsResponse = {
        error: false,
        errorMessage: '',
        apiError: undefined,
        userId: 999000,
        contacts: [
            { firstname: 'firstname1', lastname: 'lastname1', email: 'testuser1@test.com', id: 999001 },
            { firstname: 'firstname2', lastname: 'lastname2', email: 'testuser2@test.com', id: 999002 },
            { firstname: 'firstname3', lastname: 'lastname3', email: 'testuser3@test.com', id: 999003 },
            { firstname: 'firstname4', lastname: 'lastname4', email: 'testuser4@test.com', id: 999004 },
            { firstname: 'firstname5', lastname: 'lastname5', email: 'testuser5@test.com', id: 999005 }
        ]
      };
      console.log('ApiServiceStub: GetContacts returning', resp);
      return resp;
  }
};


@Injectable()
export class ApiService {

  private readonly loginUrl = 'http://localhost:4200/api/login';
  private readonly signupUrl = 'http://localhost:4200/api/signup';
  private readonly contactsUrl = 'http://localhost:4200/api/contacts';
  private readonly conversationUrl = 'http://localhost:4200/api/conversation';
  private readonly timeout = 20000;

  constructor(private http: HttpClient) {}

  async LoginUser(loginRequest: LoginRequest) {
      console.log('ApiService::LoginUser: login request ', loginRequest);
      let resp: LoginResponse = {} as any;
      try {
        const apiResp = await this.http.post<LoginResponse>(this.loginUrl, loginRequest, { observe: 'response' })
            .timeout(this.timeout)
            .pipe(catchError(this.HandleError))
            .toPromise();
        resp = apiResp.body;
      }
      catch (e) {
        const err = e as ApiError;
        console.error(`ApiService::LoginUser: API error`, err);
        resp.error = true;
        resp.apiError = err;
        resp.errorMessage = err.message;
      }
      finally {
        return resp;
      }
  }


  async SignupUser(signupRequest: SignupRequest) {
      console.log('ApiService::SignupUser: signup request ', signupRequest);
      let resp: SignupResponse = {} as any;
      try {
        const apiResp = await this.http.post<SignupResponse>(this.signupUrl, signupRequest, { observe: 'response' })
            .timeout(this.timeout)
            .pipe(catchError(this.HandleError))
            .toPromise();
        resp = apiResp.body;
      }
      catch (e) {
        const err = e as ApiError;
        console.error(`ApiService::SignupUser: API error`, err);
        resp.error = true;
        resp.apiError = err;
        resp.errorMessage = err.message;
      }
      finally {
        return resp;
      }
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


  async GetContacts(req: GetContactsRequest) {
      console.log('ApiService::GetContacts: request', req);
      let resp: GetContactsResponse = {} as any;
      try {
        const apiResp = await this.http.post<GetContactsResponse>(this.contactsUrl, req, { observe: 'response' })
            .timeout(this.timeout)
            .pipe(catchError(this.HandleError))
            .toPromise();
        resp = apiResp.body;
        console.log('ApiService::GetContacts: response', resp);
      }
      catch (e) {
        const err = e as ApiError;
        console.error(`ApiService::GetContacts: API error`, err);
        resp.error = true;
        resp.apiError = err;
        resp.errorMessage = err.message;
      }
      finally {
        return resp;
      }
  }

  //___________________________________________________________________________
  // Private

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
        console.log('ApiService::HandleError: error: ', er);
        return new ErrorObservable(er);
  }

}

