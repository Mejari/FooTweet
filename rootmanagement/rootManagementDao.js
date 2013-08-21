var db = GLOBAL.db;

var getRootProperties = function(callback) {
    db.RootProperties.find(1).success(function(rootProperties) {
        callback(rootProperties);
    }).error(function(error) {
        console.log(error);
    });
};

var updateRootProperties = function(newPropertyValues, callback) {
    getRootProperties(function(properties) {
       properties.updateAttributes(newPropertyValues).success(function() {
           if (typeof(callback) == 'function') {
               callback(properties);
           }
       });
    });
};

module.exports = {
    getRootProperties: getRootProperties,
    updateRootProperties: updateRootProperties
};