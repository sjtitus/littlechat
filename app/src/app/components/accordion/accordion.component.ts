import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnInit {

  @Input() open = false;

  constructor() { }

  ngOnInit() { }

  ToggleOpen(event) {
    event.preventDefault();
    this.open = !this.open;
  }

}
