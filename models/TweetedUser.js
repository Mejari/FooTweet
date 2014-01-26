module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.getModel("Account");
    var TweetedUser = sequelize.define('TweetedUser', {
        targetUser: { type: DataTypes.STRING, allowNull: false}
    });

    Account.hasMany(TweetedUser);//, {onDelete: 'cascade', onUpdate: 'cascade'});
    TweetedUser.belongsTo(Account);
    return TweetedUser;
};