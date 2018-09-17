export interface Message {
  from: number;
  conversation: number;
  content: string;
  timeSent: string;
}

export interface MessageAck {
  hashCode: string;
  timeReceived: string;
}
