const E11000 = 'Clave duplicada';
const OK = 'OK!!!';
const EREQUIRED = 'Se debe completar los campos requeridos.'


const getMessages = (err, body, message, flagErr) => {
    const v_body = Object.keys(body);
    let errHttp, v_valor = '',
        flagReplaceMsg = false;

    if (flagErr && typeof err.code === 'undefined') {
        let flag = true;
        if (v_body.length === 0) {
            errHttp=err
            flagReplaceMsg=true;
        } else {
            v_body.forEach(e => {
                if (flag && typeof err.errors[e] !== 'undefined') {
                    flag = false;
                    errHttp = 409;
                    if (typeof err.errors[e].properties !== 'undefined' && err.errors[e].properties.type === 'required') {
                        flagReplaceMsg = false;
                    } else {
                        flagReplaceMsg = true;
                    }
                };
            });
        }
    } else {
        errHttp = err.code || err;
        v_valor = err.keyValue;
    }
    return errorMessages(errHttp, v_valor, message, flagReplaceMsg);

}

const errorMessages = (code, p_valor, p_message, replaceMsg) => {
    let err = {};
    let message = '',
        valor = p_valor;

    switch (code) {
        case 201:
        case 200:
            message = p_message;
            valor = OK;
            break;
        case 409:
            message = (!replaceMsg) ? EREQUIRED : p_message;
            break
        case 11000:
            message = E11000;
            code = 409;
            break;
        default:
            message = p_message;
            break;
    }

    err = {
        code: code,
        messeage: message,
        valor: valor
    }
    return err;
};

module.exports = {
    getMessages
};