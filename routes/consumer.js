"use strict";

const express = require('express');
const router = express.Router(); 
const consumer = require("../controllers/consumerInformation");
const jsonWebT = require("../middlewares/tokenVerify");

router.get("/", jsonWebT, consumer.getProduct);

module.exports = router;