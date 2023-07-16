"use strict";

const bcrypt = require ("bcrypt"); 
const jwt = require("jsonwebtoken");
const users = require ("../schema/userSchema"); 
const Files = require ("../schema/filesSchema");

module.exports={
    allUsers: async function(req,res,next){
        try{
            const allUser = await users.find()
            res.json(allUser);
        }catch(err){
            console.log(err);
        };
    },

    //usersEmail: async function(req,res,next){
    //    try{
    //        const userByEmail = await users.findOne({email: req.params.email});
//
    //        if (!userByEmail) {
    //            console.log("Error: No se encontró coincidencia de mail");
    //            return res.status(401).json({ error: "No se encontró coincidencia de mail" });
    //        };
//
    //        res.json(userByEmail);
    //    }catch(err){
    //        console.log(err);
    //    };
    //},

    userLogin: async function (req, res, next) {
        try {
            const user = await users.findOne({ email: req.body.email });

            if (!user) {
                console.log("Error: No se encontró coincidencia de mail");
                return res.status(401).json({ error: "No se encontró coincidencia de mail" });
            };
    
            const passwordMatch = bcrypt.compareSync(req.body.password, user.password );
            if (!passwordMatch) {
                console.log("Error: Contraseña incorrecta");
                return res.status(401).json({ error: "Contraseña contraseña incorrecta." });;
            };
    
            const jwtToken = jwt.sign({
                userName: user.name,
            },
            "tokenKey",{
                expiresIn: "2h",
            });
    
            // Logins register
            await users.findOneAndUpdate(
                { email: req.body.email },
                { $push: { loginDates: new Date() } }
            );

            res.json({ token: jwtToken });
        } catch (err) {
            console.log(err);
            next();
        };
    },    

    findFilesByUser: async function (req, res) {
        try {
            const userByEmail = await users.findOne({ email: req.body.email });
    
            if (!userByEmail) {
                console.log("Error: No se encontró coincidencia de mail");
                return res.status(401).json({ error: "No se encontró coincidencia de mail para buscar archivos" });
            };

            const userFilesId = userByEmail.filesUploaded.toString();
            const files = await Files.find({ _id: userFilesId });

            res.json(files);
        } catch (error) {
            res.status(500).json({ error: 'Error al buscar los archivos' });
        };
    },    

    createUser: async function(req,res,next){
        try{
            const user = new users({
                name:req.body.name,
                sku:req.body.sku,
                email:req.body.email,
                password:req.body.password,
                brand: req.body.brand
            });

            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordRegex.test(user.password)) {
                console.log("Error: The password must contain at least 8 characters, including letters and numbers.");
                return;
            };

            const newUser = await user.save()
            res.json(newUser)
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
    }    
};