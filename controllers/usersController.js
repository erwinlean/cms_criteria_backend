"use strict";

const users = require ("../schemas/userSchema"); 
const files = require("../schemas/filesSchema");
const bcrypt = require("bcrypt");
const { createJwtToken } = require("../middlewares/authCreate");
const { validatePassword, hashPassword } = require("../utils/userUtils");

module.exports={

    getUsers: async function (req, res, next) {
        const userEmail = req.header("User-Email");
    
        const user = await users.findOne({ email: userEmail });
            

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }else if(user.role !== "admin"){
            return res.status(403).json({ error: "Unauthorized role" });
        }else {
            try {
                const allUsers = await users.find({}, { email: 1, brand: 1 });
    
                return res.status(200).json(allUsers);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
            };
        };
    },

    userByEmail: async function (req, res, next) {
        try {
            const userEmail = req.header("User-Email");
            const user = await users.findOne({ email: userEmail });
    
            if (!user) {
                return res.status(404).json({ error: "User not found" });
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
                    return res.status(403).json({ error: "Unauthorized role" });
            };
    
            res.json(responseData);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Internal server error" });
        };
    },    

    userLogin: async function(req, res, next) {
        try {
            const user = await users.findOne({ email: req.body.email });

            if (!user) {
                console.log("Error: No matching email found");
                return res.status(401).json({ error: "No matching email found" });
            };

            const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordMatch) {
                console.log("Error: Incorrect password");
                return res.status(401).json({ error: "Incorrect password" });
            };

            const { password, ...userWithoutPassword } = user.toObject();
            const jwtToken = createJwtToken(user);

            await users.findOneAndUpdate({ email: req.body.email }, { $push: { loginDates: new Date() } });
            
            res.json({ token: jwtToken, user: userWithoutPassword });
        } catch (err) {
            console.log(err);
            next();
        };
    },

    createUser: async function(req,res,next){
        try{
            const { name, lastName, sku, email, password, brand, role} = req.body;
            const requester = await users.findOne({ email: req.header("User-Email") });

            if (requester.role !== "admin") {
                return res.status(403).json({ error: "Only admins can create users" });
            };

            if (!validatePassword(password)) {
                return res.status(400).json({ error: "The password must contain at least 8 characters, including letters and numbers." });
            };

            const hashedPassword = hashPassword(password);

            const user = new users({
                name,
                lastName,
                sku,
                email,
                password: hashedPassword,
                brand,
                provider,
                role
            });

            const { password: userPassword, ...userWithoutPassword } = user.toObject();

            const jwtToken = createJwtToken(user);
    
            await user.save();

            res.json({ token: jwtToken, user: userWithoutPassword });
        }catch(err){
            console.log(err);
        };
    },

    deleteUser: async function (req, res, next) {
        try {
            const emailToDelete = req.params.email;
            const requesterEmail = req.header("User-Email");
            const requester = await users.findOne({ email: requesterEmail });
    
            if (!requester) {
                return res.status(404).json({ error: "Requester not found" });
            };
            if (requester.role !== "admin") {
                return res.status(403).json({ error: "Unauthorized role" });
            };
    
            // delete the user
            const deletedUser = await users.findOneAndDelete({ email: emailToDelete });
            if (!deletedUser) {
                console.log("Error: No se encontró ningún usuario con el email proporcionado");
                return res.status(404).json({ error: "User not found" });
            };
            const deletedFiles = await files.deleteMany({ userUpload: emailToDelete });

            res.json({ message: `User ${emailToDelete} deleted successfully. Deleted ${deletedFiles} files.` });
        } catch (err) {
            console.log(err);
            next(err);
        };
    },

    deleteAllUsers: async function (req, res, next) {
        try {
            await users.deleteMany();
    
            res.json({ message: "All users deleted successfully" });
        } catch (err) {
            console.log(err);
            next(err);
        };
    },

    updateUser: async function (req, res) {
        try {
            const { email, ...updatedFields } = req.body;
    
            console.log(email, updatedFields);
    
            // Verify the old password
            const user = await users.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            };
    
            // If user want to change the pass must check the old password is match with the one is seended.
            for (const key of Object.keys(updatedFields)) {
                if (key === "oldPassword") {
                    // Check if the provided old password matches the user's actual password
                    const isOldPasswordValid = await comparePassword(updatedFields.oldPassword, user.password);
                    if (!isOldPasswordValid) {
                        return res.status(401).json({ error: "Old password is incorrect" });
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
            res.json(userWithoutPassword);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error updating user" });
        };
    }
};