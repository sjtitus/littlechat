import { Component, OnInit, Injectable, ApplicationRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { LoginService } from '../../services/login.service';
import { SignupRequest } from '../../models/signuprequest';
import { SignupResponse } from '../../models/signupresponse';
import { LoginRequest } from '../../models/loginrequest';
import { LoginResponse } from '../../models/loginresponse';
import { ErrorResponse } from '../../models/errorresponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../app.component.css']
})

export class LoginComponent implements OnInit {

  //===========================================================================
  // Public Interface
  //===========================================================================
  public loginForm: FormGroup;
  public validationErrText: ValidationErrText;

  public backendLoginErrorText  = '';
  public backendSignupErrorText = '';

  constructor( private fb: FormBuilder, private loginService: LoginService, private zone: NgZone ) {
      this.validationErrText = new ValidationErrText();
      this.loginForm = this.fb.group({
              email: [ '', [ Validators.required, Validators.email ] ],
           password: [ '', [ Validators.required, Validators.minLength(6)] ],
          firstname: [ '', [ Validators.required ] ],
           lastname: [ '', [ Validators.required ] ],
            suemail: [ '', [ Validators.required, Validators.email ] ],
         supassword: [ '', [ Validators.required, Validators.minLength(6) ] ],
        supassword2: [ '', [ Validators.required, Validators.minLength(6) ] ],
      });
  }

  //___________________________________________________________________________
  // Form control accessors
  get email()       { return this.loginForm.get('email');       }
  get password()    { return this.loginForm.get('password');    }
  get firstname()   { return this.loginForm.get('firstname');   }
  get lastname()    { return this.loginForm.get('lastname');    }
  get suemail()     { return this.loginForm.get('suemail');     }
  get supassword()  { return this.loginForm.get('supassword');  }
  get supassword2() { return this.loginForm.get('supassword2'); }

  ngOnInit() {}

  //___________________________________________________________________________
  // Login
  // Log in to the application. Extracts a LoginRequest from the form and
  // logs in to the back end via the login service.
  public Login() {
    this.ClearErrors();
    if (this.ValidLoginForm()) {
      const loginRequest = this.ExtractLoginRequest();
      console.log('LoginComponent: login request ', loginRequest);
      this.loginService.LoginUser(loginRequest).subscribe(
        (loginResponse) => { this.HandleLoginResponse(loginResponse);       },
           (loginError) => { this.HandleError('login', loginError);  }
      );
    }
  }

  private ClearErrors() {
    this.validationErrText.Clear();
    this.backendLoginErrorText = '';
    this.backendSignupErrorText = '';
  }

  //___________________________________________________________________________
  // Execute new user signup API call
  Signup() {
    this.ClearErrors();
    if (this.ValidSignupForm()) {
      const signupRequest = this.ExtractSignupRequest();
      console.log('LoginComponent: signup request ', signupRequest);
      this.loginService.SignupUser(signupRequest).subscribe(
        (signupResponse) => { this.HandleSignupResponse(signupResponse);       },
           (signupError) => { this.HandleError('signup', signupError);  }
      );
    }
  }

  //___________________________________________________________________________
  // Login disabled unless all login fields present
  LoginDisabled(): boolean {
      return (this.email.value.length === 0 || this.password.value.length === 0);
  }

  //___________________________________________________________________________
  // Signup disabled unless all signup fields present
  SignupDisabled(): boolean {
      return (this.firstname.value.length === 0     ||
              this.lastname.value.length === 0      ||
              this.suemail.value.length === 0       ||
              this.supassword.value.length === 0    ||
              this.supassword2.value.length === 0);
  }


  //===========================================================================
  // Private interface
  //===========================================================================

  //___________________________________________________________________________
  // Handle login response from API
  private HandleLoginResponse(httpResponse: HttpResponse<LoginResponse>) {
    const loginResponse: LoginResponse = httpResponse.body;
    if (this.LoginSuccess(loginResponse)) {
      console.log('LoginComponent: Storing access token in localstorage', loginResponse.token);
      window.localStorage.setItem('littlechatToken', loginResponse.token);
    }
  }

