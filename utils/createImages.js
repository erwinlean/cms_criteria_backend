/* ################################################### */
/* function to generate Image for the PDF based on URL */
/* URL hard-coded at app/utils/createPdf.js            */
/* ################################################### */
/**
 * @param {string} imageUrl
 * @return {string}
 */

"use strict";

const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');

// Function to convert an image URL to a Data URI
async function getImageDataUri(imageUrl) {
    try {
        // Fetch the image from the URL (image hard-coded)
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);
        const img = await loadImage(imageBuffer);

        // Create a canvas with the image demensions
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        // Draw
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Convert to uri, and return
        const dataUri = canvas.toDataURL('image/jpeg');
        
        return dataUri;
    } catch (error) {
        console.error('Error converting image to Data URI:', error);
        return null;
    };
};

module.exports = getImageDataUri;