/*_____________________________________________________________________________
 * Contact
 * Contact handling 
 *_____________________________________________________________________________
*/
import { User, GetContactsRequest, GetContactsResponse,
  GetConversationsRequest, GetConversationsResponse } from "../../app/src/app/models/user";
import * as db from './db/db';
import { contacts } from "./api";
import { userInfo } from "os";
import { Conversation } from "../../app/src/app/models/conversation";

//_____________________________________________________________________________
// GetContacts 
export async function GetContacts(getContactsRequest: GetContactsRequest) {
  const dbContacts = await db.getContactsByUserId(getContactsRequest.userId);
  let getContactsResponse: GetContactsResponse = { 
    error: false, errorMessage: '', userId: getContactsRequest.userId, contacts: []
  };
  dbContacts.map((contact) => {
    const user: User = {id: contact.id, email: contact.email};
    getContactsResponse.contacts.push(user);
  });
  return getContactsResponse;
}

//_____________________________________________________________________________
// GetConversations
export async function GetConversations(getConversationsRequest: GetConversationsRequest) {
  const dbConversations = await db.getConversationsByUserId(getConversationsRequest.userId);
  let getConversationsResponse: GetConversationsResponse = { 
    error: false, errorMessage: '', userId: getConversationsRequest.userId, conversations: []
  };
  dbConversations.map((dbconv) => {
    const conv: Conversation = { 
      owner: {id: 1, email:''},
      audience: [], 
      totalMessages: 0,
      lastMessageTime: '2018-05-20 20:49:45.301064-04'
    }
    getConversationsResponse.conversations.push(conv);
  });
  return getConversationsResponse;
}