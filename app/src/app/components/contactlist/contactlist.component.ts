/*______________________________________________________________________________
  ContactList
  Lists the user's contacts, allows user to select a chat contact.
________________________________________________________________________________
*/
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { User } from '../../models/user';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['../../app.component.css']
})

export class ContactListComponent implements OnInit {

  // User contacts (managed by MessageService)
  Contacts: {[id: number]: User};
  SortedContactIds: string[];

  // Emit an event when a contact is selected
  @Output() contactSelected = new EventEmitter<User>();
  private _selectedContact: User;

  constructor( private messageService: MessageService ) {
      // Subscribe to contact updates from MessageService
      this.messageService.ContactsObservable().subscribe(
        (contacts: {[id: number]: User}) => { this.UpdateContacts(contacts); }
      );
  }

  ngOnInit() {}

  //___________________________________________________________________________
  // Select chat contact
  SelectContact(contact: User) {
    console.log(`ContactList::SelectContact: new chat target ${contact.email}`);
    this._selectedContact = contact;
    this.contactSelected.emit(this._selectedContact);   // Notify listeners
  }


  //___________________________________________________________________________
  //_______________________________ Private ___________________________________

  //___________________________________________________________________________
  // UpdateContacts
  // Update the user contact list
  private UpdateContacts(contacts: {[id: number]: User}) {
    this.Contacts = contacts;
    this.SortContacts();
  }

  private SortContacts() {
    this.SortedContactIds = Object.keys(this.Contacts).sort(
      function(p, q) {
        if (this.Contacts[p].lastname < this.Contacts[q].lastname) { return -1; }
        if (this.Contacts[p].lastname > this.Contacts[q].lastname) { return 1;  }
        return 0;
      });
  }


}

