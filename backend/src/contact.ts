/*_____________________________________________________________________________
 * Contact
 * Contact handling 
 *_____________________________________________________________________________
*/
import { User, GetContactsRequest, GetContactsResponse } from "../../app/src/app/models/user";
import * as db from './db/db';
import { contacts } from "./api";
import { userInfo } from "os";

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