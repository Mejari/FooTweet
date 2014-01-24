var db = GLOBAL.db,
rootManagementDao = require('./rootManagementDao');

var initRootProperties = function() {
    rootManagementDao.getRootProperties(function(properties){
        if(!properties) {
            db.RootProperties.create({
                tweetInterval: 30,
                tweetsPerSearch: 15
            });
        }
    });
};

module.exports = function() {
    require('../dbHelper').callbackWhenDbReady(initRootProperties);
}();