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
        where: {active: booleanArg},
        include: [db.TwitterAuthentication]
    }).success(function(accounts) {
        callback(accounts);
    }).error(function(error) {
        console.log(error);
    });
};

var getAccountForName = function(accountName, callback) {
    db.Account.find({
        where: {name: accountName},
        include: [db.TwitterAuthentication]
    }).success(function(account) {
        callback(account);
    }).error(function(error) {
        console.log(error);
    });
};

var createOrUpdateAccount = function(accountInfo, callback) {
    var createOrUpdateTwitterAuth = function(twitterAuth, callback) {
        if(twitterAuth) {
            if(twitterAuth.id) {
                db.TwitterAuthentication.find(twitterAuth.id).success(function(existingAuth){
                    delete twitterAuth.id;
                    existingAuth.updateAttributes(twitterAuth).success(function() {
                        callback(existingAuth)
                    });
                }).error(function(error){console.log(error);});
            } else {
                delete twitterAuth.id;
                db.TwitterAuthentication.create(twitterAuth).success(callback).error(function(error){console.log(error);});
            }
        } else {
            callback(null);
        }
    };

    var createOrUpdateAccount = function(account, twitterAuth, callback) {
        if(account.id) {
            db.Account.find(account.id).success(function(existingAccount){
                delete account.id;
                delete account.twitterAuthentication;
                existingAccount.updateAttributes(account).success(function() {
                    callback(existingAccount)
                }).error(function(error){console.log(error);});
            });
        } else {
            delete account.twitterAuthentication;
            delete account.id;
            db.Account.create(account).success(function(newAccount) {
                if(twitterAuth) {
                newAccount.setTwitterAuthentication(twitterAuth).success(function() {
                    callback(newAccount);
                });
                } else {
                    callback(newAccount);
                }
            }).error(function(error){console.log(error);});
        }
    }

    createOrUpdateTwitterAuth(accountInfo.twitterAuthentication, function(twitterAuth) {
        createOrUpdateAccount(accountInfo, twitterAuth, function(account) {
            if(callback) {
                callback(account);
            }
        });
    });
};

module.exports = {
    getActiveAccounts: getActiveAccounts,
    getDisabledAccounts: getDisabledAccounts,
    getAccountForName: getAccountForName,
    createOrUpdateAccount: createOrUpdateAccount
};