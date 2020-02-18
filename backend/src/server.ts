import * as http from 'http';
import ExpressApp from './expressApp';
import WebSocketServer from './websocketserver';

const port = 3000;   // port to serve the API

// Dump database information from ENV
const pghost = process.env.PGHOST;
const pguser = process.env.PGUSER;
const pgdb = process.env.PGDATABASE;
if (!pghost || !pguser ||   !pgdb)
{
  throw new Error('Server: Database env vars (PGHOST, PGUSER, PGDATABASE) must be defined');
}
console.log(`Server: Database Info: host=${pghost}, user=${pguser}, db=${pgdb}`);

// TODO: simple database startup test to ensure we have DB connectivity

// Create the server
ExpressApp.set('port', port);

ExpressApp.set('view engine', 'html');
const server = http.createServer(ExpressApp);

// Create the websocketserver that will use same server/port
const webSocketServer = WebSocketServer.GetInstance();
console.log(`Server: Starting WebSocketServer`);
webSocketServer.Start();

// Start listening for connections
console.log(`Server: server starting on port ${port}`);
server.listen(port);

server.on('error', onError);
server.on('listening', onListening);



//_____________________________________________________________________________
// Functions
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = `Port ${port}`;
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
  console.log(`API: Listening on port ${port}`);
}
