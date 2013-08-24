var db = GLOBAL.db;

var insertData = function() {

//    db.TwitterAuthentication.create({
//        consumerKey: 'RAWRAWRAWR',
//        consumerSecret: 'lawlawlawl',
//        accessTokenKey: 'hahahahahaha',
//        accessTokenKeySecret: 'ROFLROFLROFL'
//    }).success(function(ta){
//        db.Account.create({
//            name: 'Account Alpha',
//            active: true,
//            searchString: 'No Alpha Noooo',
//            responseString: 'Go Alpha'
//        }).success(function(account) {
//            account.setTwitterAuthentication(ta);
//        });
//    });
//
//    db.TwitterAuthentication.create({
//        consumerKey: 'HUEHUEHUE',
//        consumerSecret: 'ROFLCOPTER',
//        accessTokenKey: 'SQUEEE',
//        accessTokenKeySecret: 'QQNOOB'
//    }).success(function(ta){
//        db.Account.create({
//            name: 'Bccount Beta',
//            active: false,
//            searchString: 'Beta sucks',
//            responseString: 'Beta to the max!'
//        }).success(function(account) {
//            account.setTwitterAuthentication(ta);
//        });
//    });
};

module.exports = function() {
    require('./dbHelper').callbackWhenDbReady(insertData);
}();
