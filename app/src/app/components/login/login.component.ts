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
  loginErrorText = '';
  signupErrorText = '';

  loginHandler = {
    next: (value) => {
      console.log('LoginHandler: NORMAL login response: ', value);
    },
    error: (err: any) => {
      console.log('LoginHandler: ERROR login response ', err);
      this.loginErrorText = 'Login Error: ' + err.message;
    },
    complete: () => {
      console.log('LoginHandler: COMPLETE login response');
    }
  };


  constructor( private fb: FormBuilder, private loginService: LoginService ) {
    this.loginForm = this.fb.group({
      email: [ '', Validators.required ],
      password: [ '', Validators.required ]
    });
    // user: User = {email: 'stitus@knowland.com', password: 'foobar'};
    // this.loginForm.setValue({ email: this.user.email, password: this.user.password });
  }

  ngOnInit() {}

  InputFocus() {
    this.loginErrorText = '';
    this.signupErrorText = '';
  }

  SubmitForm() {
    this.loginErrorText = '';
    this.signupErrorText = '';
    const user = this.Extract();
    console.log('LoginComponent: submitting login form with %s', JSON.stringify(user));
    this.loginService.LoginUser(user).subscribe(this.loginHandler);
  }

  private Extract(): User {
    const user: User = {email: '', password: ''};
    user.email = this.loginForm.get('email').value;
    user.password = this.loginForm.get('password').value;
    return user;
  }

}
