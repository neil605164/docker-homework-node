// 載入User的Class
const classUserList = require('../../controller/class/class_UserList');
const classMain = require('../../controller/class/class_Main');
const errorcode = require('../../common/errorcode');
const urlencode = require('urlencode');

function register_member(req, res) {
    let response = classMain.basicData();
    let data = {};

    data['nickname'] = urlencode(req.body.nickname);
    data['username'] = req.body.username;
    data['password'] = req.body.password;
    console.log(data);

    let isVaild = classMain.VaildUserName(data['username']);
    if (isVaild){
        response.message = errorcode[isVaild];
        return res.json(response);
    }

    isVaild = classMain.VaildUserPassword(data['password']);
    if (isVaild){
        response.message = errorcode[isVaild];
        return res.json(response);
    }

    classUserList.registerMember(data, function(err, result) {
        if(err) {
            response.message = errorcode[err.errCode];
            response.data = err;
            return res.json(response);
        }

        response.status = "Y";
        response.message = "註冊會員成功";
        response.data = result;
        res.json(response);
    });
}

module.exports = register_member;