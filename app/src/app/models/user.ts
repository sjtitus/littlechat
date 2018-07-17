import { Message } from './message';
import { ApiError } from './apierror';

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  id: number;
}

export interface GetContactsRequest {
  userId: number;
}

export interface GetContactsResponse {
  error: boolean;
  errorMessage: string;
  apiError: ApiError;
  userId: number;
  contacts: User[];
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
