"use strict";

const express = require('express');
const router = express.Router(); 
const userController = require("../controller/usersController");
const jsonWebT = require("../middleware/jwt");

router.get("/", jsonWebT, userController.allUsers);
router.get("/userLogins", jsonWebT, userController.userByEmail);
router.delete("/:email", jsonWebT, userController.deleteUser);

router.get("/userFiles", jsonWebT, userController.findFilesByUser);

router.post("/create", userController.createUser);
router.put("/update", jsonWebT, userController.updateUser);
router.post("/login",userController.userLogin);

router.delete("/",userController.deleteAllUsers);

module.exports = router;