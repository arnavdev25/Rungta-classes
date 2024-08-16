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


const sendEmail = async (email, name) => {
    const email_options = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to Our App!",
        // text: `Hi ${name}, Thanks for sign up!`,
        html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head><body><h3>Hi ${name},</h3><p>Welcome to our application.</p><p>Thanks for sign up with us.</p><br><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj6nYxsIeKyxqvL5Tx99EIvJ4xiJ9fZQ5omFCfxoxPp1qx81XhUFNxHHzStg&s" alt><br><br><p>Best Regards,</p><p>Rungta Team,</p></body></html>`,
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