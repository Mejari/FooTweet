var db = GLOBAL.db;

var saveTweets = function(tweets) {
    db.Tweet.bulkCreate(tweets);
};

var tweetAlreadyExistsForAccount = function(account, tweetText, callback) {
    db.Tweet.count({
        where: {
            text: tweetText,
            AccountId: account.id
        }
    }).success(function(numTweets) {
        callback(numTweets > 0);
    });
};

module.exports = {
    saveTweets: saveTweets,
    tweetAlreadyExistsForAccount: tweetAlreadyExistsForAccount
}