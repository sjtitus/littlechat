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
  // Retrieve a conversation from the back end
  public async GetConversation(contactEmail: string) {
    // Already loaded this conversation? Use cached version
    if (contactEmail in this.conversations) {
      console.log(`MessageService: returning CACHED conversation with ${contactEmail}`);
      return this.conversations[contactEmail];
    }
    // Call API to get the conversation
    console.log(`MessageService: calling API for conversation with ${contactEmail}`);
    const req: GetConversationRequest = {
      userId: this.tokenService.CurrentUser.id,
      contactEmail: contactEmail
    };
    const apiResp = await this.apiService.GetConversation(req);
    // Extract the response
    const getResp: GetConversationResponse = apiResp.body;
    console.log(`MessageService: caching conversation with ${contactEmail}`);
    // Cache the returned conversation
    this.conversations[contactEmail] = getResp.conversation;
    console.log('MessageService: get conversation response', getResp);
    return getResp;
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
