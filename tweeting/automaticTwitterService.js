var accountManagementDao = require('../accountmanagement/accountManagementDao'),
    twitterService = require('./twitterService'),
    TweetJob = require('./TweetJob.js');

var startAutomaticTweetsForAccount = function(account) {
    twitterService.loadExistingTweetsIntoDB(account, function() {
        var accountTweetJob = TweetJob.create(account);
        accountTweetJob.start();
    });
};

var startAutomaticTweetsForActiveAccounts = function() {
    accountManagementDao.getActiveAccounts(function(accounts) {
        if(accounts) {
            accounts.forEach(function(account) {
                startAutomaticTweetsForAccount(account);
            });
        }
    });
};

module.exports = {
    startAutomaticTweetsForActiveAccounts: startAutomaticTweetsForActiveAccounts
};