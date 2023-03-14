const mongoose = require('mongoose');


const JobSeekerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Must Provide name"],
        trim: true,
        maxlength: [25, "Name cannot be more than 25 characters"]
    }, email: {
        type: String,
        required: [true, "Must Provide email"],
        trim: true,
        maxlength: [25, "email cannot be more than 25 characters"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Must Provide phone-no"],
        trim: true,
        maxlength: [13, "phone no cannot be more than 25 characters"]
    },
    password: {
        type: String,
        required: [true, "Must Provide password"],
        trim: true,
        maxlength: [125, "password cannot be more than 125 characters"]
    }
})

module.exports = mongoose.model('jobSeeker', JobSeekerSchema);