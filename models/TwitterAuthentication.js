module.exports = function(sequelize, DataTypes) {
    return sequelize.define('TwitterAuthentication', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        consumerKey: DataTypes.STRING,
        consumerSecret: DataTypes.STRING,
        accessTokenKey: DataTypes.STRING,
        accessTokenKeySecret: DataTypes.STRING
    });
};