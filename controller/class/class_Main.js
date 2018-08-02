const dbCon = require('../../common/dbconn');

module.exports = {
    basicData: basicData,
    QueryData: QueryData,
    VaildUserName: VaildUserName,
    VaildUserPassword: VaildUserPassword,
};

/**
 * 定義API基本回傳格式
 */
function basicData() {
    return {
        status:'N',
        message:'',
        data:{}
    };
}

/**
 * 連接DB
 * @param {*} sqlStatement SQL語法
 * @param {*} params 欄位 + 值
 * @param {*} callback 回傳DB搜尋結果
 */
function QueryData(sqlStatement, params, callback) {
    dbCon.connect(function(err, client, done) {
        if(err) {
            throw err;
        }
        console.log(sqlStatement)
        if(params !== '') {
            client.query(sqlStatement, params, function(error, db_results) {
                if (error) {
                    return callback({
                        status: 'error',
                        result: error
                    });
                }
                if (db_results.rowCount == 0) {
                    // No result
                    return callback({
                        status: 'empty',
                        result: []
                    });
                }
                // Has result
                return callback({
                    status: 'ok',
                    result: db_results
                });
            });

        }else {
            client.query(sqlStatement, function(error, db_results) {
                if (error) {
                    return callback({
                        status: 'error',
                        result: error
                    });
                }
                if (db_results.rowCount == 0) {
                    // No result
                    return callback({
                        status: 'empty',
                        result: []
                    });
                }
                // Has result
                return callback({
                    status: 'ok',
                    result: db_results
                });
            });
        }

        done(); // 釋放連接池    
    });
}

/**
 *  * 驗證使用者帳號格式
 * @param username 使用者帳號
 * @returns {*}
 * @constructor
 */
function VaildUserName(username) {
    // 檢查是否為空
    if (!username) {
        return '10001';
    }

    // 檢查是否符合格式
    let regex = /^[\d|\w|_]+$/;
    if (!username.match(regex)){
        return '10002';
    }

    return;
}

/**
 * 驗證使用者密碼格式
 * @param password 使用者密碼
 * @returns {*}
 * @constructor
 */
function VaildUserPassword(password) {
    // 檢查是否為空
    if (!password) {
        return '10003';
    }

    // 檢查是否符合格式
    var regex = /^[\d|\w|_]+$/;
    if (!password.match(regex)){
        return '10004';
    }
}