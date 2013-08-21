var db = GLOBAL.db,
rootManagementDao = require('./rootManagementDao');

var initRootProperties = function() {
    rootManagementDao.getRootProperties(function(properties){
        if(!properties) {
            db.RootProperties.create({tweetInterval: 5});
        }
    });
};

module.exports = function() {
    var executeWhenDbReady = function() {
        if(db.conn.isSynchronized === true) {
            initRootProperties();
        } else {
            setTimeout(function() {
                executeWhenDbReady();
            }, 1000);
        }
    };

    executeWhenDbReady();;
}();