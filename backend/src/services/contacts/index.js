'use strict';
require('dotenv').config();
const fs = require('fs');
const Contacts = require('../../models/Contacts');
const {
    convertArrayCVSToJSON,
    download
} = require('../../utils');
const {
    connectMongoDB
} = require('../../database/connMongodb');


const {
    getMessages
} = require('../../exception');
const {
    ObjectId
} = require('mongodb');

const {
    findByIdAndDeleteDW
} = require('../services');
const {
    log
} = require('console');



const aggregateContacts = (showProjection, id, searchText, flagDownload) => {
    const loockupCompanies = {
        from: 'companies',
        localField: 'companie_id',
        foreignField: '_id',
        as: 'CompCont'
    };
    const loockupCity = {
        from: 'regions',
        localField: 'city_id',
        foreignField: '_id',
        as: 'CityCont'
    };
    const loockupCountry = {
        from: 'regions',
        localField: 'CityCont.parent',
        foreignField: '_id',
        as: 'CountryCont'
    };
    let res = [{
            $lookup: loockupCompanies
        },
        {
            $unwind: '$CompCont'
        },
        {
            $lookup: loockupCity
        },
        {
            $unwind: '$CityCont'

        },
        {
            $lookup: loockupCountry
        },
        {
            $unwind: '$CountryCont'

        }
    ]
    if (showProjection) {
        let projection;
        if (flagDownload) {
            projection = {
                $project: {
                    _id:0,
                    firstname: 1,
                    lastname: 1,
                    job: 1,
                    emailCompanie: 1,
                    address: 1,
                    "companieName": "$CompCont.name",
                    "cityName": "$CityCont.name",
                    "countryName": "$CountryCont.name"                   
                }
            }
        } else {
            projection = {
                $project: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    job: 1,
                    emailCompanie: 1,
                    address: 1,
                    "companieName": "$CompCont.name",
                    "cityName": "$CityCont.name",
                    "countryName": "$CountryCont.name",
                    channel: 1
                }

            }
        }
        res.push(projection);
    }

    if (id && !searchText) {
        const match = {
            $match: {
                _id: ObjectId(id)
            }
        }
        res.push(match);
    } else {


        if (!id && searchText) {
            const match = {
                $match: searchOption(searchText)
            }
            res.push(match);
        }

    }
    return res;
}

const searchOption = (searchText) => {
    const regEx = new RegExp(searchText, 'i')
    return {
        $or: [{
            firstname: regEx
        }, {
            lastname: regEx
        }, {
            job: regEx
        }, {
            emailCompanie: regEx
        }, {
            address: regEx
        }, {
            'companieName': regEx
        }, {
            'cityName': regEx
        }, {
            'countryName': regEx
        }]
    }
}


const index = async (req, res, next) => {
    const limit = (parseInt(req.query.limit)) ? parseInt(req.query.limit) : 5;
    const pageOffset = (parseInt(req.query.offset)) ? parseInt(req.query.offset) : 0;
    let searchText = '',
        paramSearch = '';

    if (req.query.text) {
        paramSearch = req.query.text;
    } else {
        searchText = {};
        paramSearch = '';

    }
    const options = aggregateContacts(true, '', paramSearch,false);

    const totalCount = await (await Contacts.aggregate(options)).length;


    const result = await Contacts.aggregate(options).skip(pageOffset > 0 ? ((pageOffset - 1) * limit) : 0)
        .limit(limit);
    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
        totalCount,
        limit,
        pageOffset,
        totalPages
    }

    res.status(200).json({
        result,
        pagination
    });
    next();
    return JSON.stringify(result);
};

const getAllContact = async (req, res) => {
    try {
        const result = await Contacts.find({});

        res.status(200).json({
            result
        });

        return JSON.stringify(result);
    } catch (error) {
        console.log(error);
    }
};


const findByIdContact = async (req, res, next) => {
    try {
        const options = aggregateContacts(false, req.params.id,'',false);

        const resultados = await Contacts.aggregate(options);
        const result = resultados[0]

        res.status(200).json({
            result
        });
        next();

        return JSON.stringify(result)

    } catch (error) {
        console.log(error);
    }
};

const createContact = async (req, res, next) => {
    let msg;
    try {
        const {
            firstname,
            lastname,
            job,
            emailCompanie,
            address,
            city_id,
            companie_id,
            channel
        } = req.body;
        const params = {
            firstname,
            lastname,
            job,
            emailCompanie,
            address,
            city_id: ObjectId(city_id),
            companie_id: ObjectId(companie_id),
            channel
        }

        const result = await Contacts.collection.insertOne(params);

        msg = getMessages(201, '', 'Registro creado correctamente. ', true);

        res.status(201).json({
            msg
        });
        //next();
    } catch (error) {
        console.log(error);
        msg = getMessages(error, req.body, error._message, true);

        res.status(400).json({
            msg
        });
    }
    return res;
};
const deleteContact = async (req, res, next) => {
    const {
        removeAll,
        arrID
    } = req.body;
    let arrObjectID = [];
    arrID.forEach(e => arrObjectID.push(ObjectId(e)));
    const result = await deleteAllContact(removeAll, arrObjectID);
    return res.status(result.code).json({
        result
    })
};

