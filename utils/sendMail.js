/* #################################################################### */
/* This f unction send the email to the user request the password reset */
/* #################################################################### */
/**
 * @param {string} userEmail
 * @param {string} resetLink
 * @param {string} userName
 * @returns {void}
 */

"use strict";

const nodemailer = require("nodemailer");
// Style for email function
const htmlMail = require("./emailStyle");
require("dotenv").config();

// Variables and transporter
const mailerUrl = process.env.MAILER;
const transporter = nodemailer.createTransport(mailerUrl);

// Function to send a password reset email
function sendResetEmail(userEmail, resetLink, userName) {

    // Create email message
    const mailOptions = {
        from: "criteria.support@criteria.online",
        to: userEmail,
        subject: "Password Reset Request",
        html: htmlMail(resetLink, userName)
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);

            return;
        } else {
            console.log("Password reset email sent:", info.response);

            return;
        };
    });
};

module.exports = { sendResetEmail };