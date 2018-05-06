/*_____________________________________________________________________________
  ExpressApp
  Express application for the LittleChat backend API 
 _____________________________________________________________________________
 */
import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { Routes } from './routes';

class ExpressApp {
  public express: express.Application; 
  private routes: Routes;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes = new Routes(this.express);
    this.routes.Install();
  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
}

// Export the Express application
export default new ExpressApp().express;