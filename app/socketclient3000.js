const io = require('socket.io-client');
//const socket = io('ws://localhost:8080/socket.io/\?transport=websocket');
const socket = io('ws://localhost:3000');

console.log('sending event message');
socket.emit('message','hi bob', (resp) => { console.log('got response',resp); });
