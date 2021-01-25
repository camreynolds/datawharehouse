const createDataGrid = async (rows, setting) => {
    const addTable = handleCreateElement('table', 'datagrid', 'datagrid');

    let colspan = setting.columns.length;
    if (setting.checkbox) colspan += 1;
    if (setting.action) colspan += 1;
    setting.colspan = colspan;
    setting.totalCount = rows.pagination.totalCount;

    const addTableHeader = await addTheader(setting, addTable);
    const addTableFooter = await addTFooter(rows.pagination, addTable, setting);

    const addTableBody = await addTBody(rows, setting);

    addTable.appendChild(addTableHeader);
    addTable.appendChild(addTableFooter);
    addTable.appendChild(addTableBody);
    return addTable;
};
//CABECERA
const addTheader = async (setting, tableGrid, ) => {
    const addHeader = handleCreateElement('thead', 'datagrid-thead');
    const addTR = handleCreateElement('tr', 'datagrid-thead-tr');
    if (setting.checkbox) {
        addTR.appendChild(addCheckboxTheader(setting));
        // setting.checkbox = false;
    }
    setting.columns.forEach(el => {
        const addTH = handleCreateText('th', 'datagrid-thead-tr-th', '', el);
        addTR.appendChild(addTH);

    });

    if (setting.action) {
        addTR.appendChild(addActionTheader());
    }
    const addTHSearch = await addTheaderSearch(setting, tableGrid);
    addHeader.appendChild(addTHSearch);
    addHeader.appendChild(addTR);
    return await addHeader;
};

const addTheaderSearch = async (setting, tableGrid) => {
    const addTR = handleCreateElement('tr', 'datagrid-thead-tr-search', 'datagrid-thead-tr-search');

    const arrRows = [];
    for (let i = 0; i < 10; i++) {
        const element = {
            text: (i + 1) * 5,
            value: (i + 1) * 5
        };
        arrRows.push(element);
    }

    const selPag = handleCreateElement('select', 'selPage');
    selPag.setAttribute('name', 'selNumPerPage');
    selPag.addEventListener('change', async (e) => {
        setting.offset = 1;
        setting.limit = parseInt(selPag.value);
        const rows = await refreshDataGrid(setting, tableGrid);
        const addTableFooter = await addTFooter(rows.pagination, tableGrid, setting);
        tableGrid.appendChild(addTableFooter);
    }, false);
    handelCreateSelectOptions(selPag, '', '', arrRows);
    const totalRows = handleCreateText('span', 'totalRows', 'totalRows', `Total de registros: ${setting.totalCount}`)
    const txtSearch = handleCreateInput('Search', 'search', 'Búsqueda', 'searchGrid');
    txtSearch.addEventListener('keyup', async (e) => {
        (e.target.value) ? setting.textSearch = `text=${e.target.value}&`: setting.textSearch = '';
        console.log(e.target.value, setting.textSearch);
        if (e.which === 13 || e.keyCode === 13) {
            const rows = await refreshDataGrid(setting, tableGrid);
            console.log(rows.pagination.totalCount);
            elementId('totalRows').innerHTML = `Total de registros: ${rows.pagination.totalCount}`
            const addTableFooter = await addTFooter(rows.pagination, tableGrid, setting);
            tableGrid.appendChild(addTableFooter);

        }

    })
    const addTH = handleCreateElement('th', 'datagrid-thead-tr-th-search', 'datagrid-thead-tr-th-search');
    const divSearch = handleCreateElement('div', 'div-th-search', 'div-th-search');
    addTH.setAttribute('colspan', setting.colspan);
    divSearch.appendChild(selPag);
    divSearch.appendChild(totalRows);
    divSearch.appendChild(txtSearch);
    addTH.appendChild(divSearch);
    addTR.appendChild(addTH);
    return await addTR;

}

const addCheckboxTheader = (setting) => {
    const addTH = handleCreateElement('th', 'datagrid-thead-tr-th');
    const addCheck = handleCreateElement('input', 'checkbox-grid', 'checkbox-grid');
    addCheck.setAttribute('type', 'checkbox');
    addCheck.addEventListener('click', async (e) => {
        console.log(e.target.checked, e.target.dataset.id);
        if (!e.target.checked) {
            sessionStorage.clear();
        } else {
            const res = await getAllIdChecked(setting);
            res.json.result.forEach(el => {
                sessionStorage.setItem(el._id, el._id);
            });
        }
        getCheckedAll(e.target.checked)
    });
    addTH.appendChild(addCheck);
    return addTH;
};

