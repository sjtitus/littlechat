import { ApiError } from './apierror';
import { Message } from './message';

export interface Conversation {
  id: number;
  name: string;
  audience: number[];
  totalMessages: number;
  timestampCreated: string;
  timestampModified: string;
  timestampLastMessage: string;
  messages: Message[] | null;
}

export interface CreateConversationRequest {
  userId: number;
  audience: number[];
}

export interface CreateConversationResponse {
  error: boolean;
  errorMessage: string;
  apiError: ApiError;
  isNew: boolean;
  conversation: Conversation;
}

export interface GetConversationsRequest {
  userId: number;
  maxAgeInHours: number;
}

export interface GetConversationsResponse {
  error: boolean;
  errorMessage: string;
  apiError: ApiError;
  conversations: { [id: number]: Conversation };
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

