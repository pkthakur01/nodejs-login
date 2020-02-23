const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

let UserSchema = new Schema({

    userId: { type: String, required: true, index: { unique: true } },
    emailId: String,
    mobile: { type: String, required: true, index: { unique: true } },
    userName: String,
    password : String,
    registerDate: String,
    updateDate : String


});
module.exports = mongoose.model("users", UserSchema);
