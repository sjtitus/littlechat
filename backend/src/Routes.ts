import * as path from 'path';
import * as expressPackage from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as api from './Api';
import PromiseRouter from 'express-promise-router';


export class Routes {
  
  constructor(private _express: expressPackage.Application) {}

  public Install(): void {
    let router = PromiseRouter(); 

    // Create routes 
    router.post('/api/login', api.login);
    router.post('/api/signup',api.signup);
    router.post('/api/contacts', api.contacts);
    this._express.use('/', router); 
  

    //______________________________________________________
    // Catch errors: generic 500 with the error message
    this._express.use(function (err, req, res, next) {
      console.log('API Routes: caught error, sending 500', err);
      res.status(500).json({ error: err.message });
    });  

    //______________________________________________________
    // Unhandled routes: send a 404 
    this._express.use(function(req, res, next){
      console.log(`API Routes: unhandled URL: ${req.originalUrl}, sending 404`);
      res.status(404).json({ error: 'URL Not found' });
    });
  }
}
