const classMain = require('../../controller/class/class_Main');
const classUserList = require('../../controller/class/class_UserList');
const errorcode = require('../../common/errorcode');
const urlencode = require('urlencode');

function get_user_info(req, res) {
    let response = classMain.basicData();
    let data = {};

    data.username = req.query.username;

    classUserList.getUserInfo(data, function(err, result) {
        if (err) {
            response.message = errorcode[err.errCode];
            return res.json(response);
        }

        response.status = "Y";
        response.message = "取會員詳細資料成功";
        response.data = result;
        res.json(response);
    });
}

module.exports = get_user_info;