import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Message } from '../models/message';
import { Subject } from 'rxjs/Subject';
import { ApiService } from '../services/api.service';

@Injectable()
export class MessageService {

  // we will "post" newly-created messages as observable for front end
  private newMessageSource = new Subject<Message>();
  newMessageSource$ = this.newMessageSource.asObservable();

  constructor(private apiService: ApiService) { }

  //___________________________________________________________________________
  // SendMessage
  SendMessage(msg: Message) {
    console.log(`MessageService::SendMessage: from ${msg.from} to ${msg.to}`);
    this.PostMessageToUI(msg);
  }

  //___________________________________________________________________________
  // PostMessageToUI
  private PostMessageToUI(msg: Message) {
    this.newMessageSource.next(msg);
  }

  //___________________________________________________________________________
  // GetMessages: fetch a user's messages from the back end
  GetMessages(user: User): Message[] {
    return [];
  }

  // GetUsers: get the list of users from the back end
  GetUsers(): User[] {
    return [];
  }

}
