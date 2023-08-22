"use strict";

const { getProductsPim } = require("../pim/main")

module.exports = {
    getProduct: async function (req, res, next) {
        try {
            const {userRole} = req.header('User-role');
            
            if (userRole == "provider") { // Access for admin and consumer role
                res.status(403).json({ error: 'Unauthorized access' });
            };

            const product = await getProductsPim();

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error finding the product' });
        };
    }
};