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
  let current_cid = -1;
  let current_cindex = -1;
  for (let dc of dbConversation) {
    // new conversation
    //console.log(`GetConversations: comparing ${dc.conversation_id} to ${current_cid}`);
    if (dc.conversation_id !== current_cid) {
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
      current_cid = dc.conversation_id;
      current_cindex++;
    }
    const conv = resp.conversations[current_cindex];
    if (dc.usr_id !== getConversationsRequest.userId) {
      conv.audience.push(dc.usr_id);
    }
  }
  return resp;
}


//_____________________________________________________________________________
// GetConversation
export async function GetConversationMessages(getConversationMessagesRequest: GetConversationMessagesRequest) {
  const dbConversation = await db.getConversationMessages(getConversationMessagesRequest);
  let getConversationsResponse: GetConversationMessagesResponse = {} as any;
  getConversationsResponse.error = false;
  getConversationsResponse.conversationId = getConversationMessagesRequest.conversationId;
  getConversationsResponse.messages = [];
  return getConversationsResponse;
}