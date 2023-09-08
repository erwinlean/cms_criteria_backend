/* ###################################################### */
/* This controller, is crud for files sended by the user  */
/* ###################################################### */

"use strict";

const Files = require("../schemas/filesSchema");
const Users = require("../schemas/userSchema");
//const { postProductPim } = require("../pim/main"); >>>  Not posting  on the PIM, using PIM in prod, to change credentials.
//const processDescriptions = require("../ia-api/main"); >>> Not using AI generator Descripcion (API request limitation to fix)

module.exports = {

    /* Create the fileand save to the user uploader */
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
            const user = await Users.findOne({ email: userUpload });

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

            /* Ai generator descripcion, Not in used for API request limitation.*/

            //const userBrand = user.brand;
            //const attributesData = file.data;
            //const newAtributes = await processDescriptions(attributesData, userBrand);

            /* Commented post product to PIM, current PIM on prod, to change credentials, for test PIM credentials. */
            //attributesData.forEach(element => { postProductPim(element) });
            
            res.status(201).json(savedFile);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating the file' });
        };
    },


    /* Get f iles, based on the role of the current user */
    getFiles: async function (req, res) {
        try {
            const userEmail = req.header('User-Email');

            const user = await Users.findOne({ email: userEmail });

            if (user.role === "admin") {
                const files = await Files.find();
                res.json(files);

            } else if (user.role == "provider") {
                const files = await Files.find({ userUpload: userEmail });

                res.json(files);
            } else {
                res.status(403).json({ error: 'Unauthorized role' });
            };
        } catch (error) {
            res.status(500).json({ error: 'Error searching for the files' });
        };
    },

    /* Delete file based on the user and the file name */
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

    /* Destroy all files, this will be not to be used in prod */
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