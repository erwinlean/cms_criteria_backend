"use strict";

const users = require("../schemas/userSchema");
const { sendResetEmail } = require("../utils/sendMail");
const { createResetToken } = require("../middlewares/authCreate");

module.exports = {
  passwordReset: async function (req, res, next) {
    try {
      // 1. Check if the email exists in your database
      const { email } = req.body; // Email sended fromt the reset password frontend

      // Check if the email exists in your database
      const user = await users.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      // 2. Generate a unique reset token
      const resetToken = createResetToken();

      // 3. Send an email with a reset link to the user (use resetToken in the link)
      const resetLink = `http://localhost:8080/api/reset/password/${resetToken}`; // URL frontend reset password
      sendResetEmail(email, resetLink);

      // 4. Respond to the client with a success message
      res.json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  redirect: async function (req, res, next) {
    const { token } = req.params;
  
    // Redirige al frontend con el token en la URL
    res.redirect(`http://tu-frontend-url.com/reset-password?token=${token}`);
  },

  confirmPasswordReset: async function (req, res, next) {
    try {
      // 1. Extract the reset token, new password, and user email from the request body
      const { token: resetToken, newPassword, email } = req.body;
  
      // 2. Validate the reset token (you may want to check its format or expiration here)
  
      // 3. Find the user by email
      const user = await users.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      };
  
      // 4. Update the user's password with the new password
      user.password = newPassword;
      await user.save();
  
      // 5. Respond to the client with a success message
      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    };
  }  
};