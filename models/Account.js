module.exports = function(sequelize, DataTypes) {
    var TwitterAuthentication = sequelize.getModel("TwitterAuthentication");
    var Account = sequelize.define('Account', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, unique: true },
        active: { type: DataTypes.BOOLEAN, defaultValue: true },
        searchString: { type: DataTypes.STRING, allowNull: false },
        responseString: {type: DataTypes.STRING(160), allowNull: false, validate: {
            len: [0,161]
        }}
    });

    Account.belongsTo(TwitterAuthentication);//, {onDelete: 'cascade', onUpdate: 'cascade'});

    return Account;
};