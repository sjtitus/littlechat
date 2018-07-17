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
  // Retrieve a conversation from the back end using API (or cache)
  public async GetConversation(contact: User) {
    let resp: GetConversationResponse = {} as any;
    // Already loaded: use cache
    if (contact.email in this.conversations) {
      console.log(`MessageService: returning cached conversation with ${contact.email}`);
      resp.error = false;
      resp.contactEmail = contact.email;
      resp.conversation = this.conversations[contact.email];
      resp.userId = this.tokenService.CurrentUser.id;
      return resp;
    }
    // Call API to get the conversation
    console.log(`MessageService: calling API for conversation with ${contact.email}`);
    const req: GetConversationRequest = {
      userId: this.tokenService.CurrentUser.id,
      contact: contact
    };
    resp = await this.apiService.GetConversation(req);
    // cache only on success
    if (!resp.error) {
      console.log(`MessageService: caching conversation with ${contact.email}`);
      this.conversations[contact.email] = resp.conversation;
    }
    else {
      console.error(`MessageService: error calling API for conversation with ${contact.email}: ${resp.errorMessage}`, resp);
    }
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
