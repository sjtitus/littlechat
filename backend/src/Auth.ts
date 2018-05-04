/*_____________________________________________________________________________
 * Auth
 *_____________________________________________________________________________
*/
import { Token } from './Token';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import * as crypto from 'crypto';
const {promisify} = require('util');

import * as db from './db/db';
import { WSAEFAULT } from 'constants';

const async_pbkdf2 = promisify(crypto.pbkdf2); 
//crypto.DEFAULT_ENCODING = 'hex';
  
const crypt_iters: number = 100000;
const crypt_keylen: number = 128;
const crypt_alg: string = 'sha256';
const crypt_saltlen: number = 32;

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
  console.log(`Auth::Login: found ${user.firstname} ${user.lastname} (id=${user.id}) for email ${loginRequest.email}`);
  loginResponse.userId = user.id;
  //
  // Authenticate the user
  const authok = await _authenticateUser(user, loginRequest.password);
  if (!authok) {
    console.log(`Auth::Login: auth failed for id=${user.id}`);
    loginResponse.errorMessage = `Authentication failed for user ${loginRequest.email}`;
    return loginResponse; 
  }
  console.log(`Auth::Login: auth succeeded for id=${user.id}`);
  // Successful login: generate and return an authentication token
  const tok = Token.Generate({ userId: user.id });
  console.log(`Auth::Login: auth token=${tok}`);
  loginResponse.token = tok;
  loginResponse.error = false;
  return loginResponse;
}


//_____________________________________________________________________________
// Signup 
// New user signup 
export async function SignUp(signupRequest:SignupRequest) {
  let signupResponse: SignupResponse = {token: '', userId: 0, error: true, errorMessage: ''};
  console.log(`Auth::Signup: '${signupRequest.firstname} ${signupRequest.lastname} (${signupRequest.email})`);
  // Do we already have an account for this email?
  const user = await db.getUserByEmail(signupRequest.email);
  if (user != null) { 
    signupResponse.errorMessage = `User ${signupRequest.email} already exists, login instead`; 
    return signupResponse; 
  }
  // Passwords must match
  if (signupRequest.password !== signupRequest.password2) {
    signupResponse.errorMessage = `Passwords do not match`; 
    return signupResponse;
  }
  // Create the new user 
  const ok: boolean = await _createUser(signupRequest);
  return signupResponse;
}




//=========================================================
// Private Methods
//=========================================================

//_____________________________________________________________________________
// Authenticate the given user and password, return true if authentication
// succeeds.
async function _authenticateUser(user: any, password: string) {
  console.log(`Auth::_authenticate: ${user.emailaddress} (id=${user.id})`);
  const pw = await db.getPasswordByUserId(user.id);
  if (pw == null) {
    throw new Error(`Auth::Login: internal error: user ${user.id} has no password`);
  } 
  // check password
  let ebuff = await async_pbkdf2(password,pw.salt,pw.iter,crypt_keylen,crypt_alg);
  let encryptedpasswd = ebuff.toString('hex'); 
  console.log(`Auth::_authenticate: encpasswd: ${encryptedpasswd}`);
  console.log(`Auth::_authenticate: passwd: ${pw.passwd}`);
  const authOk = (encryptedpasswd === pw.passwd); 
  return authOk;
}


//_____________________________________________________________________________
// Create a user with the given password, return the new user id. 
async function _createUser(signupRequest: SignupRequest) {
  console.log(`Auth::_createUser: user for ${signupRequest.email}`);
  // first, create the usera
  const salt:string = crypto.randomBytes(crypt_saltlen).toString('hex');
  const pwbuff = await async_pbkdf2(signupRequest.password,salt,crypt_iters,crypt_keylen,crypt_alg);
  const passwd: string = pwbuff.toString('hex');
  const ok = await db.createUser( signupRequest.firstname, signupRequest.lastname,
    signupRequest.email, signupRequest.password, salt, passwd, crypt_iters);
  return ok;
}
