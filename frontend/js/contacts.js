const contactsView = async () => {
    localStorage.clear();
    const configDefault = {
        limit: 5,
        offset: 1,
        endpoint: 'contacts',
        forms: 'frmContacts',
        checkbox: true,
        action: false,
        grid: 'seccontacts-grid',
        columns: ['Nombre', 'Apellido', 'Cargo', 'Email', 'Dirección', 'Canales', 'Companía', 'Ciudad', 'País'],
        colspan: 0,
        totalCount:0,
        edit: false,
        dataId: 'city_id', // se utiliza para borrar el campo en la grilla y se usa para la acción Edit
        dataValue: 'CityCont',
        body: '',
        textSearch:'',
        canals: [{
                name: 'facebook',
                type: 'text'
            },
            {
                name: 'twitter',
                type: 'text'
            },
            {
                name: 'instagram',
                type: 'text'
            },
            {
                name: 'linkedin',
                type: 'text'
            },
            {
                name: 'whatsapp',
                type: 'tel'
            },
            {
                name: 'phone',
                type: 'tel'
            },
            {
                name: 'email',
                type: 'email'
            }
        ],
        preference: [{
            text: 'Sin preferencia',
            value: 'nopreference'
        }, {
            text: 'Canal favorito',
            value: 'favorite'
        }, {
            text: 'No molestar',
            value: 'molestar'
        }],
        avatar: 'channel',
        avataridx: 6
    };
    const secCont = handleCreateElement('section', 'seccontacts-cont', 'seccontacts-cont');
    const secHeader = handleCreateElement('header', 'secheader-cont', 'secheader-cont');
    const h1Header=handleCreateText('h1','titleContacts','titleContacts','Contactos');
    secHeader.appendChild(h1Header);
    const fabButton = floatingActionButton(secCont, configDefault);
    /*  const forms = formsContacts(configDefault); */
    const secGrid = handleCreateElement('section', 'seccontacts-grid', 'seccontacts-grid');
    await dataGridView(secGrid, configDefault);
    secHeader.appendChild(fabButton)
    secCont.appendChild(secHeader);
    //secCont.appendChild(forms);
    secCont.appendChild(secGrid);
    return await secCont;
};

const formsContacts = async (setting) => {
    removeElementId('frmContacts');
    const secForm = handleCreateElement('form', 'frmContacts', 'frmContacts');
    secForm.setAttribute('name', 'frmContacts');
    const txtNombre = handleCreateInput('Nombre', 'text', 'Nombre', 'firstname', true);
    const txtApellido = handleCreateInput('Apellido', 'text', 'Apellido', 'lastname', true);
    const txtCargo = handleCreateInput('Cargo', 'text', 'Cargo', 'job', true);
    const txtEmail = handleCreateInput('Email', 'email', 'Email', 'emailCompanie', true);
    const selCompanie = handleCreateElement('select', 'selPrincipal validate', 'selCmp');
    selCompanie.setAttribute('name', 'companie_id');
    const arrRows = await arrRowsCompanies();
    handelCreateSelectOptions(selCompanie, '', '', arrRows);
    const txtDireccion = handleCreateInput('Direccion', 'text', 'Dirección', 'address', true);
    const txtCity = handleCreateInputSearch();
    const canals = canalsContacts(setting);
    const btn = handleCreateElement('button', 'btn btn-primary btnCreateUser', 'btnCreateUser');
    btn.innerHTML = 'GRABAR';
    btn.setAttribute('name', 'save');
    btn.addEventListener('click', async (e) => {
        e.preventDefault();

        if (validateForms(secForm)) {
            let method = '',
                id = '';
            id = (e.target.dataset.id) ? e.target.dataset.id : id = '';
            (setting.edit) ? method = 'PUT': method = 'POST';
            const arrCanals = getInfoCanal(canals);
            let data = {
                firstname: txtNombre.value,
                lastname: txtApellido.value,
                job: txtCargo.value,
                emailCompanie: txtEmail.value,
                address: txtDireccion.value,
                city_id: elementId('txtCity').dataset.id,
                companie_id: selCompanie.value,
                channel: arrCanals
            };
            
            setting.body = data;
            const result = await apiCreateDeleteModify(method, id, setting);

            if (result.ok) {
                const secGrid = elementId(setting.grid);
                await dataGridView(secGrid, setting);
                removeElementId('frmContacts');
            }
        }
    }, false);
    secForm.appendChild(txtNombre);
    secForm.appendChild(txtApellido);
    secForm.appendChild(txtCargo);
    secForm.appendChild(txtEmail);
    secForm.appendChild(selCompanie);
    secForm.appendChild(txtDireccion);
    secForm.appendChild(txtCity);
    secForm.appendChild(canals);
    secForm.appendChild(btn);

    return secForm;
};


