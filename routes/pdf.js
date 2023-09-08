/* ########################################## */
/* Router for create PDF and send to Frontend */
/* ########################################## */

"use strict";

const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router(); 
const pdfGenerator = require("../controllers/pdfController");
const jsonWebT = require("../middlewares/authVerify");

// Handle pdf uploads
router.use(fileUpload());
// Create pdf endpoint
router.post("/create", jsonWebT, pdfGenerator);

module.exports = router;