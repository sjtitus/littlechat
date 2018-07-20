import { User } from './user';
import { ApiError } from './apierror';
import { Message } from './message';

export interface Conversation {
  id: number;
  name: string;
  audience: number[];
  numMessages: number;
  timestampCreated: string;
  timestampModified: string;
  timestampLastMessage: string;
}

export interface GetConversationsRequest {
  userId: number;
  maxAgeInHours: number;
}

export interface GetConversationsResponse {
  error: boolean;
  errorMessage: string;
  apiError: ApiError;
  conversations: Conversation[];
}

export interface GetConversationMessagesRequest {
  conversationId: number;
}

export interface GetConversationMessagesResponse {
  error: boolean;
  errorMessage: string;
  apiError: ApiError;
  conversationId: number;
  messages: Message[];
}

