/* ################################################################ */
/* Match the data from Frontend, to the schema needed in the PIM    */
/* Family, and Category is hard-coded (as needed/created in the PIM */
/* Attributes perse are inside "values" UUI created at the PIM      */
/* ################################################################ */
/**
 * @param {string} identifier
 * @param {Object} attributes
 * "IDK" and to_approve hard-coded based on category and family in the PIM
 * @returns {Object}
 */

"use strict";

function schema(identifier, attributes) {
    const akeneoSchema = {
        //"uuid": uuid, // Self create in PIM
        "identifier": identifier,
        "enabled": false, // Enable should be set on the PIM UI by admin
        "family": ["IDK"],
        "categories": ["to_approve"],
        "groups": [],
        "values": attributes // All the atributes here, inside object {}
    };

    return akeneoSchema;
};

module.exports = schema;