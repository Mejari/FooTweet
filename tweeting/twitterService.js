var tweetDao = require('./tweetDao');

var searchTweets = function(searchTerms, account, callback) {
    var twit = account.getTwitter();
    var searchParams = {
        q: searchTerms,
        result_type: 'recent',
        count: 50,
        include_entities: false
    };
    if(account.lastTweetId) {
        searchParams.since_id = account.lastTweetId;
    }
    twit.search(searchParams, twit.access_token, twit.access_token_secret, function(err, data) {
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

var tweetResponseCallback = function(data, account, callback) {
    if(data) {
        var responseText = data.text;
        if(GLOBAL.debug_tweets) {
            console.log(account.name +' Tweeted: '+responseText);
        }

        var userScreenName = getMentionedUsernameFromTweet({text:responseText});
        tweetDao.saveTweet(userScreenName, account);
    }
    callback(data);
};


var respondToTweet = function(tweet, account, callback) {
    callback = callback || function(){};
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

            if(GLOBAL.debug_tweets === true) {
                console.log("DEBUGGING, SKIPPING ACTUAL TWEETING");
                tweetResponseCallback({text: responseText}, account, callback);

            } else {
                twit.statuses("update", params, twit.access_token, twit.access_token_secret, function(err, data) {
                    if(err) {
                        twitterErrorHandler(err, account);
                        return;
                    }
                    tweetResponseCallback(data, account, callback);
                });
            }
        } else {
            if(GLOBAL.debug_tweets) {
                console.log('Skipping Tweet, already Tweeted: '+responseText);
            }
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
                var userScreenName = getMentionedUsernameFromTweet(searchedTweet);
                tweetDao.saveTweet(userScreenName, account, saveCallback, saveCallback);
            });
        }
    });
};

var getMentionedUsernameFromTweet = function(tweet) {
    return tweet.text.indexOf('@') == 0 ? (tweet.text.split(' ')[0].substr(1)) : null;
};

var twitterErrorHandler = function(error, account) {
    console.log("Error calling twitter method: "+error.statusCode+' for account: '+account.name+' --- '+error.data);
};

module.exports = {
    searchTweets: searchTweets,
    respondToTweet: respondToTweet,
    loadExistingTweetsIntoDB: loadExistingTweetsIntoDB
};