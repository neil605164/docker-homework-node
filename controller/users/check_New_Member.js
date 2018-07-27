const classMain = require('../../controller/class/class_Main');
const classUserList = require('../../controller/class/class_UserList');
const errorcode = require('../../common/errorcode');

function check_New_Member(req, res) {
    let response = classMain.basicData();
    let username = req.query.username;

    let isVaild = classMain.VaildUserName(username);
    if (isVaild) {
        response.message = errorcode[isVaild];
        return res.json(response);
    }

    classUserList.checkAccountExists(username, function(err, result) {
        if (err) {
            response.message = errorcode[err.errCode];
            return res.json(response);
        }

        response.status = "Y";
        response.message = "該帳號無人使用";
        res.json(response);
    });
}

module.exports = check_New_Member;