"use strict";

const Files = require("../schemas/filesSchema");
const Users = require("../schemas/userSchema");
const { postProductPim } = require("../pim/main");

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

            /*Check role of the user */
            const user = await Users.findOne({ email: userEmail });

            if(user.role == "consumer"){
                res.status(403).json({ error: 'Unauthorized role' });
            };

            const savedFile = await file.save();
            
            // Upload file to the user
            await Users.findOneAndUpdate(
                { email: userUpload },
                {
                    $push: {
                        filesUploaded: savedFile,
                    },
                },
                { new: true }
            );

            // All PIM modify data and methods inside the main
            if(file.data.length == 0){
                res.status(500).json({ error: 'No data to post on PIM' });
            };

            const attributesData = file.data;
            attributesData.forEach(element => { postProductPim(element) });
            
            res.status(201).json(savedFile);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating the file' });
        };
    },

    getFiles: async function (req, res) {
        try {
            const userEmail = req.header('User-Email');

            const user = await Users.findOne({ email: userEmail });

            if (user.role === "admin") {
                const files = await Files.find();
                res.json(files);

            } else if (user.role === "provider") {
                if (userEmail) {
                    const files = await Files.find({ userUpload: userEmail });

                    res.json(files);

                } else {
                    res.status(400).json({ error: 'Email missing in request' });
                };
            } else {
                res.status(403).json({ error: 'Unauthorized role' });
            };
        } catch (error) {
            res.status(500).json({ error: 'Error searching for the files' });
        };
    },

    deleteFile: async function (req, res) {
        try {
            const { fileName, userUpload } = req.params;
            const deletedFile = await Files.findOneAndRemove({ fileName, userUpload });
            if (deletedFile) {
                res.json(deletedFile);
            } else {
                res.status(404).json({ error: 'File missing' });
            };
        } catch (error) {
            res.status(500).json({ error: 'Error deleting the file' });
        };
    },

    deleteAllFiles: async function (req, res, next) {
        try {
            await Files.deleteMany();

            res.json({ message: "All Files deleted successfully" });
        } catch (err) {
            console.error(err);
            next(err);
        };
    }
};