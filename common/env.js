// NODE_ENV=local supervisor bin/www

let ENV = {
    local: {
        DB_host: 'localhost', // DB的IP
        user: 'postgres', // 資料庫帳號
        password: 'neil820724', // 資料庫密碼
        database: 'homeworknode', // 資料庫名稱
    },
    heroku: {
        DB_host: 'ec2-23-23-242-163.compute-1.amazonaws.com', // DB的IP
        user: 'ncjbiigqxkwzgq', // 資料庫帳號
        password: 'd3c5e506a8e4240731660cdab275af737b93df06aced530f8f228ef99cca495f', // 資料庫密碼
        database: 'd1fgi7npte875p', // 資料庫名稱
    },
};

// 載入當前開發環境
console.log(process.env.NODE_ENV);
let env = process.env.NODE_ENV;
if(env == undefined){
    env = 'heroku';
}
module.exports = ENV[env];

