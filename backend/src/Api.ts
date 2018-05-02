/*_____________________________________________________________________________
  API
  Littlechat API 
_______________________________________________________________________________
 */
import { RequestHandler, Request, Response, NextFunction } from "express";

import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import { User, GetUsersRequest, GetUsersResponse } from "../../app/src/app/models/user";
import * as Auth from "./Auth";


//___________________________________________________________________________
// Login
// Log in an existing user 
export const login: RequestHandler = async function(req:Request, res:Response, next:NextFunction) {
  console.log('Api: login');
  const loginRequest: LoginRequest = req.body;
  const loginResponse: LoginResponse = await Auth.Login(loginRequest);  
  res.status(200).json(loginResponse); 
}


//___________________________________________________________________________
// Signup
// New user signup.
export const signup:RequestHandler = function(req:Request, res:Response, next:NextFunction) {
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


//___________________________________________________________________________
// Contacts 
// List contacts for a specified user  
export const contacts:RequestHandler = function(req: Request, res:Response, next:NextFunction) {
  console.log('Api: contacts'); 
  const usersRequest: GetUsersRequest = req.body;
  let usersResponse: GetUsersResponse = {
    error: false,
    errorMessage: '',
    userId: 100, 
    users: [ {id:100, email:'email100'},  {id:101, email:'email101'},  {id:102, email:'email102'} ] 
  }
  res.status(200).json(usersResponse);
}


