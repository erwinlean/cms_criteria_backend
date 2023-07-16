"use strict";

const express = require('express');
const router = express.Router(); 
const filesController = require("../controller/filesController");
const jsonWebT = require("../middleware/jwt");

router.get("/", jsonWebT, filesController.allFiles);
router.post("/create", jsonWebT, filesController.createFile);
router.delete("/", jsonWebT, filesController.deleteAllUsers);
router.delete("/:fileName/:userUpload", jsonWebT, filesController.deleteFile);


module.exports = router;