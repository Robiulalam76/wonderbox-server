const nodemailer = require("nodemailer");
const crypto = require("crypto");

const calculateEarn = async (price) => {
  const discount = price * 0.2;
  const remainingPrice = price - discount;

  return {
    discount,
    remainingPrice,
  };
};

const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

const sendEmailVerifyMail = async (email, token) => {
  try {
    const verificationLink = `${
      process.env.CLIENT_URL
    }/email-verify/${encodeURIComponent(token)}`;

    // email send start
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Email Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Thank you for signing up! Please click the following link to verify your email address:</p>
        <a href="${verificationLink}" target="_blank" >Verify Email</a>
  `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        const data = { success: false, message: "Error sending email" };
        return data;
      } else {
        const data = { success: true, message: "Email sent successfully" };
        return "Email sent successfully";
      }
    });
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};

module.exports = {
  calculateEarn,
  sendEmailVerifyMail,
};
