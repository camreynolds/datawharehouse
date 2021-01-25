const { getMessages } = require('../exception');
const { ObjectId } = require('mongodb');

const deleteManyDW = async (models, req, res) => {
    let msg, status, message;
    try {
        const {
            query
        } = req.body;

        const result = await models.deleteMany(query);
     
        let flag;
        if (result) {
            message = 'Se eliminó correctamente. ';
            status = 200;
            flag=false;
        } else {
            message = 'Eliminación fallida!!';
            status = 400;
            flag=true;
        };
        
        msg = getMessages(status,'', message, flag);

        res.status(status).json({
            msg
        });
    } catch (error) {
        
        msg = getMessages(error,req.body,false);
        
        res.status(msg.code).json({
            msg
        });
    }
    return res;
};


const findByIdAndDeleteDW = async (models, req, res) => {
    let msg, status, message;
    try {
        const {
            _id
        } = req.body;
        //const params={_id: ObjectId(_id)}
        const result = await models.findByIdAndRemove(_id);
        let flag;
        if (result) {
            message = 'Se eliminó correctamente. ';
            status = 200;
            flag=false;
        } else {
            message = 'Eliminación fallida!!';
            status = 400;
            flag=true;
        };
        
        msg = getMessages(status,'', message, flag);

        res.status(status).json({
            msg
        });
    } catch (error) {
        
        msg = getMessages(error,req.body,false);
        
        res.status(msg.code).json({
            msg
        });
    }
    return res;
};

const saveDW = async (models, req, res) => {
    let msg;
    try {
        const model = new models(req.body);
        const result = await model.save();
       
        msg = getMessages(201,'','Registro creado correctamente. ',true);   

        res.status(201).json({
            msg
        });
    } catch (error) {
        console.log(error);
        msg = getMessages(error,req.body,error. _message,true);
        console.log(msg);
        res.status(400).json({
            msg
        });
    }
    return res;
};




const findOneAndUpdateDW = async (models, req, res) => {
    let msg, status, message;
    try {
        const result = await models.findOneAndUpdate({_id: req.params.id},{$set:req.body});
        let flag;
        if (result) {
            message = 'Se modificó correctamente. ';
            status = 200;
            flag=false;
        } else {
            message = 'Nose realizó la modificación!!';
            status = 404;
            flag=true;
        };
 
        msg = getMessages(status,'', message, flag);
        res.status(status).json({
            msg
        });
    } catch (error) {
        console.log(error);
        msg = getMessages(error,req.body,false);
        
        res.status(msg.code).json({
            msg
        });
    }
    return res;
};


const findAll = async (models, req, res, option, limit , pageOffset,searchText) => {
    try {
    
        
        const totalCount = await models.find(searchText);
        
        const result = await models.find(searchText, option)
                                                    .skip( pageOffset>0 ? ((pageOffset-1)*limit) :0 )
                                                    .limit(limit);
        const totalPages=Math.ceil(totalCount.length/limit);
        const pagination={
            totalCount:totalCount.length,
            limit,
            pageOffset,
            totalPages
        }

        const search={
            result,
            pagination
        }
        
        res.status(200).json(search);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message
        });
    }
    return;
};


const findAllNotPagination = async (models, req, res, option,params) => {
    try {
        const result = await models.find(params, option)
        res.status(200).json({result});
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message
        });
    }
    return;
};

const findByIdDW = async (models, req, res, option) => {
    try {
        const result = await models.findById(req.params.id,option)
            
        res.status(200).json({result});
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message
        });
    }
    return;
};
module.exports = {
    findByIdAndDeleteDW,
    saveDW,
    findAll,
    findByIdDW,
    findOneAndUpdateDW,
    findAllNotPagination,
    deleteManyDW
};