//DEBUG OPTIONS
GLOBAL.debug_sequelize_enabled = false;//Default: false
GLOBAL.debug_tweets = false;//Default: false
//END DEBUG OPTIONS

//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , http = require('http')
    , port = (process.env.PORT || 8081)
    , log4js = require('log4js');

log4js.replaceConsole();

log4js.loadAppender('file');

log4js.addAppender(log4js.appenders.file('logs/footweet.log'), 'footweet');

GLOBAL.logger = log4js.getLogger('footweet');


GLOBAL.db = require('./storage/DatabaseConnection');

//Setup Express
var app = express();
var server = http.createServer(app);
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view options', { layout: false });
    app.use(connect.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "sikujrfh8457gnfkjdng"}));
    app.use(connect.static(__dirname + '/static'));
    app.use(app.router);
});

require('./errors').setupErrorHandlers(app);
require('./routes').setupRoutes(app);

server.listen(port);

GLOBAL.twitterIo = require('socket.io').listen(server);
GLOBAL.twitterIo.set('log level', 1);

require('./dbHelper').callbackWhenDbReady(function() {
    require('./rootmanagement/rootPropertyInit');
    require('./tweeting/automaticTwitterService').startAutomaticTweetsForActiveAccounts();

    GLOBAL.logger.log('Listening on http://0.0.0.0:' + port );
});