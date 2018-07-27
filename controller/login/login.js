const classMain = require('../../controller/class/class_Main');
const errorcode = require('../../common/errorcode');
const user = require('../../common/admin');
const crypto = require('crypto');

function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    console.log(username);
    // 檢查是否為空
    if(username === '' || password === '') {
        return res.redirect('/login');
    }

    // 檢查是否符合格式
    var regex = /^[\d|\w|_]+$/;
    if(!username.match(regex) || !password.match(regex)){
        return res.redirect('/login');
    }

    // 檢查是否與設定檔資料相同 + 存入 session
    if (checkLogin(username, password)){
        req.session.name    = username;
        req.session.status  = checkLogin(username, password);
        res.redirect('/');
    }else {
        res.redirect('login');
    }
}

// 登入驗證 return bool
function checkLogin(username, password) {
    return (user[username] && encrypt(password) === user[username]);
}

//不可逆加密 SHA1
function encrypt(password) {
    let buf = new Buffer(password+"");
    let str = buf.toString("binary");
    return crypto.createHash("sha1").update(str).digest("hex");
}

module.exports = login;