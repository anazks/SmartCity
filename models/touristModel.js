const mongoose = require('mongoose');


const TouristPlace = new mongoose.Schema({
    place: {
        type: String,
        required: [true, "Must Provide name"],
        trim: true,
        maxlength: [25, "Name cannot be more than 25 characters"]
    },
     Price: {
        type: String,
        required: [true, "Must Provide email"],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Must Provide phone-no"],
        trim: true,
        maxlength: [13, "phone no cannot be more than 25 characters"]
    },
    guidName: {
        type: String,
        required: [true, "Must Provide password"],
        trim: true,
        maxlength: [125, "password cannot be more than 125 characters"]
    }
})

module.exports = mongoose.model('TouristPlace', TouristPlace);