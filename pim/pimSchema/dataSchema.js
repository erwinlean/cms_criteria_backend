"use strict";

function schema(identifier, attributes) {
    const akeneoSchema = {
        //"uuid": uuid, // Self create in PIM
        "identifier": identifier,
        "enabled": false, // Enable should be set on the PIM UI by admin
        "family": null,
        "categories": ["to_approve"], // categories, (category create for latter aprove in the PIM)
        "groups": [],
        "values": attributes // All the atributes here, inside object {}
    };

    return akeneoSchema;
};

module.exports = schema;