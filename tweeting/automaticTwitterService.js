var accountManagementDao = require('../accountmanagement/accountManagementDao'),
    twitterService = require('./twitterService'),
    TweetJob = require('./TweetJob'),
    dbHelper = require('../dbHelper');

var ACTIVE_TWEET_JOBS = {};

var restartAutomaticTweetsForAccount = function(account) {
    stopTweetsForAccount(account);
    startAutomaticTweetsForAccount(account);
}

var startAutomaticTweetsForAccount = function(account) {
    twitterService.loadExistingTweetsIntoDB(account, function() {
        GLOBAL.logger.log('starting automatic tweets for account: ' + account.name);
        var accountTweetJob = TweetJob.create(account);
        accountTweetJob.start();
        ACTIVE_TWEET_JOBS[account.name] = accountTweetJob;
    });
};

var startAutomaticTweetsForActiveAccounts = function() {
    dbHelper.callbackWhenDbReady(function() {
        accountManagementDao.getActiveAccounts(function(accounts) {
            if(accounts) {
                accounts.forEach(function(account) {
                    startAutomaticTweetsForAccount(account);
                });
            }
        });
    });
},

stopTweetsForAccount = function(account) {
    var accountTweetJob = ACTIVE_TWEET_JOBS[account.name];
    if(accountTweetJob) {
        accountTweetJob.stop();
        delete ACTIVE_TWEET_JOBS[account.name];
    }
};

module.exports = {
    startAutomaticTweetsForActiveAccounts: startAutomaticTweetsForActiveAccounts,
    restartAutomaticTweetsForAccount: restartAutomaticTweetsForAccount,
    stopTweetsForAccount: stopTweetsForAccount
};