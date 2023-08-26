"use strict";

const express = require('express');
const router = express.Router(); 
const userController = require("../controllers/usersController");
const jsonWebT = require("../middlewares/authVerify");

router.get("/userLogins", jsonWebT, userController.userByEmail);
router.get("/getUsers", jsonWebT, userController.getUsers);
router.delete("/deleteUser", jsonWebT, userController.deleteUser);

router.post("/create", userController.createUser);
router.put("/update", jsonWebT, userController.updateUser);
router.post("/login",userController.userLogin);

router.delete("/", jsonWebT, userController.deleteAllUsers);

module.exports = router;