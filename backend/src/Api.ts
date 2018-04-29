import { RequestHandler, Request, Response, NextFunction } from "express";
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import { User, GetUsersRequest, GetUsersResponse } from "../../app/src/app/models/user";
import { Token } from "./Token"; 
//import * as revalidator from "revalidator"; 
const db = require('./db');

export class Api {
 
  constructor() {}
  
  root:RequestHandler = function(req:Request, res:Response, next:NextFunction) {
    console.log('Api: root requesthandler ');
    res.json({ message: 'Hello from root' });
  }   

  //___________________________________________________________________________
  // Login
  // Existing user login.
  login: RequestHandler = async function(req:Request, res:Response, next:NextFunction) {
    console.log('Api: login'); 
    const loginRequest: LoginRequest = req.body;
    const { rows } = await db.query('SELECT * FROM usr WHERE id = $1', [1])
    console.log("user: ",rows[0].firstname); 
    let loginResponse: LoginResponse = {
        token: Token.Generate({ userId: 123 }),
        userId: "123",
        error: false,
        errorMessage: '' 
    };
    res.status(200).json(loginResponse); 
  }
  
  //___________________________________________________________________________
  // Users
  // Get a list of users 
  users:RequestHandler = function(req: Request, res:Response, next:NextFunction) {
    console.log('Api: users'); 
    const usersRequest: GetUsersRequest = req.body;
    console.log('Api: users request', usersRequest); 
    let usersResponse: GetUsersResponse = {
      error: false,
      errorMessage: '',
      userId: 100, 
      users: [ {id:100, email:'email100'},  {id:101, email:'email101'},  {id:102, email:'email102'} ] 
    }
    res.status(200).json(usersResponse);
  }

  //___________________________________________________________________________
  // Signup
  // New user signup.
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
