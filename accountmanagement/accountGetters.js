var db = GLOBAL.db;

var getActiveAccounts = function(callback) {
    return getAccounts(callback, true, false);
};

var getDisabledAccounts = function(callback) {
    return getAccounts(callback, false, true);
};

var getAccounts = function(callback, getActive, getDisabled) {
    var booleanArg = [];
    if(getActive === true) {
        booleanArg.push(true);
    }
    if(getDisabled === true) {
        booleanArg.push(false);
    }
    db.Account.findAll({
        where: {active: booleanArg}
    }).success(callback).error(accountManagementErrorHandler);
};

var getAccountForName = function(accountName, callback) {
    db.Account.find({
        where: {name: accountName}
    }).success(callback).error(accountManagementErrorHandler);
};

var accountManagementErrorHandler = function(error) {
    console.log("Error in Account Management: " + error)
};

module.exports = {
    getActiveAccounts: getActiveAccounts,
    getDisabledAccounts: getDisabledAccounts,
    getAccountForName: getAccountForName
};