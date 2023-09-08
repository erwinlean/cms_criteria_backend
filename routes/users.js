/* ################################################# */
/* User router to controllers functions of the users */
/* ################################################# */

"use strict";

const express = require('express');
const router = express.Router(); 
const userController = require("../controllers/usersController");
const jsonWebT = require("../middlewares/authVerify");

// Get users and the logins for each user depends on user role
router.get("/userLogins", jsonWebT, userController.userByEmail);
// Get user list and brand endpoint
router.get("/users", jsonWebT, userController.getUsers);
// Delete user endpoint, by the email
router.delete("/delete/:email", jsonWebT, userController.deleteUser);
// Create new user endpoint
router.post("/create", userController.createUser);
// Update user information as requested
router.put("/update", jsonWebT, userController.updateUser);
// Login user mannagment (generating token)
router.post("/login",userController.userLogin);
// Delete all users, to be delete function in PROD
router.delete("/", jsonWebT, userController.deleteAllUsers);

module.exports = router;