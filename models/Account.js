var Twit = require('node-twitter-api');

var createTwitForAccount = function(account) {
    var twitterAuthentication = account.twitterAuthentication;
    var twitter = null;
    if(twitterAuthentication) {
        twitter = new Twit({
            consumerKey:           twitterAuthentication.consumerKey
            , consumerSecret:      twitterAuthentication.consumerSecret
            ,callback: null
        });
        twitter.access_token=twitterAuthentication.accessTokenKey;
        twitter.access_token_secret=twitterAuthentication.accessTokenKeySecret;
    }
    return twitter;
};

module.exports = function(sequelize, DataTypes) {
    var TwitterAuthentication = sequelize.getModel("TwitterAuthentication");
    var Account = sequelize.define('Account', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, unique: true },
        active: { type: DataTypes.BOOLEAN, defaultValue: true },
        searchString: { type: DataTypes.STRING, allowNull: false },
        ignoreString: DataTypes.STRING,
        responseString: {type: DataTypes.STRING(160), allowNull: false, validate: {
            len: [0,161]
        }},
        lastTweetId: DataTypes.STRING
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

    Account.belongsTo(TwitterAuthentication);//, {onDelete: 'cascade', onUpdate: 'cascade'});

    return Account;
};