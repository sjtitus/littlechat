import { Component, OnInit, Injectable } from '@angular/core';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../app.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginErrorText: string;
  signupErrorText: string;

  loginHandler = {
    next: (value) => {
      console.log('LoginHandler: normal login response: ', value);
    },
    error: (err: any) => {
      console.log('LoginHandler: error login response ', err);
      this.loginErrorText = 'Login Error: ' + err.message;
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
      this.signupErrorText = 'Signup Error: ' + err.message;
    },
    complete: () => {
      console.log('SignupHandler: complete signup response');
    }
  };

  // Constructor
  constructor( private fb: FormBuilder, private loginService: LoginService ) {
      // Create the form
      this.loginForm = this.fb.group({
              email: [ '', Validators.required ],
           password: [ '', Validators.required ],
          firstname: [ '', Validators.required ],
           lastname: [ '', Validators.required ],
            suemail: [ '', Validators.required ],
         supassword: [ '', Validators.required ],
        supassword2: [ '', Validators.required ],
      });
      this.ClearErrorText();
  }

  ngOnInit() {}

  // Submit the form to the backend
  SubmitForm(action: string) {
    this.ClearErrorText();
    const forminfo = this.Extract();
    if (this.IsValid(forminfo, action)) {
      if (action === 'login') {
        console.log('LoginComponent: login user ', forminfo.email);
        this.loginService.LoginUser(forminfo).subscribe(this.loginHandler);
      } else {
        console.log('LoginComponent: signup user %s %s', forminfo.firstname, forminfo.lastname);
        this.loginService.SignupUser(forminfo).subscribe(this.signupHandler);
      }
    }
  }

  // Validate form information wrt specified action
  private IsValid(forminfo: any, action: string): boolean {
      if (action === 'login') {
      } else {
        if (forminfo.supassword !== forminfo.supassword2) {
          this.signupErrorText = 'Error: passwords must match.';
          return false;
        }
      }
      return true;
  }

  // Extract user information from form fields
  private Extract() {
      const forminfo: any = {};
      forminfo.email = this.loginForm.get('email').value;
      forminfo.password = this.loginForm.get('password').value;
      forminfo.firstname = this.loginForm.get('firstname').value;
      forminfo.lastname = this.loginForm.get('lastname').value;
      forminfo.supassword = this.loginForm.get('supassword').value;
      forminfo.supassword2 = this.loginForm.get('supassword2').value;
      return forminfo;
  }

  // Control disabling of submission buttons
  DisableCheck(action: string): boolean {
    if (action === 'login') {
      return (this.loginForm.controls['email'].invalid ||
              this.loginForm.controls['password'].invalid);
    } else if (action === 'signup') {
      return (this.loginForm.controls['firstname'].invalid ||
              this.loginForm.controls['lastname'].invalid ||
              this.loginForm.controls['suemail'].invalid ||
              this.loginForm.controls['supassword'].invalid ||
              this.loginForm.controls['supassword2'].invalid);
    }
  }

  // Clear the error text fields
  ClearErrorText() {
    this.loginErrorText = '';
    this.signupErrorText = '';
  }

}
