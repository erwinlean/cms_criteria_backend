"use strict";

const schema = require("../pimSchema/dataSchema");

function matchData(values) {
    if (typeof values !== "object") {
        console.log("Values are not objects");
        throw new Error("Values are not objects");
    };

    /* notes from values(xlsx data)
        uui = label/name
        sku = identifier
        crear categorias = categorias pre_aproved
        everything else goes to attributes
    */
        
    const { uuid, identifier, categories ,attributes } = values;

    const akeneoSchema = schema(uuid, identifier, categories, attributes);

    return akeneoSchema;
}

module.exports = matchData;