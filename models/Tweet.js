module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.getModel("Account");
    var Tweet = sequelize.define('Tweet', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        text: { type: DataTypes.STRING(160), allowNull: false }
    });

    Account.hasMany(Tweet);//, {onDelete: 'cascade', onUpdate: 'cascade'});
    Tweet.belongsTo(Account);
    return Tweet;
};