var NotFound = require('./NotFound');
var setupErrorHandlers = function(server) {
    server.use(function(err, req, res, next){
        if (err instanceof NotFound) {
            res.status(404);
            res.render('404.jade', {
                title : '404 - Not Found'
                ,description: err.toString()
                ,author: ''
            });
        } else {
            GLOBAL.logger.error(err);
            res.status(500);
            res.render('500.jade', {
                title : '500 - The Server Encountered an Error'
                ,description: err.toString()
                ,author: ''
                ,error: err
            });
        }
    });
};

module.exports = {setupErrorHandlers: setupErrorHandlers};