var db = GLOBAL.db;

var getRootProperties = function(callback) {
    db.RootProperties.find(1).success(callback).error(rootManagementErrorHandler);
};

var updateRootProperties = function(newPropertyValues, callback) {
    getRootProperties(function(properties) {
       properties.updateAttributes(newPropertyValues).success(function() {
           if (typeof(callback) == 'function') {
               callback(properties);
           }
       }).error(rootManagementErrorHandler);
    });
};

var rootManagementErrorHandler = function(error) {
    console.log("Error with root properties: "+error);
}

module.exports = {
    getRootProperties: getRootProperties,
    updateRootProperties: updateRootProperties
};