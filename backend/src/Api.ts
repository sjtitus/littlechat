import { RequestHandler, Request, Response, NextFunction } from "express";
import { SignupRequest } from "../../app/src/app/models/signuprequest";
import { SignupResponse } from "../../app/src/app/models/signupresponse";
import { LoginRequest } from "../../app/src/app/models/loginrequest";
import { LoginResponse } from "../../app/src/app/models/loginresponse";
import { Token } from "./Token"; 

//import * as revalidator from "revalidator"; 
export class Api {
 
  constructor() {}
  
  root:RequestHandler = function(req:Request, res:Response, next:NextFunction) {
      console.log('Api: root requesthandler ');
      res.json({ message: 'Hello from root' });
  }   

  // Login
  login: RequestHandler = function(req:Request, res:Response, next:NextFunction) {
      console.log('Api: login requesthandler');
      let loginResponse: LoginResponse = {
        token: Token.Generate({ userId: 123 }),
        userId: "123",
        error: false,
        errorMessage: ''
      };

      res.status(200).json(loginResponse); 
  } 

  //___________________________________________________________________________
  // Signup
  // Process a new user signup request.
  signup:RequestHandler = function(req:Request, res:Response, next:NextFunction) {
      console.debug('Api: signup');
      const signuprequest: SignupRequest = req.body;
      /*
      let vMessage = revalidator.validate(signuprequest, {
        properties: {
            suemail: {
              description: 'new user email address',
              type: 'string',
              format: 'email',
              required: true
            }
        }
      });
      */
      console.log(signuprequest);
      res.status(200).json(signuprequest);
  }

}