const arrRowsCompanies = async () => {
    let arrRows = [];
    arrRows.length = 0;
    let rows = {
        text: 'Seleccione Companía',
        value: '0'
    };
    arrRows.push(rows)
    const res = await apiDW('companies', 'GET', '', '', '');
    const arrResult = res.json.result;
    if (res.result.ok) {
        res.json.result.forEach(e => {
            rows = {
                text: e.name,
                value: e._id
            }
            arrRows.push(rows);
        });
    }
    return arrRows;
}

const getInfoCanal = (channels) => {
    let arrData = [];
    for (let liCanal of channels.children) {
        let canal = '';
        let data = {
            name: '',
            type: '',
            preference: ''
        }
        for (let el of liCanal.children) {
            if (el.tagName === 'INPUT' &&
                el.type === 'checkbox' &&
                el.checked) {
                canal = el.name;
                data.type = el.name;
            }
            if (canal === el.name &&
                el.tagName === 'INPUT' &&
                (el.type === 'text' || el.type === 'tel' || el.type === 'email') &&
                el.value) {
                data.name = el.value;
            }
            if (canal === el.dataset.name &&
                el.tagName === 'SELECT') {
                data.preference = el.value;
            }
            if (data.preference && data.type && data.name) {
                arrData.push(data);
            }
        }
    }
    return arrData;
};

const canalsContacts = (setting) => {
    const ulTag = handleCreateElement('ul', 'ulChannel', 'ulChannel');
    setting.canals.forEach(el => {
        const idChk = `chk${el.name}`;
        let placeholder = el.name;
        const txtCanal = handleCreateInput(`${el.name}`, `${el.type}`, placeholder, `${el.name}`, false);
        const chkCanal = handleCreateElement('input', 'chkCanal', idChk);
        chkCanal.setAttribute('type', 'checkbox');
        chkCanal.setAttribute('name', el.name);
        const labelCanal = handleCreateElement('label', '', '');
        labelCanal.setAttribute('for', idChk);

        const imgCanal = handleCrearImg(`images/canal${el.name}.png`, `${el.name}`, `${el.name}`, `img${el.name}`);
        labelCanal.appendChild(imgCanal);
        const selPreferenceCanal = preferenceCanal(setting, el.name);
        const liCanal = handleCreateElement('li', 'liCanal', 'liCanal');
        liCanal.appendChild(chkCanal);
        liCanal.appendChild(labelCanal);
        liCanal.appendChild(txtCanal);
        liCanal.appendChild(selPreferenceCanal);
        ulTag.appendChild(liCanal);

    });
    //fieldSet.appendChild(ulTag);
    return ulTag;
};

const preferenceCanal = (setting, id) => {
    const selPreference = handleCreateElement('select', 'selPrincipal', `sel${id}`);
    handelCreateSelectOptions(selPreference, '', '', setting.preference);
    selPreference.setAttribute('name', 'preference');
    selPreference.setAttribute('data-name', id);
    return selPreference;
}


