"use strict";

function ipCheck(req, res, next) {
    const allowedIP = "181.117.92.19"; // example
    
    const requestIP = req.ip;

    if (requestIP !== allowedIP) {
        return res.status(403).json({ error: 'Access denied from this IP address.' });
    };

    next();
};

module.exports = ipCheck;