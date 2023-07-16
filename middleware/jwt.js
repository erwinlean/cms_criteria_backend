"use strict";

const jwt = require("jsonwebtoken");

const jsonWebT = (req,res,next) =>{
    jwt.verify(req.body["token-Ok"], "tokenKey"),

    function(err,ok){
        if(err){
            res.json(`error, token necesario ${err}`)
        }else{
            console.log(`funcionando token ${ok}`);
            next();
        };
    };
};

module.exports = jsonWebT;