"use strict";

const express = require('express');
const router = express.Router(); 
const {getFiles, createFile, deleteFile, deleteAllFiles } = require("../controllers/filesController");
const jsonWebT = require("../middlewares/authVerify");

router.get("/", jsonWebT, getFiles);
router.post("/create", jsonWebT, createFile);
router.delete("/:fileName/:userUpload", jsonWebT, deleteFile);

router.delete("/", jsonWebT, deleteAllFiles);

module.exports = router;