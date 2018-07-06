import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ContactListComponent } from './contactlist.component';
import { ApiService, ApiServiceStub } from '../../services/api.service';
import { TokenService, TokenServiceStub } from '../../services/token.service';

describe('ContactListComponent', () => {

  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let apiService: ApiService;
  let tokenService: TokenService;
  let contactElements: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactListComponent ],
      providers: [
        {provide: ApiService, useValue: ApiServiceStub },
        {provide: TokenService, useValue: TokenServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    apiService = TestBed.get(ApiService);
    tokenService = TestBed.get(TokenService);
  });

  it('should properly construct', fakeAsync( () => {
    expect(component).toBeTruthy();
  }));

  it('should contain the list of test contacts', fakeAsync( () => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    contactElements = fixture.nativeElement.querySelectorAll('.contact');
    expect(contactElements[0].textContent.trim()).toEqual('firstname1 lastname1');
    expect(contactElements[1].textContent.trim()).toEqual('firstname2 lastname2');
    expect(contactElements[2].textContent.trim()).toEqual('firstname3 lastname3');
    expect(contactElements[3].textContent.trim()).toEqual('firstname4 lastname4');
  }));

  it('should change to contact1 when contact1 is clicked', fakeAsync( () => {
    component.ngOnInit();
    tick();
    component.contactSelected.subscribe(user => {
      expect(user).toEqual({firstname: 'firstname1', lastname: 'lastname1', email: 'testuser1@test.com', id: 999001});
    });
    fixture.detectChanges();
    contactElements = fixture.nativeElement.querySelectorAll('.contact');
    contactElements[0].click();
    tick();
  }));

  it('should change to contact2 when contact2 is clicked', fakeAsync( () => {
    component.ngOnInit();
    tick();
    component.contactSelected.subscribe(user => {
      expect(user).toEqual({firstname: 'firstname2', lastname: 'lastname2', email: 'testuser2@test.com', id: 999002});
    });
    fixture.detectChanges();
    contactElements = fixture.nativeElement.querySelectorAll('.contact');
    contactElements[1].click();
    tick();
  }));

  it('should fail properly on API error', fakeAsync( () => {
    apiService.generateError = true;
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.applicationError).toContain('test error');
  }));

});
