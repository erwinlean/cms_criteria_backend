/* ###################################################### */
/* This controller, is crud for files sended by the user  */
/* ###################################################### */

"use strict";

const Files = require("../schemas/filesSchema");
const Users = require("../schemas/userSchema");
const { errorHandler } = require("../utils/errorHandler");
//const { postProductPim } = require("../pim/main"); >>>  Not posting  on the PIM, using PIM in prod, to change credentials.
//const processDescriptions = require("../ia-api/main"); >>> Not using AI generator Descripcion (API request limitation to fix)

module.exports = {

    /* Create the fileand save to the user uploader */
    createFile: async function (req, res) {
        try {
            const { fileName, brand, data, userUpload } = req.body;

            if( !fileName || !brand || !data || !userUpload ){
                return errorHandler(400, `Information missing.`, res);
            };

            const file = new Files({
                fileName,
                userUpload,
                brand,
                data,
            });

            /*Check role of the user */
            const user = await Users.findOne({ email: userUpload });

            if(user.role == "consumer"){
                return errorHandler(403, "Unauthorized role.", res);
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
                return errorHandler(404, "Not data to post in the PIM.", res);
            };

            /* Ai generator descripcion, Not in used for API request limitation.*/

            //const userBrand = user.brand;
            //const attributesData = file.data;
            //const newAtributes = await processDescriptions(attributesData, userBrand);

            /* Commented post product to PIM, current PIM on prod, to change credentials, for test PIM credentials. */
            //attributesData.forEach(element => { postProductPim(element) });
            
            return res.status(201).json(savedFile);
        } catch (error) {
            console.error(error);
            return errorHandler(500, "Error creating the file. Try again latter.", res);
        };
    },


    /* Get f iles, based on the role of the current user */
    getFiles: async function (req, res) {
        try {
            const userEmail = req.header('User-Email');

            if(!userEmail){
                return errorHandler(404, "Email is required.", res);
            };

            const user = await Users.findOne({ email: userEmail });

            if (user.role === "admin") {
                const files = await Files.find();
                return res.json(files);
            } else if (user.role == "provider") {
                const files = await Files.find({ userUpload: userEmail });

                return res.json(files);
            } else {
                return errorHandler(401, "Unauthorized role.", res);
            };
        } catch (error) {
            return errorHandler(500, "Error searchinf the file. Try again latter.", res);
        };
    },

    /* Delete file based on the user and the file name */
    deleteFile: async function (req, res) {
        try {
            const { fileName, userUpload } = req.params;
            const deletedFile = await Files.findOneAndRemove({ fileName, userUpload });
            if (deletedFile) {
                return res.json(deletedFile);
            } else {
                return errorHandler(404, "Missing file", res);
            };
        } catch (error) {
            return errorHandler(500, "Error deleting the file.", res);
        };
    },

    /* Destroy all files, this will be not to be used in prod */
    deleteAllFiles: async function (req, res, next) {
        try {
            await Files.deleteMany();

            return res.json({ message: "All Files deleted successfully" });
        } catch (error) {
            console.error(error);
            return errorHandler(500, `${error.message}`, res);
        };
    }
};