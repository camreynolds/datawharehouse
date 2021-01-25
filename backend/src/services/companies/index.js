const Companies = require('../../models/Companies');
const messeageError = require('../../exception');
const {
    ObjectId
} = require('mongodb');
const {
    findByIdAndDeleteDW,
    saveDW,
    findAll,
    findByIdDW,
    findOneAndUpdateDW
} = require('../services');

const {
    download
} = require('../../utils');

const aggregateCompanies = (showProjection, id, searchText) => {
    const loockupCity = {
        from: 'regions',
        localField: 'city_id',
        foreignField: '_id',
        as: 'city'
    };
    const loockupCountry = {
        from: 'regions',
        localField: 'city.parent',
        foreignField: '_id',
        as: 'country'
    };
    const loockupRegions = {
        from: 'regions',
        localField: 'country.parent',
        foreignField: '_id',
        as: 'region'
    };
    let res = [{
            $lookup: loockupCity
        },
        {
            $unwind: '$city'
        },
        {
            $lookup: loockupCountry
        },
        {
            $unwind: '$country'
        },
        {
            $lookup: loockupRegions
        },
        {
            $unwind: '$region'
        },
        {
            $sort: {
                name: 1
            }
        }
    ]

    if (showProjection) {
        const projection = {
            $project: {
                _id: 1,
                name: 1,
                address: 1,
                email: 1,
                phone: 1,
                "cityName": "$city.name",
                "countryName": "$country.name",
                city_id: 1
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
        res.unshift(match);
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
            name: regEx
        }, {
            address: regEx
        }, {
            email: regEx
        }, {
            phone: regEx
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
    const options=aggregateCompanies(true, '', paramSearch);
    const totalCount = (await Companies.aggregate(options)).length;
    const result = await Companies.aggregate(options).skip(pageOffset > 0 ? ((pageOffset - 1) * limit) : 0)
        .limit(limit);
    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
        totalCount,
        limit,
        pageOffset,
        totalPages
    }

    const search = {
        result,
        pagination
    }

    res.status(200).json({
        result,
        pagination
    });
    next();
    return JSON.stringify(result);
};

const findByIdCompanies = async (req, res, next) => {
    try {
        const oiptions = aggregateCompanies(true, req.params.id);
        const resultados = await Companies.aggregate(oiptions);
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

const createCompanies = async (req, res, next) => {
    const result = await saveDW(Companies, req, res, next);
    res = result;
    next();
    return res;
};

const deleteCompanies = async (req, res, next) => {

    return await findByIdAndDeleteDW(Companies, req, res);
};

const updateCompanies = async (req, res, next) => {
    return await findOneAndUpdateDW(Companies, req, res);
};

const downloadCompanies = (req, res) => {
    try {
        const opt = {
            _id: 1,
            name: 1
        };
        const headers = [
            'ID',
            'NAME'
        ];


        return download(res, Companies, opt, headers, 'companies.csv', '{}', false);

    } catch (error) {
        console.log('ERROR', error);
    }

};



module.exports = {
    index,
    createCompanies,
    deleteCompanies,
    findByIdCompanies,
    updateCompanies,
    downloadCompanies
}