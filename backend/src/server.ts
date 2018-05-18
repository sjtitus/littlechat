import * as http from 'http';
import ExpressApp from './expressApp';
import WebSocketServer from './websocketserver';
import * as socketIo from 'socket.io';

const port = 3000;   // port to serve the API

// Dump database information from ENV
const pghost = process.env.PGHOST;
const pguser = process.env.PGUSER;
const pgdb = process.env.PGDATABASE;
if (!pghost || !pguser || !pgdb)
{
  throw new Error('Server: Database env vars (PGHOST, PGUSER, PGDATABASE) must be defined');
}
console.log(`Server: Database Info: host=${pghost}, user=${pguser}, db=${pgdb}`);

// TODO: simple database startup test to ensure we have DB connectivity

// Create the server
ExpressApp.set('port', port);
ExpressApp.set('view engine', 'html');
const server = http.createServer(ExpressApp); 

// Configure websockets 
const io = socketIo(server, { serveClient: false, pingInterval: 10000, pingTimeout: 5000, cookie: false });
//io.listen(server);
io.on('connect', (socket: any) => {
    console.log('Websockets: connected client');
    socket.on('message', (m, ack) => {
        console.log('Websockets: (message) %s', JSON.stringify(m));
        console.log('Calling ack');
        ack('My first ack');
    });
    socket.on('disconnect', () => {
        console.log('Websockets: client disconnected');
    });
});

// Start listening for connections 
console.log(`Server: starting API server on port ${port}`);
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
