"use strict";

const users = require ("../schema/userSchema"); 
const bcrypt = require ("bcrypt"); 
const jwt = require("jsonwebtoken");

module.exports={
    allUsers: async function(req,res,next){
        try{
            const allUser = await users.find()
            res.json(allUser);
        }catch(err){
            console.log(err);
        };
    },

    usersId: async function(req,res,next){
        try{
            const userByid = await users.findById({_id:req.params.id},req.body)
            res.json(userByid);
        }catch(err){
            console.log(err);
        };
    },

    userLogin: async function(req,res,next){
        try{
            const user = await users.findOne({email:req.body.email})
            if(!user){
                console.log("error, no se encontro coincidencia de mail")
            };
            if(bcrypt.compareSync(req.body.password,user.password)){
                const jwtToken= jwt.sign({
                    userName:user.name
                },"tokenKey",
                {
                    expiresIn:"2h"
                })
                console.log(`funcionando token ${jwtToken}`);
                console.log(`funcionando contraseña y mail ${user}`);

                user.loginDates.push(new Date());

                await user.save();
            }else{
                console.log("error, contraseña incorrecta");
            };
        }catch(err){
            console.log(err);
            next();
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
    }  
};