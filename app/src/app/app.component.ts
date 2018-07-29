import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

const dbgpackage = require('debug');

dbgpackage.colors =  [
  '#e6194b', '#3cb44b', '#0082c8', '#911eb4', '#f032e6',
  '#aa6e28', '#800000', '#000080', '#46f0f0', '#fabebe',
  '#f58231', '#008080', '#e6beff', '#cd853f', '#daa520',
  '#228b22', '#c71585'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  constructor() {}
  ngOnInit() {
    localStorage.debug = 'MessageService,Home,MessageEntry,ContactList';
  }
}
