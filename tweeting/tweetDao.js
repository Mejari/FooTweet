var db = GLOBAL.db;

var saveTweet = function(userScreenName, account, callback, errorCallback) {
    db.Tweet.create({
        targetUser: userScreenName
    }).success(function(tweet){
        tweet.setAccount(account).success(function() {
            if(callback) {
                callback();
            }
        }).error(function(err) {
            console.log(err);
            if(errorCallback) {
                errorCallback(err);
            }
        });
    }).error(function(err){
        console.log(err);
        if(errorCallback) {
            errorCallback(err);
        }
    });
};

var tweetAlreadyExistsForAccount = function(account, tweet, callback) {
    db.Tweet.count({
        where: {
            targetUser: tweet.user.screen_name,
            AccountId: account.id
        }
    }).success(function(numTweets) {
        callback(numTweets > 0);
    });
};

module.exports = {
    saveTweet: saveTweet,
    tweetAlreadyExistsForAccount: tweetAlreadyExistsForAccount
}