import { User } from './user';

export interface Conversation {
  owner: User;
  audience: User[];
  totalMessages: number;
  lastMessageTime: string;
}