const addActionTheader = () => {
    return handleCreateText('th', 'datagrid-thead-tr-th', '', 'Acción');
}
//FIN CABECERA

//FOOTER
const addTFooter = async (pagination, tableGrid, setting) => {
    removeElementId('datagrid-tfoot');
    const addFooter = handleCreateElement('tfoot', 'datagrid-tfoot', 'datagrid-tfoot');
    const addTR = handleCreateElement('tr', 'datagrid-tfoot-tr', 'datagrid-tfoot-tr');
    addTD = handleCreateElement('td', 'datagrid-tfoot-tr-td-pag', 'datagrid-tfoot-pages');
    addTD.setAttribute('colspan', setting.colspan);
    const pages = await addPagination(pagination, setting, tableGrid);
    addTD.appendChild(pages);
    addTR.appendChild(addTD);
    addFooter.appendChild(addTR);
    return addFooter;
};
//FIN FOOTER

//BODY

const addTBody = (arrBody, setting) => {
    const addBody = handleCreateElement('tbody', 'datagrid-tbody', 'datagrid-tbody');
    arrBody.result.forEach(el => {
        const addTR = handleCreateElement('tr', 'datagrid-tbody-tr');
        const id = Object.values(el)[0];

        if (setting.dataId) {
            delete el[setting.dataId]
        }

        if (setting.checkbox) {
            addTR.appendChild(addCheckboxTBody(id));
        }
        let avatar = [];
        if (setting.avatar) {
            avatar = Object.values(el)[setting.avataridx];
        }

        Object.values(el).forEach(values => {
            if (!(id === values) && !(avatar === values)) {
                const val = (typeof values === 'object') ? Object.values(values) : values;
                addTR.appendChild(addTBodyTD(val));
            } else {
                if (avatar === values) {
                    const ava = avatarChannels(values);
                    const addTD = handleCreateElement('td', 'datagrid-tbody-tr-td');
                    addTD.appendChild(ava);
                    addTR.appendChild(addTD);
                }
            }

        });

        if (setting.action) {
            const buttons = addActionTBody(setting, id);
            addTR.appendChild(buttons);
        }
        addBody.appendChild(addTR);
    });



    return addBody;
};

const addPagination = async (pagination, setting, tableGrid) => {
    const divPagination = handleCreateElement('div', 'div-pagination', 'div-pagination');
    const divPag = handleCreateElement('div', 'div-pagination-pages', 'div-pagination-pages');
    let arrRows = [];
    for (let i = 0; i < pagination.totalPages; i++) {
        const element = {
            text: i + 1,
            value: i + 1
        };
        arrRows.push(element);
    }

    const selPag = handleCreateElement('select', 'selPage');
    selPag.setAttribute('name', 'selPage');
    selPag.addEventListener('change', async (e) => {
        setting.offset = parseInt(selPag.value);
        await refreshDataGrid(setting, tableGrid);


    }, false);
    handelCreateSelectOptions(selPag, '', '', arrRows);
    const aPrev = handleCreateText('a', 'aPrev', 'aPrev', 'Anterior')
    aPrev.href = '#';
    aPrev.addEventListener('click', async (e) => {
        let index = selPag.selectedIndex - 1;
        (index < 0) ? selPag.selectedIndex = 0: selPag.selectedIndex = index;
        setting.offset = parseInt(selPag.value);
        await refreshDataGrid(setting, tableGrid);
    });
    const aNext = handleCreateText('a', 'aNext', 'aNext', 'Siguiente')
    aNext.href = '#';
    aNext.addEventListener('click', async (e) => {
        const index = selPag.selectedIndex + 1;
        (index === pagination.totalPages) ? selPag.selectedIndex = pagination.totalPages - 1: selPag.selectedIndex = index;

        setting.offset = parseInt(selPag.value);
        await refreshDataGrid(setting, tableGrid);
    });
    let pPages = handleCreateText('p', 'p-pages', 'p-pages', 'Página: ');

    divPag.appendChild(pPages);
    divPag.appendChild(selPag);
    pPages = handleCreateText('p', 'p-pages', 'p-pages', `de ${pagination.totalPages}`);
    divPag.appendChild(pPages);
    divPagination.appendChild(aPrev);
    divPagination.appendChild(divPag);
    divPagination.appendChild(aNext);

    return divPagination
}


