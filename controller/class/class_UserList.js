const classIMAdmin = require('./class_Main');
const urlencode = require('urlencode');
const async = require('async');
const mysql = require('mysql');
// const crypto = require('crypto');
// const moment = require('moment');


module.exports = {
    getUserInfo: getUserInfo,
    registerMember: registerMember,
    editUserNickname: editUserNickname,
    checkAccountExists: checkAccountExists,
    getUserAccountAndInfo: getUserAccountAndInfo,
};

/**
 * 註冊會員
 * @param data 前端傳遞的資料
 * @param callback 有錯誤時，回傳錯誤代碼
 */
function registerMember(data, callback) {
    let response = {};

    async.waterfall([
        // 檢查帳號是否已存在
        function(next) {
            checkAccountExists(data.username, function(err, result) {
                if(err){
                    return next(err);
                }
                
                next();
            });
        },
        // 新增帳號 + 密碼進入user table
        function(next) {
            let query = "INSERT INTO users(username, password, nickname) VALUES ($1, $2, $3)";
            let parameter = [data.username, data.password, data.nickname];

            classIMAdmin.QueryData(query, parameter, function(result) {
                if (result.status === 'error' ) {
                    response.errCode = '10005';
                    response.query = mysql.format(query, parameter);
                    return callback(response);
                }

                callback()
            })
        }
    ], function (err) {
        if(err) {
            return callback(err);
        }
        callback();
    });
}

/**
 * 檢查帳號是否存在
 * @param account 使用者帳號
 * @param callback 有錯誤時，回傳錯誤代碼
 */
function checkAccountExists(account, callback) {
    let response = {};
    let query = "SELECT * FROM users WHERE username = $1";
    let parameter = [account];

    classIMAdmin.QueryData(query, parameter, function(result) {
        if (result.status === 'error' ) {
            response.errCode = '10005';
            response.query = mysql.format(query, parameter);
            return callback(response);
        }

        if (result.status !== 'empty' ) {
            response.errCode = '10006';
            return callback(response);
        }

        callback(null, result)
    })
}

/**
 * 取得用戶列表資料
 * @param {*} callback 回傳DB搜尋結果
 */
function getUserAccountAndInfo(callback) {
    let response = {};

    let query = "SELECT username, nickname, create_at FROM users";

    classIMAdmin.QueryData(query, '', function(result) {
        if (result.status === 'error' ) {
            response.errCode = '10007';
            response.query = mysql.format(query);
            return callback(response);
        }

        if (result.status === 'empty' ) {
            response.errCode = '10008';
            response.query = mysql.format(query);
            return callback(response);
        }

        let dbData = result.result.rows
        for(let i = 0; i < dbData.length; i++) {
            dbData[i].nickname = urlencode.decode(dbData[i].nickname);
        }

        callback(null, result.result.rows);
    })
}

/**
 * 更改帳號暱稱
 * @param {*} data 使用者名稱 + 暱稱
 * @param {*} callback 回傳更改後結果
 */
function editUserNickname(data, callback) {
    let response = {};

    async.waterfall([
        // 檢查帳號是否已存在
        // function(next) {
        //     checkAccountExists(data.username, function(err) {
        //         if(err){
        //             return next(err);
        //         }

        //         next();
        //     });
        // },
        // 修改暱稱
        function(next) {
            let query = "UPDATE users SET nickname = $1 WHERE username = $2";
            let parameter = [data.nickname, data.username];

            classIMAdmin.QueryData(query, parameter, function(result) {
                if (result.status === 'error' ) {
                    response.errCode = '10010';
                    response.query = mysql.format(query, parameter);
                    return callback(response);
                }

                callback()
            })
        }
    ], function (err) {
        if(err) {
            return callback(err);
        }
        callback();
    });
}

/**
 * 取用戶詳細資料
 * @param {*} data 用戶帳號 
 * @param {*} callback 回傳錯誤代碼，或DB資料
 */
function getUserInfo(data, callback) {
    let response = {};

    let query = "SELECT username, nickname, create_at FROM users WHERE username = $1";
    let parameter = [data.username];

    classIMAdmin.QueryData(query, parameter, function(result) {
        if (result.status === 'error' ) {
            response.errCode = '10012';
            response.query = mysql.format(query);
            return callback(response, parameter);
        }

        let dbData = result.result.rows
        for(let i = 0; i < dbData.length; i++) {
            dbData[i].nickname = urlencode.decode(dbData[i].nickname);
        }

        callback(null, result.result.rows);
    })
}