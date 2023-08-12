"use strict";

const express = require('express');
const router = express.Router(); 
const { getProduct } = require("../controllers/consumerController");
const jsonWebT = require("../middlewares/authVerify");

router.post("/", jsonWebT, getProduct);

module.exports = router;