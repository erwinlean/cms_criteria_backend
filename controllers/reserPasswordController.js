"use strict";

const users = require("../schemas/userSchema");
const { sendResetEmail } = require("../utils/sendMail");
const { createResetToken } = require("../middlewares/authCreate");

module.exports = {
  // First function. receibe petition from frontend, and send the email to the user email
  passwordReset: async function (req, res, next) {
    try {
      const { email } = req.body;

      const user = await users.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      };
      const userName  = user.name;

      const resetToken = createResetToken();

      // TO CHANGE THIS URL FOR API URL PROD
      const resetLink = `https://criteria-providers.onrender.com/api/reset/password/${resetToken}?email=${email}`;  
      sendResetEmail(email, resetLink, userName);

      res.json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    };
  },

  redirect: async function (req, res, next) {
    const { token } = req.params;
    const { email } = req.query;

    // Redirige al frontend with the token and email in the URL
    // TO CHANGE URL FOR FRONTEND URL PROD
    const redirectURL = `https://criteria-portal.netlify.app/password-reset.html?token=${token}&email=${email}`;

    res.redirect(redirectURL);
  },

  confirmPasswordReset: async function (req, res, next) {
    try {
      const { newPassword, email } = req.body;
  
      const user = await users.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      };
  
      user.password = newPassword;
      await user.save();
  
      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    };
  }  
};