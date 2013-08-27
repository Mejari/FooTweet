var NotFound = require('./NotFound');
var setupErrorHandlers = function(server) {
    server.error(function(err, req, res, next){
        if (err instanceof NotFound) {
            res.render('404.jade', { locals: {
                title : '404 - Not Found'
                ,description: err.toString()
                ,author: ''
            },status: 404 });
        } else {
            res.render('500.jade', { locals: {
                title : 'The Server Encountered an Error'
                ,description: err.toString()
                ,author: ''
                ,error: err
            },status: 500 });
        }
    });
};

module.exports = {setupErrorHandlers: setupErrorHandlers};