'use strict';
require('dotenv').config();
const express= require('express');
const app= express();
const cors= require('cors');
//const path = require('path');
//Routes
const usersRouter= require('./routes/users');
const regionsRouter= require('./routes/regions');
const companiesRouter= require('./routes/companies');
const contactsRouter= require('./routes/contacts');
const authRouter= require('./routes/auth');
const { authenticateJWT, adminRoleValidation } = require('./auth/authServer');

/******MIDDELWARE******/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, '../public')));

const log=(req, res, next)=>{
    const {method, path, query, body}=req
    console.log(`${method} - ${path} - ${JSON.stringify(query)} - ${JSON.stringify(body)}`);
    next();
};
app.use(log);

app.use('/auth',authRouter);


app.use('/regions',authenticateJWT,regionsRouter);
app.use('/companies',authenticateJWT,companiesRouter);
app.use('/contacts',authenticateJWT,contactsRouter);
app.use('/users',authenticateJWT,adminRoleValidation,usersRouter);


/*********************/
app.use((err,req, res, next)=>{
    if(!err)
        return next();
    else
    console.log(err);
        return res.status(500).json({status: 'Error', mensaje:'Se ha producido un error inesperado.'});
});
app.listen(process.env.PORT, (err)=>{
    if (err) return console.log(err);
    console.log(`Servidor en ejecución en el puerto: ${process.env.PORT}`);
});