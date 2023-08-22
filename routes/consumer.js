"use strict";

const express = require('express');
const router = express.Router(); 
const { getProduct } = require("../controllers/consumerController");
const jsonWebT = require("../middlewares/authVerify");

router.get("/", jsonWebT, getProduct);

module.exports = router;