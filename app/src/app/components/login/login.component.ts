import { Component, OnInit, Injectable } from '@angular/core';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { SignupRequest } from '../../models/signuprequest';
import { LoginRequest } from '../../models/loginrequest';
import { LoginResponse } from '../../models/loginresponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../app.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  emailErrorText = '';
  passwordErrorText = '';
  firstnameErrorText = '';
  lastnameErrorText = '';
  suemailErrorText = '';
  supasswordErrorText = '';
  supassword2ErrorText = '';

  // Constructor
  constructor( private fb: FormBuilder, private loginService: LoginService ) {
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

  // Control Getters for convenience
  get email()       { return this.loginForm.get('email');       }
  get password()    { return this.loginForm.get('password');    }
  get firstname()   { return this.loginForm.get('firstname');   }
  get lastname()    { return this.loginForm.get('lastname');    }
  get suemail()     { return this.loginForm.get('suemail');     }
  get supassword()  { return this.loginForm.get('supassword');  }
  get supassword2() { return this.loginForm.get('supassword2'); }

  ngOnInit() {}

  // Execute new user signup API call
  SignupAction() {
    this.ClearErrorText();
    const signupRequest = this.ExtractSignupRequest();
    if (this.ValidateSignup(signupRequest)) {
      console.log('LoginComponent: signup request ', signupRequest);
      this.loginService.SignupUser(signupRequest).subscribe(
        (data) => { console.log('RECEIVED DATA', data); }
      );
    }
  }

  // Execute existing user login API call
  LoginAction() {
    this.ClearErrorText();
    const loginRequest = this.ExtractLoginRequest();
    if (this.ValidateLogin(loginRequest)) {
      console.log('LoginComponent: login request ', loginRequest);
      this.loginService.LoginUser(loginRequest).subscribe(
        (loginResponse: LoginResponse) => {
          console.log('Response token', loginResponse.token);
        }
      );
    }
  }


  // Control disabling of login button
  LoginDisabled(): boolean {
      return (this.email.value.length === 0 || this.password.value.length === 0);
  }

  // Control disabling of signup button
  SignupDisabled(): boolean {
      return (this.firstname.value.length === 0   ||
              this.lastname.value.length === 0    ||
              this.suemail.value.length === 0     ||
              this.supassword.value.length === 0  ||
              this.supassword2.value.length === 0);
  }


  // Clear the error text fields
  private ClearErrorText() {
      this.emailErrorText = '';
      this.passwordErrorText = '';
      this.firstnameErrorText = '';
      this.lastnameErrorText = '';
      this.suemailErrorText = '';
      this.supasswordErrorText = '';
      this.supassword2ErrorText = '';
  }

  // Validate login fields
  private ValidateLogin(login: LoginRequest): boolean {
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

  // Validate signup fields
  private ValidateSignup(signup: SignupRequest): boolean {
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

  // Extract the LoginRequest from the form
  private ExtractLoginRequest(): LoginRequest {
    const login: LoginRequest = {
      email: this.email.value,
      password: this.password.value,
    };
    return login;
  }

}
