/* #################### */
/* Error Handler based  */
/* #################### */
/**
 * @param {number} status
 * @param {string} message
 * @param {Object} res
 * @return {Object}
 */

"use strict";

module.exports = {

  errorHandler: function (status, message, res){
    const statusCode = status;
    const errorResponse = {
      status: statusCode,
      message: message,
    };
    return res.status(statusCode).json(errorResponse);
  }

};