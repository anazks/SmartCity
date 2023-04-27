const bcrypt = require("bcrypt");
const TouristModel = require("../models/tourist-model");
const HospitalModel = require("../models/hospital-model");
const HotelModel = require("../models/hotel-model")
const TheaterModel = require("../models/theater-model")
const LibraryModel = require("../models/library-model");
const touristPlaceModel = require("../models/touristModel");
const touristModel = require("../models/tourist-model");



const getSignupPage = (req, res) => {
    let alertMessage = req.session.alertMessage
    res.render("tourist/signup", { alertMessage });
    delete req.session.alertMessage;
}
const doSignup = async (req, res) => {
    // console.log(req.body);
    try {
        let oldpassword = req.body.password;
        req.body.password = await bcrypt.hash(oldpassword, 10); //encrypting the password from tourist and adding it to the req.body object
        // console.log(req.body);
        const tourist = await TouristModel.create(req.body);
        req.session.alertMessage = "Signup Comlpleted successfully"
        res.status(201).redirect("/tourist/login")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error in creating New Tourist. Retry !!!!!";
        res.redirect("/tourist/signup")
    }
}

const getLoginPage = (req, res) => {
    if (req.session.tourist) {
        res.redirect("/tourist")
    } else {
        let alertMessage = req.session.alertMessage
        res.render("tourist/login", { alertMessage })
        delete req.session.alertMessage;
    }
}
const getplace = async(req,res)=>{
    try {
        let places = await touristPlaceModel.find();
        console.log(places,"places-----------------")
            res.render('tourist/view-places',{places})
    } catch (error) {
        
    }
}
const doLogin = async (req, res) => {
    try {
        // console.log(req.body, req.body.password);
        let { password } = req.body;
        const tourist = await TouristModel.findOne({ email: req.body.email });
        if (tourist) {
            const exist = await bcrypt.compare(password, tourist.password);
            if (exist) {
                req.session.tourist = tourist;
                req.session.alertMessage = "Logged In successfully";
                return res.redirect("/tourist")
            }
        }
        req.session.alertMessage = "Invalid Tourist Credentials";
        res.redirect("/tourist/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/tourist/login")
    }
}
//home page
const getHomePage = function (req, res, next) {
    let { alertMessage } = req.session;
    if (req.session.tourist) {
        let { tourist } = req.session; //fetching tourist and alert message stored in session
        res.render("tourist/home-page", { title: 'Smart city', tourist, alertMessage });
        delete req.session.alertMessage;
    } else {
        res.render("tourist/home-page", { title: 'Smart city', alertMessage });
        delete req.session.alertMessage;
    }
}

const forGotPage = function (req, res, next) {
        try {
                res.render('tourist/for-got-password')
        } catch (error) {
            console.log(error)  
        }
}
//logout
const logout = (req, res) => {
    req.session.tourist = null;
    req.session.alertMessage = "Logged Out Successfully!!!"
    res.redirect("/")
}
const searchHotel = async (req, res) => {
    let hotels = await HotelModel.find({})
    if (hotels.length == 0) { hotels = false; }
    res.render("tourist/view-hotels", { hotels })
}
const searchHospital = async (req, res) => {
    let hospitals = await HospitalModel.find({})
    if (hospitals.length == 0) { hospitals = false; }
    res.render("tourist/view-hospitals", { hospitals })
}
const searchTheater = async (req, res) => {
    let theaters = await TheaterModel.find({})
    if (theaters.length == 0) { theaters = false; }
    res.render("tourist/view-theaters", { theaters })
}
const searchLibrary = async (req, res) => {
    let libraries = await LibraryModel.find({})
    if (libraries.length == 0) { libraries = false; }
    res.render("tourist/view-libraries", { libraries })
}
 const newPassword = async (req, res) => {
    let {email} = req.body;
    let {password} = req.body;
   try {
        let user = await touristModel.find({email:email});
        if(user.length>0){
            console.log(user,"----------")
            let userID = user[0]._id;
            console.log(userID)
            newpasswords = await bcrypt.hash(password, 10); 
            let newPasswordUpdate = await touristModel.findOneAndUpdate({ _id: userID }, {$set :{password:newpasswords}})
            let alert = "Password changer successfully!!.."
            res.render('tourist/for-got-password',{alert})
        }else{
            let alert = "Wrong Email"
            res.render('tourist/for-got-password',{alert})
        }
   } catch (error) {
            console.log(error)
   }
}
const searchByCategory = async (req, res) => {
    console.log(req.body)
    let { category, content } = req.body;
    switch (category) {
        case 'libraries':
            let libraries = await LibraryModel.find({ libraryName: { $regex: content, $options: 'i' } })
            console.log(libraries)
            if (libraries.length == 0) { libraries = false; }
            return res.render("tourist/view-libraries", { libraries })
            break;
        case 'theaters':
            let theaters = await TheaterModel.find({ theaterName: { $regex: content, $options: 'i' } })
            console.log(theaters)
            if (theaters.length == 0) { theaters = false; }
            return res.render("tourist/view-theaters", { theaters })
            break;
        case 'hotels':
            let hotels = await HotelModel.find({ hotelName: { $regex: content, $options: 'i' } })
            console.log(hotels)
            if (hotels.length == 0) { hotels = false; }
            return res.render("tourist/view-hotels", { hotels })
            break;
        case 'hospitals':
            let hospitals = await HospitalModel.find({ hospitalName: { $regex: content, $options: 'i' } })
            console.log(hospitals)
            if (hospitals.length == 0) { hospitals = false; }
            return res.render("tourist/view-hospitals", { hospitals })
            break;
        default:
            req.session.alertMessage = "No results Found";
            res.redirect('/')
    }
}




module.exports = { forGotPage,newPassword,searchByCategory,getplace, getSignupPage, doSignup, getLoginPage, doLogin, getHomePage, logout, searchHotel, searchHospital, searchTheater, searchLibrary }