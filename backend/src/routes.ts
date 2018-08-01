/*_____________________________________________________________________________
  Littlechat API routes
_______________________________________________________________________________
 */
import * as path from 'path';
import * as expressPackage from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as api from './Api';
import PromiseRouter from 'express-promise-router';


export class Routes {

  constructor(private _express: expressPackage.Application) {}

  public Install(): void {

    let router = PromiseRouter();   // so api endpoints can be async

    // routes
    router.post('/api/login', api.login);
    router.post('/api/signup', api.signup);
    router.post('/api/contacts', api.contacts);
    router.post('/api/conversations', api.conversations);
    router.post('/api/messages', api.messages);
    this._express.use('/', router);

    //______________________________________________________
    // Catch errors: generic 500 with the error message
    this._express.use(function (err, req, res, next) {
      console.log('Routes: caught error, sending 500', err);
      let errtext = err.message;
      if (err.stack != null) { errtext = errtext + `stack: ${err.stack}` }
      res.status(500).json({ message: err.message, error: err, stack: err.stack });
    });

    //______________________________________________________
    // Unhandled routes: send a 404
    this._express.use(function(req, res, next){
      console.log(`Routes: unhandled URL: ${req.originalUrl}, sending 404`);
      res.status(404).json({ error: 'URL Not found' });
    }); 

  }
}
