// 載入User的Class
const classUserList = require('../../controller/class/class_UserList');
const classMain = require('../../controller/class/class_Main');
const errorcode = require('../../common/errorcode');

function user_list(req, res) {
    let response = classMain.basicData();

    classUserList.getUserAccountAndInfo(function(err, result) {
        if (err) {
            response.message = errorcode[err.errCode];
            response.data = err;
            return res.json(response);
        }


        response.status = "Y";
        response.data["DBValue"] = result;
        response.message = "取會員清單成功";

        res.json(response);
    });
};

module.exports = user_list;