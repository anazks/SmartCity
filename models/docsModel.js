const mongoose = require('mongoose');


const DocsScema = new mongoose.Schema({
    DocsName: {
        type: String,
        required: [true, "Must Provide DocsName"],
        trim: true,
        maxlength: [65, "Name cannot be more than 25 characters"]
    }, description: {
        type: String,
        required: [true, "Must Provide description"],
        trim: true,
    },
    subject: {
        type: String,
        required: [true, "Must Provide phone-no"],
        trim: true,
    },

})

module.exports = mongoose.model('DocsScema', DocsScema);