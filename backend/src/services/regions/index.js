const { aggregate } = require('../../models/Regions');
const Regions = require('../../models/Regions');
const { download } = require('../../utils');

const {
    findAllNotPagination,
    findByIdAndDeleteDW,
    saveDW,
    findOneAndUpdateDW,
    deleteManyDW
} = require('../services');

const aggregateRegions=()=>{
    return [
        { 
            $graphLookup:{
                from: "regions",
                startWith: "$_id",
                connectFromField: "parent",
                connectToField: "parent",
                as: "children"
            }
        },
        {
            $match :{type: "Country"}
        },
        {
            $unwind: "$children"
        },
        {
            $project:{
                "cityID": "$children._id",
                "cityName": "$children.name",
                "country":"$name",
                _id:0
            }
        }
        ];
};

const index = async (req, res, next) => {
    const result = await Regions.aggregate().graphLookup({
        from: "regions",
        startWith: "$_id",
        connectFromField: "parent",
        connectToField: "parent",
        as: "children"
    });
    res.status(200).json({
        result
    })
    next();
    return JSON.stringify(result);
}

const createRegionCountryCity = async (req, res, next) => {

    if (!req.body.parent) {
        delete req.body.parent;
    }
    const result = await saveDW(Regions, req, res, next);
    res = result;
    next();
    return res;
};

const deleteRegionCountryCity = async (req, res, next) => {
    return await findByIdAndDeleteDW(Regions, req, res);
}

const updateRegionCountryCity = async (req, res, next) => {
    return await findOneAndUpdateDW(Regions, req, res);
}
const getAllRegionsCountryCity = async (req, res, next) => {
    let params;
    if (req.query.type && req.query.name) {
        params = {
            $and: [{
                type: "City"
            }, {
                name: {
                    '$regex': `.*${req.query.name}.*`,
                    '$options': 'i'
                }
            }]
        }
    } else {
        if (req.query.type && !req.query.name){
            params = {
                type: req.query.type
            }
        }else {
            params = {
                parent: req.query.parent
            }
        }
    }
    const option = {
        _id: 1,
        parent: 1,
        name: 1,
        type: 1
    }
 
    const result = await findAllNotPagination(Regions, req, res, option, params)

    res.status(200).json({
        result
    })
    next();
    return JSON.stringify(result);
}

const downloadRegions =(req,res)=>{
    try {
        const opt=aggregateRegions();
        
        const headers=[
            'CITY_ID','NAME','COUNTRY'
        ]
        return download(res, Regions, opt, headers,'citys.csv', '', true);

    } catch (error) {
        console.log('ERROR', error);
    }
}
module.exports = {
    createRegionCountryCity,
    updateRegionCountryCity,
    deleteRegionCountryCity,
    index,
    getAllRegionsCountryCity,
    downloadRegions
}