'use strict';
require('dotenv').config();
const MongoClient=require('mongodb').MongoClient;



const connectMongoDB=async ()=>{

    const client =new MongoClient(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}`,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    try {
        const result =await client.connect();
        console.log("Connected correctly to server");
        return result
    } catch (error) {
        console.log(error);
        return error;
    }

    
}

module.exports={ connectMongoDB }