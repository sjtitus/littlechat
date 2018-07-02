/*_____________________________________________________________________________
 * Contact
 * Contact handling
 *_____________________________________________________________________________
*/
import { User, GetContactsRequest, GetContactsResponse,
  GetConversationRequest, GetConversationResponse } from "../../app/src/app/models/user";
import { Message } from "../../app/src/app/models/message";
import * as db from './db/db';
import { contacts } from "./api";
import { userInfo } from "os";
import { Conversation } from "../../app/src/app/models/conversation";

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
  const dbContacts = await db.getContactsByUserId(getContactsRequest.userId);
  let getContactsResponse: GetContactsResponse = {} as any;
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
// GetConversation
export async function GetConversation(getConversationsRequest: GetConversationRequest) {
  //const dbConversation = await db.getConversationByUserId(getConversationsRequest.userId);
  let getConversationsResponse: GetConversationResponse = {} as any;
  getConversationsResponse.error = false;
  getConversationsResponse.errorMessage = '';
  getConversationsResponse.userId = getConversationsRequest.userId;
  getConversationsResponse.contactEmail = getConversationsRequest.contactEmail;
  getConversationsResponse.conversation = testMessages;
  /*
  dbConversations.map((dbconv) => {
    const conv: Conversation = {
      owner: {firstname: '', lastname: '', id: 1, email:''},
      audience: [],
      totalMessages: 0,
      lastMessageTime: '2018-05-20 20:49:45.301064-04'
    }
    getConversationsResponse.conversations.push(conv);
  });
  */
  return getConversationsResponse;
}