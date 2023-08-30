"use strict";

const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router(); 
const pdfGenerator = require("../controllers/pdfController");
const jsonWebT = require("../middlewares/authVerify");

router.use(fileUpload());
router.post("/create", jsonWebT, pdfGenerator);

module.exports = router;