/* ################### */
/* Dev token generator */
/* ################### */

"use strict";

const express = require('express');
const router = express.Router();
const { token } = require("../controllers/authController");
const ipCheck = require("../middlewares/ipVerify");

// Obtein token dev endpoint
router.post('/v1/token', /*ipCheck,*/ token);

module.exports = router; 