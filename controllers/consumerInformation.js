"use strict";

const pim = require("../pim/main")

module.exports = {

    getProduct: async function (req, res, next) {
        try {
            const { code } = req.body;
            
            if (!code) {
                res.status(403).json({ error: 'Code its required' });
            };

            const product = await pim.getProductsPim(code);

            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error finding the product' });
        };
    }

};