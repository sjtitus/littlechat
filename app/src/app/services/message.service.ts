/*______________________________________________________________________________
  MessageService
  Service that manages contacts/conversations/messages.
________________________________________________________________________________
*/

import { Injectable } from '@angular/core';
import { Conversation, GetConversationsRequest, GetConversationsResponse,
  GetConversationMessagesRequest, GetConversationMessagesResponse } from '../models/conversation';
import { Message } from '../models/message';
import { Subject } from 'rxjs/Subject';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { MonitorService } from './monitor.service';
import { StatusMonitorStatus } from '../models/statusmonitor';
import { User, GetContactsRequest, GetContactsResponse } from '../models/user';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { isNull } from 'util';

const dbgpackage = require('debug');
const debug = dbgpackage('MessageService');

@Injectable()
export class MessageService {

  // User contacts
  private contacts: { [id: number]: User };

  // User conversations
  private conversations: { [id: number]: Conversation };

  // we will publish when we fill contacts
  private contactsSource$: Subject<{[id: number]: User}>;

  constructor(private tokenService: TokenService, private apiService: ApiService,
                private monitorService: MonitorService) {
      this.contactsSource$ = new Subject<{[id: number]: User}>();
  }

  public ContactsObservable(): Observable<{[id: number]: User}> {
    return this.contactsSource$.asObservable();
  }


  //___________________________________________________________________________
  // Start
  // Get contacts and conversations from backend, then associate
  // contacts with conversations.
  public async Start() {
    debug(`MessageService::Start: getting contacts`);
    const contactsResponse: GetContactsResponse = await this.GetContacts();
    if (contactsResponse.error) {
      console.error(`MessageService::Start: ERROR getting contacts: ${contactsResponse.errorMessage}`);
      throw new Error(`MessageService::Start: ERROR: ${contactsResponse.errorMessage}`);
    }
    debug(`MessageService::Start: getting conversations`);
    const conversationsResponse: GetConversationsResponse = await this.GetConversations();
    if (conversationsResponse.error) {
      console.error(`MessageService::Start: ERROR getting conversations: ${conversationsResponse.errorMessage}`);
      throw new Error(`MessageService::Start: ERROR: ${conversationsResponse.errorMessage}`);
    }
    debug(`MessageService::Start: mapping conversations to contacts`);
    this.MapConversations();
    // Notify listeners
    this.contactsSource$.next(this.contacts);
  }

  //___________________________________________________________________________
  // Map conversations to contacts
  private MapConversations() {
    debug(`MessageService::MapConversations: mapping conversations to contacts`);

    // Assign converstations to contacts
    for (const cid in this.conversations) {
      if (this.conversations.hasOwnProperty(cid)) {
          const conv: Conversation = this.conversations[cid];
          // person-to-person
          if (conv.audience.length === 1) {
              const chatPartnerId = conv.audience[0];
              if (chatPartnerId in this.contacts && (this.contacts.hasOwnProperty(chatPartnerId))) {
                  debug(`MessageService::MapConversations: found conversation with ${this.contacts[chatPartnerId].email}`);
                  this.contacts[chatPartnerId].conversation = conv;
              }
          }
          // TODO: Group
      }
    }
  }

  //___________________________________________________________________________
  // Load contacts
  private async GetContacts() {
    this.contacts = {};
    const apiReq: GetContactsRequest = { userId: this.tokenService.CurrentUser.id };
    debug(`MessageService::GetContacts: getting contacts for ${this.tokenService.CurrentUser.id}`);
    const resp: GetContactsResponse = await this.apiService.GetContacts(apiReq);
    if (!resp.error) {
      this.contacts = resp.contacts;
    }
    else {
      // API call succeeded, but there was an error on the backend
      const errmsg = `MessageService::GetContacts Error: ${resp.errorMessage}`;
      this.monitorService.ChangeStatus('API', StatusMonitorStatus.Error, errmsg);
      console.error(errmsg);
    }
    return resp;
  }

  //___________________________________________________________________________
  // GetConversations
  // Retreive and store ongoing conversations
  private async GetConversations(maxAgeInHours?: number) {
    const user = this.tokenService.CurrentUser;
    debug(`MessageService::GetConversations: getting conversations for ${user.email}`);
    const req: GetConversationsRequest = {} as any;
    req.userId = this.tokenService.CurrentUser.id;
    req.maxAgeInHours = (maxAgeInHours ? -1 : maxAgeInHours);
    const resp: GetConversationsResponse = await this.apiService.GetConversations(req);
    // cache only on success
    if (!resp.error) {
      debug(`MessageService::GetConversations: caching ${Object.keys(resp.conversations).length} conversations for ${user.email}`);
      if ((this.conversations) && Object.keys(this.conversations).length > 0) {
        console.warn(`MessageService::GetConversations: overwriting cached conversations for ${user.email}`);
      }
      // save conversations (managed by this module)
      this.conversations = resp.conversations;
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
  async GetConversationMessages(conversation: Conversation) {
    debug(`MessageService::GetConversationMessages: getting conversation ${conversation.id}`);
    // Already loaded: use cache
    /*
    if (!isNull(conversation.messages)) {
      debug(`MessageService::GetConversationMessages: conversation ${conversation.id} messages already loaded`);
      return 0;
    }
    */
    const req: GetConversationMessagesRequest = { conversationId: conversation.id };
    let resp: GetConversationMessagesResponse = {} as any;
    // Call API to get the conversation
    debug(`MessageService::GetConversationMessages: calling API for conversation ${conversation.id}`);
    resp = await this.apiService.GetConversationMessages(req);
    // cache only on success
    if (!resp.error) {
      debug(`MessageService::GetConversationMessages: retrieved ${resp.messages.length} msgs from conversation ${conversation.id}`);
      conversation.messages = resp.messages;
      return conversation.messages.length;
    }
    else {
      console.error(`MessageService::GetConversationMessages: error getting conversation ${conversation.id}: ${resp.errorMessage}`);
      this.monitorService.ChangeStatus('API', StatusMonitorStatus.Error, resp.errorMessage);
      return 0;
    }
  }

}
