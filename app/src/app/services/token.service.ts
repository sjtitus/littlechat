/**
 *  TokenService
 *  Client-side authentication token management: storage, retrieval, deletion, decoding.
 *  Uses json web tokens and browser localstorage, and implements 'CanActivate'
 *  interface to enable route guarding. Also provides a 'CurrentUser' method which
 *  returns the currently authenticated user.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user';

const dbgpackage = require('debug');
const debug = dbgpackage('TokenService');

// Stub for testing
export const TokenServiceStub: Partial<TokenService> = {
  get CurrentUser(): User {
    return {
      firstname: 'firstname1',
      lastname: 'lastname1',
      email: 'testuser1@test.com',
      id: 999000,
      conversation: null
    };
  }
};

@Injectable()
export class TokenService implements CanActivate {

  static TokenKey = 'littleChat';
  private storageAvailable: boolean;

  //___________________________________________________________________________
  // Constructor
  constructor(private router: Router) {
    debug(`TokenService::Construct: token key '${TokenService.TokenKey}'`);
    this.storageAvailable = this.StorageAvailable();
    debug('TokenService::Construct: storage available: ', this.storageAvailable);
  }

  //___________________________________________________________________________
  // Return the current authenticated user
  get CurrentUser(): User {
    return this.GetCurrentUser();
  }

  //___________________________________________________________________________
  // Store auth token
  public Store(token: string) {
    debug(`TokenService::Store: storing token for key '${TokenService.TokenKey}'`);
    try {
      window.localStorage.setItem(TokenService.TokenKey, token);
    } catch (e) {
      throw new Error(`TokenService::Store: failed storing token for key '${TokenService.TokenKey}': ${e.message}`);
    }
  }


  //___________________________________________________________________________
  // Retrieve auth token
  // Returns null if no token is stored for the key.
  public Retrieve(): string | null {
    //debug(`TokenService::Retrieve: retrieving token for key '${TokenService.TokenKey}'`);
    try {
      const tok = window.localStorage.getItem(TokenService.TokenKey);
      //debug(`TokenService::Retrieve: token is ${tok}`);
      return tok;
    } catch (e) {
      throw new Error(`TokenService::Retrieve: failed to retrieve token with key '${TokenService.TokenKey}': ${e.message}`);
    }
  }

  //___________________________________________________________________________
  // Delete auth token
  public Delete() {
    debug(`TokenService::Delete: retrieving token for key '${TokenService.TokenKey}': %s`);
    try {
      window.localStorage.removeItem(TokenService.TokenKey);
    } catch (e) {
      throw new Error(`TokenService::Delete: failed to delete token with key '${TokenService.TokenKey}': ${e.messaage}`);
    }
  }

  //___________________________________________________________________________
  // Decode auth token
  // Returns the decoded payload of the auth token.
  public Decode(): string | { [key: string]: any } {
    try {
      return jwt.decode(this.Retrieve());
    } catch (e) {
      throw new Error(`TokenService::Decode: failed to decode token with key '${TokenService.TokenKey}': ${e.messaage}`);
    }
  }

  //___________________________________________________________________________
  // CanActivate implementation
  // Returns true if the auth token is valid.
  canActivate(): boolean {
    debug('TokenService::CanActivate: checking auth');
    const jwtoken: any = this.Decode();
    debug('TokenService::CanActivate: token: ', jwtoken);
    if (jwtoken == null) {
      debug('TokenService::CanActivate: auth failed: empty token, redirecting to login');
      this.router.navigate(['login']);
      return false;
    }
    const current_time = new Date().getTime() / 1000;
    if (current_time > jwtoken.exp) {
      debug('TokenService::CanActivate: auth failed: token expired %d seconds ago, redirecting to login',
        current_time - jwtoken.exp);
      this.router.navigate(['login']);
      return false;
    }
    debug(`TokenService::CanActivate: auth success: token: '${JSON.stringify(jwtoken)}'`);
    return true;
  }


  //___________________________________________________________________________
  // Set the current user according to the currently stored token
  private GetCurrentUser(): User {
    const jwtoken: any = this.Decode();
    const u: User = {
      firstname: jwtoken.firstname,
      lastname: jwtoken.lastname,
      email: jwtoken.email,
      id: jwtoken.id,
      conversation: null
    };
    return u;
  }

  //___________________________________________________________________________
  // Detect if localstorage is available on the browser
  private StorageAvailable(): boolean {
    debug('TokenService::StorageAvailable: determining if localstorage is available');
    let storage;
    try {
        storage = window['localStorage'];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
  }
}

