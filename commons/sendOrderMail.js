const nodemailer = require("nodemailer");

const sendOrderMail = async (emails, name, storeName) => {
  try {
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
      to: emails,
      subject: "Order Purchased",
      html: `<h2>Yahooooo!</h2>
                  <p>${name} purchased new product from ${storeName}</p>
                `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return "Error sending email";
      } else {
        return "Email sent successfully";
      }
    });
  } catch (error) {
    return error;
  }
};

module.exports = {
  sendOrderMail,
};
