const HotelModel = require("../models/hotel-model")
const HospitalModel = require("../models/hospital-model")
const CollegeModel = require("../models/college-model")
const IndustryModel = require("../models/industry-model")
const JobModel = require("../models/job-model")
const TheaterModel = require("../models/theater-model")
const LibraryModel = require("../models/library-model")
const AdminModel = require("../models/admin-model")
const bcrypt = require("bcrypt");
const StudentModel = require("../models/student-model")
const JobSeekerModel = require("../models/job-seeker-model")
const TouristModel = require("../models/tourist-model")
const touristModel = require("../models/touristModel")


//login --------------------------------------------------
const adminLoginPage = async (req, res) => {
    if (req.session.alertMessage) {

        let { alertMessage } = req.session;
        res.render("admin/login", { alertMessage })
        delete req.session.alertMessage
    } else {
        res.render("admin/login")
    }
}
const adminLogin = async (req, res) => {
    try {
        console.log(req.body, req.body.password);
        let { password } = req.body;
        const admin = await AdminModel.findOne({ email: req.body.email });
        if (admin) {
            const exist = await bcrypt.compare(password, admin.password);
            if (exist) {
                req.session.admin = admin;
                return res.redirect("/admin")
            }
        }
        req.session.alertMessage = "Invalid admin Credentials";
        res.redirect("/admin/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/admin/login")
    }
}

const adminDashboard = async (req, res) => {
    let { admin, alertMessage } = req.session;
    try {
        let count = {};
        count.hotel = await HotelModel.count();
        count.hospital = await HospitalModel.count();
        count.college = await CollegeModel.count();
        count.library = await LibraryModel.count();
        count.job = await JobModel.count();
        count.theater = await TheaterModel.count();
        count.library = await LibraryModel.count();
        count.industry = await IndustryModel.count();
        count.student = await StudentModel.count();
        count.jobSeeker = await JobSeekerModel.count();
        count.tourist = await TouristModel.count();
        res.render('admin/01-admin-dashboard', { admin, count, alertMessage })
        delete req.session.alertMessage;

    } catch (error) {
        console.log(error)
    }
}
const adminLogout = async (req, res) => {
    delete req.session.admin;
    req.session.alertMessage = "Logged out successfully";
    res.redirect('/')
}

const viewAllStudents = async (req, res) => {
    try {
        const students = await StudentModel.find({})
        res.render("admin/view-all-students", { students })
    } catch (error) {
        console.log(error)
    }
}


const viewAllTouristplaces = async (req, res) => {
    try {
        const touris = await touristModel.find({})
        res.render("admin/view-all-touristPlaces", { touris })
    } catch (error) {
        console.log(error)
    }
}
const viewAllJobSeekers = async (req, res) => {
    try {
        const jobSeekers = await JobSeekerModel.find({})
        res.render("admin/view-all-job-seekers", { jobSeekers })
    } catch (error) {
        console.log(error)
    }
}
const viewAllTourists = async (req, res) => {
    try {
        const tourists = await TouristModel.find({})
        res.render("admin/view-all-tourists", { tourists })
    } catch (error) {
        console.log(error)
    }
}

//hotel -------------------------------------------------------
const addHotelForm = (req, res) => {
    res.render("admin/add-new-hotel")
}
const addNewHotel = async (req, res) => {
    // console.log(req.files)
    try {
        const hotel = await HotelModel.create(req.body);
        let { image } = req.files;
        image.mv('./public/images/hotels/' + hotel._id + ".jpg").then((err) => {
            if (!err) {
                return res.redirect('/admin/view-all-hotels')
            }
            res.redirect('/admin/add-hotel')
        })
    } catch (error) {
        console.log(error)
    }
}
const viewAllHotel = async (req, res) => {
    try {
        const hotels = await HotelModel.find({})
        res.render("admin/view-all-hotels", { hotels })
    } catch (error) {
        console.log(error)
    }
}
const deleteHotel = async (req, res) => {
    try {
        let { id } = req.params;
        let hotel = await HotelModel.findOneAndDelete({ _id: id })
        res.redirect('/admin/view-all-hotels')
    } catch (error) {
        console.log(error)
    }
}
const editHotelForm = async (req, res) => {
    console.log(req.params)
    try {
        let { id } = req.params;
        let hotel = await HotelModel.findOne({ _id: id })
        res.render("admin/edit-hotel", { hotel })
    } catch (error) {
        console.log(error)
    }
}
const editHotel = async (req, res) => {
    try {
        let { id } = req.params;
        let hotel = await HotelModel.findOneAndUpdate({ _id: id }, req.body)
        // console.log(req.files)
        if (req.files) {
            let image = req.files.image;
            image.mv('./public/images/hotels/' + hotel._id + ".jpg").then((err) => {
                if (!err) {
                    return res.redirect('/admin/view-all-hotels')
                } else console.log(err)
            })
        }
        res.redirect('/admin/view-all-hotels')
    } catch (error) {
        console.log(error)
    }
}

