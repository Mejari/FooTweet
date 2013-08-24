module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.getModel("Account");
    var Tweet = sequelize.define('Tweet', {
        targetUser: { type: DataTypes.STRING, allowNull: false, primaryKey: true }
    });

    Account.hasMany(Tweet);//, {onDelete: 'cascade', onUpdate: 'cascade'});
    Tweet.belongsTo(Account);
    return Tweet;
};