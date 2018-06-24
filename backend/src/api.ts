/*_____________________________________________________________________________
  Littlechat API
_______________________________________________________________________________
 */
import { RequestHandler, Request, Response, NextFunction } from "express";

import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import { User, GetContactsRequest, GetContactsResponse, GetConversationRequest, GetConversationResponse } from "../../app/src/app/models/user";
import * as Auth from "./auth";
import * as Contact from "./contact";

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
  const signupRequest: SignupRequest = req.body;
  console.debug(`Api::Signup: request for ${signupRequest.email}`);
  const signupResponse: SignupResponse = await Auth.SignUp(signupRequest);
  res.status(200).json(signupResponse);
}

//___________________________________________________________________________
// Contacts
// List contacts for a specified user
export const contacts:RequestHandler = async function(req: Request, res:Response, next:NextFunction) {
  const getContactsRequest: GetContactsRequest = req.body;
  console.debug(`Api::Contacts: request for user id ${getContactsRequest.userId}`);
  const getContactsResponse: GetContactsResponse = await Contact.GetContacts(getContactsRequest);
  res.status(200).json(getContactsResponse);
}

//___________________________________________________________________________
// Conversation
export const conversation:RequestHandler = async function(req: Request, res:Response, next:NextFunction) {
  const getConversationRequest: GetConversationRequest = req.body;
  console.debug(`Api::Conversations: request for user id ${getConversationRequest.userId}`);
  const getConversationsResponse: GetConversationResponse = await Contact.GetConversation(getConversationRequest);
  res.status(200).json(getConversationsResponse);
}


