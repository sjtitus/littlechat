import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class TokenService implements CanActivate {

  public storageAvailable: boolean;

  constructor(private router: Router) {
    this.storageAvailable = this.StorageAvailable();
    console.log('TokenService: storage available: ', this.storageAvailable);
  }


  public StorageAvailable(): boolean {
    console.log('TokenService: determining if localstorage is available');
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

  canActivate(): boolean {
    console.log("TokenService: checking activation");
    if (!this.IsAuthenticatedClientSide()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  public IsAuthenticatedClientSide(): boolean {
    const token = window.localStorage.getItem('littlechatToken');
    if (token == null) {
      console.log('TokenService: failed auth: no token');
      return false;
    }
    const jwtoken: any = this.Decode(token);
    const current_time = new Date().getTime() / 1000;
    if (!('exp' in jwtoken) || (current_time > jwtoken.exp)) {
      console.log('TokenService: failed auth: token expired %d seconds ago', current_time - jwtoken.exp);
      return false;
    }
    console.log('TokenService: successful auth: token expires in %d seconds', jwtoken.exp - current_time);
    return true;
  }

  public Save(key: string, token: string) {
    try {
      console.log(`TokenService: saving token under key '${key}'`);
      console.log('TokenService: token "%s"', JSON.stringify(this.Decode(token)));
      window.localStorage.setItem(key, token);
    } catch (e) {
      throw new Error(`TokenService: could not save token under key '${key}' in localStorage`);
    }

  }

  public Get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      throw new Error(`TokenService: could not retrieve token with key '${key}' from localStorage`);
    }
  }

  public Delete(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      throw new Error(`TokenService: could not delete token with key '${key}' from localStorage`);
    }
  }

  public Decode(token: string): string | { [key: string]: any } {
    return jwt.decode(token);
  }

}
