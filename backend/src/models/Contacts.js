require('../database/connection');
const mongoose=require('mongoose');
const { Schema, model }= mongoose;

const contactsSchema = new Schema({
    firstname:{
        type: String,
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    job:{
        type:String,
        required:true
    },
    emailCompanie:{
        type: String,
        required: true,
        unique:true
    },
    address:{
        type: String,
        required: true
    },
    channel: [{
        name:{ type:String},
        type: { type:String},
        preference: { type:String}
    }],
    city_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regions',
        required: true
    },
    companie_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Companies',
        required: true
    }
   
});

//contactsSchema.index( { "$**": "text" } );

const Contacts=model("Contacts", contactsSchema);

module.exports = Contacts;