const urlApi = 'http://localhost:3000/';

const apiHeaders = () => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', sessionStorage.getItem('tokenDW'));
    return headers;
};

const apiHeadersCSV = () => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/csv');
    headers.append('Authorization', sessionStorage.getItem('tokenDW'));
    return headers;
};
const apiDW = async (endpoint, p_method, p_body, p_pagination, p_params) => {
    try {
        const header = apiHeaders();
        const options = {
            method: p_method,
            headers: header,
            body: p_body
        }
        
        const uri= urlApi + endpoint + p_params + p_pagination;
        console.log(uri);
        const result = (p_method === 'GET') ? await fetch(uri,{headers: header}) 
                                            : await fetch(uri,options); 
        
        
        if (result.status===401 && endpoint!=='auth/login'){
            login();
        }
        const json = await result.json();
        const res = {
            result,
            json
        }
        return res;
    } catch (error) {
        console.log(error);
        
        return error;
    }
};
const apiCreateDeleteModify = async (method, id, setting) => {
    const formulario = elementId(setting.forms);
    let dataJson = '',
        uri = '';

        if (setting.body){
            dataJson=JSON.stringify(setting.body)
        }else{
            dataJson = convertDataFormToJSON(formulario.elements);
        }       
        
    switch (method) {
        case 'POST':          
            uri = setting.endpoint;
            break;
        case 'PUT':
            uri = setting.endpoint + '/' + id;
            break;
        case 'DELETE':
            dataJson = JSON.stringify({
                _id: id
            });
            uri = setting.endpoint;
            break;
        default:
            break;
    }
    
    const res = await apiDW(uri,method , dataJson,'','');

    alertStatus(formulario, res.result.status, res.json.msg.messeage + ' ' + JSON.stringify(res.json.msg.valor))
    if (res.result.ok) {
        setting.edit = false;
        for (let el of formulario.elements) {
            if (el.name === 'save') {
                el.setAttribute('data-id', '');
            }
            if (el.type === 'password') {
                el.required = true;
            }
        };

        formulario.reset();
    }
    return res.result;
}