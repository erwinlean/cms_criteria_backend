/* ##################################### */
/* Files router endpoints, require token */
/* ##################################### */

"use strict";

const express = require('express');
const router = express.Router(); 
const {getFiles, createFile, deleteFile, deleteAllFiles } = require("../controllers/filesController");
const jsonWebT = require("../middlewares/authVerify");

// Get files endpoint
router.get("/", jsonWebT, getFiles);
// Create file
router.post("/create", jsonWebT, createFile);
// Delete by user
router.delete("/:fileName/:userUpload", jsonWebT, deleteFile);

// This endpoint will be deleted in prod
router.delete("/", jsonWebT, deleteAllFiles);

module.exports = router;