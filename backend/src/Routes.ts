import * as path from 'path';
import * as expressPackage from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { Api } from './Api';


class Routes {
  
  api: Api = new Api();
  
  constructor(private _express: expressPackage.Application) {}

  public Install(): void {
    let router = expressPackage.Router();

    // Create routes 
    router.get('/api', this.api.root);
    router.post('/api/login', this.api.login);

    this._express.use('/', router);
  }

}

export { Routes };

