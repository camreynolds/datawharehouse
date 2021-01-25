const regionsView = async () => {
    const configDefault = {
        endpoint: 'regions',
        forms: 'frmRegions',
        edit: false,
        method: '',
        body: {}
    };
    const secRegionCont = handleCreateElement('section', 'secregion-cont', 'secregion-cont');
    const frmRegion = handleCreateElement('form', 'frmRegions', 'frmRegions');
    frmRegion.setAttribute('name', 'frmRegions');
    frmRegion.setAttribute('action', '');
    const titRCC = handleCreateText('h1', 'titRCC', 'titRCC', 'Crear Región/País/Ciudad');
    const btnregion = handleCreateElement('button', 'btnRegion', 'btnRegion');
    btnregion.addEventListener('click', async (e) => {
        const controls = await createControlsRegionCountryCity(configDefault, '', '', 'Region', '')
        const title = titleRegionCountryCity('ADD', 'Region');
        configDefault.method = 'POST';
        openModal(title, controls, configDefault,'');
    }, false);
    const regiones = await treeViewRegions(configDefault);
    
    frmRegion.appendChild(titRCC);
    frmRegion.appendChild(btnregion);
    frmRegion.appendChild(regiones);
    secRegionCont.appendChild(frmRegion);
    return await secRegionCont;
};





const treeViewRegions = async (setting) => {
    removeElementId('ulRegion');
    const res = await apiDW(setting.endpoint, 'GET', '', '', '');
    
    const ulRegion = await addRegion(res.json.result, 'Region', setting);
    return ulRegion;
};


const addRegion = async (rows, type, setting) => {
    const ulRegion = handleCreateElement('ul', 'ulRegion', 'ulRegion');

    rows.filter(el => el.type === type)
        .forEach(e => {
            const liRegion = handleCreateElement('li', 'liRegion');
            liRegion.setAttribute(`data-region-id`, e._id);
            liRegion.setAttribute(`data-type`, e.type);
            const spanRegion = spanRegionCountryEventClick(e.name, 'spanRegion');
            liRegion.appendChild(spanRegion);
            const addButtonRegion = addButtonActionRegionCountryCity(setting, e._id, true, e.type, 'Country', e.parent, e.name);
            liRegion.appendChild(addButtonRegion);
            addCountry(liRegion, e.children, setting, rows);
            ulRegion.appendChild(liRegion)

        })

    return await ulRegion;
}

const addCountry = (liRegion, countries, setting, rows) => {
    const ulCountry = handleCreateElement('ul', 'nested ulCountry', 'ulCountry');
    countries.forEach(child => {
        const liCountry = handleCreateElement('li', `liCountry`);
        liCountry.setAttribute(`data-country-id`, child._id);
        liCountry.setAttribute(`data-type`, child.type);
        const spanCountry = spanRegionCountryEventClick(child.name, 'spanCountry');
        const addButtonCountry = addButtonActionRegionCountryCity(setting, child._id, true, child.type, 'City', child.parent, child.name);
        liCountry.appendChild(spanCountry);
        liCountry.appendChild(addButtonCountry);
        const city = addCity(rows, child._id, setting);
        liCountry.appendChild(city);
        ulCountry.appendChild(liCountry);
        liRegion.appendChild(ulCountry);
    });

    return;
}

const spanRegionCountryEventClick = (description, spanClass) => {
    const span = handleCreateText('span', `caret ${spanClass}`, '', description);
    span.addEventListener('click', (e) => {
        e.target.parentElement.querySelector(".nested").classList.toggle("active");
        e.target.classList.toggle("caret-down");
    });

    return span;
};

const addCity = (rows, id, setting) => {
    const ulCity = handleCreateElement('ul', 'nested ulCity', 'ulCity');
    rows.filter(el => el.parent === id)
        .forEach(e => {
            const liCity = handleCreateElement('li', `liCity`);
            liCity.setAttribute(`data-city-id`, e._id);
            liCity.setAttribute(`data-type`, e.type);
            const spanCity = handleCreateText('span', `spanCity`, '', e.name);
            const addButtonCity = addButtonActionRegionCountryCity(setting, e._id, false, e.type, '', e.parent, e.name);
            liCity.appendChild(spanCity);
            liCity.appendChild(addButtonCity);
            ulCity.appendChild(liCity);
        });
    return ulCity;
};


const selectRegionCountryCity = () => {
    const selRCC = handleCreateElement('select', 'selPrincipal validate');
    selRCC.setAttribute('name', 'parent');
}

