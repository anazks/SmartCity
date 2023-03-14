const mongoose = require("mongoose")
let url = "mongodb+srv://anazks:123@cluster0.jxpil.mongodb.net/smartNew?retryWrites=true&w=majority"
const connectDB = () => {
    return mongoose.connect(url)
}

module.exports = connectDB;