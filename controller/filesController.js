"use strict";

const axios = require('axios'); // Post a akeneo
const Files = require ("../schema/filesSchema");
const users = require("../schema/userSchema");

module.exports = {
    createFile: async function (req, res) {
        try {
            const { fileName, brand, data, userUpload } = req.body;

            const file = new Files({
                fileName,
                userUpload,
                brand,
                data,
            });

            const savedFile = await file.save();

            // Upload file to the user
            const user = await users.findOneAndUpdate(
                { email: userUpload },
                { 
                    $push: { 
                        filesUploaded: savedFile,
                    }
                },
                { new: true }
            );

            // Post to Akeneo
            const akeneoData = file.data;
            console.log(akeneoData);
            //await axios.post('urlToAkeneo', akeneoData);

            res.status(201).json(savedFile);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al crear el archivo' });
        };
    },

    allFiles: async function (req, res, next) {
        try {
            const files = await Files.find();
    
            res.json(files);
        } catch (error) {
            res.status(500).json({ error: 'Error al buscar los archivos' });
        };
    },

    deleteFile: async function (req, res) {
        try {
            const { fileName, userUpload } = req.params;
            const deletedFile = await Files.findOneAndRemove({ fileName, userUpload });
            if (deletedFile) {
                res.json(deletedFile);
            } else {
                res.status(404).json({ error: 'Archivo no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el archivo' });
        };
    },

    deleteAllUsers: async function (req, res, next) {
        try {
            await Files.deleteMany();
        
            res.json({ message: "All Files deleted successfully" });
        } catch (err) {
            console.log(err);
            next(err);
        };
    }
};