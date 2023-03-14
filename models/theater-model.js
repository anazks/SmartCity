const mongoose = require('mongoose');


const TheaterSchema = new mongoose.Schema({
    theaterName: {
        type: String,
        required: [true, "Must Provide name"],
        trim: true,
        maxlength: [100, "Name cannot be more than 25 characters"]
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
    description: {
        type: String,
        required: [true, "Must Provide password"],
        trim: true,
    },
    place: {
        type: String,
        required: [true, "Must Provide place"],
        trim: true,
        maxlength: [125, "password cannot be more than 125 characters"]
    },
    showTimes: String,
    totalSeats: String,
    minPrice: String,
})

module.exports = mongoose.model('theater', TheaterSchema);