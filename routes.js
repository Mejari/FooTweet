var NotFound = require('./NotFound'),
    accountManagementDao = require('./accountmanagement/accountManagementDao'),
    rootManagementDao = require('./rootmanagement/rootManagementDao'),
    twitterService = require('./tweeting/twitterService'),
    automaticTwitterService = require('./tweeting/automaticTwitterService');
var setupRoutes = function(server) {
///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////


server.get('/', function(req,res){
    res.render('index.jade', {
        title : 'FooTweet'
        ,description: 'Tweet Anything'
        ,author: 'Mejari'
    });
});

var renderRootPropertiesForm = function(res) {
    rootManagementDao.getRootProperties(function(rootProperties) {
        res.render('rootManagement.jade', {
            properties: rootProperties
            ,title : 'FooTweet - Root Properties'
            ,description: 'Tweet Anything'
            ,author: 'Mejari'
            ,backHref: '/'
        });
    });
}

server.get('/root', function(req,res){
    renderRootPropertiesForm(res);
});

server.post('/root', function(req,res){
    var values = req.body;
    var properties = {
        tweetInterval: values.tweetInterval,
        tweetsPerSearch: values.tweetsPerSearch
    };
    rootManagementDao.updateRootProperties(properties, function() {
        renderRootPropertiesForm(res);
    });
});


var renderAccountInfoForm = function(accountName, res) {
    accountManagementDao.getAccountForName(accountName, function(account){
        res.render('updateAccountForm.jade', {
            title : 'FooTweet - ' + (account ? account.name : 'new')
            ,account: account || {name: accountName}
            ,description: 'Tweet Anything'
            ,author: 'Mejari'
            ,backHref: '/accounts'
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

    var accountInfo = {
        id: values.id,
        name: values.name,
        searchString: values.searchString,
        responseString: values.responseString,
        ignoreString: values.ignoreString,
        active: values.active == 'on',
        consumerKey: values.consumerKey,
        consumerSecret: values.consumerSecret,
        accessTokenKey: values.accessTokenKey,
        accessTokenKeySecret: values.accessTokenKeySecret
    };

    accountManagementDao.createOrUpdateAccount(accountInfo, function(savedAccount) {
        accountManagementDao.getAccountForName(savedAccount.name, function(account) {
            automaticTwitterService.restartAutomaticTweetsForAccount(account);
        });
        renderAccountInfoForm(savedAccount.name, res);
    });
});

//A Route to view currently active Twitter accounts
server.get('/accounts', function(req, res){
    accountManagementDao.getActiveAccounts(function(accounts){
        accountManagementDao.getDisabledAccounts(function(inactiveAccounts) {
            res.render('listAccounts.jade', {
                title : 'FooTweet - Accounts'
                ,accounts: accounts
                ,inactiveAccounts: inactiveAccounts
                ,description: 'Tweet Anything'
                ,author: 'Mejari'
                ,backHref: '/'
            });
        })
    });
});


//A Route for Creating a 500 Error
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route
server.get('/*', function(req, res){
    throw new NotFound;
});
}

module.exports = {setupRoutes: setupRoutes};