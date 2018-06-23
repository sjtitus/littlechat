/*_____________________________________________________________________________
 * Auth
 *_____________________________________________________________________________
*/
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import { User } from "../../app/src/app/models/user";
import { Token } from './token';
import * as db from './db/db';
import * as mycrypto from './mycrypto';


//_____________________________________________________________________________
// Login
// Log in an existing user
export async function Login(loginRequest:LoginRequest) {
  console.log(`Auth::Login: ${loginRequest.email}`);
  let loginResponse: LoginResponse = {token: '', userId: 0, error: true, errorMessage: ''};
  //_________________________________
  // Get user record from db
  const dbuser = await db.getUserByEmail(loginRequest.email);
  if (dbuser == null) {
    console.log(`Auth::Login: User ${loginRequest.email} not found`);
    loginResponse.errorMessage = `User ${loginRequest.email} not found`;
    return loginResponse;
  }
  if (!dbuser.active) {
    console.log(`Auth::Login: User ${loginRequest.email} is inactive`);
    loginResponse.errorMessage = `User ${loginRequest.email} is inactive`;
    return loginResponse;
  }
  console.log(`Auth::Login: Found active user ${loginRequest.email} (id = ${dbuser.id})`);
  //__________________________________________________
  // Authenticate: check password against db entry
  const dbpw = await db.getPasswordByUserId(dbuser.id);
  const authOk = await mycrypto.CheckPassword(loginRequest.password, dbpw.passwd, dbpw.salt, dbpw.iter);
  if (!authOk) {
    console.log(`Auth::Login: Auth failed for user ${loginRequest.email} (id = ${dbuser.id})`);
    loginResponse.userId = dbuser.id;
    loginResponse.errorMessage = `Authentication failed for user ${loginRequest.email}`;
    return loginResponse;
  }
  //___________________________________________________
  // Successful auth: return new auth token
  const user: User = {
      firstname: dbuser.firstname,
      lastname: dbuser.lastname,
      id: dbuser.id,
      email: dbuser.email
  }
  const tok = Token.Generate(user);
  console.log(`Auth::Login: Auth user: `,user);
  console.log(`Auth::Login: Auth succeeded for user ${loginRequest.email} (id = ${dbuser.id})`);
  loginResponse.userId = dbuser.id;
  loginResponse.token = tok;
  loginResponse.error = false;
  return loginResponse;
}


//_____________________________________________________________________________
// Signup
// Sign up a new user
export async function SignUp(signupRequest:SignupRequest) {
  console.log(`Auth::Signup: ${signupRequest.firstname} ${signupRequest.lastname} (${signupRequest.email})`);
  let signupResponse: SignupResponse = {
      token: '', userId: -1, error: true, errorMessage: ''
  };
  //______________________________________________
  // User must not exist
  const user = await db.getUserByEmail(signupRequest.email);
  if (user != null) {
    signupResponse.errorMessage = `Account for ${signupRequest.email} already exists, login instead`;
    return signupResponse;
  }
  //______________________________________________
  // Passwords must match
  if (signupRequest.password !== signupRequest.password2) {
    signupResponse.errorMessage = `Passwords do not match`;
    return signupResponse;
  }
  //______________________________________________
  // Create the new user
  const [salt, encryptedPassword, iters] = await mycrypto.EncryptPassword(signupRequest.password);
  const newUserId = await db.createUser( signupRequest.firstname, signupRequest.lastname,
      signupRequest.email, salt, encryptedPassword, iters);
  console.log(`Auth::Signup: new user id = ${newUserId}`);
  //______________________________________________
  // Generate auth token
  const tok = Token.Generate({ userId: newUserId, email: signupRequest.email });
  console.log(`Auth::Signup: new user auth token = ${tok}`);
  signupResponse.userId = newUserId;
  signupResponse.token = tok;
  signupResponse.error = false;
  return signupResponse;
}

