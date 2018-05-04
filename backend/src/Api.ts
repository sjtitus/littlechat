/*_____________________________________________________________________________
  Littlechat API 
_______________________________________________________________________________
 */
import { RequestHandler, Request, Response, NextFunction } from "express";

import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import { User, GetUsersRequest, GetUsersResponse } from "../../app/src/app/models/user";
import * as Auth from "./auth";


//___________________________________________________________________________
// Login
// Log in an existing user 
export const login: RequestHandler = async function(req:Request, res:Response, next:NextFunction) {
  console.log('Api::login');
  const loginRequest: LoginRequest = req.body;
  const loginResponse: LoginResponse = await Auth.Login(loginRequest);  
  res.status(200).json(loginResponse); 
}


//___________________________________________________________________________
// Signup
// New user signup.
export const signup:RequestHandler = async function(req:Request, res:Response, next:NextFunction) {
  console.debug('Api::signup');
  const signupRequest: SignupRequest = req.body;
  const signupResponse: SignupResponse = await Auth.SignUp(signupRequest);  
  res.status(200).json(signupResponse);
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