//Hospital -------------------------------------
const addHospitalForm = (req, res) => {
    res.render("admin/add-new-hospital")
}
const addNewHospital = async (req, res) => {
    console.log(req.body)
    try {
        const hospital = await HospitalModel.create(req.body);
        let { image } = req.files;
        image.mv('./public/images/hospital/' + hospital._id + ".jpg").then((err) => {
            if (!err) {
                return res.redirect('/admin/view-all-hospitals')
            }
            res.redirect('/admin/add-hospital')
        })
    } catch (error) {
        console.log(error)
    }
}
const viewAllHospital = async (req, res) => {
    try {
        const hospitals = await HospitalModel.find({})
        res.render("admin/view-all-hospitals", { hospitals })
    } catch (error) {
        console.log(error)
    }
}
const deleteHospital = async (req, res) => {
    try {
        let { id } = req.params;
        let hospital = await HospitalModel.findOneAndDelete({ _id: id })
        res.redirect('/admin/view-all-hospitals')
    } catch (error) {
        console.log(error)
    }
}
const editHospitalForm = async (req, res) => {
    console.log(req.params)
    try {
        let { id } = req.params;
        let hospital = await HospitalModel.findOne({ _id: id })
        res.render("admin/edit-hospital", { hospital })
    } catch (error) {
        console.log(error)
    }
}
const editHospital = async (req, res) => {
    try {
        let { id } = req.params;
        let hospital = await HospitalModel.findOneAndUpdate({ _id: id }, req.body)
        // console.log(req.files)
        if (req.files) {
            let { image } = req.files;
            image.mv('./public/images/hospital/' + hospital._id + ".jpg").then((err) => {
                if (!err) {
                    return res.redirect('/admin/view-all-hospitals')
                } else console.log(err)
            })
        }
        res.redirect('/admin/view-all-hospitals')
    } catch (error) {
        console.log(error)
    }
}

//College-------------------------------------------------

const addCollegeForm = (req, res) => {
    res.render("admin/add-new-college")
}
const addNewCollege = async (req, res) => {
    // console.log(req.body)
    try {
        const college = await CollegeModel.create(req.body);
        let { image } = req.files;
        image.mv('./public/images/college/' + college._id + ".jpg").then((err) => {
            if (!err) {
                return res.redirect('/admin/view-all-colleges')
            }
            res.redirect('/admin/add-college')
        })
    } catch (error) {
        console.log(error)
    }
}
const viewAllColleges = async (req, res) => {
    try {
        const colleges = await CollegeModel.find({})
        res.render("admin/view-all-colleges", { colleges })
    } catch (error) {
        console.log(error)
    }
}
const deleteCollege = async (req, res) => {
    try {
        let { id } = req.params;
        let college = await CollegeModel.findOneAndDelete({ _id: id })
        res.redirect('/admin/view-all-colleges')
    } catch (error) {
        console.log(error)
    }
}
const editCollegeForm = async (req, res) => {
    console.log(req.params)
    try {
        let { id } = req.params;
        let college = await CollegeModel.findOne({ _id: id })
        res.render("admin/edit-college", { college })
    } catch (error) {
        console.log(error)
    }
}
const editCollege = async (req, res) => {
    try {
        let { id } = req.params;
        let college = await CollegeModel.findOneAndUpdate({ _id: id }, req.body)
        // console.log(req.files)
        if (req.files) {
            let { image } = req.files;
            image.mv('./public/images/college/' + college._id + ".jpg").then((err) => {
                if (!err) {
                    return res.redirect('/admin/view-all-colleges')
                } else console.log(err)
            })
        }
        res.redirect('/admin/view-all-colleges')
    } catch (error) {
        console.log(error)
    }
}

//Job -------------------------------------------------------

