var db = GLOBAL.db;

var insertData = function() {
    db.TwitterAuthentication.create({
        consumerKey: '77777777777',
        consumerSecret: '77777777',
        accessTokenKey: '7-777777777777',
        accessTokenKeySecret: '77777777777'
    }).success(function(ta){
        db.Account.create({
            name: 'LactosTolerance',
            active: true,
            searchString: 'Lactose and Tolerant',
            responseString: 'Moo! I think you mean Lactose Intolerant!'
        }).success(function(account) {
            account.setTwitterAuthentication(ta);
        });
    });

    db.TwitterAuthentication.create({
        consumerKey: 'RAWRAWRAWR',
        consumerSecret: 'lawlawlawl',
        accessTokenKey: 'hahahahahaha',
        accessTokenKeySecret: 'ROFLROFLROFL'
    }).success(function(ta){
        db.Account.create({
            name: 'Account Alpha',
            active: true,
            searchString: 'No Alpha Noooo',
            responseString: 'Go Alpha'
        }).success(function(account) {
                account.setTwitterAuthentication(ta);
            });
    });

    db.TwitterAuthentication.create({
        consumerKey: 'HUEHUEHUE',
        consumerSecret: 'ROFLCOPTER',
        accessTokenKey: 'SQUEEE',
        accessTokenKeySecret: 'QQNOOB'
    }).success(function(ta){
        db.Account.create({
            name: 'Bccount Beta',
            active: false,
            searchString: 'Beta sucks',
            responseString: 'Beta to the max!'
        }).success(function(account) {
                account.setTwitterAuthentication(ta);
            });
    });
};

module.exports = function() {

    var executeWhenDbReady = function() {
        if(db.conn.isSynchronized === true) {
            insertData();
        } else {
            setTimeout(function() {
                executeWhenDbReady();
            }, 1000);
        }
    };

    executeWhenDbReady();
}();
