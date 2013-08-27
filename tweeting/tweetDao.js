var db = GLOBAL.db;

var saveTweet = function(userScreenName, account, callback, errorCallback) {
    errorCallback = errorCallback || tweetDaoErrorHandler;
    callback = callback || function() {};
    db.TweetedUser.create({
        targetUser: userScreenName,
        AccountId: account.id
    }).success(callback).error(errorCallback);
};

var tweetAlreadyExistsForAccount = function(account, tweet, callback) {
    db.TweetedUser.count({
        where: {
            targetUser: tweet.user.screen_name,
            AccountId: account.id
        }
    }).success(function(numTweets) {
        callback(numTweets > 0);
    }).error(tweetDaoErrorHandler);
};

var tweetDaoErrorHandler = function(error) {
    if(error.indexOf("ER_DUP_ENTRY") < 0) {
        console.log("Error in Tweet dao: " + error);
    }
}

module.exports = {
    saveTweet: saveTweet,
    tweetAlreadyExistsForAccount: tweetAlreadyExistsForAccount
}