const refreshDataGrid = async (setting, tableGrid) => {
    tableGrid.querySelector('#datagrid-tbody').remove();
    const rows = await getDataGridPagination(setting);

    const addTableBody = await addTBody(rows, setting);
    tableGrid.appendChild(addTableBody);
    const checkAll = elementId('checkbox-grid');
    if (checkAll) {
        getCheckedAll(checkAll.checked);
    }
    return rows;
}

const addTBodyTD = (textTD) => {
    return handleCreateText('td', 'datagrid-tbody-tr-td', '', textTD);
}


const addCheckboxTBody = (id) => {
    const addTD = handleCreateElement('td', 'datagrid-tbody-checkbox');
    const addCheck = handleCreateElement('input', 'checkbox-grid');
    addCheck.setAttribute('type', 'checkbox');
    addCheck.setAttribute('data-id', id);
    addCheck.addEventListener('click', (e) => {
        const checkAll = elementId('checkbox-grid');

        if (checkAll.checked && !e.target.checked) {
            checkAll.checked = false
            sessionStorage.removeItem(e.target.dataset.id);
        } else {
            if (e.target.checked) {
                sessionStorage.setItem(e.target.dataset.id, e.target.dataset.id);
            } else {
                sessionStorage.removeItem(e.target.dataset.id);
            }
        }

    });
    addTD.appendChild(addCheck);
    return addTD;
};
const addActionTBody = (setting, id) => {
    const addTD = handleCreateElement('td', 'datagrid-tbody-actions');
    const addButtonActionDelete = handleCreateElement('button', 'btnAction btnDelete');
    addButtonActionDelete.setAttribute('data-id', id);
    addButtonActionDelete.addEventListener('click', async (e) => {

        if (window.confirm("¿Desea eliminar el registro?")) {
            apiCreateDeleteModify('DELETE', e.target.dataset.id, setting);
            const tableGrid = document.querySelector('#datagrid');
            await refreshDataGrid(setting, tableGrid);
        }
    }, false);
    const addButtonActionEdit = handleCreateElement('button', 'btnAction btnEdit');
    addButtonActionEdit.setAttribute('data-id', id);
    addButtonActionEdit.addEventListener('click', async (e) => {
        e.preventDefault();
        const rows = await getDataGridByEdit(setting, e.target.dataset.id);
        loadDataIntoForm(setting, rows.result)
    }, false)

    addTD.appendChild(addButtonActionEdit);
    addTD.appendChild(addButtonActionDelete);
    return addTD;
}



const getDataGridByEdit = async (setting, id) => {
    const param = `/${id}`

    const res = await apiDW(setting.endpoint, 'GET', '', '', param);

    return res.json;
}
//FIN BODY
const getDataGridPagination = async (pagination) => {
    const pag = `?${pagination.textSearch}limit=${pagination.limit}&offset=${pagination.offset}`
    const res = await apiDW(pagination.endpoint, 'GET', '', pag, '');
    return res.json;
}

const dataGridView = async (secGrid, setting) => {
    removeElementId('datagrid');
    const rows = await getDataGridPagination(setting);
    const grid = await createDataGrid(rows, setting);
    secGrid.appendChild(grid);
    return;
};

const getFirstChecked = () => {
    let id,
        flag;
    const listCheck = document.querySelectorAll('.datagrid-tbody-checkbox');
    listCheck.forEach(e => {
        if (e.children[0].checked && !flag) {
            flag = true;
            id = e.children[0].dataset.id;
        }
    });
    return id;
}


const getCheckedAll = (checked) => {
    const listCheck = document.querySelectorAll('.datagrid-tbody-checkbox');
    console.log(listCheck.length);
    listCheck.forEach(e => {
        e.children[0].checked = checked
    });
    return;
}

const getAllIdChecked = async (setting) => {
    return await apiDW(setting.endpoint + '/all', 'GET', '', '', '');

}