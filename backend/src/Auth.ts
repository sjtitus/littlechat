/*_____________________________________________________________________________
 * Auth
 *_____________________________________________________________________________
*/
import { Token } from './Token';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import * as db from './db';

//_____________________________________________________________________________
// Login
// Existing user login
export async function Login(loginRequest:LoginRequest) {
  console.log(`Auth::Login: '${loginRequest.email}'`);
  let loginResponse: LoginResponse = {token: '', userId: 0, error: true, errorMessage: 'random error'};
  const { rows:users } = await db.query(db.sqlQueries.usrGetByEmail, [loginRequest.email]); 
  if (users.length === 0) { 
    loginResponse.error = true;
    loginResponse.errorMessage = `User not found`; 
    return loginResponse; 
  }
  let u = users[0];
  if (!u.isactive) {
    loginResponse.error = true;
    loginResponse.errorMessage = `User not found`; 
    return loginResponse; 
  }
  console.log(`Auth::Login: found '${u.firstname} ${u.lastname} (id=${u.id})'`);
  //const { pwrows } = await db.query(db.sqlQueries.passwdGetById, [u.id]); 
  const { rows:pws } = await db.query(db.sqlQueries.passwdGetById, [u.id]); 
  if (pws.length === 0) { 
    throw new Error(`Auth::Login: internal error: user ${u.id} has no password`);
  }
  // Authenticate the user 
  return loginResponse;
}


