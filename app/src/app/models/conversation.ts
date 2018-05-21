import { User } from './user';

export interface Conversation {
  owner: number;    // user id of the conversation owner
  users: User[];    // users included in the conversation
}
