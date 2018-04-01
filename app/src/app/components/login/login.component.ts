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
  submitAction = 'login';

  loginHandler = {
    next: (value) => {
      console.log('LoginHandler: NORMAL login response: ', value);
    },
    error: (err: any) => {
      console.log('LoginHandler: ERROR login response ', err);
      if (this.submitAction === 'login') {
        this.loginErrorText = 'Login Error: ' + err.message;
      } else {
        this.signupErrorText = 'Login Error: ' + err.message;
      }
    },
    complete: () => {
      console.log('LoginHandler: COMPLETE login response');
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

  SetAction(action: string) {
    this.submitAction = action;
    this.SubmitForm();
  }

  ngOnInit() {}

  // Submit the form to the backend
  SubmitForm() {
      const userinfo = this.Extract();
      const user: User = {email: userinfo.email, password: userinfo.password};
      if (this.submitAction === 'login') {
        this.ClearErrorText();
        console.log('LoginComponent: login user ', user);
        this.loginService.LoginUser(user).subscribe(this.loginHandler);
      } else {
        this.ClearErrorText();
        console.log('LoginComponent: signup user ', user);
        this.loginService.SignupUser(userinfo).subscribe(this.loginHandler);
      }
  }

  // Extract user information from form fields
  private Extract() {
      const userinfo: any = {};
      userinfo.email = this.loginForm.get('email').value;
      userinfo.password = this.loginForm.get('password').value;
      userinfo.firstname = this.loginForm.get('firstname').value;
      userinfo.lastname = this.loginForm.get('lastname').value;
      userinfo.supassword = this.loginForm.get('supassword').value;
      userinfo.supassword2 = this.loginForm.get('supassword2').value;
      return userinfo;
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
    this.submitAction = 'login';
  }

}
