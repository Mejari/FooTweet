var NotFound = require('./NotFound'),
    accountManagementDao = require('./accountmanagement/accountManagementDao'),
    rootManagementDao = require('./rootmanagement/rootManagementDao'),
    twitterService = require('./tweeting/twitterService');
var setupRoutes = function(server) {
///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

var renderIndex = function(res, tweets) {
    res.render('index.jade', {
        locals : {
            latestTweets: tweets
            ,title : 'FooTweet'
            ,description: 'Tweet Anything'
            ,author: 'Mejari'
        }
    });
}

server.get('/', function(req,res){
    accountManagementDao.getAccountForName("LactosTolerance", function(lactose) {
        if(lactose) {
            twitterService.loadExistingTweetsIntoDB(lactose);
            twitterService.searchTweets(lactose.searchString, lactose, function(result) {
                renderIndex(res, result.statuses);
            });
        } else {
            renderIndex(res, [{text: 'HAMMY DOWN'}, {text: 'LACTOSE AND TOLERANT'}]);
        }
    });
});

var renderRootPropertiesForm = function(res) {
    rootManagementDao.getRootProperties(function(rootProperties) {
        res.render('rootManagement.jade', {
            locals : {
                properties: rootProperties
                ,title : 'FooTweet'
                ,description: 'Tweet Anything'
                ,author: 'Mejari'
                ,backHref: '/'
            }
        });
    });
}

server.get('/root', function(req,res){
    renderRootPropertiesForm(res);
});

server.post('/root', function(req,res){
    var values = req.body;
    var properties = {
        tweetInterval: values.tweetInterval
    };
    rootManagementDao.updateRootProperties(properties, function() {
        renderRootPropertiesForm(res);
    });
});


var renderAccountInfoForm = function(accountName, res) {
    accountManagementDao.getAccountForName(accountName, function(account){
        res.render('updateAccountForm.jade', {
            locals : {
                title : 'FooTweet - ' + (account ? account.name : 'new')
                ,account: account || {name: accountName, twitterAuthentication: {}}
                ,description: 'Tweet Anything'
                ,author: 'Mejari'
                ,backHref: '/accounts'
            }
        });
    });
};

//A Route to view/edit details about a specific Twitter account
server.get('/accounts/:accountName', function(req, res){
    var accountName = req.params.accountName;
    renderAccountInfoForm(accountName, res);
});

server.post('/accounts/:accountName', function(req, res) {
    var values = req.body;

    var twitterAuthInfo = {
        id: values.twitterAuthId,
        consumerKey: values.consumerKey,
        consumerSecret: values.consumerSecret,
        accessTokenKey: values.accessTokenKey,
        accessTokenKeySecret: values.accessTokenKeySecret
    };

    var accountInfo = {
        id: values.id,
        name: values.name,
        searchString: values.searchString,
        responseString: values.responseString,
        active: values.active == 'on',
        twitterAuthentication: twitterAuthInfo
    };

    accountManagementDao.createOrUpdateAccount(accountInfo, function(savedAccount) {
        renderAccountInfoForm(savedAccount.name, res);
    });
});

//A Route to view currently active Twitter accounts
server.get('/accounts', function(req, res){
    accountManagementDao.getActiveAccounts(function(accounts){
        accountManagementDao.getDisabledAccounts(function(inactiveAccounts) {
            res.render('listAccounts.jade', {
                locals : {
                    title : 'FooTweet - Active Accounts'
                    ,accounts: accounts
                    ,inactiveAccounts: inactiveAccounts
                    ,description: 'Tweet Anything'
                    ,author: 'Mejari'
                    ,backHref: '/'
                }
            });
        })
    });
});


//A Route for Creating a 500 Error (Useful to keep around)
    server.get('/500', function(req, res){
        throw new Error('This is a 500 Error');
    });

//The 404 Route (ALWAYS Keep this as the last route)
    server.get('/*', function(req, res){
        throw new NotFound;
    });
}

module.exports = {setupRoutes: setupRoutes};