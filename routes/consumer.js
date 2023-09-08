/* ############################################################################## */
/* Router for the role consumer witch only get information of products at the PIM */
/* ############################################################################## */

"use strict";

const express = require('express');
const router = express.Router(); 
const { getProduct } = require("../controllers/consumerController");
const jsonWebT = require("../middlewares/authVerify");

// Get products endpoint
router.get("/", jsonWebT, getProduct);

module.exports = router;