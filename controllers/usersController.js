"use strict";

const users = require ("../schemas/userSchema"); 
const bcrypt = require("bcrypt");
const { createJwtToken } = require("../middlewares/authCreate");
const { validatePassword, hashPassword } = require("../utils/userUtils");

module.exports={
    allUsers: async function(req,res,next){
        try{
            const allUser = await users.find()
            res.json(allUser);
        }catch(err){
            console.log(err);
        };
    },

    userByEmail: async function(req, res, next) { // Untested yet
        try {
            const userEmail = req.header('User-Email');
            const userRole = req.header('User-Rol');
    
            const user = await users.findOne({ email: userEmail });
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            };
    
            let loginDates;
    
            if (userRole === 'admin') {
                loginDates = await users.find({}, { email: 1, loginDates: 1 });
            } else if (userRole === 'provider') {
                if (user.rol !== 'provider') {
                    return res.status(403).json({ error: 'Unauthorized role' });
                };
                loginDates = user.loginDates;
            } else {
                return res.status(403).json({ error: 'Unauthorized role' });
            };
    
            res.json({ loginDates });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
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
            const { name, lastName, sku, email, password, brand, rol } = req.body;

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
                rol
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
        try{
            const { email } = req.params;

            const deletedUser = await users.findOneAndDelete({ email });

            if (!deletedUser) {
                console.log("Error: No se encontró ningún usuario con el email proporcionado");
                return res.status(404).json({ error: "User not found" });
            };

            res.json({ message: "User deleted successfully" });
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

    updateUser: async function(req, res) {
        try {
            const { email, password, ...updatedFields } = req.body;
    
            const user = await users.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            };

            Object.keys(updatedFields).forEach(key => {
                user[key] = updatedFields[key];
            });

            if (password) {
                const hashedPassword = hashPassword(password);
                user.password = hashedPassword;
            };

            await user.save();
            const { password: userPassword, ...updatedUser } = user.toObject();
    
            res.json(updatedUser);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error updating user' });
        };
    } 
};