import { RequestHandler, Request, Response, NextFunction } from "express";
import { SignupRequest } from "../../app/src/app/models/signuprequest";
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

 
  // Signup
  signup:RequestHandler = function(req:Request, res:Response, next:NextFunction) {
      console.log('Api: signup requesthandler, baby');
      const signuprequest: SignupRequest = req.body;
      console.log(signuprequest);
      res.status(200).json(signuprequest);
  }

}
