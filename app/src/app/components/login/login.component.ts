import { Component, OnInit, Injectable } from '@angular/core';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { SignupRequest } from '../../models/signuprequest';
import { LoginRequest } from '../../models/loginrequest';

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

  loginHandler = {
    next: (value) => {
      console.log('LoginHandler: normal login response: ', value);
    },
    error: (err: any) => {
      console.log('LoginHandler: error login response ', err);
    },
    complete: () => {
      console.log('LoginHandler: complete login response');
    }
  };

  signupHandler = {
    next: (value) => {
      console.log('SignupHandler: normal signup response: ', value);
    },
    error: (err: any) => {
      console.log('SignupHandler: error signup response ', err);
    },
    complete: () => {
      console.log('SignupHandler: complete signup response');
    }
  };

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
      this.ClearErrorText();
  }

  // Getters for convenience
  get email()       { return this.loginForm.get('email');       }
  get password()    { return this.loginForm.get('password');    }
  get firstname()   { return this.loginForm.get('firstname');   }
  get lastname()    { return this.loginForm.get('lastname');    }
  get suemail()     { return this.loginForm.get('suemail');     }
  get supassword()  { return this.loginForm.get('supassword');  }
  get supassword2() { return this.loginForm.get('supassword2'); }

  ngOnInit() {}

  // Execute new user signup
  SignupAction() {
    const signupRequest = this.ExtractSignupRequest();
    if (this.ValidateSignup(signupRequest)) {
      console.log('LoginComponent: signup request ', signupRequest);
      this.loginService.SignupUser(signupRequest).subscribe(this.signupHandler);
    }
  }

  // Execute user login
  LoginAction() {
    if (this.IsValid('login')) {
      const loginRequest = this.ExtractLoginRequest();
      console.log('LoginComponent: login request ', loginRequest);
      this.loginService.LoginUser(loginRequest).subscribe(this.loginHandler);
    }
  }

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
      if (this.supassword2.errors || (this.supassword2 !== this.supassword)) {
        this.supassword2ErrorText = 'Repeated password must match';
        valid = false;
      }
    }
    return valid;
  }

  // Extract the SignupRequest from the form
  private ExtractSignupRequest(): SignupRequest {
    const signup: SignupRequest = {
      firstname: this.loginForm.get('firstname').value,
      lastname: this.loginForm.get('lastname').value,
      email: this.loginForm.get('suemail').value,
      password: this.loginForm.get('supassword').value,
      password2: this.loginForm.get('supassword2').value
    };
    return signup;
  }

  // Extract the LoginRequest from the form
  private ExtractLoginRequest(): LoginRequest {
    const login: LoginRequest = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
    return login;
  }

  // Validate form information wrt specified action
  private IsValid(action: string): boolean {
      if (action === 'login') {
      } else {
      }
      return true;
  }


  // Control disabling of submission buttons
  LoginDisabled(): boolean {
      return (this.email.value.length === 0 || this.password.value.length === 0);
  }

  SignupDisabled(): boolean {
      return (this.firstname.value.length === 0   ||
              this.lastname.value.length === 0    ||
              this.suemail.value.length === 0     ||
              this.supassword.value.length === 0  ||
              this.supassword2.value.length === 0);
  }

  // Clear the error text fields
  ClearErrorText() {
  }

}
