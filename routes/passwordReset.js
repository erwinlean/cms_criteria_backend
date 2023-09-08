/* ########################## */
/* User password reset router */
/* ########################## */

"use strict";

const express = require("express");
const router = express.Router();
const { passwordReset, confirmPasswordReset, redirect } = require("../controllers/reserPasswordController");
const jsonWebT = require("../middlewares/authVerify");

// Endpoint for send email the user requested
router.post("/password", passwordReset);
// Redirect endpoint to frontend with token and the user email
router.get("/password/:token", redirect);
// Change the password endpoint
router.post("/confirm", jsonWebT,confirmPasswordReset);

module.exports = router;