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
// GetConversation
export async function GetConversation(getConversationRequest: GetConversationRequest) {
  const dbConversation = await db.getConversation(getConversationRequest);
  let getConversationsResponse: GetConversationResponse = {} as any;
  getConversationsResponse.error = false;
  getConversationsResponse.errorMessage = '';
  getConversationsResponse.userId = getConversationRequest.userId;
  getConversationsResponse.contactEmail = getConversationRequest.contact.email;
  getConversationsResponse.conversation = testMessages;
  return getConversationsResponse;
}