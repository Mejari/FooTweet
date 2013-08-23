var twitterService = require('./twitterService'),
    rootDao = require('../rootmanagement/rootManagementDao'),
    qs = require('querystring'),
    CronJob = require('cron').CronJob;

var TwitterJob = (function() {

    var constructCronStringForMinutes = function(minutes) {
        return '0 0/'+minutes+' * 1/1 * *';
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
        searchString += ')';
        var accountIgnoreString = account.ignoreString;
        if(accountIgnoreString) {
            var ignoreStringArr = accountIgnoreString.split(',');
            for(var i in ignoreStringArr) {
                searchString += '-"'+ignoreStringArr[i].trim()+'" ';
            }
        }
        searchString += ' -RT';


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

    function create( account ) {
        var runJob = function() {
            twitterService.searchTweets(this.searchString, account, handleSearchResults);
        };

        var  handleSearchResults = function(statuses) {
            if(statuses){
                for(var i in statuses) {
                    var status = statuses[i];
                    twitterService.respondToTweet(status, account);
                }
            }
        };

        return {
            start: function() {
                rootDao.getRootProperties(function(rootProps) {
                    var minutes = rootProps.tweetInterval;
                    this.searchString = constructSearchStringForAccount(account);
                    this.accountCron = new CronJob(constructCronStringForMinutes(minutes), runJob, null, null, null, this);
                    this.accountCron.start();

                    //Run immediately
                    runJob();
                });
            },

            stop: function() {
                this.accountCron.stop();
                this.accountCron = null;

            }

            //TODO: Restart when tweet interval is changed under root properties
        };
    };

    // Public API
    return {
        create: create
    };

})();

module.exports = TwitterJob;