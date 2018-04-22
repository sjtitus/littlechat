import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {

  public storageAvailable: boolean;

  constructor() {
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

  public Save(key: string, token: string) {
    try {
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
