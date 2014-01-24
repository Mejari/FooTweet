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

    if(GLOBAL.debug_tweets === true) {
        GLOBAL.logger.log("Config Data:");
        Object.keys(db_config).forEach(function(key) {
            GLOBAL.logger.log(key+": "+db_config[key]);
        });
    }

    //Setup Database
    var sequelize = new Sequelize(db_config.dbName, db_config.user, db_config.password, {
        host: db_config.host,
        dialect: 'mysql',
        logging: function(statementToLog) {
            if(GLOBAL.debug_sequelize_enabled === true) {
                GLOBAL.logger.log(statementToLog);
            }
        }
    });

    extendSequelize(sequelize);

    return sequelize;
};

var extendSequelize = function(sequelize) {
    sequelize.getModel = sequelize.daoFactoryManager.getDAO.bind(sequelize.daoFactoryManager);
};

var syncModels = function(sequelize) {
    sequelize.sync({/*force: true*/}).success(function() {
        sequelize.isSynchronized = true;
    }).error(function(error){
            GLOBAL.logger.log('Error syncing db model: '+error);
        process.exit();
    });
};

var importModel = function(conn, modelName) {
    return conn.import(__dirname+"\\..\\models\\"+modelName);
}

var populateDbModels = function(conn) {
    return {
        RootProperties: importModel(conn, "RootProperties"),
        Account: importModel(conn, "Account"),
        TweetedUser: importModel(conn, "TweetedUser")
    };
};

var conn = setupDbConnection();
var exports = populateDbModels(conn);
syncModels(conn);
exports.conn = conn;
module.exports = exports;