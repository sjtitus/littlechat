import { Message } from './message';

export interface User {
  id: number;
  email: string;
}

export interface GetUsersRequest {
  userId: number;
}

export interface  GetUsersResponse {
  error: boolean;
  errorMessage: string;
  userId: number;
  users: User[];
}

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
