/*_____________________________________________________________________________
  Auth 
  Authentication 
 _____________________________________________________________________________
 */
import { Token } from './Token';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import * as db from './db';


export async function Login(loginRequest:LoginRequest) {
  console.log(`Login: login '${loginRequest.email}'`);
  const { rows } = await db.query(db.sqlQueries.getUserByEmail, loginRequest.email); 
  console.log("user:",rows.length); 
  let loginResponse: LoginResponse = {
      token: Token.Generate({ userId: 123 }),
      userId: "123",
      error: false,
      errorMessage: '' 
  };
  return loginResponse;
}
