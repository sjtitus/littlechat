/*_____________________________________________________________________________
  Littlechat API
_______________________________________________________________________________
 */
import { RequestHandler, Request, Response, NextFunction } from "express";

import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../../app/src/app/models/login";
import { User, GetContactsRequest, GetContactsResponse } from "../../app/src/app/models/user";
import { Conversation, GetConversationsRequest, GetConversationsResponse,
  GetConversationMessagesRequest, GetConversationMessagesResponse } from '../../app/src/app/models/conversation';
import * as Auth from "./auth";
import * as Contact from "./contact";

//___________________________________________________________________________
// Login
// Log in an existing user
export const login: RequestHandler = async function(req:Request, res:Response, next:NextFunction) {
  const loginRequest: LoginRequest = req.body;
  console.log(`Api::login: request for ${loginRequest.email}`);
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
// Return contacts for a specified user
export const contacts:RequestHandler = async function(req: Request, res:Response, next:NextFunction) {
  const getContactsRequest: GetContactsRequest = req.body;
  console.debug(`Api::Contacts: request for id ${getContactsRequest.userId}`);
  const getContactsResponse: GetContactsResponse = await Contact.GetContacts(getContactsRequest);
  res.status(200).json(getContactsResponse);
}

//___________________________________________________________________________
// Conversations
// Return conversations for a specified user
export const conversations:RequestHandler = async function(req: Request, res:Response, next:NextFunction) {
  const getConversationsRequest: GetConversationsRequest = req.body;
  console.debug(`Api::Conversations: request for id ${getConversationsRequest.userId}`);
  const getConversationsResponse: GetConversationsResponse = await Contact.GetConversations(getConversationsRequest);
  res.status(200).json(getConversationsResponse);
}


