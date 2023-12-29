const sql = require('mssql');

module.exports = {
    server: 'wdai-database.ch8yqqikgd2b.eu-west-2.rds.amazonaws.com',
    port: 1433,
    user: 'admin',
    password: 'wdairoot1',
    database: 'wdai',
    options: {
        enableArithAbort: true,
        encrypt: false
    },
    connectionTimeout: 150000,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

