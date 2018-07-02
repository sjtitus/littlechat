export interface  Message {
  from: number;
  to: number;
  content: string;
  timeSent: string;
}

export interface MessageAck {
  hashCode: string;
  timeReceived: string;
}
