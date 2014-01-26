var Twit = require('node-twitter-api');

var createTwitForAccount = function(account) {
    var twitter = null;
    if(account) {
        twitter = new Twit({
            consumerKey:           account.consumerKey
            , consumerSecret:      account.consumerSecret
            ,callback: null
        });
        twitter.access_token=account.accessTokenKey;
        twitter.access_token_secret=account.accessTokenKeySecret;
    }
    return twitter;
};

module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define('Account', {
        //Details About the Account
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, unique: true },
        active: { type: DataTypes.BOOLEAN, defaultValue: true },
        searchString: { type: DataTypes.STRING, allowNull: false },
        ignoreString: DataTypes.STRING,
        responseString: {type: DataTypes.STRING(160), allowNull: false, validate: {
            len: [0,161]
        }},
        //Details About the Twitter Authentication for the Account
        consumerKey: DataTypes.STRING,
        consumerSecret: DataTypes.STRING,
        accessTokenKey: DataTypes.STRING,
        accessTokenKeySecret: DataTypes.STRING
    }, {
        instanceMethods: {
            getTwitter: function() {
                if(!this.twitter) {
                    this.twitter = createTwitForAccount(this);
                }
                return this.twitter;
            }
        }
    });
    return Account;
};