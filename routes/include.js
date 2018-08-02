module.exports = {
    login: require('../controller/login/login'),
    logout: require('../controller/logout/logout'),
    user_list: require('../controller/users/user_list'),
    get_user_info: require('../controller/users/get_user_info'),
    edit_user_info: require('../controller/users/edit_user_info'),
    register_member: require('../controller/users/register_member'),
    check_New_Member: require('../controller/users/check_New_Member'),
};