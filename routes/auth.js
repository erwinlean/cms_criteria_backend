"use strict";

const express = require('express');
const router = express.Router();
const { token } = require("../controllers/authController");
const ipCheck = require("../middlewares/securityIP");

router.post('/v1/token', ipCheck, token);

module.exports = router; 