const titleRegionCountryCity = (action, type) => {
    let description = '';
    let typeString = '';
    switch (action) {
        case 'ADD':
            description = 'Agregar ';
            break;
        case 'EDIT':
            description = 'Modificar ';
            break
        default:
            break;
    };
    switch (type) {
        case 'Country':
            typeString = 'País';

            break;
        case 'City':
            typeString = 'Ciudad';
            break;
        default:
            typeString = 'Región';
            break;
    }
    return description.concat(typeString);
};
const addButtonActionRegionCountryCity = (setting, id, viewAdd, type, addType, parent_id, name) => {

    const divTag = handleCreateElement('div', 'button-actions', 'button-actions');
    if (viewAdd) {
        const addButtonActionAdd = handleCreateElement('button', 'btnAction btnAdd');
        addButtonActionAdd.setAttribute('data-id', id);
        addButtonActionAdd.setAttribute('data-type', addType);
        addButtonActionAdd.addEventListener('click', async (e) => {

            const controls = await createControlsRegionCountryCity(setting, id, id, addType, '')
            const title = titleRegionCountryCity('ADD', addType);
            setting.method = 'POST';
            openModal(title, controls, setting, '');

        }, false);
        divTag.appendChild(addButtonActionAdd);
    }
    const addButtonActionDelete = handleCreateElement('button', 'btnAction btnDelete');
    addButtonActionDelete.setAttribute('data-id', id);
    addButtonActionDelete.setAttribute('data-parent-id', parent_id);
    addButtonActionDelete.setAttribute('data-type', type);
    addButtonActionDelete.addEventListener('click', async(e) => {
        if (window.confirm("¿Desea eliminar el registro?")) {
            let body={};
            if(e.target.dataset.type==='City'){
                 body={
                    _id:e.target.dataset.id
                }
                const res = await apiDW(setting.endpoint, 'DELETE', JSON.stringify(body), '', '');
                
            }else{
                const res = await apiDW(setting.endpoint, 'GET', '', '', '');
                    res.json.result.filter(el=> el.parent===e.target.dataset.id)
                    .forEach(ec=>{
                         body={
                            _id:ec._id
                        }
                       
                         const resultDelete =  apiDW(setting.endpoint, 'DELETE', JSON.stringify(body), '', '');
                         resultDelete.then(el=>{
                             console.log('resultDelete',el);
                         });
                         ec.children.forEach(child=>{
                            body={
                                _id:child._id
                            }
                    
                            const resultDelete =  apiDW(setting.endpoint, 'DELETE', JSON.stringify(body), '', '');
                            resultDelete.then(el=>{
                                console.log('resultDelete CHILD',el);
                            });
                         })
                    });
                    body={
                        _id:e.target.dataset.id
                    }
                    const resultDelete = await apiDW(setting.endpoint, 'DELETE', JSON.stringify(body), '', '');
            }
            const fmrRegion=elementId(setting.forms);
            const regiones = await treeViewRegions(setting);
            fmrRegion.appendChild(regiones);

        }
    }, false);
    const addButtonActionEdit = handleCreateElement('button', 'btnAction btnEdit');
    addButtonActionEdit.setAttribute('data-id', id);
    addButtonActionEdit.setAttribute('data-parent-id', parent_id);
    addButtonActionEdit.setAttribute('data-type', type);
    addButtonActionEdit.setAttribute('data-name', name);
    addButtonActionEdit.addEventListener('click', async (e) => {
        setting.method = 'PUT';
        setting.edit = true;
        const controls = await createControlsRegionCountryCity(setting, e.target.dataset.parentId,
            e.target.dataset.id, e.target.dataset.type, e.target.dataset.name)
        const title = titleRegionCountryCity('EDIT', e.target.dataset.type);
        openModal(title, controls, setting, e.target.dataset.id);
        
    }, false);


    divTag.appendChild(addButtonActionEdit);
    divTag.appendChild(addButtonActionDelete);
    return divTag;
};

const createControlsRegionCountryCity = async (setting, parent_id, id, type, name) => {
    const divContrtols = handleCreateElement('div', 'divControls');
    const input = handleCreateInput('Nombre', 'text', 'Nombre', 'name', true);
    input.setAttribute('data-parent-id', parent_id);
    input.setAttribute('data-id', id);
    input.setAttribute('data-type', type);
    input.value = name;
    if (setting.edit && parent_id !== 'null') {
        const params = (type === 'Country') ? '?type=Region' : '?type=Country';
        const res = await loadRegionCountryCity(setting.endpoint, params);
       
        const selectRC = handleCreateElement('select', 'selPrincipal validate');
        selectRC.setAttribute('name','parent');
        let arrRows = [];
        res.json.result.forEach(e => {
       
            const rows = {
                text: e.name,
                value: e._id
            }
            arrRows.push(rows);
        })
        handelCreateSelectOptions(selectRC, '', '', arrRows);
        selectRC.value = parent_id;
        divContrtols.appendChild(selectRC);
    }
    divContrtols.appendChild(input);
    return await divContrtols;
}

const loadRegionCountryCity = async (endpoint, params) => {
    return await apiDW(endpoint + '/all', 'GET', '', '', params)
}


const openModal = async (p_title, body, setting,id) => {
    const title = handleCreateText('h1', 'titleModal', 'titleModal', p_title);

    const footer = handleCreateElement('div', 'div-footer');
    const btnSave = handleCreateElement('button', 'btn btn-primary btnSave', '');
    btnSave.innerHTML = 'GRABAR';
    btnSave.addEventListener('click', async (e) => {
        e.preventDefault();
        const names = document.getElementById('modal-content');
        let data = {
            name: '',
            type: '',
            parent: ''
        };
        for (let el of names.elements) {
            if (el.dataset.parentId !== undefined && !setting.edit) {
                data.parent = el.dataset.parentId;
            }
            if (el.dataset.type !== undefined) {
                data.type = el.dataset.type
            }
            if (el.name === 'name') {
                data.name = el.value;
            }
            if (el.tagName==='SELECT' && setting.edit){
                data.parent=el.value;
            }
            
        }

        
        setting.body = data;
        setting.forms = 'modal-content';
        const result=await apiCreateDeleteModify(setting.method, id, setting);
        if (result.ok) {
            setting.forms = 'frmRegions';
            const fmrRegion=elementId(setting.forms);
            const regiones = await treeViewRegions(setting);
            fmrRegion.appendChild(regiones);
              
        }
    }, false);

    const btnClose = handleCreateElement('button', 'btn btn-secondary btnClose', '');
    btnClose.innerHTML = 'CERRAR';
    btnClose.addEventListener('click', (e) => {
        removeElementId('modal');
    }, false);
    footer.appendChild(btnSave);
    footer.appendChild(btnClose);

    const modal = await handleModal(title, body, footer);


    return modal;
}