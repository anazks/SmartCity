var express = require('express');
var router = express.Router();


//controllers
const { searchByCategory,getpage,forgotpassword, applyJob,getSignupPage, doSignup, getLoginPage, doLogin, getHomePage, logout, searchJob, searchHospital, searchIndustry, searchHotels } = require("../controllers/job-seeker-controller")
const checkJobSeeker = require('../middleware/checkJobSeeker')

router.route('/').get(checkJobSeeker, getHomePage);
router.route('/signup').get(getSignupPage).post(doSignup);
router.route('/login').get(getLoginPage).post(doLogin);
router.route('/logout').get(checkJobSeeker, logout);
router.route('/search-jobs').get(checkJobSeeker, searchJob);
router.route('/search-hospitals').get(checkJobSeeker, searchHospital);
router.route('/search-industries').get(checkJobSeeker, searchIndustry);
router.route('/search-hotels').get(checkJobSeeker, searchHotels);
router.route('/search').post(checkJobSeeker, searchByCategory);
router.route('/applyJob/:mail').get(checkJobSeeker,applyJob)
router.route('/getpage').get(getpage)
router.route('/forgotpassword').post(forgotpassword)
// router.get('/applyJob/:mail',(req,res)=>{
//     console.log(req.params);
// })

module.exports = router;
