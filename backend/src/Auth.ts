/*_____________________________________________________________________________
 * Auth
 *_____________________________________________________________________________
*/
import { Token } from './Token';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import * as crypto from 'crypto';
const {promisify} = require('util');

import * as db from './db/db';

const async_pbkdf2 = promisify(crypto.pbkdf2); 
//crypto.DEFAULT_ENCODING = 'hex';

//_____________________________________________________________________________
// Login
// Existing user login
export async function Login(loginRequest:LoginRequest) {
  console.log(`Auth::Login: '${loginRequest.email}'`);
  let loginResponse: LoginResponse = {token: '', userId: 0, error: true, errorMessage: ''};
  //
  // Make sure user exists and is active 
  const user = await db.getUserByEmail(loginRequest.email);
  if (user == null) { 
    loginResponse.errorMessage = `User ${loginRequest.email} not found`; 
    return loginResponse; 
  }
  if (!user.active) {
    loginResponse.errorMessage = `User ${loginRequest.email} is inactive`; 
    return loginResponse;
  }
  console.log(`Auth::Login: found '${user.firstname} ${user.lastname} (id=${user.id})'`);
  //
  // Authenticate the user
  const authok = await _authenticate(user, loginRequest.password);
  if (!authok) {
    console.log('badness');
  }
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
  console.log(`Auth::_authenticate: ${user.emailaddress} (id=${user.id})`);
  const pw = await db.getPasswordByUserId(user.id);
  if (pw == null) {
    throw new Error(`Auth::Login: internal error: user ${user.id} has no password`);
  } 
  // check password
  let ebuff = await async_pbkdf2(password,pw.salt,pw.iter,128,'sha256');
  let encryptedpasswd = ebuff.toString('hex'); 
  console.log(`Auth::_authenticate: encpasswd: ${encryptedpasswd}`);
  return true;
}

