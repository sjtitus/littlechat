import { RequestHandler, Request, Response, NextFunction } from "express";
import { SignupRequest } from "../../app/src/app/models/signuprequest";
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
      res.status(200).json({ id: 123 }); 
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
