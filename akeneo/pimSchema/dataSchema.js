"use strict";

function schema(uuid, identifier, categories, attributes) {
    const akeneoSchema = {
        //"uuid": uuid, // Self create in PIM
        "identifier": identifier,
        "enabled": false,
        "family": null,
        "categories": [categories],
        "groups": [],
        "values": attributes
    };

    return akeneoSchema;
};

module.exports = schema;