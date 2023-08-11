"use strict";

const bcrypt = require ("bcrypt"); 
const jwt = require("jsonwebtoken");
const users = require ("../schema/userSchema"); 
const Files = require ("../schema/filesSchema");
const encrypt = require("bcrypt");

module.exports={
    allUsers: async function(req,res,next){
        try{
            const allUser = await users.find()
            res.json(allUser);
        }catch(err){
            console.log(err);
        };
    },

    userByEmail: async function(req,res,next){
        try {
            const userEmail = req.header('User-Email');
    
            const user = await users.findOne({ email: userEmail });
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const loginDates = user.loginDates;
    
            res.json({ loginDates });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

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
    
            const { password, ...userWithoutPassword } = user.toObject();

            const jwtToken = jwt.sign(
                {
                    userName: user.name,
                    userLastName: user.lastName,
                    userEmail: user.email,
                    userBrand: user.brand,
                    userBrand: user.rol,
                    userCreationDate: user.creationDate,
                    userLoginDates: user.loginDates,
                    userFilesUploaded: user.filesUploaded
                },
                "tokenKey",
                {
                    expiresIn: "2h",
                }
            );
    
            // Logins register
            await users.findOneAndUpdate(
                { email: req.body.email },
                { $push: { loginDates: new Date() } }
            );

            res.json({ token: jwtToken, user: userWithoutPassword });
        } catch (err) {
            console.log(err);
            next();
        };
    },    

    findFilesByUser: async function (req, res) {
        try {
            const userEmailHeader = req.headers['user-email'];
            if (!userEmailHeader) {
                return res.status(400).json({ error: 'Falta el encabezado "User-Email" en la solicitud.' });
            }

            const userByEmail = await users.findOne({ email: userEmailHeader });
        
            if (!userByEmail) {
                console.log("Error: No se encontró coincidencia de mail");
                return res.status(401).json({ error: "No se encontró coincidencia de mail para buscar archivos" });
            };
    
            // Search by multiple _id
            const userFilesIdArray = userByEmail.filesUploaded.map((fileId) => fileId.toString());
            const files = await Files.find({ _id: { $in: userFilesIdArray } });    
    
            res.json(files);
        } catch (error) {
            res.status(500).json({ error: 'Error al buscar los archivos' });
        };
    },    

    createUser: async function(req,res,next){
        try{
            const { name, lastName, sku, email, password, brand, rol } = req.body;

            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ error: "The password must contain at least 8 characters, including letters and numbers." });
            }

            const hashedPassword = encrypt.hashSync(password, 10);

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

            const jwtToken = jwt.sign(
                {
                    userName: user.name,
                    userLastName: user.lastName,
                    userEmail: user.email,
                    userBrand: user.brand,
                    userBrand: user.rol,
                    userCreationDate: user.creationDate,
                    userLoginDates: user.loginDates,
                    userFilesUploaded: user.filesUploaded
                },
                "tokenKey",
                {
                    expiresIn: "2h",
                }
            );
    
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
                return res.status(404).json({ error: 'Usuario no encontrado' });
            };

            Object.keys(updatedFields).forEach(key => {
                user[key] = updatedFields[key];
            });

            if (password) {
                const hashedPassword = encrypt.hashSync(password, 10);
                user.password = hashedPassword;
            };

            await user.save();
            const { password: userPassword, ...updatedUser } = user.toObject();
    
            res.json(updatedUser);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        };
    },    
};