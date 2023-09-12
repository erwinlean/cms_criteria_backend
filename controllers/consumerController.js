/* ####################################################################### */
/* Check the role, and access the PIM Products Data for admin and consumer */
/* ####################################################################### */

"use strict";

// Get products PIM function
const { getProductsPim } = require("../pim/main")
const { errorHandler } = require("../utils/errorHandler");

module.exports = {

    // Get the products
    getProduct: async function (req, res, next) {
        try {
            const userRole = req.header("user-role");
            
            if(!userRole){
                return errorHandler(404, "User role is required", res);
            }else if (userRole == "provider") { // Access for admin and consumer role
                return errorHandler(401, "Unauthorized access", res);
            };

            const product = await getProductsPim();

            return res.status(200).json(product);
        } catch (error) {
            console.log(error);
            return errorHandler(500 ,"Error finding the product", res);
        };
    }
};