const addJobForm = async (req, res) => {
    res.render("admin/add-new-job")
}
const addNewJob = async (req, res) => {
    // console.log(req.body)
    try {
        const job = await JobModel.create(req.body);
        res.redirect('/admin/view-all-jobs')
    } catch (error) {
        console.log(error)
    }
}
const viewAllJobs = async (req, res) => {
    try {
        const jobs = await JobModel.find({})
        res.render("admin/view-all-jobs", { jobs })
    } catch (error) {
        console.log(error)
    }
}
const deleteJob = async (req, res) => {
    try {
        let { id } = req.params;
        let job = await JobModel.findOneAndDelete({ _id: id })
        res.redirect('/admin/view-all-jobs')
    } catch (error) {
        console.log(error)
    }
}
const editJobForm = async (req, res) => {
    console.log(req.params)
    try {
        let { id } = req.params;
        let job = await JobModel.findOne({ _id: id })
        res.render("admin/edit-job", { job })
    } catch (error) {
        console.log(error)
    }
}
const editJob = async (req, res) => {
    try {
        let { id } = req.params;
        let job = await JobModel.findOneAndUpdate({ _id: id }, req.body)
        res.redirect('/admin/view-all-jobs')
    } catch (error) {
        console.log(error)
    }
}
//Industries ---------------------------------------------
const addIndustryForm = (req, res) => {
    res.render("admin/add-new-industry")
}
const addNewIndustry = async (req, res) => {
    // console.log(req.body)
    try {
        const industry = await IndustryModel.create(req.body);
        let { image } = req.files;
        image.mv('./public/images/industry/' + industry._id + ".jpg").then((err) => {
            if (!err) {
                return res.redirect('/admin/view-all-industries')
            }
            res.redirect('/admin/add-industry')
        })
    } catch (error) {
        console.log(error)
    }
}
const viewAllIndustries = async (req, res) => {
    try {
        const industries = await IndustryModel.find({})
        res.render("admin/view-all-industries", { industries })
    } catch (error) {
        console.log(error)
    }
}
const deleteIndustry = async (req, res) => {
    try {
        let { id } = req.params;
        let industry = await IndustryModel.findOneAndDelete({ _id: id })
        res.redirect('/admin/view-all-industries')
    } catch (error) {
        console.log(error)
    }
}
const editIndustryForm = async (req, res) => {
    console.log(req.params)
    try {
        let { id } = req.params;
        let industry = await IndustryModel.findOne({ _id: id })
        res.render("admin/edit-industry", { industry })
    } catch (error) {
        console.log(error)
    }
}
const editIndustry = async (req, res) => {
    try {
        let { id } = req.params;
        let industry = await IndustryModel.findOneAndUpdate({ _id: id }, req.body)
        // console.log(req.files)
        if (req.files) {
            let { image } = req.files;
            image.mv('./public/images/industry/' + industry._id + ".jpg").then((err) => {
                if (!err) {
                    return res.redirect('/admin/view-all-industries')
                } else console.log(err)
            })
        }
        res.redirect('/admin/view-all-industries')
    } catch (error) {
        console.log(error)
    }
}


//Theater -------------------------------------------------------
const addTheaterForm = async (req, res) => {
    res.render("admin/add-new-theater")
}
const addNewTheater = async (req, res) => {
    // console.log(req.body)
    try {
        const theater = await TheaterModel.create(req.body);
        let { image } = req.files;
        image.mv('./public/images/theater/' + theater._id + ".jpg").then((err) => {
            if (!err) {
                return res.redirect('/admin/view-all-theaters')
            }
            res.redirect('/admin/add-theater')
        })
    } catch (error) {
        console.log(error)
    }
}
const viewAllTheaters = async (req, res) => {
    try {
        const theaters = await TheaterModel.find({})
        res.render("admin/view-all-theaters", { theaters })
    } catch (error) {
        console.log(error)
    }
}
const getTourist = async(req,res)=>{
    try {
        res.render('admin/add-new-tourist-place')
    } catch (error) {
        console.log(error)
    }
}
const deleteTheater = async (req, res) => {
    try {
        let { id } = req.params;
        let theater = await TheaterModel.findOneAndDelete({ _id: id })
        res.redirect('/admin/view-all-theaters')
    } catch (error) {
        console.log(error)
    }
}
const editTheaterForm = async (req, res) => {
    console.log(req.params)
    try {
        let { id } = req.params;
        let theater = await TheaterModel.findOne({ _id: id })
        res.render("admin/edit-theater", { theater })
    } catch (error) {
        console.log(error)
    }
}
const editTheater = async (req, res) => {
    try {
        let { id } = req.params;
        let theater = await TheaterModel.findOneAndUpdate({ _id: id }, req.body)
        // console.log(req.files)
        if (req.files) {
            let { image } = req.files;
            image.mv('./public/images/theater/' + theater._id + ".jpg").then((err) => {
                if (!err) {
                    return res.redirect('/admin/view-all-theaters')
                } else console.log(err)
            })
        }
        res.redirect('/admin/view-all-theaters')
    } catch (error) {
        console.log(error)
    }
}

