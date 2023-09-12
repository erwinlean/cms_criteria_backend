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
const { errorHandler } = require("../utils/errorHandler");

module.exports = {

  // Receibe petition from frontend, and send the email to the user email
  passwordReset: async function (req, res, next) {
    try {
      const { email } = req.body;

      if(!email){
        return errorHandler(400, "Email is required.", res);
      };

      const user = await users.findOne({ email });

      if (!user) {
        return errorHandler(404, "User not found.", res);
      };

      const userName  = user.name;
      const resetToken = createResetToken();

      // Generate link and send via Email to the user
      const resetLink = `https://criteria-providers.onrender.com/api/reset/password/${resetToken}?email=${email}`;  
      sendResetEmail(email, resetLink, userName);

      return res.json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.log(error);
      return errorHandler(500, "Internal server error.", res);
    };
  },

  /* Redirect user endpoint to Frontend */
  redirect: async function (req, res, next) {
    const { token } = req.params;
    const { email } = req.query;

    if(!token || !email){
      return errorHandler(400, "Missing peremeter.", res);
    };

    // when the user is sended by the email to this endpoint function, redirect the user to the Frontend, with the token and user email.
    const redirectURL = `https://criteria-portal.netlify.app/password-reset.html?token=${token}&email=${email}`;

    return res.redirect(redirectURL);
  },

  /* request the new password and email (the token is verified at the router) and update the user */
  confirmPasswordReset: async function (req, res, next) {
    try {
      const { newPassword, email } = req.body;

      if(!newPassword || !email){
        return errorHandler(400, "Missing peremeters.", res);
      };
  
      const user = await users.findOne({ email });
  
      if (!user) {
        return errorHandler(404, "User not found.", res);
      };

      // Hash the new password, and save the user
      const hashedPassword = hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();

      return res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      return errorHandler(500, "Internal server error.", res);
    };
  }  
};