const floatingActionButton = (contenedor, setting) => {
    const divFAB = handleCreateElement('div', 'divFAB', 'divFAB');
    const ulTag = handleCreateElement('ul', 'ulFAB', 'ulFAB');
    let liTag = handleCreateElement('li', 'liFAB', 'liFAB');

    const aTagAddContact = handleCreateElement('a', 'fabtn fabAddContact ', 'fabAddContact');
    aTagAddContact.setAttribute('href', '#');
    const imgAddContact = handleCrearImg('images/add_contact.png', 'Agregar Contacto', 'Agregar Contacto');
    aTagAddContact.appendChild(imgAddContact);
    aTagAddContact.addEventListener('click', async (e) => {
        if (ulTag.classList[1] === 'activeFAB') {
            ulTag.classList.remove('activeFAB');
        } else {
            ulTag.classList.add('activeFAB');
        }
        setting.edit = false;
        const forms = await formsContacts(setting);
        contenedor.appendChild(forms);
    }, false);

    liTag.appendChild(aTagAddContact);
    ulTag.appendChild(liTag);

    const aTagEditContact = handleCreateElement('a', 'fabtn fabEditContact ', 'fabEditContact');
    aTagEditContact.setAttribute('href', '#');
    const imgEditContact = handleCrearImg('images/edit_1.png', 'Editar Contacto', 'Editar Contacto');
    aTagEditContact.appendChild(imgEditContact);
    aTagEditContact.addEventListener('click', async (e) => {
        if (ulTag.classList[1] === 'activeFAB') {
            ulTag.classList.remove('activeFAB');
        } else {
            ulTag.classList.add('activeFAB');
        }
        setting.edit = true;
        const forms = await formsContacts(setting);
        const res = await loadInfoContactsInForms(setting, forms);

        contenedor.appendChild(forms);

    }, false);


    liTag.appendChild(aTagEditContact);
    ulTag.appendChild(liTag);

    const aTagDeleteContact = handleCreateElement('a', 'fabtn fabDeleteContact ', 'fabDeleteContact');
    aTagDeleteContact.setAttribute('href', '#');
    const imgDeleteContact = handleCrearImg('images/delete.png', 'Eliminar Contacto', 'Eliminar Contacto');
    aTagDeleteContact.appendChild(imgDeleteContact);
    aTagDeleteContact.addEventListener('click', async (e) => {
        if (window.confirm("¿Desea eliminar el/los registro/s?")) {
            const checkAll=elementId('checkbox-grid');
            if(checkAll.checked){
                setting.body=JSON.stringify({removeAll:'Y', arrID:[]})
             }else{
                 setting.body=JSON.stringify({removeAll:'N',arrID:Object.keys(localStorage)});
             }
            
             const res = await apiDW(setting.endpoint,'DELETE' , setting.body,'','');
             if (res.json.result.code===200){
                localStorage.clear();
             }
            const secGrid=elementId(setting.grid);
            await dataGridView(secGrid, setting); 
        }
        
    },false);
    liTag.appendChild(aTagDeleteContact);
    ulTag.appendChild(liTag);

    const aTagImportContact = handleCreateElement('a', 'fabtn fabImportContact ', 'fabImportContact');
    aTagImportContact.setAttribute('href', '#');
    const imgImportContact = handleCrearImg('images/importContact.png', 'Importar Contactos', 'Importar Contactos');
    aTagImportContact.appendChild(imgImportContact);
    aTagImportContact.addEventListener('click', async(e)=>{
        const controls = await createUploadControl(setting);
        const title ='Importar Contactos';
        setting.method = 'POST';
        openModalUpload(title, controls, setting,'');
    },false);

    liTag.appendChild(aTagImportContact);
    ulTag.appendChild(liTag);

    const aTagExportContact = handleCreateElement('a', 'fabtn fabExportContact ', 'fabExportContact');
    aTagExportContact.setAttribute('href', '#');
    const imgExportContact = handleCrearImg('images/download.png', 'Exportar Contactos', 'Exportar Contactos');
    aTagExportContact.appendChild(imgExportContact);
    aTagExportContact.addEventListener('click', async(e)=>{
        setting.method = 'GET';
        openModalDownload(setting);
    },false);
    liTag.appendChild(aTagExportContact);
    ulTag.appendChild(liTag);

    const aTagPlus = handleCreateElement('a', 'fabPlus', 'btnFAB');
    aTagPlus.setAttribute('href', '#')
    const iTag = handleCreateElement('i', 'fas fa-plus');
    aTagPlus.addEventListener('click', (e) => {
        if (ulTag.classList[1] === 'activeFAB') {
            ulTag.classList.remove('activeFAB');
        } else {
            ulTag.classList.add('activeFAB');
        }

    }, false);
    aTagPlus.appendChild(iTag);
    divFAB.appendChild(aTagPlus);
    divFAB.appendChild(ulTag);


    return divFAB
};




