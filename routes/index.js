var express = require('express');
var router = express.Router();

const include = require('./include');

// 任何功能，無論Get or Post，都會先進入"/"
// 登入驗證功能
router.use(function(req, res, next){
  let session_status = false;
  let api_token = '';

  if(req.session.status) {
      session_status = req.session.status;
  }

  if(req.query.api_token) {
      api_token = req.query.api_token;
  }

  if(req.body.api_token) {
      api_token = req.body.api_token;
  }

  if(api_token == 'ji3vu;31j62l4' && (req.ip == '::ffff:127.0.0.1' || req.ip === '::1')) {
      return next();
  }

  if(req.path != '/login' && session_status === false) {
      return res.redirect('/login');
  }
  next();
});

// 首頁
router.get('/', function(req, res) {res.render('user_list');});
// 登入頁面
router.get('/login', function(req, res) {res.render('login');});
// 登入功能
router.post('/login', include.login);
// 登出功能(清除 cookie)
router.get('/logout', include.logout);
// 註冊會員時，檢查該會員是否已存在
router.get('/check_New_Member', include.check_New_Member);
// 註冊會員
router.post('/register_member', include.register_member);
// 顯示「會員清單」+ 「模糊搜尋」功能
router.get('/user_list', include.user_list);
// 取得用戶資料
router. get('/get_user_info', include.get_user_info);
// 編輯用戶資料
router. post('/edit_user_info', include.edit_user_info);
// 顯示「會員首頁」
router.get('/users', function(req, res) {res.render('user_list');});


module.exports = router;

