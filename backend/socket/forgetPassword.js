const connectionPool = require('./../config/connection');
const generateOTP = require('./../utility/generateOtp');
const { master } = require('./../config/redis');
const hashPassword = require('../utility/hashPassword');
const mailer = require('./../utility/mailer');

const findUsername = (data, cb) => {
    const qry = "select * from users where username = ? or email = ?";

    try {
        connectionPool.query(qry, [data, data], async (err, result) => {
            if (err) {
                throw new Error("Something went wrong please try again later");
            }

            if (result.length === 0) {
                cb({ error: false, message: "No user find with this username of email " });
                return;
            }

            const otp = generateOTP();
            const subject = "OTP to change password"
            const mail = `Your OTP for reseting your password is ${otp}`
            const sendMail = await mailer(otp, result[0].email, subject, mail);

            if(sendMail){
                await master.set(`otp:${result[0]._id}`, otp);    
                cb({
                error: false,
                data: {
                    message : `OTP sent successfully to your email ${result[0].email} `
                }
            });
            }
            

            

        });
    }

    catch (err) {
        cb({ error: true, message: err.message });
    }

    return;
}

const verifyOtp = (data, cb) => {
    const { username, password, otp } = data;

    let qry = "SELECT * FROM users WHERE username = ? OR email = ?";

    connectionPool.query(qry, [username, username], async (err, users) => {
        if (err || users.length === 0) {
            cb({ error: true, message: "User not found or query failed" });
            return;
        }

        const user = users[0];

        try {
            const storedOtp = await master.get(`otp:${user._id}`);

            if (!storedOtp) {
                cb({ error: true, message: "OTP has expired or was not sent" });
                return;
            }

            if (storedOtp !== otp) {
                cb({ error: true, message: "Invalid OTP" });
                return;
            }

            const hashedPassword = await hashPassword(password);



            qry = "UPDATE users SET password = ? WHERE _id = ?";

            connectionPool.query(qry, [hashedPassword, user._id], async (err) => {
                if (err) {
                    console.log(err);
                    cb({ error: true, message: "Something went wrong, please try again later" });
                    return;
                }

                // OTP used, delete it
                await master.del(`otp:${user._id}`);

                cb({
                    error: false,
                    data: { message: "Password changed successfully" }
                });
            });


        } catch (err) {
            cb({ error: true, message: err.message });
        }
    });
};


module.exports = { findUsername, verifyOtp };