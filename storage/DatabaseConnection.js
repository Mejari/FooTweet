var Sequelize = require('sequelize-mysql').sequelize
    , mysql     = require('sequelize-mysql').mysql
    , fs = require('fs');

var setupDbConnection = function() {
    var db_config = {
        dbName: null,
        host: null,
        user: null,
        password: null
    };

    var data = fs.readFileSync('./database.conf', 'utf8');
    var lines = data.split(/\r?\n/);
    for(var i=0; i < lines.length; i++) {
        var keyValue = lines[i].split('=');
        if(keyValue.length == 2 && keyValue[1]) {
            db_config[keyValue[0]] = keyValue[1];
        }
    }
    //Setup Database
    var sequelize = new Sequelize(db_config.dbName, db_config.user, db_config.password, {
        host: db_config.host,
        dialect: 'mysql'
    });

    extendSequelize(sequelize);

    return sequelize;
};

var extendSequelize = function(sequelize) {
    sequelize.getModel = sequelize.daoFactoryManager.getDAO.bind(sequelize.daoFactoryManager);
};

var syncModels = function(sequelize) {
    sequelize.sync({force: true}).success(function() {
        sequelize.isSynchronized = true;
    }).error(function(error){
        console.log('Error syncing db model: '+error);
        process.exit();
    });
};

var importModel = function(conn, modelName) {
    return conn.import(__dirname+"\\..\\models\\"+modelName);
}

var populateDbModels = function(conn) {
    return {
        RootProperties: importModel(conn, "RootProperties"),
        TwitterAuthentication: importModel(conn, "TwitterAuthentication"),
        Account: importModel(conn, "Account"),
        Tweet: importModel(conn, "Tweet")
    };
};




var conn = setupDbConnection();
var exports = populateDbModels(conn);
syncModels(conn);
exports.conn = conn;
module.exports = exports;