  //___________________________________________________________________________
  // Handle signup response from API
  private HandleSignupResponse(httpResponse: HttpResponse<SignupResponse>) {
    const signupResponse: SignupResponse = httpResponse.body;
    if (this.SignupSuccess(signupResponse)) {
      console.log('Storing access token in localstorage', signupResponse.token);
      window.localStorage.setItem('littlechatToken', signupResponse.token);
    }
  }

  //___________________________________________________________________________
  // Handle an API error
  private HandleError(etype: string, errorResponse: ErrorResponse) {
    console.log('Network Error: ', errorResponse);
    if (etype === 'login') {
      this.backendLoginErrorText = 'Network error: ' + errorResponse.message;
    } else {
      this.backendSignupErrorText = 'Network error: ' + errorResponse.message;
    }
  }

  //___________________________________________________________________________
  // Was login successful?
  private LoginSuccess(loginResponse: LoginResponse): boolean {
    if (loginResponse.error) {
      this.backendLoginErrorText = 'Login Error: ' + loginResponse.errorMessage;
    }
    return !loginResponse.error;
  }

  //___________________________________________________________________________
  // Was signup successful?
  private SignupSuccess(signupResponse: SignupResponse): boolean {
    if (signupResponse.error) {
      this.backendSignupErrorText = 'Signup Error: ' + signupResponse.errorMessage;
    }
    return !signupResponse.error;
  }

  //___________________________________________________________________________
  // Validate login fields
  private ValidLoginForm(): boolean {
    if (this.email.errors)    { this.validationErrText.EmailError();     }
    if (this.password.errors) { this.validationErrText.PasswordError();  }
    return this.validationErrText.ValidLogin();
  }

  //___________________________________________________________________________
  // Validate signup fields
  private ValidSignupForm(): boolean {
    if (this.firstname.errors)  { this.validationErrText.FirstnameError(); }
    if (this.lastname.errors)   { this.validationErrText.LastnameError();  }
    if (this.suemail.errors)    { this.validationErrText.SuEmailError();   }
    if (this.supassword.errors) {
      this.validationErrText.SuPasswordError();
    } else {
      // first password has been supplied, check that passwords match
      if (this.supassword2.value !== this.supassword.value) {
        this.validationErrText.SuPassword2Error();
      }
    }
    return this.validationErrText.ValidSignup();
  }

  //___________________________________________________________________________
  // Extract the LoginRequest from the form
  private ExtractLoginRequest(): LoginRequest {
    const login: LoginRequest = {
      email: this.email.value,
      password: this.password.value,
    };
    return login;
  }

  //___________________________________________________________________________
  // Extract the SignupRequest from the form
  private ExtractSignupRequest(): SignupRequest {
    const signup: SignupRequest = {
      firstname: this.firstname.value,
      lastname: this.lastname.value,
      email: this.suemail.value,
      password: this.supassword.value,
      password2: this.supassword2.value
    };
    return signup;
  }

}


class ValidationErrText {

  email: string;
  password: string;
  firstname: string;
  lastname: string;
  suemail: string;
  supassword: string;
  supassword2: string;

  constructor() { this.Clear(); }

  public Clear() {
    this.email = '';
    this.password = '';
    this.firstname = '';
    this.lastname = '';
    this.suemail = '';
    this.supassword = '';
    this.supassword2 = '';
  }

  public EmailError()        { this.Invalidate('email', 'Email is required and must be in valid email format');    }
  public PasswordError()     { this.Invalidate('password', 'Password is required and must have length >= 6');      }
  public FirstnameError()    { this.Invalidate('firstname', 'First name is required');                             }
  public LastnameError()     { this.Invalidate('lastname', 'Last name is required');                               }
  public SuEmailError()      { this.Invalidate('suemail', 'Email is required and must be in valid email format');  }
  public SuPasswordError()   { this.Invalidate('supassword', 'Password is required and must have length >= 6');    }
  public SuPassword2Error()  { this.Invalidate('supassword2', 'Repeated password must match');                     }

  public ValidLogin(): boolean {
    return (this.email.length === 0 && this.password.length === 0);
  }

  public ValidSignup(): boolean {
    return (this.firstname.length === 0     &&
            this.lastname.length === 0      &&
            this.suemail.length === 0       &&
            this.supassword.length === 0    &&
            this.supassword2.length === 0);
  }

  private Invalidate(field: string, errText: string) { (this)[field] = errText; }
}
