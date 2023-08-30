"use strict";

const nodemailer = require("nodemailer");
require("dotenv").config();
const emailHost = process.env.EMAIL_HOST;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASS;
const emailService = process.env.EMAIL_SERVICE;

const transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
        user: emailUser,
        pass: emailPassword,
    },
});


// Function to send a password reset email
function sendResetEmail(email, resetLink) {
    console.log("email function")

    // Create email message
    const mailOptions = {
        from: "criteria.suppoert@criteria.online",
        to: email,
        subject: "Password Reset Request",
        html: `
            <p>Hello,</p>
            <p>You have requested a password reset. Click the following link to reset your password:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.error("Error sending email:", error);
        } else {
                console.log("Password reset email sent:", info.response);
        }
    });
}

module.exports = { sendResetEmail };
