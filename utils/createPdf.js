"use strict";

const { jsPDF } = require("jspdf");
const getImageDataUri = require("./createImages");
async function pdfPerse(data) {
    /* Create the pdf */
    try {
        const pdfDoc = new jsPDF();

        // Define the position for the title
        const titleX = 20;
        const titleY = 20;

        // Define the font and style for the title
        pdfDoc.setFont("Arial", "bold");
        pdfDoc.setFontSize(24);

        // Define the position for the product data
        let productDataX = 20;
        let productDataY = 70;

        // Define the font and style for the product data
        pdfDoc.setFont("Arial", "normal");
        pdfDoc.setFontSize(12);

        // Set line height (spacing) between paragraphs/lines
        const lineHeight = 12;

        // Set the line color to light grey
        pdfDoc.setDrawColor(200, 200, 200);

        // Use Promise.all to fetch and add images to the PDF
        await Promise.all(
            data.map(async (productInfo, index) => {
                // Create a string with formatted product information
                let productInfoString = `${productInfo.sku}\n`;

                // Loop through the selected product data and add it to the PDF
                for (const key in productInfo) {
                    if (key !== "sku") {
                        // Check if the value contains an image URL
                        if (productInfo[key].includes("http")) {
                            // If it's an image, prepend "Image:"
                            const imgIndex = productInfoString.lastIndexOf("Image:");
                            if (imgIndex === -1) {
                                // If "Image:" is not already in the productInfoString, add it
                                productInfoString += `Image: ${productInfo[key]}\n`;
                            };

                            /* Images */
                            if (productInfo[key].includes("images")) {
                                
                                const imgWidth = 90;
                                const imgHeight = 90;
                
                                const dataUri = await getImageDataUri(productInfo[key]);
                
                                // Adjust the left and top coordinates to position the image below other attributes
                                const left = 70; // You can adjust this value based on your layout
                                const top = productDataY + 5; // Add 10 to create some spacing
                
                                pdfDoc.addImage(dataUri, 'JPEG', left, top, imgWidth, imgHeight);
                
                                // Increase productDataY to make space for the image and next product info
                                productDataY += imgHeight + 10; // Add 10 for spacing
                            }
                        } else {
                            // Otherwise, display the key and value
                            // Split long attribute values into multiple lines
                            const lines = pdfDoc.splitTextToSize(`${productInfo[key]}.`, 140);
                            productInfoString += lines.join("\n") + "\n";
                        };
                    };
                };
                
                // Add formatted text to the PDF
                pdfDoc.text(productDataX, productDataY, productInfoString);
                
                // Calculate the height of the text block and adjust the Y position
                const textBlockHeight = pdfDoc.getTextDimensions(productInfoString, { fontSize: 12, maxWidth: 140 }).h;
                productDataY += textBlockHeight + lineHeight; // Add line height
                
                // Add a page break if the content exceeds the page
                if (productDataY + lineHeight + 10 > 220) {
                    pdfDoc.addPage();
                    productDataY = 20;
                };
            })
        );

        return pdfDoc;
    } catch (error) {
        console.error("Error creating PDF:", error);
        throw error;
    };
};


module.exports = pdfPerse;