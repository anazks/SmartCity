const mongoose = require('mongoose');


const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Must Provide email"],
        trim: true,
        maxlength: [25, "email cannot be more than 25 characters"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Must Provide email"],
        trim: true,
    }
})

module.exports = mongoose.model('Admin', AdminSchema);