const deleteAllContact = async (removeAll, arrContacts) => {
    let res, message, status, flag;
    try {
        const result = (removeAll === 'Y') ? await Contacts.deleteMany() : await Contacts.deleteMany({
            _id: {
                $in: arrContacts
            }
        });

        let flag;
        if (result.ok === 1) {
            message = 'Se eliminaron correctamente los contactos. ';
            status = 200;
            flag = false;
        } else {
            message = 'Eliminación fallida!!';
            status = 400;
            flag = true;
        };

        res = getMessages(status, '', message, flag);

    } catch (error) {
        res = getMessages(error, '', false);
    }
    return res
};


const updateContact = async (req, res, next) => {

    let msg, status, message;
    try {

        const {
            firstname,
            lastname,
            job,
            emailCompanie,
            address,
            city_id,
            companie_id,
            channel
        } = req.body;
        const params = {
            firstname,
            lastname,
            job,
            emailCompanie,
            address,
            city_id: ObjectId(city_id),
            companie_id: ObjectId(companie_id)

        }

        const result = await Contacts.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: params
        });

        const searchChannel = await Contacts.aggregate(aggregateContacts(true, req.params.id,'',false))
        const arrChannel = searchChannel[0].channel;

        for (let index = 0; index < arrChannel.length; index++) {

            const channelPull = await Contacts.findOneAndUpdate({
                _id: req.params.id
            }, {
                $pull: {
                    'channel': arrChannel[index]
                }
            });
        }

        for (let index = 0; index < channel.length; index++) {
            const arrPush = {
                name: channel[index].name,
                type: channel[index].type,
                preference: channel[index].preference
            }


            const channelPush = await Contacts.findOneAndUpdate({
                _id: req.params.id
            }, {
                $push: {
                    "channel": arrPush
                }
            });
        }

        let flag;
        if (result) {
            message = 'Se modificó correctamente. ';
            status = 200;
            flag = false;
        } else {
            message = 'Nose realizó la modificación!!';
            status = 404;
            flag = true;
        };

        msg = getMessages(status, '', message, flag);
        res.status(status).json({
            msg
        });
    } catch (error) {
        //console.log(error);
        msg = getMessages(error, req.body, true);

        res.status(msg.code).json({
            msg
        });
    }
    return await res;

};


const uploadContacts = (req, res, next) => {

    return createManyContacts(req, res);
}

const createManyContacts = async (req, res) => {

    const fileData = req.file;
    const filePath = `./uploadCSV/${fileData.filename}`;

    const arrKey = ['firstname', 'lastname', 'job', 'emailCompanie', 'address', 'city_id', 'companie_id'];


    const stream = fs.createReadStream(filePath, {
        encoding: 'utf8'
    });


    const connectBulk = await connectMongoDB();
    const dbBulk = connectBulk.db(process.env.DBNAME);
    const collectionBulk = dbBulk.collection('contacts');
    const bulk = collectionBulk.initializeUnorderedBulkOp();

    stream.on('data', async (row) => {
            const result = convertArrayCVSToJSON(row, arrKey);

            try {
                result.forEach(element => {
                    const {
                        firstname,
                        lastname,
                        job,
                        emailCompanie,
                        address,
                        city_id,
                        companie_id
                    } = element;
                    const insertBulk = {
                        firstname,
                        lastname,
                        job,
                        emailCompanie,
                        address,
                        city_id: ObjectId(city_id),
                        companie_id: ObjectId(companie_id),
                        channel: []
                    }
                    bulk.insert(insertBulk);
                });
            } catch (error) {
                console.log(result.length);
            }

        })
        .on('end', async () => {

            fs.unlink(filePath, async (err) => {
                if (err) throw err;

                console.log(`file ${fileData.filename} deleted`);
            });

            let resultImport;
            try {
                await bulk.execute();

            } catch (error) {
                resultImport = error.result

            } finally {

                await connectBulk.close();
            }

            return res.status(201).json({
                resultImport
            });
        })
        .on('error', (e) => {
            fs.unlink(filePath, (err) => {
                if (err) throw err;

                console.log(`file ${fileData.filename} deleted`);
            });

            return res.status(500).json({
                err: '500',
                msg: 'Error inesperado'
            });
        });
}


const downloadContacts = (req, res) => {
    try {
        const options = aggregateContacts(true, '', '',true);

        const headers = [
            'NOMBRE', 'APELLIDO', 'CARGO', 'EMAIL', 'DIRECCION', 'COMPAÑIA', 'CIUDAD', 'PAIS'
        ]
        return download(res, Contacts, options, headers, 'contacts.csv', '', true);

    } catch (error) {
        console.log('ERROR', error);
    }
}
module.exports = {
    index,
    createContact,
    deleteContact,
    findByIdContact,
    updateContact,
    uploadContacts,
    getAllContact,
    downloadContacts
}