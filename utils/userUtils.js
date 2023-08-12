"use strict";

const bcrypt = require("bcrypt");

const validatePassword = password => {
    const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    return PASSWORD_REGEX.test(password);
};

const hashPassword = password => {
    return bcrypt.hashSync(password, 10);
};

module.exports = {
    validatePassword,
    hashPassword
};