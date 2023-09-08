/* ###################################################################### */
/* Generate the PDF based on the data and function pdfPerse witch will be */
/* sended as base64 uri to the frontend                                   */
/* ###################################################################### */

"use strict";

const fs = require("fs");
const pdfPerse = require("../utils/createPdf");

async function pdfGenerator(req, res, next){

    try {
        const data = req.body

        /* Exported function for create PDF */
        const pdfDoc = await pdfPerse(data);
        
        // Save the PDF to a temporary file
        const tempFileName = `temp-${Date.now()}.pdf`;
        pdfDoc.save(tempFileName);

        // Read the temporary file as a data URI (Base64)
        const pdfDataUri = `data:application/pdf;base64,${fs.readFileSync(tempFileName, "base64")}`;

        // Delete file after saved the URI
        fs.unlinkSync(tempFileName);

        // Response to frontend
        res.status(200).json({ pdfDataUri });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error generating PDF" });
    };
};

module.exports = pdfGenerator;