/* ############################# */
/* Informs user bad path for "/" */
/* ############################# */

"use strict";

const express = require('express');
const router = express.Router();
const { index } = require("../controllers/indexController");

// Bad endpoint responses
router.get('/', index);

module.exports = router; 