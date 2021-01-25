const {
    getMessages
} = require('../exception');

const path = require('path');

const multer = require('multer');





let started = false;


const docToCSV = (doc) => {
    return Object.values(doc).join(';');
}


const start = (response, headers, filename) => {
    response.setHeader('Content-disposition', `attachment; filename=${filename}`);
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.write(headers + '\n');
    started = true;
}

const download = async (res, models, optionSelect, headerCSV, filename, params, flagAggregate) => {
    const headers = headerCSV.join(';');

    let query;
    if (!flagAggregate) {
        query = models.find(params, optionSelect)
        console.log('QUERY', query);
        query.stream()
            .on('data', (doc) => {
                if (!started) {
                    start(res, headers, filename);
                }
                const dataCSV = docToCSV(doc) + '\n';
                res.write(dataCSV);
            })
            .on('close', () => {
                res.end();
            })
            .on('error', (err) => {
                res.send(500, {
                    err: err,
                    msg: "Fallo al obtener los datos de la base de datos."
                });
            });
    } else {
        query = await models.aggregate(optionSelect)

        query.forEach(element => {
            if (!started) {
                start(res, headers, filename);
            }
            const dataCSV = docToCSV(element) + '\n';
            res.write(dataCSV);
        });

        res.end();

    }



}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploadCSV');
    },
    filename: (req, file, cb) => {


        cb(null, file.originalname.split('.')[0] + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage
});

const convertArrayCVSToJSON = (row, key) => {
    let result = [];
    
    const read = row.trim().replace(/\r/g, '').split('\n');
    // const key = read[0].split(';');
    read.forEach(element => {
        const arrValue = element.split(';');
        const objJson = arrValue.reduce((objJson, field, index) => {
            if (field !== key[index]) {
                objJson[key[index]] = field;

            }
            return objJson;

        }, {});
        
        if (Object.keys(objJson).length > 0) {

            result.push((objJson));
        }
    


    });
    //console.log(result);
    return result
}



module.exports = {
    download,
    upload,
    convertArrayCVSToJSON
}