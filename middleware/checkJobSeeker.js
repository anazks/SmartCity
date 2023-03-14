const checkJobSeeker = function (req, res, next) {
    if (!req.session.jobSeeker) {
        req.session.alertMessage = "Please Login to Continue"
        res.redirect('/job-seeker/login');
    } else {
        next();
    }
}

module.exports = checkJobSeeker;