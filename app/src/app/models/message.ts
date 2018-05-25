export interface  Message {
  from: number;
  to: number;
  content: string;
  timeSent: string;
  hashCode: string;
}

export interface MessageAck {
  hashCode: string;
  timeReceived: string;
}
