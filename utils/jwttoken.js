const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt_config.json');


function createJWTToken(mobileNo, role) {
  if(!mobileNo){
    return false;
  }
  
    var token = jwt.sign({
		exp: Math.floor(Date.now() / 1000) + 86400,
    mobileNo: mobileNo,
		role: role
    }, jwtconfig.secret);
    return token;
}  

async function verifyJWTToken(token, secret){
   return await jwt.verify(token, secret, function (err, success){
    if (err) {
      return false;
    } else {    
        return success;
    }
})
}

exports.createJWTToken = createJWTToken;
exports.verifyJWTToken = verifyJWTToken;
