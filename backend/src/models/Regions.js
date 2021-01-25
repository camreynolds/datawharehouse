require('../database/connection');
const mongoose=require('mongoose');
const { Schema, model }= mongoose;

const regionsSchema=new Schema({
    name:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    parent:{
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Regions'
    }
});

//regionsSchema.index( { "$**": "text" } );
regionsSchema.index({name: 1, parent:1}, {unique: true});

const Regions=model("Regions",regionsSchema);

module.exports  =Regions;