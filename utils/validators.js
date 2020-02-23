//mobile number validation returns true or false
const crypto = require("crypto");

function validateMobileNo(mob) {
    if (/^([+][9][1]\d{10})?$/.test(mob)) {
        return true;
    } else {
        return false
    }
}

//email ID validation returns true or false
function validateEmail(email){
    if(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return true;
    }
    else{
        return false;
    }
}

//date format validation
function validateDate(date){
    if(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(date)){
        return true;
    }
    else{
        return false;
    }
}


//generating random number in the range
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
// generating otp for verifiation
function generateOTP(length){
    var otp = crypto.randomBytes(length).toString('hex');
    return otp;
}

//calculating price for each trip


exports.validateMobileNo = validateMobileNo;
exports.validateEmail = validateEmail;
exports.validateDate = validateDate;
exports.generateRandomNumber = generateRandomNumber;
exports.generateOTP= generateOTP;


