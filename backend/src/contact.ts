/*_____________________________________________________________________________
 * Contact
 * Contact handling
 *_____________________________________________________________________________
*/
import { User, GetContactsRequest, GetContactsResponse } from "../../app/src/app/models/user";
import { Conversation, GetConversationsRequest, GetConversationsResponse,
  GetConversationMessagesRequest, GetConversationMessagesResponse } from '../../app/src/app/models/conversation';
import { Message } from "../../app/src/app/models/message";
import * as db from './db/db';
import { isUndefined, isNullOrUndefined } from "util";

const testMessages: Message[] = [
 { to: 2, from: 1, timeSent: 'now', content: 'this is a test message'},
 { to: 2, from: 1, timeSent: 'now', content: 'this is a test message'},
 { to: 2, from: 1, timeSent: 'now', content: 'this is a test message'},
 { to: 2, from: 1, timeSent: 'now', content: 'this is a test message'},
 { to: 2, from: 1, timeSent: 'now', content: 'this is a test message'}
];

//_____________________________________________________________________________
// GetContacts
export async function GetContacts(getContactsRequest: GetContactsRequest) {
  let getContactsResponse: GetContactsResponse = {} as any;
  const dbContacts = await db.getContactsByUserId(getContactsRequest.userId);
  getContactsResponse.userId = getContactsRequest.userId;
  getContactsResponse.contacts = {};
  dbContacts.map((contact) => {
    const user: User = {
      firstname: contact.firstname,
      lastname: contact.lastname,
      email: contact.email, 
      id: contact.id,
      conversation: null
    };
    getContactsResponse.contacts[contact.id] = user;
  });
  return getContactsResponse;
}

//_____________________________________________________________________________
// GetConversations
export async function GetConversations(getConversationsRequest: GetConversationsRequest) {
  const dbConversation = await db.getConversations(getConversationsRequest);
  const resp: GetConversationsResponse = {} as any;
  resp.error = false;
  resp.conversations = {};
  let currentConversation: Conversation = {} as any; 
  for (let dc of dbConversation) {
    // new conversation
    //console.log(`GetConversations: comparing ${dc.conversation_id} to ${current_cid}`);
    if (isNullOrUndefined(currentConversation.id) || (dc.conversation_id !== currentConversation.id)) {
      const respConv: Conversation = {
        id: dc.conversation_id,
        name: dc.conversation_name,
        audience: [],
        totalMessages: 0,
        timestampCreated: dc.created_timestamp,
        timestampModified: dc.modifed_timestamp,
        timestampLastMessage: dc.lastmessasge_timestamp,
        messages: []
      }
      resp.conversations[respConv.id] = respConv;
      currentConversation = respConv; 
    }
    if (dc.usr_id !== getConversationsRequest.userId) {
      currentConversation.audience.push(dc.usr_id);
    }
  }
  return resp;
}


//_____________________________________________________________________________
// GetConversation
export async function GetConversationMessages(getConversationMessagesRequest: GetConversationMessagesRequest) {
  const dbMessages = await db.getConversationMessages(getConversationMessagesRequest);
  // id | id_conversation | id_sender |       timestampcreated        |           content
  let getConversationMessagesResponse: GetConversationMessagesResponse = {} as any;
  getConversationMessagesResponse.error = false;
  getConversationMessagesResponse.conversationId = getConversationMessagesRequest.conversationId;
  getConversationMessagesResponse.messages = [];
  for (let dbm of dbMessages) {
    const msg: Message = {
      from: dbm.id_sender,
      to: getConversationMessagesRequest.conversationId,
      content: dbm.content,
      timeSent: dbm.timestampCreated 
    }
    getConversationMessagesResponse.messages.push(msg);
  }
  return getConversationMessagesResponse;
}