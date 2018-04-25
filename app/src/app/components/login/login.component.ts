import { Component, OnInit, Injectable, ApplicationRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { TokenService } from '../../services/token.service';

import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from '../../models/login';
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

  public static minPasswordLen = 6;
  public loginForm: FormGroup;
  public vErrText = {
    email: 'Email is required and must be in valid email format',
    password: `Password is required and must have length >= ${LoginComponent.minPasswordLen}` ,
    firstname: 'First name is required',
    lastname: 'Last name is required',
    suemail: 'Email is required and must be in valid email format',
    supassword: `Password is required and must have length >= ${LoginComponent.minPasswordLen}`,
    supassword2: 'Repeated password must match'
  };
  public backendLoginErrorText  = '';
  public backendSignupErrorText = '';

  constructor( private fb: FormBuilder, private apiService: ApiService, private tokenService: TokenService,
    private router: Router ) {
      this.loginForm = this.fb.group({
              email: [ '', [ Validators.required, Validators.email ] ],
           password: [ '', [ Validators.required, Validators.minLength(LoginComponent.minPasswordLen)] ],
          firstname: [ '', [ Validators.required ] ],
           lastname: [ '', [ Validators.required ] ],
            suemail: [ '', [ Validators.required, Validators.email ] ],
         supassword: [ '', [ Validators.required, Validators.minLength(LoginComponent.minPasswordLen) ] ],
        supassword2: [ '', [ Validators.required, Validators.minLength(LoginComponent.minPasswordLen) ] ],
      });
  }

  //___________________________________________________________________________
  // Form control accessors (convenience)
  get email()       { return this.loginForm.get('email');       }
  get password()    { return this.loginForm.get('password');    }
  get firstname()   { return this.loginForm.get('firstname');   }
  get lastname()    { return this.loginForm.get('lastname');    }
  get suemail()     { return this.loginForm.get('suemail');     }
  get supassword()  { return this.loginForm.get('supassword');  }
  get supassword2() { return this.loginForm.get('supassword2'); }

  ngOnInit() {}

  //___________________________________________________________________________
  // Log in to the application
  public Login() {
    this.ClearErrors();
    const loginRequest = this.ExtractLoginRequest();
    console.log('LoginComponent: login request', loginRequest);
    this.apiService.LoginUser(loginRequest).subscribe(
      (loginResponse) => { this.HandleLoginResponse(loginResponse);       },
         (loginError) => { this.HandleError('login', loginError);  }
    );
  }

  //___________________________________________________________________________
  // Signup for a new account
  Signup() {
    this.ClearErrors();
    const signupRequest = this.ExtractSignupRequest();
    console.log('LoginComponent: signup request ', signupRequest);
    this.apiService.SignupUser(signupRequest).subscribe(
      (signupResponse) => { this.HandleSignupResponse(signupResponse);       },
         (signupError) => { this.HandleError('signup', signupError);  }
    );
  }

  private ClearErrors() {
    this.backendLoginErrorText = '';
    this.backendSignupErrorText = '';
  }

  //___________________________________________________________________________
  // Login disabled unless all login fields present
  LoginDisabled(): boolean {
    return (this.email.errors !== null || this.password.errors !== null );
  }

  //___________________________________________________________________________
  // Signup disabled unless all signup fields present
  SignupDisabled(): boolean {
      return (this.firstname.errors !== null    ||
              this.lastname.errors !== null     ||
              this.suemail.errors !== null      ||
              this.supassword.errors !== null   ||
              this.supassword2.errors !== null  ||
              this.supassword2.value !== this.supassword.value
            );
  }


  //===========================================================================
  // Private interface
  //===========================================================================

  //___________________________________________________________________________
  // Handle login response from API
  private HandleLoginResponse(httpResponse: HttpResponse<LoginResponse>) {
    const loginResponse: LoginResponse = httpResponse.body;
    if (this.LoginSuccess(loginResponse)) {
      this.tokenService.Save('littlechatToken', loginResponse.token);
      this.router.navigate(['/home']);
    }
  }

  //___________________________________________________________________________
  // Handle signup response from API
  private HandleSignupResponse(httpResponse: HttpResponse<SignupResponse>) {
    const signupResponse: SignupResponse = httpResponse.body;
    console.log('signup response', signupResponse);
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
    let err = false;
    if (loginResponse.error) {
      this.backendLoginErrorText = 'Login Error: ' + loginResponse.errorMessage;
      err = true;
    }
    else if (!('token' in loginResponse) || loginResponse.token.length === 0) {
      this.backendLoginErrorText = 'Login Error: auth token not present or 0-length';
      err = true;
    }
    return !err;
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

