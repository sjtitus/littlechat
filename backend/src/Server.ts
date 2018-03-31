import * as http from 'http';

// Express application for the API 
import ExpressApp from './ExpressApp';

console.log("Backend (DEBUG=",process.env.DEBUG,")");

// port: can be number or file path 
const port = normalizePort(process.env.PORT || 3000);

console.log('setting port to ', port);
ExpressApp.set('port', port);
ExpressApp.set('view engine', 'html');
const server = http.createServer(ExpressApp); 

// start listening
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


//_____________________________________________________________________________
// Functions

function normalizePort(val: number|string): number|string|boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch(error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}