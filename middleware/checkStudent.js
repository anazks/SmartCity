const checkStudent = function (req, res, next) {
    if (!req.session.student) {
        req.session.alertMessage = "Please Login to Continue"
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = checkStudent;