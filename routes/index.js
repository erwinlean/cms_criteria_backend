"use strict";

const express = require('express');
const router = express.Router();
const indexController = require("../controller/index");

router.get('/', indexController.index);

module.exports = router; 