const loadInfoContactsInForms = async (setting, form) => {
    const idContact = getFirstChecked();
    const res = await apiDW(`${setting.endpoint}/${idContact}`, 'GET', '', '', '')
    if (res.result.ok) {
        const rows = res.json.result;
        const arrRows = Object.entries(rows);
        let valName = '';
        arrRows.forEach(([key, valor]) => {
            if (key === 'channel') {
                valor.forEach(e=> {
                    
                    for (let el of form.elements) {
                            if (el.id===`chk${e.type}`){
                                el.checked=true
                            }
                            if (el.id===`sel${e.type}`){
                                el.value=e.preference;
                            }
                            if (el.id===`txt${e.type}`){
                                el.value=e.name;
                            }
                    }
                });
                
            }
        });
        for (let el of form.elements) {

            if (el.name === 'save') {
                el.setAttribute('data-id', rows._id);
            }
            arrRows.forEach(([key, valor]) => {

                if (key === setting.dataValue) {
                    valName = valor.name;
                }
                if (key === el.name) {
                    if (key === setting.dataId) {
                        el.setAttribute('data-id', valor);
                        el.value = valName;
                    } else {
                        el.value = valor;
                    }
                }
            });


        }
    }
    return res;
};

const avatarChannels = (arrAvatar) => {
    const ulTag = handleCreateElement('ul', 'ulAvatar', 'ulAvatar');
    arrAvatar.forEach(el => {
        const imgCanal = handleCrearImg(`images/canal${el.type}.png`, `${el.type}`, `${el.type}`, `img${el.type}`);
        const liCanal = handleCreateElement('li', 'liAvatar', 'liAvatar');
        liCanal.appendChild(imgCanal);
        ulTag.appendChild(liCanal);
    });
    return ulTag;
};

const createUploadControl=async (setting)=>{
    const frmUpload = handleCreateElement('form', 'fileupload');
    frmUpload.setAttribute('name','fileupload');
    frmUpload.setAttribute('action','#');
    
    const input = handleCreateElement('input', 'fileContacts','fileContacts');
    input.setAttribute('type','file');
    input.setAttribute('name','file');
    input.setAttribute('accept','.csv');
    frmUpload.appendChild(input);


   /* const inputUp = handleCreateElement('button', 'btn btn-primary','fileUpContacts');
    inputUp.setAttribute('type','submit');
    inputUp.innerHTML='SUBIR'
    inputUp.addEventListener('click',async (e)=>{
        e.preventDefault();
        const result= await SaveImportContacts();
        const secGrid=elementId(setting.grid);
        await dataGridView(secGrid, setting);
        removeElementId('modal');
    });  */
    
    
    /* frmUpload.appendChild(inputUp);  */
    return await frmUpload;
}

const openModalUpload = async (p_title, body, setting,id) => {
    const title = handleCreateText('h1', 'titleModal', 'titleModal', p_title);

    const footer = handleCreateElement('div', 'div-footer');
    const btnUpload = handleCreateElement('button', 'btn btn-primary btnSave', '');
    btnUpload.innerHTML = 'SUBIR';
    btnUpload.addEventListener('click', async (e) => {
        e.preventDefault();
        const result= await SaveImportContacts();
        const secGrid=elementId(setting.grid);
        await dataGridView(secGrid, setting);
        removeElementId('modal');
    }, false);

    const btnClose = handleCreateElement('button', 'btn btn-secondary btnClose', '');
    btnClose.innerHTML = 'CERRAR';
    btnClose.addEventListener('click', (e) => {
        removeElementId('modal');
    }, false);
    footer.appendChild(btnUpload);
    footer.appendChild(btnClose);

    const modal = await handleModal(title, body, footer);


    return modal;
}

