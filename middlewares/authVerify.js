/* ############################################################################ */
/* Function to verify the auth provide for the user in the header of the request*/
/* ############################################################################ */

"use strict";

const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

const jsonWebT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Invalid token" });
    };

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, secretKey);
        req.decoded = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    };
};

module.exports = jsonWebT;