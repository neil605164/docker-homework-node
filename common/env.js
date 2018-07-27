// NODE_ENV=local supervisor bin/www

let ENV = {
    local: {
        DB_host: 'localhost', // DB的IP
        user: 'postgres', // 資料庫帳號
        password: 'neil820724', // 資料庫密碼
        database: 'homeworknode', // 資料庫名稱
    },
};

// 載入當前開發環境
console.log(process.env.NODE_ENV);
let env = process.env.NODE_ENV;
if(env == undefined){
    env = 'local';
}
module.exports = ENV[env];

