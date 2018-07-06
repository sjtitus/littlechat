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

  it('should create', fakeAsync( () => {
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    contactElements = fixture.nativeElement.querySelectorAll('.contact');
    expect(contactElements[1].textContent.trim()).toEqual('firstname2 lastname2');
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

});
