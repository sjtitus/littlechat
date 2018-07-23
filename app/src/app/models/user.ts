import { Message } from './message';
import { ApiError } from './apierror';
import { Conversation } from './conversation';

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  id: number;
  conversation: Conversation | null;
}

export interface GetContactsRequest {
  userId: number;
}

export interface GetContactsResponse {
  error: boolean;
  errorMessage: string;
  apiError: ApiError;
  userId: number;
  contacts: { [id: number]: User };
}

/*
export interface  UserMessagesRequest {
    userId: number;
    maxMessages: number;
}

export interface  UserMessagesResponse {
  error: boolean;
  errorMessage: string;
  userId: number;
  messages: Message[];
}
*/
