import { Message } from './message';
import { Conversation } from './conversation';

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  id: number;
}

export interface GetConversationsRequest {
  userId: number;
}

export interface GetConversationsResponse {
  error: boolean;
  errorMessage: string;
  userId: number;
  conversations: Conversation[];
}

export interface GetContactsRequest {
  userId: number;
}

export interface GetContactsResponse {
  error: boolean;
  errorMessage: string;
  userId: number;
  contacts: User[];
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
