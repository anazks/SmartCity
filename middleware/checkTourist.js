const checkTourist = function (req, res, next) {
    if (!req.session.tourist) {
        req.session.alertMessage = "Please Login to Continue"
        res.redirect('/tourist/login');
    } else {
        next();
    }
}

module.exports = checkTourist;