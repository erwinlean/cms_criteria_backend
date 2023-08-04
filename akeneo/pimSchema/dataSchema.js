"use strict";

function schema(uuid, identifier, attributes) {
    const akeneoSchema = {
        "uuid": uuid,
        "identifier": identifier,
        "enabled": false,
        "family": null,
        "categories": [],
        "groups": [],
        "values": attributes
    };

    return akeneoSchema;
};

module.exports = schema;