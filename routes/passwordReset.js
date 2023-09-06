"use strict";

const express = require("express");
const router = express.Router();
const { passwordReset, confirmPasswordReset, redirect } = require("../controllers/reserPasswordController");
const jsonWebT = require("../middlewares/authVerify");

// Reset password endpoint /api/reset/password and redirect to user reset password endpoint and frontend same thing
router.post("/password", passwordReset);
router.get("/password/:token", redirect);
router.post("/confirm", jsonWebT,confirmPasswordReset);

module.exports = router;