/*______________________________________________________________________________
  MessageService
  Service that manages all client-side messages, outgoing and incoming.
  Also stores/manages contacts and conversations. 
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
import { WebSocketService } from './websocket.service';
import { StatusMonitorStatus } from '../models/statusmonitor';
import { User, GetContactsRequest, GetContactsResponse } from '../models/user';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { isNull } from 'util';

const dbgpackage = require('debug');
const debug = dbgpackage('MessageService');

@Injectable()
export class MessageService {

  private contacts: { [id: number]: User };                   // User contacts by Id 
  private conversations: { [id: number]: Conversation };      // User conversations by Id 

  private contactsSource$: Subject< {[id: number]: User} >;   // Contacts published to components 


  constructor(private tokenService: TokenService,
              private apiService: ApiService,
              private monitorService: MonitorService,
              private webSocketService: WebSocketService) {
      this.contacts = {};
      this.conversations = {};
      this.contactsSource$ = new Subject<{[id: number]: User}>();
      this.HandleIncomingMessages();
  }


  public ContactsObservable(): Observable<{[id: number]: User}> {
    return this.contactsSource$.asObservable();
  }


  //___________________________________________________________________________
  // Start
  // Start the service:
  //    - Get contacts and conversations from backend
  //    - Link each conversation to its associated contact
  //    - Publish contacts to listeners
  public async Start() {
    // First, get all conversations and contacts
    // Note: no async conversations/contacts can arrive during this time since
    // websocket service has not yet connected to backend.
    await this.GetConversations();
    await this.GetContacts();
    this.MapConversationsToContacts();
    // Now let's connect websocket service
    this.webSocketService.Connect();
    this.contactsSource$.next(this.contacts);   // publish contacts
  }

  //___________________________________________________________________________
  // SendMessage
  // Send an outgoing message 
  public async SendMessage(message: Message) {
    debug(`MessageService::SendMessage: send message to ${message.to}`);
    let msgId = -1;
    try {
      msgId = await this.webSocketService.SendMessage(message);
      debug(`MessageService::SendMessage: sent msg id: ${msgId}`);
    }
    catch (err) {
      console.error(`MessageService::SendMessage: error`, err);
      this.monitorService.ChangeStatus('Websocket', StatusMonitorStatus.Error, err.message);
      throw(err);
    }
    return msgId;
  }



  //
  // Private
  //

  //___________________________________________________________________________
  // GetContacts
  // Retrieve contacts from back end
  private async GetContacts() {
    const user = this.tokenService.CurrentUser;
    if ((this.contacts) && Object.keys(this.contacts).length > 0) {
      console.warn(`MessageService::GetContacts: overwriting existing contacts for ${user.email}`);
    }
    debug(`MessageService::GetContacts: getting contacts for ${user.email}`);
    this.contacts = {};
    const apiReq: GetContactsRequest = { userId: user.id };
    const resp: GetContactsResponse = await this.apiService.GetContacts(apiReq);
    if (!resp.error) {
      debug(`MessageService::GetContacts: retrieved ${Object.keys(resp.contacts).length} contacts for ${user.email}`);
      this.contacts = resp.contacts;
    }
    else {
      // API (or backend) error
      const errmsg = `MessageService::GetContacts: ERROR: ${resp.errorMessage}`;
      this.monitorService.ChangeStatus('API', StatusMonitorStatus.Error, errmsg);
      throw new Error(errmsg);
    }
  }


  //___________________________________________________________________________
  // Get conversations 
  // Retreive ongoing conversations from back end 
  private async GetConversations(maxAgeInHours?: number) {
    const user = this.tokenService.CurrentUser;
    if ((this.conversations) && Object.keys(this.conversations).length > 0) {
      console.warn(`MessageService::GetConversations: overwriting existing conversations for ${user.email}`);
    }
    debug(`MessageService::GetConversations: getting conversations for ${user.email}`);
    this.conversations = {};
    const req: GetConversationsRequest = {} as any;
    req.userId = this.tokenService.CurrentUser.id;
    req.maxAgeInHours = (maxAgeInHours ? -1 : maxAgeInHours);
    const resp: GetConversationsResponse = await this.apiService.GetConversations(req);
    if (!resp.error) {
      debug(`MessageService::GetConversations: retrieved ${Object.keys(resp.conversations).length} conversations for ${user.email}`);
      this.conversations = resp.conversations;
    }
    else {
      const errmsg = `MessageService::GetConversations: ERROR: ${resp.errorMessage}`;
      this.monitorService.ChangeStatus('API', StatusMonitorStatus.Error, errmsg);
      throw new Error(errmsg);
    }
  }

  //___________________________________________________________________________
  // GetConversationMessages 
  // Retrieve messages for a specific coversation from back end
  public async GetConversationMessages(conversation: Conversation, reload: boolean = false) {
    debug(`MessageService::GetConversationMessages: getting msgs for conversation ${conversation.id}`);
    // Already loaded 
    if (!isNull(conversation.messages) && !reload) {
      debug(`MessageService::GetConversationMessages: conversation ${conversation.id} msgs already loaded`);
      return 0;
    }
    conversation.messages = [];
    const req: GetConversationMessagesRequest = { conversationId: conversation.id };
    let resp: GetConversationMessagesResponse = {} as any;
    debug(`MessageService::GetConversationMessages: calling API for msgs for conversation ${conversation.id}`);
    resp = await this.apiService.GetConversationMessages(req);
    if (!resp.error) {
      debug(`MessageService::GetConversationMessages: retrieved ${resp.messages.length} msgs from conversation ${conversation.id}`);
      conversation.messages = resp.messages;
      return resp.messages.length;
    }
    else {
      const errmsg = `MessageService::GetConversationMessages: ERROR: ${resp.errorMessage}`;
      this.monitorService.ChangeStatus('API', StatusMonitorStatus.Error, resp.errorMessage);
      //throw new Error(errmsg);
      return 0;
    }
  }


  //___________________________________________________________________________
  // HandleIncomingMessages
  // Subscribe to inbound messages (from WebSocketService) and handle 
  // them appropriately. 
  private HandleIncomingMessages(): void {
      this.webSocketService.OnIncomingMessage$.subscribe((msg: Message) => this.OnIncomingMessage(msg));
  }


  //___________________________________________________________________________
  // OnIncomingMessage
  // Handle messages arriving from the back end 
  private OnIncomingMessage(msg: Message) {
    debug(`MessageService::OnIncomingMessage: receiving message from user id ${msg.from}`);

    // is it from an existing contact? 
    if (msg.from in this.contacts) {
      const contact: User = this.contacts[msg.from];
      if (!isNull(contact.conversation)) {
        const conversation: Conversation = contact.conversation;
        // add the message to the conversation
        if (isNull(conversation.messages)) {
          conversation.messages = new Array<Message>();
        }
        debug(`MessageService:OnIncomingMessage: adding message to existing conversation with ${contact.email}`);
        conversation.messages.push(msg);
      }
      else {
        // contact known, but we don't yet have a conversation with them yet...
      }
    }
    // message is from a previously unknown contact...need to add them to contacts
    // then do the exercise above...
    else {
      debug(`MessageService:OnIncomingMessage: sender is unknown, adding a contact`);
    }
  }


  //___________________________________________________________________________
  // Assign conversations to contacts
  // Q: Should this be done on back-end?
  private AssignConversationsToContacts() {
    debug(`MessageService::MapConversations: mapping conversations to contacts`);
    // Assign converstations to contacts
    for (const cid in this.conversations) {
      if (this.conversations.hasOwnProperty(cid)) {
          const conv: Conversation = this.conversations[cid];
           debug(`MessageService::MapConversations: conversation `, conv);
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

}
