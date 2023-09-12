/* ############################################################################################ */
/* User mannagment, get users, get users logins, delete users, update user data and create user */
/* ############################################################################################ */

"use strict";

const users = require ("../schemas/userSchema"); 
const files = require("../schemas/filesSchema");
const bcrypt = require("bcrypt");
// Create token function
const { createJwtToken } = require("../middlewares/authCreate");
// Validate,hash password & error handler
const { validatePassword, hashPassword } = require("../utils/userUtils");
const { errorHandler } = require("../utils/errorHandler");

module.exports={

    /* Get users and brand fetched, for list of users for the admin */
    getUsers: async function (req, res, next) {
        const userEmail = req.header("User-Email");

        if(!userEmail){
            return errorHandler(400, "Email is required", res);
        };
    
        const user = await users.findOne({ email: userEmail });
    
        if (!user) {
            return errorHandler(404, "User not found", res);
        } else if (user.role !== "admin") {
            return errorHandler(401, "Unauthorized role", res);
        } else {
            try {
                const allUsers = await users.find({}, { email: 1, brand: 1 });
    
                return res.status(200).json(allUsers);
            } catch (error) {
                console.error(error);
                return errorHandler(500, "Internal server error", res);
            };
        };
    },

    /* Get users and his logins dates (admin can see all the users logins, provider only his) */
    userByEmail: async function (req, res, next) {
        try {
            const userEmail = req.header("User-Email");
            const user = await users.findOne({ email: userEmail });
    
            if(!userEmail){
                return errorHandler(400, "Email is required", res);
            };
            if (!user) {
              return errorHandler(404, "User not found", res);
            };
    
            let allUserData = await users.find({}, { email: 1, loginDates: 1 });
            let responseData;
            
            switch (user.role) {
              case "admin":
                  responseData = { allUserData };
                  break;
              case "provider":
                  let userData = await users.findOne({ email: userEmail }, { email: 1, loginDates: 1 });
                  responseData = { userData };
                  break;
              default:
                  return errorHandler(401, "Unauthorized role", res);
            };
    
            return res.json(responseData);
        } catch (error) {
            console.log(error);
            return errorHandler("Internal server error", req, res, next);
        };
    },

    /* Login into the app mannagment */
    userLogin: async function (req, res, next) {
        try {
            const user = await users.findOne({ email: req.body.email });
            
            if (!user) {
                return errorHandler(404, "No matching email found", res);
            };
          
            const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordMatch) {
                return errorHandler(404, "Incorrect password", res);
            };
          
            const { password, ...userWithoutPassword } = user.toObject();
            const jwtToken = createJwtToken(user);
          
            await users.findOneAndUpdate({ email: req.body.email }, { $push: { loginDates: new Date() } });
          
            return res.json({ token: jwtToken, user: userWithoutPassword });
        } catch (error) {
            console.log(error);
            return errorHandler(500, "Internal server error", res);
        };
      },

    /* Create user */
    createUser: async function (req, res, next) {
        try {
            const { name, lastName, sku, email, password, brand, role } = req.body;

            if (!name || !lastName || !sku || !email || !password || !brand || !role) {
                return errorHandler(400, "Missing required user properties", res);
            };

            const requester = await users.findOne({ email: req.header("User-Email") });
            
            if (requester.role !== "admin") {
                return errorHandler(401, "Unauthorized role.", res);
            };
          
            if (!validatePassword(password)) {
                return errorHandler(400, "The password must contain at least 8 characters, including letters and numbers.", res);
            };
          
            const hashedPassword = hashPassword(password);
          
            const user = new users({
                name,
                lastName,
                sku,
                email,
                password: hashedPassword,
                brand,
                role,
            });
          
            const { password: userPassword, ...userWithoutPassword } = user.toObject();
          
            const jwtToken = createJwtToken(user);
          
            await user.save();
          
            return res.json({ token: jwtToken, user: userWithoutPassword });
        } catch (error) {
            console.log(error);
            return errorHandler(500, "Internal server error", res);
        };
      },

    /* Delete user, for the admin */
    deleteUser: async function (req, res, next) {
        try {
            const emailToDelete = req.params.email;
            const requesterEmail = req.header("User-Email");
            const requester = await users.findOne({ email: requesterEmail });
            
            if (!emailToDelete || !requesterEmail) {
                return errorHandler(400, "Email parameters are missing", res);
            };

            if (!requester) {
                return errorHandler(400, "Requester not found", res);
            };
            if (requester.role !== "admin") {
                return errorHandler(401, "Unauthorized role", res);
            };
          
            // delete the user
            const deletedUser = await users.findOneAndDelete({ email: emailToDelete });
            if (!deletedUser) {
                return errorHandler(404, "User not found", res);
            };
            const deletedFiles = await files.deleteMany({ userUpload: emailToDelete });
          
            return res.json({ message: `User ${emailToDelete} deleted successfully. Deleted ${deletedFiles} files.` });
        } catch (error) {
            console.log(error);
            return errorHandler(500, "Internal server error", res);
        };
      },
    
    /* Delete all user, this should be commented or deleted in PROD */
    deleteAllUsers: async function (req, res, next) {
        try {
            await users.deleteMany();
        
            return res.json({ message: "All users deleted successfully" });
        } catch (error) {
            console.log(error);
            return errorHandler(500, "Internal server error", res);
        };
    },

    /* Upload the user information (perfil mannagment for his own user) */
    updateUser: async function (req, res) {
        try {
            const { email, ...updatedFields } = req.body;

            if(!email){
                return errorHandler(400, "Email is required", res);
            };
            
            // Verify the old password
            const user = await users.findOne({ email });
            if (!user) {
                return errorHandler(404, "User not found", res);
            };
          
            // If the user wants to change the password, check if the old password matches the one sent
            for (const key of Object.keys(updatedFields)) {
                if (key === "oldPassword") {
                    const isOldPasswordValid = await comparePassword(updatedFields.oldPassword, user.password);
                if (!isOldPasswordValid) {
                    return errorHandler(403, "Old password is incorrect", res);
                };
              };
                user[key] = updatedFields[key];
            };
          
            // Update the password only if a new password is provided
            if (updatedFields.password) {
                const hashedPassword = hashPassword(updatedFields.password);
                user.password = hashedPassword;
            };
          
            await user.save();
            const { password, ...userWithoutPassword } = user.toObject();
            return res.json(userWithoutPassword);
        } catch (error) {
            console.log(error);
            return errorHandler(500, "Error updating user", res);
        };
    }
};