const companiesView = async () => {
    const configDefault={
        limit: 5,
        offset: 1,
        endpoint: 'companies',
        forms: 'frmCompanies',
        checkbox: false,
        action: true,
        grid: 'seccompanie-grid',
        columns: ['Nombre', 'Dirección', 'Email', 'Teléfono','Ciudad','País'],
        colspan: 0,
        totalCount:0,
        edit: false,
        dataId:'city_id', // se utiliza para borrar el campo en la grilla y se usa para la acción Edit
        dataValue:'cityName',
        body:'',
        textSearch:''
    };
    const secCont = handleCreateElement('section', 'seccompanie-cont', 'seccompanie-cont');
    const secForm = handleCreateElement('form', 'seccompanie-form', 'frmCompanies');
    secForm.setAttribute('name','frmCompanies');
    const secGrid = handleCreateElement('section', 'seccompanie-grid', 'seccompanie-grid');
    await dataGridView(secGrid, configDefault);
    const title = handleCreateText('h1', 'titCompanies', 'titCompanies', 'Crear Companía');
    const txtNombre = handleCreateInput('NomComp', 'text', 'Nombre', 'name', true);
    const txtDireccion = handleCreateInput('DirComp', 'text', 'Dirección', 'address', true);
    const txtEmail = handleCreateInput('Email', 'email', 'Email', 'email', true);
    const txtTelefono = handleCreateInput('Telefono', 'text', 'Teléfono', 'phone', true);
    const txtCity =handleCreateInputSearch();

    const btn = handleCreateElement('button', 'btn btn-primary btnCreateCompanie', 'btnCreateCompanie');
    btn.innerHTML = 'GRABAR';
    btn.setAttribute('name','save')
    btn.addEventListener('click', async(e) => {
        e.preventDefault();
        if (validateForms(secForm)) {
            let method = '',
                id = '';          
            id =(e.target.dataset.id) ? e.target.dataset.id: id = '';
            const city_id=(elementId('txtCity').dataset.cityId)? elementId('txtCity').dataset.cityId : elementId('txtCity').dataset.id;
            (configDefault.edit) ? method = 'PUT': method = 'POST';
            let data = {
                name: txtNombre.value,
                address:txtDireccion.value,
                email: txtEmail.value,
                phone:txtTelefono.value,
                city_id: city_id
            };
            configDefault.body=data;
            
            const result= await apiCreateDeleteModify(method, id, configDefault);

            if (result.ok){
                await dataGridView(secGrid, configDefault); 
            } 
        }
    }, false);
    

    secForm.appendChild(title);
    secForm.appendChild(txtNombre);
    secForm.appendChild(txtDireccion);
    secForm.appendChild(txtEmail);
    secForm.appendChild(txtTelefono);
    secForm.appendChild(txtCity);
    secForm.appendChild(btn);
    secCont.appendChild(secForm);
    secCont.appendChild(secGrid);
    return secCont;
};



const handleCreateInputSearch=()=>{
    const divsgContainerSearch = handleCreateElement('div', 'sg-container-search', 'sg-container-search');
    const inputSearch = handleCreateInput('City', 'search', 'Busca Ciudad', 'city_id', true);

    inputSearch.addEventListener('search', (e) => {
        if (e.target.value === '') {
            removeComponentSearch();
        }

    });
    inputSearch.addEventListener('keyup', async(e) => {
        if (e.target.value === '') {
            removeComponentSearch();
        } else {
            removeComponentSearch();
            await searchCity(e.target.value,inputSearch);
        }
    });
    divsgContainerSearch.appendChild(inputSearch);
    
  return divsgContainerSearch;
};



const removeComponentSearch=()=>{
    removeElementId('ul-autocomplete');
    removeElementId('sg-line-search');
    removeElementId('imgsearch-1');
    removeElementId('imgsearch-lupa');
    return;
};

const searchCity=async(value, input)=>{
    const params=`?type=City&name=${value}`;
    const rows=await loadRegionCountryCity('regions',params);
    removeComponentSearch();

    const sgContainerSearch = elementId('sg-container-search');
    const divSgLine = handleCreateElement('div', 'sg-line-search', 'sg-line-search');
    sgContainerSearch.appendChild(divSgLine);
    const ulTag = handleCreateElement('ul', 'ul-autocomplete', 'ul-autocomplete');
    
    rows.json.result.forEach(el => {
        removeElementId('li-autocomplete');
        const liTag = handleCreateElement('li', 'li-autocomplete', 'li-autocomplete');
        const aTag = handleCreateText('a', 'a-autocomplete', 'a-autocomplete', el.name);
        aTag.setAttribute('data-city-id',el._id);
        aTag.addEventListener('click', (e) => {  
            const textValue = e.target.text || e.target.alt || e.target.innerText;       
            input.value = textValue; 
            input.setAttribute('data-id',e.target.dataset.cityId)
            removeComponentSearch();
        });
        aTag.href = '#';
        liTag.appendChild(aTag);
        ulTag.appendChild(liTag)
    });
    sgContainerSearch.appendChild(ulTag);
    return await sgContainerSearch;
}




/* const removeOptionSelect=(selTag,id)=>{
    const selOption=selTag.querySelectorAll(`#${id}`);
    selOption.forEach(e=>{
        e.remove();
    });
    return;
}

const arrRowsRegionCountrCity = async (type, params) => {
    let arrRows = [];
    arrRows.length = 0;
    const parameters = (params) ? params : `?type=${type}`;

    let rows;
    switch (type) {
        case 'Region':
            rows = {
                text: 'Seleccione Región',
                value: '0'
            };
            break;
        case 'Country':
            rows = {
                text: 'Seleccione País',
                value: '0'
            };
            break;
        case 'City':
            rows = {
                text: 'Seleccione Ciudad',
                value: '0'
            };
            break;
        default:
            break;
    }
    arrRows.push(rows)
    const res = await loadRegionCountryCity('regions', parameters);
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
} */