const dotenv = require('dotenv');

dotenv.config();


function generateOTP() {
  let otp = "";
  for (let i = 0; i < process.env.OTP_LENGTH; i++) {
    otp += Math.floor(Math.random() * 10); 
  }
  return otp;
}

module.exports = generateOTP;
