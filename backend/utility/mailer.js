const nodemailer = require("nodemailer");

const mailer = async (otp, email, subject, mail) => {
  try {
    console.log("🚀 Trying to send mail...");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ka344057@gmail.com", 
        pass: "vffu nium wuox fkxu", 
      },
      debug: true,
      logger: true,
    });

    const info = await transporter.sendMail({
      from: '"Aniket" <ka344057@gmail.com>',
      to: email,
      subject: subject,
      text: mail,
    });

    return info;
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

module.exports = mailer;
