import { RequestHandler, Request, Response, NextFunction } from "express";

export class Api {
 
  constructor() {}
  
  root:RequestHandler = function(req:Request, res:Response, next:NextFunction) {
      console.log('Api: root requesthandler');    
      res.json({ message: 'Hello from root' });
  }

  login:RequestHandler = function(req:Request, res:Response, next:NextFunction) {
      console.log('Api: login requesthandler');
      throw new Error('throwing error from loginHandler');    
      res.json({ message: 'Hello from loginHandler' });
  }

}
