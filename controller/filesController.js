"use strict";

const Files = require ("../schema/filesSchema"); 

module.exports={
    createFile: async function (req, res) {
        try {
            const { fileName, userUpload, brand, data } = req.body;
            const file = new Files({
                fileName,
                userUpload,
                brand,
                data,
            });
            const savedFile = await file.save();
            res.status(201).json(savedFile);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el archivo' });
        };
    },

    findFilesByUser: async function (req, res) {
        try {
            const { userUpload } = req.params;
            const files = await Files.find({ userUpload });
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
            };
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el archivo' });
        };
    }
};