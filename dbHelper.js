var db = GLOBAL.db;

var callbackWhenDbReady = function(callback) {
    var executeWhenDbReady = function() {
        if(db && db.conn.isSynchronized === true) {
            callback();
        } else {
            setTimeout(function() {
                executeWhenDbReady();
            }, 1000);
        }
    };

    executeWhenDbReady();
};

module.exports = {
    callbackWhenDbReady: callbackWhenDbReady
};