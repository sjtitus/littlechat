/*_____________________________________________________________________________
 * Auth
 *_____________________________________________________________________________
*/
import { Token } from './Token';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import * as crypto from 'crypto';
const {promisify} = require('util');

import * as db from './db';
const async_pbkdf2 = promisify(crypto.pbkdf2);

//_____________________________________________________________________________
// Login
// Existing user login
export async function Login(loginRequest:LoginRequest) {
  console.log(`Auth::Login: '${loginRequest.email}'`);
  let loginResponse: LoginResponse = {token: '', userId: 0, error: false, errorMessage: ''};
  // Find the user 
  const { rows:users } = await db.query(db.sqlQueries.usrGetByEmail, [loginRequest.email]); 
  if (users.length === 0 || !users[0].isactive) { 
    loginResponse.error = true;
    loginResponse.errorMessage = `User not found`; 
    return loginResponse; 
  }
  let user = users[0];
  console.log(`Auth::Login: found '${user.firstname} ${user.lastname} (id=${user.id})'`);
  // Authenticate the user
  if (!_authenticate(user, loginRequest.password)) {

  }
  // Authenticate the user 
  return loginResponse;
}


//_____________________________________________________________________________
// Signup 
// New user signup 
export async function SignUp(signupRequest:SignupRequest) {
  let signupResponse: SignupResponse = {token: '', userId: 0, error: false, errorMessage: ''};
  console.log(`Auth::Signup: '${signupRequest.firstname} ${signupRequest.lastname}`);
  return signupResponse;
}




//=========================================================
// Private Methods
//=========================================================

//_____________________________________________________________________________
// _authenticate
// Authenticate the given user and password, return true if authentication
// succeeds.
async function _authenticate(user: any, password: string) {
  console.log(`Auth::_authenticate: '${user.id}'`);
  const { rows:pwinfo } = await db.query(db.sqlQueries.passwdGetById, [user.id]); 
  if (pwinfo.length === 0) { 
    throw new Error(`Auth::Login: internal error: user ${user.id} has no password`);
  }
  // check password
  let encryptedpass = await async_pbkdf2(password,pwinfo.salt,pwinfo.iter,256,'sha256');
  return true;
}

