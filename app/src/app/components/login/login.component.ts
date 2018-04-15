import { Component, OnInit, Injectable, ApplicationRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { LoginService } from '../../services/login.service';
import { SignupRequest } from '../../models/signuprequest';
import { LoginRequest } from '../../models/loginrequest';
import { LoginResponse } from '../../models/loginresponse';
import { SignupResponse } from '../../models/signupresponse';
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
  public emailErrorText         = '';
  public passwordErrorText      = '';
  public firstnameErrorText     = '';
  public lastnameErrorText      = '';
  public suemailErrorText       = '';
  public supasswordErrorText    = '';
  public supassword2ErrorText   = '';
  public backendLoginErrorText  = '';
  public backendSignupErrorText = '';

  constructor( private fb: FormBuilder, private loginService: LoginService, private zone: NgZone ) {
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
    this.ClearErrorText();
    const loginRequest = this.ExtractLoginRequest();
    if (this.ValidLogin(loginRequest)) {
      console.log('LoginComponent: login request ', loginRequest);
      this.loginService.LoginUser(loginRequest).subscribe(
          this.HandleLoginResponse,
          (error) => { this.zone.run( () => { this.HandleNetworkError('login', error); } ); }
      );
      console.log('finished the login request flow');
    }
  }

  //___________________________________________________________________________
  // Execute new user signup API call
  Signup() {
    this.ClearErrorText();
    const signupRequest = this.ExtractSignupRequest();
    if (this.ValidSignup(signupRequest)) {
      console.log('LoginComponent: signup request ', signupRequest);
      this.loginService.SignupUser(signupRequest).subscribe(
          this.HandleSignupResponse,
          (error) => { this.zone.run( () => { this.HandleNetworkError('signup', error); } ); }
      );
    }
  }

  //___________________________________________________________________________
  // Control disabling of login button
  LoginDisabled(): boolean {
      return (this.email.value.length === 0 || this.password.value.length === 0);
  }

  //___________________________________________________________________________
  // Control disabling of signup button
  SignupDisabled(): boolean {
      return (this.firstname.value.length === 0   ||
              this.lastname.value.length === 0    ||
              this.suemail.value.length === 0     ||
              this.supassword.value.length === 0  ||
              this.supassword2.value.length === 0);
  }



  //===========================================================================
  // Private interface
  //===========================================================================

  //___________________________________________________________________________
  // Handle the back end response to a login request.
  private HandleLoginResponse(httpResponse: HttpResponse<LoginResponse>) {
    const loginResponse: LoginResponse = httpResponse.body;
    if (!this.BackEndLoginError(loginResponse)) {
      console.log('LoginComponent: Storing access token in localstorage', loginResponse.token);
      window.localStorage.setItem('littlechatToken', loginResponse.token);
    }
  }

  //___________________________________________________________________________
  // Handle an error on a login/signup request that prevented return of a
  // backend response.
  private HandleNetworkError(etype: string, errorResponse: ErrorResponse) {
    console.log('Network Error: ', errorResponse);
    if (etype === 'login') {
      this.backendLoginErrorText = 'Network error: ' + errorResponse.message;
    } else {
      this.backendSignupErrorText = 'Network error: ' + errorResponse.message;
    }
  }


  //___________________________________________________________________________
  // Handle the back end response to a signup request.
  private HandleSignupResponse(httpResponse: HttpResponse<SignupResponse>) {
    const signupResponse: SignupResponse = httpResponse.body;
    if (!this.BackEndSignupError(signupResponse)) {
      console.log('Storing access token in localstorage', signupResponse.token);
      window.localStorage.setItem('littlechatToken', signupResponse.token);
    }
  }

  //___________________________________________________________________________
  // Handle an error on a signup request that prevented return of a
  // backend response.
  private HandleSignupError(error: any) {
    console.log('Here is the signup error: ', error);
  }

  //___________________________________________________________________________
  // Flag a back-end login error that came from the backend response
  private BackEndLoginError(loginResponse: LoginResponse): boolean {
    let err = false;
    if (loginResponse.error) {
      this.backendLoginErrorText = 'Login Error: ' + loginResponse.errorMessage;
      err = true;
    }
    return err;
  }

  //___________________________________________________________________________
  // Flag a back-end signup error that came from the backend response
  private BackEndSignupError(signupResponse: SignupResponse): boolean {
    let err = false;
    if (signupResponse.error) {
      this.backendSignupErrorText = 'Signup Error: ' + signupResponse.errorMessage;
      err = true;
    }
    return err;
  }

  //___________________________________________________________________________
  // Clear the error text fields
  private ClearErrorText() {
      this.emailErrorText           = '';
      this.passwordErrorText        = '';
      this.firstnameErrorText       = '';
      this.lastnameErrorText        = '';
      this.suemailErrorText         = '';
      this.supasswordErrorText      = '';
      this.supassword2ErrorText     = '';
      this.backendLoginErrorText    = '';
      this.backendSignupErrorText   = '';
  }

  //___________________________________________________________________________
  // Flag if loginRequest was invalid
  private ValidLogin(login: LoginRequest): boolean {
    let valid = true;
    if (this.email.errors) {
      this.emailErrorText = 'Email is required and must be in valid email format';
      valid = false;
    }
    if (this.password.errors) {
      this.passwordErrorText = 'Password is required and must have length >= 6';
      valid = false;
    }
    return valid;
  }

  //___________________________________________________________________________
  // Validate signup fields
  private ValidSignup(signup: SignupRequest): boolean {
    let valid = true;
    if (this.firstname.errors) {
      this.firstnameErrorText = 'First name is required';
      valid = false;
    }
    if (this.lastname.errors) {
      this.lastnameErrorText = 'Last name is required';
      valid = false;
    }
    if (this.suemail.errors) {
      this.suemailErrorText = 'Email is required and must be in valid email format';
      valid = false;
    }
    if (this.supassword.errors) {
      this.supasswordErrorText = 'Password is required and must have length >= 6';
      valid = false;
    } else {
      if (this.supassword2.value !== this.supassword.value) {
        this.supassword2ErrorText = 'Repeated password must match';
        valid = false;
      }
    }
    return valid;
  }

  // Extract the LoginRequest from the form
  private ExtractLoginRequest(): LoginRequest {
    const login: LoginRequest = {
      email: this.email.value,
      password: this.password.value,
    };
    return login;
  }

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
