"use strict";

const { getProductsPim } = require("../pim/main")

module.exports = {
    getProduct: async function (req, res, next) {
        try {
            const { code } = req.body;
            
            if (!code) {
                res.status(403).json({ error: 'Product code is required' });
            };

            const product = await getProductsPim(code);

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error finding the product' });
        };
    }
};