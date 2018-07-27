// supervisor.cmd bin\www && Set NODE_ENV=local

// 引入 mysql
// var mysql = require('mysql');
// 引入 pg
var pg = require('pg');
// 載入環境設定
var env = require('./env');

// var con = mysql.createPool({
//     connectionLimit: 50,
//     host           : env.host,
//     user           : env.user,
//     password       : env.password,
//     database       : env.database,
//     dateStrings    : true,  // 將時間格式Z、T去除(2018-06-28T12:30:25Z)
// });



var con = new pg.Pool({
    user: env.user,
    database: env.database,
    password: env.password,
    port:5432,

    // 擴展屬性
    max:20, // 最大連線數
    idleTimeoutMillis:30000, // 最大閒置時間 3s
});

module.exports = con;