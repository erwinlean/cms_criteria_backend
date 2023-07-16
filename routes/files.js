"use strict";

const express = require('express');
const router = express.Router(); 
const filesController = require("../controller/filesController");
const jsonWebT = require("../middleware/jwt");

router.get("/", jsonWebT, filesController.findFilesByUser);
router.delete("/:fileName/:userUpload", jsonWebT, filesController.deleteFile);
router.post("/create", jsonWebT, filesController.createFile);

module.exports = router;