
/*_____________________________________________________________________________
 * Database singleton
 *_____________________________________________________________________________
*/
import { Pool } from 'pg';
import { Message }  from '../../../app/src/app/models/message';
import { User, GetContactsRequest, GetContactsResponse,
  GetConversationRequest, GetConversationResponse } from "../../../app/src/app/models/user";

// Database connection pool
console.log('db: creating new connection pool');
const pool = new Pool();

//_____________________________________________________________________________
// SQL queries
const sql = {
  createUser: 'SELECT * from createUser($1,$2,$3,$4,$5,$6)',
  getUserByEmail: 'SELECT * FROM usr WHERE email = $1',
  getPasswordByUserId: 'SELECT * FROM passwd WHERE id_usr = $1',
  getContactsByUserId: 'SELECT * FROM usr',
  getConversationMessages: 'SELECT * from message where id_conversation = $1'
}

//=========================================================
// Data Access
//=========================================================

//______________________________________________________________________________
// Run a query against the connection pool
export async function query(text, params) { return pool.query(text, params) }


//______________________________________________________________________________
// getConversation
// Returns: db conversation
export async function getConversation( contact: User ) {
  const { rows:conversations } = await query(sql.getConversationMessages, );
  return conversations;
}


//______________________________________________________________________________
// getContactsByUserId
// Returns: db contact list for user with specified user id
export async function getContactsByUserId( uid: number ) {
  const { rows:contacts } = await query(sql.getContactsByUserId, []);
  return contacts;
}

//______________________________________________________________________________
// createUser
// Create a new littlechat user in the database.
// Returns: the new user's id or null if user creation fails
export async function createUser( firstname: string, lastname: string, email: string,
  salt: string, encryptedPassword: string, cryptIters: number ) {
    const { rows } = await query(
        sql.createUser,
        [firstname, lastname, email, salt, encryptedPassword, cryptIters]
    );
    if (rows.length === 0) {
      throw new Error(`db.createUser: failed to create user for ${email} (unexpected empty result)`);
    }
    return rows[0].createuser;
}

//______________________________________________________________________________
// getUserByEmail
// Returns: db user with specified email or null if user not found
export async function getUserByEmail( emailaddress: string ) {
  const { rows:users } = await query(sql.getUserByEmail, [emailaddress]);
  return (users.length === 0) ? null:users[0];
}

//______________________________________________________________________________
// saveMessage
// Save a received message to the database
export async function saveMessage( message: Message ) {
}

//______________________________________________________________________________
// getPasswordByUserId
// Returns: db password info for user with specified user id
export async function getPasswordByUserId( uid: number ) {
  const { rows:passwords } = await query(sql.getPasswordByUserId, [uid]);
  if (passwords.length === 0) {
      throw new Error(`db.getPasswordByUserId: failed to get password info for userid ${uid} (unexpected empty result)`);
  }
  return passwords[0];
}


