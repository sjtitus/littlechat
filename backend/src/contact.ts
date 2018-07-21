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
  getContactsResponse.contacts = [];
  dbContacts.map((contact) => {
    const user: User = {
      firstname: contact.firstname,
      lastname: contact.lastname,
      email: contact.email,
      id: contact.id,
    };
    getContactsResponse.contacts.push(user);
  });
  return getContactsResponse;
}

//_____________________________________________________________________________
// GetConversations
export async function GetConversations(getConversationsRequest: GetConversationsRequest) {
  const dbConversation = await db.getConversations(getConversationsRequest);
  const resp: GetConversationsResponse = {} as any;
  resp.error = false;
  resp.conversations = [];
  for (let dc of dbConversation) {
    console.log(`db conversation: ${JSON.stringify(dc)}`);
    /*
    dc.conversation_id
    dc.usr_id
    dc.conversation_name
    dc.created_timestamp
    dc.modified_timestamp
    dc.lastmessasge_timestamp
    */
    const respConv: Conversation = {} as any; 
    resp.conversations.push(respConv);
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