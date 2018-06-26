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

@Injectable()
export class MessageService {

  // Data structure for client-side conversation storage
  // An array of messages by contact
  private conversations: { [contactEmail: string]: Message [] };

  // we will "post" newly-created messages as observable for front end
  private newMessageSource = new Subject<Message>();
  newMessageSource$ = this.newMessageSource.asObservable();

  constructor(private apiService: ApiService, private tokenService: TokenService) {
    this.conversations = {};
  }

  //___________________________________________________________________________
  // GetConversation
  // Retrieve a conversation from the back end (or cache)
  public async GetConversation(contactEmail: string) {
    let resp: GetConversationResponse = {} as any;
    // Already loaded: use cache
    if (contactEmail in this.conversations) {
      console.log(`MessageService: returning cached conversation with ${contactEmail}`);
      resp.error = false;
      resp.contactEmail = contactEmail;
      resp.conversation = this.conversations[contactEmail];
      resp.userId = this.tokenService.CurrentUser.id;
      return resp;
    }
    // Call API to get the conversation
    console.log(`MessageService: calling API for conversation with ${contactEmail}`);
    const req: GetConversationRequest = {
      userId: this.tokenService.CurrentUser.id,
      contactEmail: contactEmail
    };
    resp = await this.apiService.GetConversation(req);
    // cache only on success
    if (!resp.error) {
      console.log(`MessageService: caching conversation with ${contactEmail}`);
      this.conversations[contactEmail] = resp.conversation;
    }
    else {
      console.log(`MessageService: error calling API for conversation with ${contactEmail}: ${resp.errorMessage}`, resp);
    }
    console.log('MessageService: get conversation success', resp);
    return resp;
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

}
