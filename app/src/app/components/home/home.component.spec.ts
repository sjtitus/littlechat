import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WebSocketService } from '../../services/websocket.service';
import { TokenService, TokenServiceStub } from '../../services/token.service';

import { HomeComponent } from './home.component';
import { ContactListComponent } from '../contactlist/contactlist.component';
import { MessageentryComponent } from '../messageentry/messageentry.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent, ContactListComponent, MessageentryComponent ],
      providers: [
        {provide: TokenService, useValue: TokenServiceStub },
        {provide: WebSocketService, useValue: WebSocketService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
