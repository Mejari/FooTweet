//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081);

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "sikujrfh8457gnfkjdng"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

require('./errors').setupErrorHandlers(server);

server.listen(port);

var db = require('./storage/DatabaseConnection');

GLOBAL.db = db;
GLOBAL.debug_sequelize_enabled = false;

//require('./testData');

require('./rootmanagement/rootPropertyInit');

//Setup Socket.IO
var ioServer = io.listen(server);
ioServer.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});

require('./routes').setupRoutes(server);

console.log('Listening on http://0.0.0.0:' + port );