//Library --------------------------------------
const addLibraryForm = async (req, res) => {
    res.render("admin/add-new-library")
}
const addNewLibrary = async (req, res) => {
    // console.log(req.body)
    try {
        const library = await LibraryModel.create(req.body);
        let { image } = req.files;
        image.mv('./public/images/library/' + library._id + ".jpg").then((err) => {
            if (!err) {
                return res.redirect('/admin/view-all-libraries')
            }
            res.redirect('/admin/add-library')
        })
    } catch (error) {
        console.log(error)
    }
}
const viewAllLibraries = async (req, res) => {
    try {
        const libraries = await LibraryModel.find({})
        res.render("admin/view-all-libraries", { libraries })
    } catch (error) {
        console.log(error)
    }
}
const deleteLibrary = async (req, res) => {
    try {
        let { id } = req.params;
        let library = await LibraryModel.findOneAndDelete({ _id: id })
        res.redirect('/admin/view-all-libraries')
    } catch (error) {
        console.log(error)
    }
}
const editLibraryForm = async (req, res) => {
    console.log(req.params)
    try {
        let { id } = req.params;
        let library = await LibraryModel.findOne({ _id: id })
        res.render("admin/edit-library", { library })
    } catch (error) {
        console.log(error)
    }
}
const editLibrary = async (req, res) => {
    try {
        let { id } = req.params;
        let library = await LibraryModel.findOneAndUpdate({ _id: id }, req.body)
        // console.log(req.files)
        if (req.files) {
            let { image } = req.files;
            image.mv('./public/images/library/' + library._id + ".jpg").then((err) => {
                if (!err) {
                    return res.redirect('/admin/view-all-libraries')
                } else console.log(err)
            })
        }
        res.redirect('/admin/view-all-libraries')
    } catch (error) {
        console.log(error)
    }
}
const addTourist = async(req,res)=>{
    console.log(req.body)
    try {
        const turistPlace = await touristModel.create(req.body);
        let { image } = req.files;
        image.mv('./public/images/Turistmodel/' + turistPlace._id + ".jpg").then((err) => {
            if (!err) {
                return res.redirect('/admin/')
            }
            res.redirect('/admin/')
        })
    } catch (error) {
        console.log(error)
    }
}
//TravelAgency --------------------------------------
const addTravelAgencyForm = async (req, res) => {
    res.render("admin/add-new-agency")
}
const addNewTravelAgency = async (req, res) => {
    res.send("route is live")
}
const viewAllTravelAgencies = async (req, res) => {
    res.send("route is live")
}
const deleteTravelAgency = async (req, res) => {
    res.send("route is live")
}
const editTravelAgencyForm = async (req, res) => {
    res.send("route is live")
}
const editTravelAgency = async (req, res) => {
    res.send("route is live")
}

const addDocs =(req,res)=>{
    try {
                res.render("admin/addDocs")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addDocs,
    getTourist,
    addTourist,
    adminLoginPage,
    adminLogin,
    adminDashboard,
    adminLogout,

    addJobForm,
    addNewJob,
    viewAllJobs,
    deleteJob,
    editJobForm,
    editJob,
    addHotelForm,
    addNewHotel,
    viewAllHotel,
    deleteHotel,
    editHotelForm,
    editHotel,
    addHospitalForm,
    addNewHospital,
    viewAllHospital,
    deleteHospital,
    editHospitalForm,
    editHospital,
    addCollegeForm,
    addNewCollege,
    viewAllColleges,
    deleteCollege,
    editCollegeForm,
    editCollege,
    addIndustryForm,
    addNewIndustry,
    viewAllIndustries,
    deleteIndustry,
    editIndustryForm,
    editIndustry,
    addLibraryForm,
    addNewLibrary,
    viewAllLibraries,
    deleteLibrary,
    editLibraryForm,
    editLibrary,
    addTheaterForm,
    addNewTheater,
    viewAllTheaters,
    deleteTheater,
    editTheaterForm,
    editTheater,
    addTravelAgencyForm,
    addNewTravelAgency,
    viewAllTravelAgencies,
    deleteTravelAgency,
    editTravelAgencyForm,
    editTravelAgency,
    viewAllStudents,
    viewAllJobSeekers,
    viewAllTourists,
    viewAllTouristplaces
}