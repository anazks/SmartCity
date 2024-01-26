const bcrypt = require("bcrypt");
const jobSeekerModel = require("../models/job-seeker-model");
const JobModel = require("../models/job-model");
const HospitalModel = require("../models/hospital-model");
const IndustryModel = require("../models/industry-model");
const HotelModel = require("../models/hotel-model");
let nodemailer = require('nodemailer');

const getSignupPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("job-seeker/signup", { alertMessage });
    delete req.session.alertMessage;
}
const doSignup = async (req, res) => {
    // console.log(req.body);
    try {
        let oldpassword = req.body.password;
        req.body.password = await bcrypt.hash(oldpassword, 10); //encrypting the password from jobSeeker and adding it to the req.body object
        // console.log(req.body);
        const jobSeeker = await jobSeekerModel.create(req.body);
        req.session.alertMessage = "Signup Comlpleted successfully"
        res.status(201).redirect("/job-seeker/login")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error in creating New Job seeker. Retry !!!!!";
        res.redirect("/job-seeker/signup")
    }
}

const getLoginPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("job-seeker/login", { alertMessage })
    delete req.session.alertMessage;
}
const doLogin = async (req, res) => {
    try {
        // console.log(req.body, req.body.password);
        let { password } = req.body;
        const jobSeeker = await jobSeekerModel.findOne({ email: req.body.email });
        if (jobSeeker) {
            const exist = await bcrypt.compare(password, jobSeeker.password);
            if (exist) {
                req.session.jobSeeker = jobSeeker;
                req.session.alertMessage = "Logged In successfully";
                return res.redirect("/job-seeker")
            }
        }
        req.session.alertMessage = "Invalid job seeker Credentials";
        res.redirect("/job-seeker/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/job-seeker/login")
    }
}
//home page
const getHomePage = function (req, res, next) {
    let { alertMessage } = req.session;
    if (req.session.jobSeeker) {
        let { jobSeeker } = req.session; //fetching jobSeeker and alert message stored in session
        res.render("job-seeker/home-page", { title: 'Smart city', jobSeeker, alertMessage });
        delete req.session.alertMessage;
    } else {
        res.render("job-seeker/home-page", { title: 'Smart city', alertMessage });
        delete req.session.alertMessage;
    }
}


const applyJob = async(req,res)=>{
    let companyMail = req.params.mail;
    console.log("mailing to comapny",req.params)
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
          user:'ecommercetest246@gmail.com',
          pass:'iftgqrcgrduigxuk'
        },
        tls:{
          rejectUnauthorized:false,
        },
      })
      let mailOption  = {
        from:"Smart City Team",
        to:companyMail,
        subject:"Job Application",
        text:`${req.session.jobSeeker.username}  is showing interest in the job that you recently posted. contact candidates on ${req.session.jobSeeker.phone}`,
      };
      transporter.sendMail(mailOption,function(err,info){
        if(err){
          console.log(err)
        }else{
          console.log("emailsent Succecfully")
          res.redirect('/job-seeker')
        }
      })
}
//logout
const logout = (req, res) => {
    req.session.jobSeeker = null;
    req.session.alertMessage = "Logged Out Successfully!!!"
    res.redirect("/")
}
const getpage = (req,res)=>{
    res.render('job-seeker/for-got-password')
}
const searchJob = async (req, res) => {
    let jobs = await JobModel.find({})
    if (jobs.length == 0) { jobs = false; }
    res.render("job-seeker/view-jobs", { jobs })
}
const searchHospital = async (req, res) => {
    let hospitals = await HospitalModel.find({})
    if (hospitals.length == 0) { hospitals = false; }
    res.render("job-seeker/view-hospitals", { hospitals })
}
const searchIndustry = async (req, res) => {
    let industry = await IndustryModel.find({})
    if (industry.length == 0) { industry = false; }
    res.render("job-seeker/view-industry", { industry })
}
const searchHotels = async (req, res) => {
    let hotels = await HotelModel.find({})
    if (hotels.length == 0) { hotels = false; }
    res.render("job-seeker/view-hotels", { hotels })
}
const forgotpassword = async (req,res)=>{
    let {email} = req.body;
    let {password} = req.body;
   try {
        let user = await jobSeekerModel.find({email:email});
        if(user.length>0){
            console.log(user,"----------")
            let userID = user[0]._id;
            console.log(userID)
            newpasswords = await bcrypt.hash(password, 10); 
            let newPasswordUpdate = await jobSeekerModel.findOneAndUpdate({ _id: userID }, {$set :{password:newpasswords}})
            let alert = "Password changer successfully!!.."
            res.render('job-seeker/for-got-password',{alert})
        }else{
            let alert = "Wrong Email"
            res.render('job-seeker/for-got-password',{alert})
        }
   } catch (error) {
            console.log(error)
   }
}
const searchByCategory = async (req, res) => {
    console.log(req.body)
    let { category, content } = req.body;
    switch (category) {
        case 'industries':
            let industry = await IndustryModel.find({ industryName: { $regex: content, $options: 'i' } })
            console.log(industry)
            if (industry.length == 0) { industry = false; }
            return res.render("job-seeker/view-industry", { industry })
            break;
        case 'hotels':
            let hotels = await HotelModel.find({ hotelName: { $regex: content, $options: 'i' } })
            console.log(hotels)
            if (hotels.length == 0) { hotels = false; }
            return res.render("job-seeker/view-hotels", { hotels })
            break;
        case 'jobs':
            let jobs = await JobModel.find({ jobName: { $regex: content, $options: 'i' } })
            console.log(jobs)
            if (jobs.length == 0) { jobs = false; }
            return res.render("job-seeker/view-jobs", { jobs })
            break;
        case 'hospitals':
            let hospitals = await HospitalModel.find({ hospitalName: { $regex: content, $options: 'i' } })
            console.log(hospitals)
            if (hospitals.length == 0) { hospitals = false; }
            return res.render("job-seeker/view-hospitals", { hospitals })
            break;
        default:
            req.session.alertMessage = "No results Found";
            res.redirect('/')

    }
}




module.exports = { searchByCategory,forgotpassword, getpage,getSignupPage,applyJob, doSignup, getLoginPage, doLogin, getHomePage, logout, searchJob, searchHospital, searchIndustry, searchHotels }