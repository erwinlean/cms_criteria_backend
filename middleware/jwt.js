"use strict";

const jwt = require("jsonwebtoken");

const jsonWebT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Invalid token" });
    };

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, "tokenKey");
        req.decoded = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    };
};

module.exports = jsonWebT;