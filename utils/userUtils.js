/* ######################################################################## */
/* Utils functions, for validate the password, and hash/bcrypt the password */
/* ######################################################################### */
/**
 * @module passwordUtils
*/

"use strict";

const bcrypt = require("bcrypt");

/**
 * @param {string} password 
 * @returns {boolean}
*/

// Validator password
const validatePassword = password => {
    const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    return PASSWORD_REGEX.test(password);
};

/**
 * @param {string} password
 * @returns {string}
*/
// Hash password bcrypt
const hashPassword = password => {
    return bcrypt.hashSync(password, 10);
};

module.exports = {
    validatePassword,
    hashPassword
};