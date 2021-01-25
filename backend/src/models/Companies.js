require('../database/connection');
const mongoose=require('mongoose');
const { Schema, model }= mongoose;

const companiesSchema=new Schema({
    name:{
        type: String,
        unique: true,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    phone:{
        type: String,
        unique: true,
        required: true
    },
    city_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regions',
        required: true
    }
});


//companiesSchema.index( { "$**": "text" } );

const Companies=model("Companies",companiesSchema);

module.exports  = Companies;