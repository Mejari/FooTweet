var tweetDao = require('./tweetDao');

var

searchTweets = function(searchTerms, numResults, account, callback) {
    var twit = account.getTwitter();
    var searchParams = {
        q: searchTerms,
        result_type: 'recent',
        count: numResults || 50,
        include_entities: false
    };
    twit.search(searchParams, twit.access_token, twit.access_token_secret, function(err, data) {
        if(err) {
            twitterErrorHandler(err, account);
            return;
        }
        callback(data.statuses);
    });
},

getTweetsForAccount = function(account, callback) {
    var twit = account.getTwitter();
    twit.getTimeline("user_timeline", {screen_name: account.name, count: 100}, twit.access_token, twit.access_token_secret, function(err, data) {
        if(err) {
            twitterErrorHandler(err, account);
            return;
        }
        callback(data);
    });
},

tweetResponseCallback = function(data, account, callback) {
    if(data) {
        var responseText = data.text;
        if(GLOBAL.debug_tweets) {
            GLOBAL.logger.log(account.name +' Tweeted: '+responseText);
        }

        var userScreenName = getMentionedUsernameFromTweet({text:responseText});
        tweetDao.saveTweet(userScreenName, account);
    }
    callback(data);
},


respondToTweet = function(options, callback) {
    callback = callback || function(){};
    var tweet = options.status,
        account = options.account,
        tweetCountObject = options.tweetCountObject || {};
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

            if(tweetCountObject.hitTweetLimit && tweetCountObject.hitTweetLimit()) {
                return;
            }

            tweetCountObject.numTweetsTweeted++;
            if(GLOBAL.debug_tweets === true) {
                GLOBAL.logger.log("DEBUGGING, SKIPPING ACTUAL TWEETING");
                tweetResponseCallback({text: responseText}, account, callback);

            } else {
                GLOBAL.logger.log("Tweeted from account " + account.name + " to " + tweet.user.screen_name);
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
                GLOBAL.logger.log('Skipping Tweet, already Tweeted: '+responseText);
            }
        }
    });
},

constructResponseTextForAccount = function(tweet, account) {
    return (tweet ? ('@'+tweet.user.screen_name+ ' ') : '') +account.responseString;
},

loadExistingTweetsIntoDB = function(account, callback) {
    callback = callback || function() {};
    getTweetsForAccount(account, function(statuses) {
        if(statuses) {
            var numTweets = statuses.length;
            if(numTweets != 0) {
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
                return;
            }
        }
        callback();
    });
},

getMentionedUsernameFromTweet = function(tweet) {
    return tweet.text.indexOf('@') == 0 ? (tweet.text.split(' ')[0].substr(1)) : null;
},

twitterErrorHandler = function(error, account) {
    GLOBAL.logger.log("Error calling twitter method: "+error.statusCode+' for account: '+account.name+' --- '+error.data);
};

module.exports = {
    searchTweets: searchTweets,
    respondToTweet: respondToTweet,
    loadExistingTweetsIntoDB: loadExistingTweetsIntoDB
};