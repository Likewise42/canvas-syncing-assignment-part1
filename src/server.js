const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// read index into memory
const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// pass int he http server to socketio and grab the websocker server as io
const io = socketio(app);

let myNum = 0;

const onUpdate = (sock) => {
  const socket = sock;

  socket.on('updateServer', () => {
    myNum += 1;

    console.log(`Total Score: ${myNum}`);
  });

  setInterval(() => {
    socket.emit('updateClient', { newNum: myNum });
  }, 100);
};

io.sockets.on('connection', (socket) => {
  console.log('someone joined');

  onUpdate(socket);
});

console.log('Websocket server started');
