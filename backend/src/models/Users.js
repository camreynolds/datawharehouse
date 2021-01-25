//const mongoose=require('../database/connection');
require('../database/connection');
const mongoose=require('mongoose');
const { Schema, model }= mongoose;

const usersSchema=new Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profile:{
        type: String,
        required:true,
        enum:['admin','basic']
    },
    registerdate:{
        type: Date,
        default: new Date()
    }
});
//usersSchema.index( { "$**": "text" } );
const Users= model("Users",usersSchema);

module.exports=  Users;