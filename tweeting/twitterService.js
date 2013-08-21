var Twit = require('twit'),
    tweetDao = require('./tweetDao');

var searchTweets = function(searchTerms, account, callback) {
    var twit = createTwitForAccount(account);
    twit.get('search/tweets', { q: searchTerms, count: 20 }, function(err, reply) {
        if(err) {
            twitterErrorHandler(err);
            return;
        }

//        require('./tweetDao').tweetAlreadyExistsForAccount(account, reply.statuses[0].text, function(){});

        callback(reply);
    });
};

var db = GLOBAL.db;

var loadExistingTweetsIntoDB = function(account) {
    //TODO: THIS IS WRONG. STORE SOMETHING ELSE
    searchTweets('@'+account.name, account, function(result) {
        result.statuses.forEach(function(searchedTweet) {
            db.Tweet.create({
                text: searchedTweet.text
            }).success(function(tweet){
                tweet.setAccount(account);
            }).error(function(err){
                console.log(err);
            });
        });
    });
};

var createTwitForAccount = function(account) {
    var twitterAuthentication = account.twitterAuthentication;
    return new Twit({
        consumer_key:           twitterAuthentication.consumerKey
        , consumer_secret:      twitterAuthentication.consumerSecret
        , access_token:         twitterAuthentication.accessTokenKey
        , access_token_secret:  twitterAuthentication.accessTokenKeySecret
    });
};

var twitterErrorHandler = function(error) {
    console.log(error);
};

module.exports = {
    searchTweets: searchTweets,
    loadExistingTweetsIntoDB: loadExistingTweetsIntoDB
};