import { Component, OnInit, Injectable } from '@angular/core';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService, LoginResponse } from '../../services/login.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../app.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  loginHandler: Observer<LoginResponse> = {
    next: (value: LoginResponse) => {
      console.log('LoginHandler: NORMAL login response: %s', JSON.stringify(value));
    },
    error: (err: any) => {
      console.log('LoginHandler: ERROR login response ', err);
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

  SubmitForm() {
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
