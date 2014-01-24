var twitterService = require('./twitterService'),
    rootDao = require('../rootmanagement/rootManagementDao'),
    accountManagement = require('../accountmanagement/accountManagementDao'),
    qs = require('querystring');

var emitTweetEvent = function(tweet) {
    if(GLOBAL.twitterIo) {
        var io = GLOBAL.twitterIo;
        io.sockets.emit('tweetTweeted', tweet);
    }
};

var constructSearchStringForAccount = function(account) {
    var accountSearchString = account.searchString;
    var searchString = '';
    var searchStringArr = accountSearchString.split(',');
    searchString += '(';
    for(var i in searchStringArr) {
        searchString += '"'+searchStringArr[i].trim()+'"';
        if((searchStringArr.length-1) > i) {
            searchString += ' OR ';
        }
    }
    searchString += ') ';
    var accountIgnoreString = account.ignoreString;
    if(accountIgnoreString) {
        var ignoreStringArr = accountIgnoreString.split(',');
        for(var i in ignoreStringArr) {
            searchString += '-"'+ignoreStringArr[i].trim()+'" ';
        }
    }
    searchString += ' -RT';//Never respond to a re-tweet. This might be pulled out into a root property later
    if(GLOBAL.debug_tweets) {
        GLOBAL.logger.log("Search String for " + account.name + ": "+searchString);
    }

    return encodeSearchString(searchString);
};

var encodeSearchString = function(searchString) {
    var tmp =  qs.escape(searchString);
    tmp = tmp.replace(/!/g,'%21');
    tmp = tmp.replace(/\*/g,'%2A');
    tmp = tmp.replace(/\(/g,'%28');
    tmp = tmp.replace(/\)/g,'%29');
    tmp = tmp.replace(/'/g,'%27');
    return tmp;
};

var shouldRespondToTweet = function(tweet, account) {
    var shouldRespond = true;
    //Make sure search string is actually contained in result, without punctuation in the way.
    shouldRespond = shouldRespond && tweet.text.toLowerCase().indexOf(account.searchString.toLowerCase()) >= 0;

    return shouldRespond;
};

var TwitterJob = (function() {
    function create( account ) {
        var runJob = function() {
            if(GLOBAL.debug_tweets) {
                GLOBAL.logger.log('Running sync for account: '+account.name);
            }
            //Return 2x the number of tweets we want in case there are tweets that do not fit our criteria and are skipped
            twitterService.searchTweets(this.searchString, this.numTweetsPerSearch * 2, account, handleSearchResults.bind(this));
        };

        var stop = function() {
            clearInterval(this.intervalId);
        };

        var  handleSearchResults = function(statuses) {
            var maxId = null, numTweetsTweeted = 0;
            if(statuses){
                for(var i in statuses) {
                    if(numTweetsTweeted > this.numTweetsPerSearch) {
                        break;
                    }
                    var status = statuses[i];
                    if(!maxId) {
                        maxId = status.id_str;
                    }
                    if(shouldRespondToTweet(status, account)) {
                        numTweetsTweeted++;
                        twitterService.respondToTweet(status, account, emitTweetEvent);
                        emitTweetEvent(status);
                    }
                }
            }
            this.stop();
            this.intervalId = setInterval(runJob.bind(this), this.minutes*60*1000);
            accountManagement.createOrUpdateAccount({id: account.id, lastTweetId: maxId});
            if(GLOBAL.debug_tweets) {
                GLOBAL.logger.log('Sync complete for account: '+account.name);
            }
        };

        return {
            start: function() {
                rootDao.getRootProperties(function(rootProps) {
                    this.minutes = rootProps.tweetInterval;
                    this.numTweetsPerSearch = rootProps.tweetsPerSearch;
                    this.searchString = constructSearchStringForAccount(account);

                    //Run immediately
                    runJob.bind(this)();
                }.bind(this));
            },

            stop: stop

            //TODO: Restart when tweet interval is changed under root properties
        };
    };

    // Public API
    return {
        create: create
    };

})();

module.exports = TwitterJob;