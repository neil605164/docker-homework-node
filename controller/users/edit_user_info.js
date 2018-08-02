const classMain = require('../../controller/class/class_Main');
const classUserList = require('../../controller/class/class_UserList');
const errorcode = require('../../common/errorcode');
const urlencode = require('urlencode');

function edit_user_info(req, res) {
    let response = classMain.basicData();
    let data = {};

    if(!req.body.nickname) {
        response.message = errorcode['10009'];
        return res.json(response);
    }

    data.username = req.body.username;
    data.nickname = urlencode(req.body.nickname);
console.log(data)
    classUserList.editUserNickname(data, function(err, result) {
        if(err) {
            response.message = errorcode[err.errCode];
            return res.json(response);
        }
        
        response.status = "Y";
        response.message = "更改暱稱成功";
        res.json(response);
    })
}

module.exports = edit_user_info;