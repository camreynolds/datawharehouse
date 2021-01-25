'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
//mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(db => console.log('Base de datos conectada'))
    .catch(error => console.log(error));

//module.exports = mongoose;