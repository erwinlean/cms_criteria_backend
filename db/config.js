"use strict";

const mongoose = require('mongoose');
require('dotenv').config();
//const dbUser = process.env.DB_USER
//const dbPassword = process.env.DB_PASSWORD
//const dbHost = process.env.DB_HOST
const dbUser = "emarte"
const dbPassword = "9BsY4MKvO870jx8u"
const dbHost = "cluster0.cpknn39.mongodb.net"

const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/?retryWrites=true&w=majority`;

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });
const db  = mongoose.connection;

db.on('error', (error) => {
    console.error('Error connecting to the database:', error);
});  
db.once('open', () => {
    console.log('Connected to the database');
});

module.exports = db;