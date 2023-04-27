const bcrypt = require("bcrypt");
const StudentModel = require("../models/student-model");
const LibraryModel = require("../models/library-model");
const CollegeModel = require("../models/college-model");
const HospitalModel = require("../models/hospital-model");
let nodemailer = require('nodemailer');
const studentModel = require("../models/student-model");


const getSignupPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("student/signup", { alertMessage });
    delete req.session.alertMessage;
}
const doSignup = async (req, res) => {
    // console.log(req.body);
    try {
        let oldpassword = req.body.password;
        req.body.password = await bcrypt.hash(oldpassword, 10); //encrypting the password from student and adding it to the req.body object
        // console.log(req.body);
        const student = await StudentModel.create(req.body);
        req.session.alertMessage = "Signup Comlpleted successfully"
        res.status(201).redirect("/login")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error in creating New student. Retry !!!!!";
        res.redirect("/signup")
    }
}

const getLoginPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("student/login", { alertMessage })
    delete req.session.alertMessage;
}
const doLogin = async (req, res) => {
    try {
        // console.log(req.body, req.body.password);
        let { password } = req.body;
        const student = await StudentModel.findOne({ email: req.body.email });
        if (student) {
            const exist = await bcrypt.compare(password, student.password);
            if (exist) {
                req.session.student = student;
                req.session.alertMessage = "Logged In successfully";
                return res.redirect("/")
            }
        }
        req.session.alertMessage = "Invalid student Credentials";
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/login")
    }
}
//home page
const getHomePage = function (req, res, next) {
    let { alertMessage } = req.session;
    if (req.session.student) {
        let { student } = req.session; //fetching student and alert message stored in session
        res.render('student/home-page', { title: 'Smart city', student, alertMessage });
        delete req.session.alertMessage;
    } else {
        res.render('home-page', { title: 'Smart city', alertMessage });
        delete req.session.alertMessage;
    }
}
//logout
const logout = (req, res) => {
    req.session.student = null;
    req.session.alertMessage = "Logged Out Successfully!!!"
    res.redirect("/")
}
const getpage = (req,res)=>{
    res.render('student/for-got-password')
}
const searchLibrary = async (req, res) => {
    let libraries = await LibraryModel.find({})
    if (libraries.length == 0) { libraries = false; }
    res.render("student/view-libraries", { libraries })
}

const searchColleges = async (req, res) => {
    let colleges = await CollegeModel.find({})
    if (colleges.length == 0) { colleges = false; }
    res.render("student/view-colleges", { colleges })
}
const searchHosptals = async (req, res) => {
    let hospitals = await HospitalModel.find({})
    if (hospitals.length == 0) { hospitals = false; }
    res.render("student/view-hospitals", { hospitals })
}
const forgotpassword= async(req,res)=>{
    let {email} = req.body;
    let {password} = req.body;
   try {
        let user = await studentModel.find({email:email});
        if(user.length>0){
            console.log(user,"----------")
            let userID = user[0]._id;
            console.log(userID)
            newpasswords = await bcrypt.hash(password, 10); 
            let newPasswordUpdate = await studentModel.findOneAndUpdate({ _id: userID }, {$set :{password:newpasswords}})
            let alert = "Password changer successfully!!.."
            res.render('student/for-got-password',{alert})
        }else{
            let alert = "Wrong Email"
            res.render('student/for-got-password',{alert})
        }
   } catch (error) {
            console.log(error)
   }
}
const searchByCategory = async (req, res) => {
    console.log(req.body)
    let { category, content } = req.body;
    switch (category) {
        case 'colleges':
            let colleges = await CollegeModel.find({ collegeName: { $regex: content, $options: 'i' } })
            console.log(colleges)
            if (colleges.length == 0) { colleges = false; }
            return res.render("student/view-colleges", { colleges })
            break;
        case 'libraries':
            let libraries = await LibraryModel.find({ libraryName: { $regex: content, $options: 'i' } })
            console.log(libraries)
            if (libraries.length == 0) { libraries = false; }
            return res.render("student/view-libraries", { libraries })
            break;
        case 'hospitals':
            let hospitals = await HospitalModel.find({ hospitalName: { $regex: content, $options: 'i' } })
            console.log(hospitals)
            if (hospitals.length == 0) { hospitals = false; }
            return res.render("student/view-hospitals", { hospitals })
            break;
        default:
            req.session.alertMessage = "No results Found";
            res.redirect('/')

    }

}



module.exports = { searchByCategory,forgotpassword, getpage,getSignupPage, doSignup, getLoginPage, doLogin, getHomePage, logout, searchLibrary, searchColleges, searchHosptals }