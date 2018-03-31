import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageentryComponent } from './messageentry.component';

describe('MessageentryComponent', () => {
  let component: MessageentryComponent;
  let fixture: ComponentFixture<MessageentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
