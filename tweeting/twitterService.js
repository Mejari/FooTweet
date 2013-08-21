var tweetDao = require('./tweetDao');

var searchTweets = function(searchTerms, account, callback) {
    var twit = account.getTwitter();
    twit.search({ count: 20, q: searchTerms}, twit.access_token, twit.access_token_secret, function(err, data, response) {
        if(err) {
            twitterErrorHandler(err);
            return;
        }

//        require('./tweetDao').tweetAlreadyExistsForAccount(account, reply.statuses[0].text, function(){});

        callback(data.statuses);
    });
};

var respondToTweet = function(tweet, account, callback) {
    var responseText = constructResponseTextForAccount(tweet, account);
    var replyToId = tweet ? tweet.id_str : null;

    var params = {
        status: responseText,
        in_reply_to_status_id: replyToId
    };

    var twit = account.getTwitter();

    twit.statuses("update", params, twit.access_token, twit.access_token_secret, function(err, data, response) {
        if(err) {
            twitterErrorHandler(err);
            return;
        }

        callback(data);
    });
};

var constructResponseTextForAccount = function(tweet, account) {
    return (tweet ? ('@'+tweet.user.screen_name+ ' ') : '') +account.responseString;
};

var db = GLOBAL.db;

var loadExistingTweetsIntoDB = function(account) {
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



var twitterErrorHandler = function(error) {
    console.log("Error calling twitter method: "+error);
};

module.exports = {
    searchTweets: searchTweets,
    respondToTweet: respondToTweet,
    loadExistingTweetsIntoDB: loadExistingTweetsIntoDB
};