"use strict";

const express = require('express');
const router = express.Router(); 
const filesController = require("../controllers/filesController");
const jsonWebT = require("../middlewares/tokenVerify");

router.get("/", jsonWebT, filesController.getFiles);
router.post("/create", jsonWebT, filesController.createFile);
router.delete("/:fileName/:userUpload", jsonWebT, filesController.deleteFile);

router.delete("/", jsonWebT, filesController.deleteAllFiles);

module.exports = router;