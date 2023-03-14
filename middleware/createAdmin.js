const AdminModel = require("../models/admin-model");
const bcrypt = require("bcrypt");

module.exports.createAdmin = async (req, res, next) => {
    let admin = await AdminModel.find({});
    if (admin.length == 0) {
        let password = await bcrypt.hash("admin", 10);
        let adminObj = {
            email: "admin@gmail.com",
            password
        }
        await AdminModel.create(adminObj)
        console.log("admin created")
        next();
    } else next();
}