const User = require("../models/users"); //storing the otp details in the verify collection

exports.save = async otp => await otp.save().then( res =>{}).catch(err => { return err;});
exports.findOne = async user => await User.findOne(user)
.then( res =>{if(!res){throw new Error('User not found')}else {return {user :res, err:""}}})
.catch(err => {return  {err :err , user :""}});
exports.findOneAndUpdate = async (updatethrough, update) => await User.findOneAndUpdate(updatethrough, update, { new: true })
.then(res => { if (!res) { throw new Error('User not found') } return res; }).catch(err => { return err });
