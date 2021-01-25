const Users = require('../../models/Users');
const bcrypt = require('bcryptjs');

const { findByIdAndDeleteDW, saveDW, findAll,findByIdDW,findOneAndUpdateDW }= require('../services');
const { find } = require('../../models/Users');
const { hashPaswword }= require('../../auth/authServer');

const searchOption = (searchText) => {
    const regEx = new RegExp(searchText, 'i')
    return {
        $or: [{
            firstname: regEx
        }, {
            lastname: regEx
        }, {
            email: regEx
        }, {
            profile: regEx
        }]
    }
}

const index = async (req, res, next) => {
    const getInfo={
        firstname: 1,
        lastname: 1,
        email: 1,
        profile: 1
    }
    const limit = (parseInt(req.query.limit)) ? parseInt(req.query.limit) : 5;
    const skip = (parseInt(req.query.offset)) ? parseInt(req.query.offset) : 0;
    let searchText = '',
        paramSearch = '';

    if (req.query.text) {
        paramSearch = req.query.text;
        searchText=searchOption(paramSearch);
    } else {
        searchText = {};
        paramSearch = '';

    }

    return await findAll(Users,req,res, getInfo,limit,skip,searchText);
};

const authenticateRol = async (username, passreq) => {
    try {
        const getInfo={
            firstname:1,
            lastname:1,
            profile:1,
            password:1
        }
        const results = await Users.find({email: username}, getInfo);
        
        if (results.length === 0) {
            return {
                code: 401,
                message: 'Usuario/Contraseña incorrecto'
            };
        }
        
        const pass = results[0].password;
        const auth = await bcrypt.compare(passreq, pass);

        if (auth === false) {
            return {
                code: 401,
                message: 'Usuario/Contraseña incorrecto'
            };
        }

        return {
            code: 200,
            result: results[0]
        };
        
    } catch (error) {
        console.log(error);
        return {
            code: 500,
            message: 'Error inesperado.'
        };
    }
};

const findByIdUser= async (req, res, next) => {
    try {
        const getInfo={
            firstname: 1,
            lastname: 1,
            email: 1,
            profile: 1
        }
        const result= await findByIdDW(Users,req,res, getInfo);

        next();

        return result
            
    } catch (error) {
        console.log(error);
    }


};

const createUser = async (req, res, next) => {

    const pass=await hashPaswword(req.body.password);
    req.body.password=pass;




    const result=await saveDW(Users,req, res, next);
    res=result;
    next();
    return res;  
};

const deleteUser = async (req, res, next) => {
    
    return await findByIdAndDeleteDW(Users,req,res);
};

const updateUser = async (req, res, next) => {
    if (!req.body.password){
        delete req.body.password;
    }
    return await findOneAndUpdateDW(Users,req,res);
};



module.exports = {
    index,
    createUser,
    deleteUser,
    findByIdUser,
    updateUser,
    authenticateRol
}