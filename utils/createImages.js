"use strict";

const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');

// Function to convert an image URL to a Data URI
async function getImageDataUri(imageUrl) {
    try {
        // Fetch the image from the URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);

        // Load the image using canvas
        const img = await loadImage(imageBuffer);

        // Create a canvas with dimensions matching the image
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Convert the canvas to a Data URI (JPEG format)
        const dataUri = canvas.toDataURL('image/jpeg');
        return dataUri;
    } catch (error) {
        console.error('Error converting image to Data URI:', error);
        return null;
    };
};

module.exports = getImageDataUri;