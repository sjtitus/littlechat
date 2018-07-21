/*______________________________________________________________________________
  MessageService
  Service that handles all conversations/messages and message storage.
________________________________________________________________________________
*/

import { Injectable } from '@angular/core';
import { Conversation, GetConversationsRequest, GetConversationsResponse,
  GetConversationMessagesRequest, GetConversationMessagesResponse } from '../models/conversation';
import { Message } from '../models/message';
import { Subject } from 'rxjs/Subject';
import { ApiService } from '../services/api.service';
import { TokenService } from '../services/token.service';
import { MonitorService } from '../services/monitor.service';
import { StatusMonitorStatus } from '../models/statusmonitor';

@Injectable()
export class MessageService {

  // Ongoing conversations
  private conversations: Conversation[] = [];
  private messages: { [conversationId: number]: Message[] } = {};

  // we will "post" newly-created messages as observable for front end
  private newMessageSource = new Subject<Message>();
  newMessageSource$ = this.newMessageSource.asObservable();

  constructor(private monitorService: MonitorService, private apiService: ApiService, private tokenService: TokenService) {
    this.GetConversations().then( (resp) => { console.log(`MessageService: conversations retrieved`); });
  }


  //___________________________________________________________________________
  // GetConversations
  // Retreive and store ongoing conversations 
  public async GetConversations(maxAgeInHours?: number) {
    const user = this.tokenService.CurrentUser;
    console.log(`MessageService::GetConversations: getting conversations for ${user.email}`);
    const req: GetConversationsRequest = {} as any;
    req.userId = this.tokenService.CurrentUser.id;
    req.maxAgeInHours = (maxAgeInHours ? -1 : maxAgeInHours);
    const resp: GetConversationsResponse = await this.apiService.GetConversations(req);
    // cache only on success
    if (!resp.error) {
      console.log(`MessageService::GetConversations: caching ${resp.conversations.length} conversations for ${user.email}`);
      if (this.conversations.length > 0) {
        console.warn(`MessageService::GetConversations: overwriting cached conversations for ${user.email}`);
      }
      // save conversations (managed by this module)
      this.conversations = resp.conversations;
      resp.conversations = undefined;
    }
    else {
      console.error(`MessageService::GetConversations: error getting conversations for ${user.email}: ${resp.errorMessage}`);
      this.monitorService.ChangeStatus('API', StatusMonitorStatus.Error, resp.errorMessage);
    }
    return resp;
  }

  //___________________________________________________________________________
  // GetConversationMessages
  // Retrieve and store messages for a specific coversation
  public async GetConversationMessages(conversation: Conversation) {
    console.log(`MessageService::GetConversationMessages: getting conversation ${conversation.id}`);
    let resp: GetConversationMessagesResponse = {} as any;
    // Already loaded: use cache
    if (conversation.id in this.messages) {
      console.log(`MessageService::GetConversationMessages: returning cached conversation ${conversation.id}`);
      resp.error = false;
      resp.conversationId = conversation.id;
      resp.messages = this.messages[conversation.id];
      return resp;
    }
    // Not yet loaded: retrieve from back end
    const req: GetConversationMessagesRequest = { conversationId: conversation.id };
    // Call API to get the conversation
    console.log(`MessageService::GetConversationMessages: calling API for conversation ${conversation.id}`);
    resp = await this.apiService.GetConversationMessages(req);
    // cache only on success
    if (!resp.error) {
      console.log(`MessageService::GetConversationMessages: caching conversation ${conversation.id}`);
      this.messages[conversation.id] = resp.messages;
    }
    else {
      console.error(`MessageService::GetConversationMessages: error getting conversation ${conversation.id}: ${resp.errorMessage}`);
    }
    return resp;
  }

}
