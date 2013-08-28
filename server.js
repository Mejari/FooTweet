//DEBUG OPTIONS
GLOBAL.debug_sequelize_enabled = false;//Default: false
GLOBAL.debug_tweets = true;//Default: false
//END DEBUG OPTIONS

GLOBAL.db = require('./storage/DatabaseConnection');

//setup Dependencies
var connect = require('connect')
    , express = require('express')
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
require('./routes').setupRoutes(server);

server.listen(port);

GLOBAL.twitterIo = require('socket.io').listen(server);
GLOBAL.twitterIo.set('log level', 1);

require('./dbHelper').callbackWhenDbReady(function() {
    require('./rootmanagement/rootPropertyInit');
    require('./tweeting/automaticTwitterService').startAutomaticTweetsForActiveAccounts();

    console.log('Listening on http://0.0.0.0:' + port );
});