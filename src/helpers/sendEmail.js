const nodemailer = require('nodemailer')
require('dotenv').config()


const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
})


const sendEmail = async (email, subject, html) => {
    const email_options = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        // text: `Hi ${name}, Thanks for sign up!`,
        html
    }

    transporter.sendMail(email_options, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        }
        else {
            console.log("Email sent: ", info.response);
        }
    });
}


module.exports = sendEmail