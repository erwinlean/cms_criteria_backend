"use strict";

const express = require('express');
const router = express.Router(); 
const userController = require("../controller/usersController");
const jsonWebT = require("../middleware/jwt");

router.get("/", jsonWebT,userController.allUsers);
router.get("/:id", jsonWebT, userController.usersId);
router.delete("/:email", jsonWebT, userController.deleteUser);

router.post("/create", userController.createUser);
router.post("/login",userController.userLogin);

module.exports = router; 