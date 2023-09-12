/* ############################################################################# */
/* This function create the pdf, based on the data sended from FrontEnd products */
/* ############################################################################# */
/**
* @param {Array.<Object>} data
* @returns {jsPDF}
*/

"use strict";

const { jsPDF } = require("jspdf");
const getImageDataUri = require("./createImages");

async function pdfPerse(data) {

    /* Create the pdf */
    try {
        const pdfDoc = new jsPDF();

        // Position for the title
        const titleX = 20;
        const titleY = 20;
        // Font and style for the title
        pdfDoc.setFont("Arial", "bold");
        pdfDoc.setFontSize(24);
        pdfDoc.text(titleX, titleY, "Productos seleccionados");

        // Image title
        const imageX = 170;
        const imageY = 13;
        const imageWidth = 17;
        const imageHeight = 17;
        const logoURL = "https://media.licdn.com/dms/image/C4D0BAQGcCakBNsoUyw/company-logo_200_200/0/1554238141789?e=1701302400&v=beta&t=tcHx9Hh0Yl8QQ1nEroi8UxmN-8Ed8-R8Guqze_OlFtQ";
        const logoUri = await getImageDataUri(logoURL);
        pdfDoc.addImage(logoUri, "PNG", imageX, imageY, imageWidth, imageHeight);

        // Position for the product data
        let productDataX = 20;
        let productDataY = 45;
        // Font and style for the product data
        pdfDoc.setFont("Arial", "normal");
        pdfDoc.setFontSize(12);

        // Spacing between lines
        const lineHeight = 12;

        // Use Promise.all to fetch and add images to the PDF
        await Promise.all(
            /* Products informations */

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
                                const left = 65; // You can adjust this value based on your layout
                                const top = productDataY - 10; // Add 10 to create some spacing > SPACE BETWEEN THE IMAGE AND TOP PRODUCT

                                pdfDoc.addImage(dataUri, 'JPEG', left, top, imgWidth, imgHeight);

                                // Increase productDataY to make space for the image and next product info
                                productDataY += imgHeight - 5; // Adjust spacing > SPACE BETWEEN PRODUCT AND PRODUCT DATA
                            };
                        } else {
                            // Otherwise, display the key and value
                            // Split long attribute values into multiple lines
                            const lines = pdfDoc.splitTextToSize(`${productInfo[key]}.`, 140);
                            productInfoString += lines.join("\n") + "\n";
                        };
                    };
                };

                // Calculate the height of the text block and adjust the Y position
                const textBlockHeight = pdfDoc.getTextDimensions(productInfoString, { fontSize: 12, maxWidth: 140 }).h;
                const totalHeight = productDataY + textBlockHeight + lineHeight; // Total height including text

                // Add a separator line in the middle of the space between products
                if (index < data.length - 1) {
                    const separatorY = (totalHeight + productDataY) / 2 + 20;
                    pdfDoc.setDrawColor(200, 200, 200); // Light grey color
                    pdfDoc.line(20, separatorY, 190, separatorY); // Draw line
                };

                // Add formatted text to the PDF
                pdfDoc.text(productDataX, productDataY, productInfoString);

                // Increase productDataY to make space for the next product
                productDataY = totalHeight + lineHeight;

                // Add a page break if the content exceeds the page
                if (productDataY + lineHeight + 10 > 225) {
                    pdfDoc.addPage();
                    productDataY = 15;
                };

                // Calculate and add page numbers
                const currentPage = pdfDoc.internal.getNumberOfPages();
                pdfDoc.setFontSize(10);
                pdfDoc.setTextColor(100);
                pdfDoc.text(195, 290, `Page ${currentPage}`);
            })
        );

        return pdfDoc;
    } catch (error) {
        console.error("Error creating PDF:", error.message);
        return error;
    };
};


module.exports = pdfPerse;