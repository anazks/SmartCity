const checkAdmin = function (req, res, next) {
    if (!req.session.admin) {
        req.session.alertMessage = "Please Login to Continue"
        res.redirect('/admin/login');
    } else {
        next();
    }
}

module.exports = checkAdmin;