const optionsDownload=()=>{
    const divControls= handleCreateElement('div','divDownload','divDownload');
    const inputContacts=handleCreateElement('input','downContact','downContact');
    inputContacts.setAttribute('value','contacts');
    inputContacts.setAttribute('name','download');
    inputContacts.setAttribute('type','radio');
    inputContacts.setAttribute('checked',true);
    const labelContacts=handleCreateText('label','','lblcontacts','Contactos');
    labelContacts.setAttribute('for','contacts');
    divControls.appendChild(inputContacts);
    divControls.appendChild(labelContacts);
    const inputRegions=handleCreateElement('input','downRegion','downRegion');
    inputRegions.setAttribute('value','regions');
    inputRegions.setAttribute('name','download');
    inputRegions.setAttribute('type','radio');
    const labelRegions=handleCreateText('label','','lblregions','Regiones');
    labelRegions.setAttribute('for','regions');
    divControls.appendChild(inputRegions);
    divControls.appendChild(labelRegions);
    const inputCompanie=handleCreateElement('input','downCompanie','downCompanie');
    inputCompanie.setAttribute('value','companies');
    inputCompanie.setAttribute('name','download');
    inputCompanie.setAttribute('type','radio');
    const labelCompanies=handleCreateText('label','','lblcompanies','Compañías');
    labelCompanies.setAttribute('for','companies');
    divControls.appendChild(inputCompanie);
    divControls.appendChild(labelCompanies);
    return divControls;
}
const openModalDownload = async (setting) => {
    const body=optionsDownload();
    const title = handleCreateText('h1', 'titleModal', 'titleModal', 'Descargar');

    const footer = handleCreateElement('div', 'div-footer');
    const btnUpload = handleCreateElement('button', 'btn btn-primary btnSave', '');
    btnUpload.innerHTML = 'DESCARGAR';
    btnUpload.addEventListener('click', async (e) => {
        e.preventDefault();
 /*        const result= await SaveImportContacts();
        const secGrid=elementId(setting.grid);
        await dataGridView(secGrid, setting); */
        let endpoint='',filename='';
        const contact=elementId('downContact').checked;
        const region=elementId('downRegion').checked;
        const companie=elementId('downCompanie').checked;
        if (contact){
            endpoint='contacts/download';
            filename='contacts.csv';
        }
        if (region){
            endpoint='regions/download';
            filename='regions.csv';
        }
        if (companie){
            endpoint='companies/download';
            filename='companies.csv';
        }
        
       
    
        await handleDownload(urlApi+endpoint,filename);
        
        //removeElementId('modal');
    }, false);

    const btnClose = handleCreateElement('button', 'btn btn-secondary btnClose', '');
    btnClose.innerHTML = 'CERRAR';
    btnClose.addEventListener('click', (e) => {
        removeElementId('modal');
    }, false);
    footer.appendChild(btnUpload);
    footer.appendChild(btnClose);

    const modal = await handleModal(title, body, footer);


    return modal;
}

const handleDownload = async (endpoint,filename) => {
    const header = apiHeadersCSV();
    const options = {
        method: 'GET',
        headers: header
    }
    let a = document.createElement('a');
    let response = await fetch(endpoint,options);
    let file = await response.blob();
    a.download = filename;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/csv', a.download, a.href].join(':');
    a.click(); 
};

const SaveImportContacts = async ()=>{

    const formData= new FormData();
    const file= elementId('fileContacts').files[0];
        
    formData.append("file",file)
    
    try {
        const header = apiHeadersCSV();
        const options = {
            method: 'POST',
            headers: header,
            body: formData
        }
    
        const result=await fetch(urlApi+'contacts/upload',options);
       return result;
    } catch (error) {
        console.log(error);
    }

}