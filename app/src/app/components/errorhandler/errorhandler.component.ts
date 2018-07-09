import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-errorhandler',
  templateUrl: './errorhandler.component.html',
  styleUrls: ['./errorhandler.component.css', '../../app.component.css']
})

export class ErrorhandlerComponent implements OnInit {
  Message = 'This is the errorhandler text';
  ErrorList: Array<string> = [
    'this is error 1',
    'this is error 2',
    'this is error 3'
  ];

  constructor() { }

  ngOnInit() {
  }

}
