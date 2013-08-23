var tweetDao = require('./tweetDao');

var searchTweets = function(searchTerms, account, callback) {
    var twit = account.getTwitter();
    twit.search({ q: searchTerms}, twit.access_token, twit.access_token_secret, function(err, data) {
        if(err) {
            twitterErrorHandler(err, account);
            return;
        }
        callback(data.statuses);
    });
};

var getTweetsForAccount = function(account, callback) {
    var twit = account.getTwitter();
    twit.getTimeline("user_timeline", {screen_name: account.name}, twit.access_token, twit.access_token_secret, function(err, data) {
        if(err) {
            twitterErrorHandler(err, account);
            return;
        }
        callback(data);
    });
};

var respondToTweet = function(tweet, account, callback) {
    var responseText = constructResponseTextForAccount(tweet, account);

    //Don't ever tweet the same thing to the same person
    tweetDao.tweetAlreadyExistsForAccount(account, tweet, function(tweetAlreadyExists) {
        if(tweetAlreadyExists === false) {
            var replyToId = tweet ? tweet.id_str : null;

            var params = {
                status: responseText,
                in_reply_to_status_id: replyToId
            };

            var twit = account.getTwitter();

            if(true) {
                console.log("BYPASSING. WOULD HAVE TWEETED: "+responseText);
                if(callback) {
                    callback({});
                }
                return;
            }
            twit.statuses("update", params, twit.access_token, twit.access_token_secret, function(err, data, response) {
                if(err) {
                    twitterErrorHandler(err, account);
                    return;
                }

                if(callback) {
                    //TODO: SAVE TWEET TO DB
                    callback(data);
                }
            });
        } else {
            console.log('Skipping Tweet, already Tweeted: '+responseText);
        }
    });
};

var constructResponseTextForAccount = function(tweet, account) {
    return (tweet ? ('@'+tweet.user.screen_name+ ' ') : '') +account.responseString;
};

var loadExistingTweetsIntoDB = function(account, callback) {
    getTweetsForAccount(account, function(statuses) {
        if(statuses) {
            var numTweets = statuses.length;
            var numSaved = 0;
            var saveCallback = function() {
                numSaved++;
                if(numSaved >= numTweets) {
                    callback();
                }
            };
            statuses.forEach(function(searchedTweet) {
                var userScreenName = searchedTweet.text.indexOf('@') == 0 ? (searchedTweet.text.split(' ')[0].substr(1)) : null;
                tweetDao.saveTweet(userScreenName, account, saveCallback, saveCallback);
            });
        }
    });
};

var twitterErrorHandler = function(error, account) {
    console.log("Error calling twitter method: "+error.statusCode+' for account: '+account.name+' --- '+error.data);
};

module.exports = {
    searchTweets: searchTweets,
    respondToTweet: respondToTweet,
    loadExistingTweetsIntoDB: loadExistingTweetsIntoDB
};