//import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusMonitorStatus, StatusMonitor } from './statusmonitor';

describe('Model: StatusMonitor', () => {

  let statusMonitor: StatusMonitor;

  beforeEach(() => {
    statusMonitor = new StatusMonitor('TestStatusMonitor');
  });

  afterEach(() => {
    statusMonitor = null;
  });

  it('should be initialized to "Unknown"', () => {
    expect(statusMonitor.Status).toEqual(StatusMonitorStatus.Unknown);
  });

/*
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
*/

});
