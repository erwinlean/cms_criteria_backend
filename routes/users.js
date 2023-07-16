"use strict";

const express = require('express');
const router = express.Router(); 
const userController = require("../controller/usersController");
const jsonWebT = require("../middleware/jwt");

router.get("/", jsonWebT, userController.allUsers);
//router.get("/:email", jsonWebT, userController.usersEmail);
router.delete("/:email", jsonWebT, userController.deleteUser);

router.get("/userFiles", jsonWebT, userController.findFilesByUser);

router.post("/create", userController.createUser);
router.post("/login",userController.userLogin);

router.delete("/",userController.deleteAllUsers);

module.exports = router;