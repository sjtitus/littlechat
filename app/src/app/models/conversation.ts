import { User } from './user';
import { ApiError } from './apierror';

export interface Conversation {
  id: number;
  name: string;
  numMessages: number;
  timestampCreated: string;
  timestampModified: string;
  timestampLastMessage: string;
}

export interface GetAllConversationsRequest {
  userId: number;
}

export interface GetAllConversationsResponse {
  error: boolean;
  errorMessage: string;
  apiError: ApiError;
  conversations: Conversation[];
}

export interface GetConversationMessagesRequest {
  userId: number;
  conversationId: number;
}

export interface GetConversationMessagesResponse {
  error: boolean;
  errorMessage: string;
  apiError: ApiError;
  userId: number;
  contactEmail: string;
  messages: Message[];
}

