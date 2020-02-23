const express = require("express");
const router = express.Router();
const utils = require('../utils/validators');
const UserDb = require("../db/userdb");
const jwtToken = require('../utils/jwttoken');
const jwtconfig = require('../config/jwt_config.json');
const UserSchema = require("../models/users");
const log4js = require('log4js');
var moment = require("moment");
const logger = log4js.getLogger('UserLog');
const bcrypt = require('bcrypt');
		

//sendphoneotp to send the otp to the phone number
router.post("/registeruser", async (req, res) => {

	var emailId = req.body.emailid;
	var mobile = req.body.mobileno;
	var username = req.body.username;
	//var password = req.body.password;
	var password = bcrypt.hashSync(req.body.password, 10); 
	var date = moment(new Date());
	date = moment().format("YYYY-MM-DD HH:mm:ss", date);

	if (!mobile) {
		res.status(400).send({ status: false, result: "Invalid input for Phone Number" });
		return;
	}

	var newUser = new UserSchema();
	newUser.mobile = mobile;
	var findparam = { mobile: mobile };
	msg = await UserDb.findOne(findparam);
	if (msg.err.message == "User not found") {
		var num = utils.generateRandomNumber(1000, 9999);;
		newUser.userId = "user" + num;
		newUser.emailId = emailId;
		newUser.userName = username;
		newUser.password = password;
		newUser.registerDate = date;
		newUser.updateDate = date;


		var err = await UserDb.save(newUser);
		if (err) {
			logger.error("Error in register user");
			res.status(400).send({ status: false, message: "Error in register user" });
			return;
		}
		else{
			res.status(200).send({ status: true, message: "User Registered successfully" });
			return;
		}

	} else if (msg.err) {
		logger.error("Internal server error");
		res.status(500).send({ status: false, message: "Internal server error" });
		return;
	}
	else{
		res.status(400).send({ status: false, message: "User Already exists with this Mobie No" });
		return;
	}
});

// fetching API from database based on parameters mobileno and password
router.post("/loginuser", async (req, res) => {

	
	var mobile = req.body.mobileno;
	var password = req.body.password;

	if (!mobile) {
		res.status(400).send({ status: false, result: "Invalid input for Phone Number" });
		return;
	}

	var newUser = new UserSchema();
	newUser.mobile = mobile;
	var findparam = { mobile: mobile };
	msg = await UserDb.findOne(findparam);
	if (msg.err.message == "User not found") {

		logger.error("Error in User Login");
		res.status(400).send({ status: false, message: "Incorrect User Name" });
		return;
	} else if (msg.err) {
		logger.error("Internal server error");
		res.status(500).send({ status: false, message: "Internal server error" });
		return;
	}
	else{
		if(bcrypt.compareSync(password, msg.user.password)) {
			// Passwords match
			token = jwtToken.createJWTToken(mobile, jwtconfig.user)
			if (!token) {
			logger.error("Error in genrating access token");
			return res.status(500).send({ status: false, message: "Error in genrating access token" });
			}
			res.status(200).send({ status: true, message: "User login Successfull", authToken : token});
			return;

		} else {
			// Passwords don't match
			logger.error("Invalid password");
			res.status(400).send({ status: false, message: "Invalid Password entered" });
			return;

		   }
		
	}
});

// //fetching user profile details
router.get("/viewprofile", async function (req, res) {
	var mobile = req.mobile; //getting data(mobile no) from auth token
	if (!mobile) {
		res.status(401).send({ status: false, result: "Invalid Token" });
		return;
	}
	var findparam = { mobile: mobile };
	profile = await UserDb.findOne(findparam);
	if (profile.err) {
		if (msg.err.message == "User not found") {
			logger.error("User Doesn't exist for this Mobile No");
			res.status(400).send({ status: false, message: "User Doesn't exist for this Mobile No" });
			return;
		}
		logger.error("Internal server error");
		res.status(500).send({ status: false, message: "Internal server error" });
		return;
	}
	else{
		res.status(200).send({ status: true, message: "Data fetched successfully", data:profile.user });
		return;
	}
});

// //verifying the profile
router.put("/updateprofile", async function (req, res) {
	var mobile = req.mobile;
	var date = moment(new Date());
	date = moment().format("YYYY-MM-DD HH:mm:ss", date);

	if (!mobile) {
		res.status(401).send({ status: false, result: "Invalid Token" });
		return;
	}
	var json = { updateDate : date};
	if (req.body.emailId) {
		var emailId = req.body.emailId.toLowerCase();
		json['emailId'] = emailId;
	}
	if (req.body.userName) {
		var userName = req.body.userName.toUpperCase();
		json['userName'] = userName;
	}
	var updatedetails = {
		$set: json
	}
	var updatethrough = { mobile: mobile }
	result = await UserDb.findOneAndUpdate(updatethrough, updatedetails);
	if (result.message == "User not found") {
		logger.error("User not found");
		res.status(400).send({ status: false, message: "User not found" });
		return;
	} else if (result.message) {
		logger.error("Internal server error");
		res.status(500).send({ status: false, message: "Internal server error" });
		return;
	} else {
		res.status(200).send({ status: true, message: "User successfully updated" });
		return;

	}

});



module.exports = router;