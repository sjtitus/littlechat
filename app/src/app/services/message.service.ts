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

  // Send the message to the back end and post it to the front end
  SendMessage(user: User, msg: Message) {
    console.log('MessageService: sending/posting message:', msg, 'to user', user);
    this.PostMessage(msg);
  }

  // PostMessage: post a new message to the front end
  PostMessage(msg: Message) {
    this.newMessageSource.next(msg);
  }

  // GetMessages: fetch a user's messages from the back end
  GetMessages(user: User): Message[] {
    return [];
    /*
    const msgs: Message[] = [
      { content: 'message 1' },
      { content: 'message 2' },
      { content: 'message 3' },
      { content: 'message 4' },
      { content: 'message 5' },
      { content: 'message 6' },
      { content: 'message 6' },
      { content: 'message 6' },
      { content: 'message 6' },
      { content: 'message 6' },
      { content: 'message 6' },
      { content: 'message 6' },
      { content: 'message 6' },
      { content: 'message 6' },
      { content: 'message 16' },
    ];
    return msgs.map( m => {
      m.content = user.email + ' ' + m.content;
      return m;
    });
    */
  }

  // GetUsers: get the list of users from the back end
  GetUsers(): User[] {
    return [];
    /*
    const users: User[] = [
      {email: 'Steve', password: ''},
      {email: 'Bob', password: ''},
      {email: 'Luke', password: ''},
      {email: 'Arden', password: ''},
      {email: 'Jess', password: ''},
      {email: 'Jess12', password: ''}
    ];
    return users;
    */
  }

}
