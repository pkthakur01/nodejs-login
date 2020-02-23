const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
var url = require('../db/mongoclientconnection').url
console.log("Connected to db successfully- "+ url);
let conn;
mongoose.connect(url,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
conn = mongoose.connection
module.exports = conn;

