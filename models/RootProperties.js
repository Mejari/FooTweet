module.exports = function(sequelize, DataTypes) {
    return sequelize.define('RootProperties', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        tweetInterval: DataTypes.INTEGER
    });
};