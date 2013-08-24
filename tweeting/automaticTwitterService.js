var accountManagementDao = require('../accountmanagement/accountManagementDao'),
    twitterService = require('./twitterService'),
    TweetJob = require('./TweetJob.js');

var ACTIVE_TWEET_JOBS = {};

var restartAutomaticTweetsForAccount = function(account) {
    var accountTweetJob = ACTIVE_TWEET_JOBS[account.name];
    if(accountTweetJob) {
        accountTweetJob.stop();
    }
    startAutomaticTweetsForAccount(account);
}

var startAutomaticTweetsForAccount = function(account) {
    twitterService.loadExistingTweetsIntoDB(account, function() {
        var accountTweetJob = TweetJob.create(account);
        accountTweetJob.start();
        ACTIVE_TWEET_JOBS[account.name] = accountTweetJob;
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
    startAutomaticTweetsForActiveAccounts: startAutomaticTweetsForActiveAccounts,
    restartAutomaticTweetsForAccount: restartAutomaticTweetsForAccount
};