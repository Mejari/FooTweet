var db = GLOBAL.db;

var createAccount = function(account, callback) {
    delete account.id;
    callback = callback || function(){};
    db.Account.create(account).success(callback).error(accountManagementErrorHandler);
};

var updateExistingAccount = function(account, callback) {
    db.Account.find(account.id).success(function(existingAccount){
        delete account.id;
        existingAccount.updateAttributes(account).success(function() {
            callback(existingAccount)
        }).error(accountManagementErrorHandler);
    });
};

var createOrUpdateAccount = function(account, callback) {
    callback = callback || function(){};
    if(account.id) {
        updateExistingAccount(account, callback);
    } else {
        createAccount(account, callback);
    }
};

var deleteAccount = function(account, callback) {
    callback = callback || function(){};
    if(account && account.id) {
        account.destroy().success(callback).error(accountManagementErrorHandler);
    }
};

var accountManagementErrorHandler = function(error) {
    GLOBAL.logger.log("Error in Account Management: " + error)
};

module.exports = {
    createOrUpdateAccount: createOrUpdateAccount,
    deleteAccount: deleteAccount
};