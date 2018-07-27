function logout(req, res) {
    // 登出後清除全部的session
    req.session.name   = undefined;
    req.session.status = undefined;
    res.redirect('/login');
}

module.exports = logout;