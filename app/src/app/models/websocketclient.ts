import { WebSocketService } from '../services/websocket.service';

export class WebSocketClient {
  messages: string[] = [];
  ioConnection: any;

  constructor(private socketService: WebSocketService) {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: string) => { this.messages.push(message); });

    this.socketService.onEvent('connect')
      .subscribe(() => { console.log('connected'); });

    this.socketService.onEvent('disconnect')
      .subscribe(() => { console.log('disconnected'); });
  }

  public sendMessage(message: string): void {
    if (!message) { return; }
    this.socketService.send(message);
  }
}
