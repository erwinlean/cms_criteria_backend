/* ############################################################################################################ */
/* Reset password controller, send email, to the user, redirect to endpoint and then confirm the reset password */
/* ############################################################################################################ */

"use strict";

const users = require("../schemas/userSchema");
// Email send function
const { sendResetEmail } = require("../utils/sendMail");
// Create token for reset password
const { createResetToken } = require("../middlewares/authCreate");
const { hashPassword } = require("../utils/userUtils");

module.exports = {

  // Receibe petition from frontend, and send the email to the user email
  passwordReset: async function (req, res, next) {
    try {
      const { email } = req.body;

      const user = await users.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      };
      const userName  = user.name;

      const resetToken = createResetToken();

      // Generate link and send via Email to the user
      const resetLink = `https://criteria-providers.onrender.com/api/reset/password/${resetToken}?email=${email}`;  
      sendResetEmail(email, resetLink, userName);

      res.json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    };
  },

  /* Redirect user endpoint to Frontend */
  redirect: async function (req, res, next) {
    const { token } = req.params;
    const { email } = req.query;

    // when the user is sended by the email to this endpoint function, redirect the user to the Frontend, with the token and user email.
    const redirectURL = `https://criteria-portal.netlify.app/password-reset.html?token=${token}&email=${email}`;

    res.redirect(redirectURL);
  },

  /* request the new password and email (the token is verified at the router) and update the user */
  confirmPasswordReset: async function (req, res, next) {
    try {
      const { newPassword, email } = req.body;
  
      const user = await users.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      };

      // Hash the new password, and save the user
      const hashedPassword = hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    };
  }  
};