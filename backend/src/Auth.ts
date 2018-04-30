/*_____________________________________________________________________________
  Auth 
  Authentication 
 _____________________________________________________________________________
 */
import { Token } from './Token';
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
const db = require('./db');

export class Auth { 
    constructor() {}

    public static async Login(loginRequest:LoginRequest) {
      const { rows } = await db.query('SELECT * FROM usr WHERE emailaddress = $1', ['sjtitus@alumni.duke.edu'])
      console.log("user:",rows.length); 
      let loginResponse: LoginResponse = {
          token: Token.Generate({ userId: 123 }),
          userId: "123",
          error: false,
          errorMessage: '' 
      };
      return loginResponse;
    }

}