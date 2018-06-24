/*______________________________________________________________________________
  MessageService
  Service that handles all incoming messages and message storage.
________________________________________________________________________________
*/

import { Injectable } from '@angular/core';
import { User, GetConversationRequest, GetConversationResponse } from '../models/user';
import { Message } from '../models/message';
import { Subject } from 'rxjs/Subject';
import { ApiService } from '../services/api.service';
import { TokenService } from '../services/token.service';
import { HttpResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/errorresponse';

@Injectable()
export class MessageService {

  // Data structure for message storage
  // A message thread (array of messages) for each contact
  private conversations: { [contactEmail: string]: Message [] };

  // we will "post" newly-created messages as observable for front end
  private newMessageSource = new Subject<Message>();
  newMessageSource$ = this.newMessageSource.asObservable();

  constructor(private apiService: ApiService, private tokenService: TokenService) {
    this.conversations = {};
  }

  public async GetConversation(contactEmail: string) {
    console.log(`MessageService: getting conversation for ${contactEmail}`);
    // we've already loaded this conversation
    if (contactEmail in this.conversations) {
      return this.conversations[contactEmail];
    }
    const req: GetConversationRequest = {
      userId: this.tokenService.CurrentUser.id,
      contactEmail: contactEmail
    };
    console.log('MessageService: get conversation request', req);
    const resp = await this.apiService.GetConversation(req);
    return resp;
  }

  private HandleGetConversationResponse(httpResponse: HttpResponse<GetConversationResponse>) {
    const resp: GetConversationResponse = httpResponse.body;
    console.log('MessageService: get conversation response', resp);
    if (resp.error) {
      console.error(`MessageService: get conversation failed: ${resp.errorMessage}`);
    }
    else {
      console.error(`MessageService: get conversation success: ${resp.conversation.length} messages`);
      this.conversations[resp.contactEmail] = resp.conversation;
    }
  }

  private HandleError(etype: string, errorResponse: ErrorResponse) {
    console.error(`API network Error: type ${etype}`, errorResponse);
    /*
    if (etype === 'login') {
      this.backendLoginErrorText = 'Network error: ' + errorResponse.message;
    } else {
      this.backendSignupErrorText = 'Network error: ' + errorResponse.message;
    }
    */
  }

  //___________________________________________________________________________
  // SendMessage
  SendMessage(msg: Message) {
    console.log(`MessageService::SendMessage: from ${msg.from} to ${msg.to}`);
    this.PostMessageToUI(msg);
  }

  //___________________________________________________________________________
  // PostMessageToUI
  private PostMessageToUI(msg: Message) {
    this.newMessageSource.next(msg);
  }

  // GetMessages: fetch a user's messages from the back end
  GetMessages(user: User): Message[] {
    return [];
  }

}
