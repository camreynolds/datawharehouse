const convertDataFormToJSON = (elementFrm) => {
    const element = elementFrm;
    let dataJson = {};
    for (let c = 0; c < element.length; c++) {
        if (element[c].name && element[c].value) {
            dataJson[element[c].name] = element[c].value;
        }
    }
    return JSON.stringify(dataJson);
}

const alertStatus = (form, status, messeage) => {
    removeElementId('alerts');
    let alert = '';
    let img = '';
    switch (status) {
        case 200:
        case 201:
            alert = 'alert-success';
            img = 'success.png';
            break;
        case 400:
        case 401:
        case 409:
            alert = 'alert-error';
            img = 'error.png';
            break;
        default:
            break;
    };

    const divAlert = handleCreateElement('div', 'alerts ' + alert, 'alerts');
    const imgAlert = handleCrearImg('images/' + img, 'Alert', 'Alert', 'img-' + alert);
    const spanAlert = handleCreateText('a', 'closebtn', 'closebtn', 'X');
    spanAlert.addEventListener('click', (e) => {
        removeElementId('alerts');
    }, false);
    const strongAlert = handleCreateText('strong', 'alert-messeage', 'alert-messeage', messeage);

    divAlert.appendChild(strongAlert);
    divAlert.appendChild(spanAlert);
    divAlert.appendChild(imgAlert);
    form.appendChild(divAlert);


    fadeOutEffect();

    return;

};

const fadeOutEffect = () => {
    let fadeTarget = elementId('alerts');
    let fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity < 0.1) {
            clearInterval(fadeEffect);
            removeElementId('alerts');
        } else {
            fadeTarget.style.opacity -= 0.1;
        }
    }, 300);
}

const loadDataIntoForm = (setting, rows) => {

    const arrRows = Object.entries(rows);
    const forms = elementId(setting.forms);
    let valName = '';
    setting.edit = true;
    for (let elem of forms.elements) {
        if (setting.editNotValidateType === elem.type) {
            elem.required = false;
        }
        if (elem.name === 'save') {
            elem.setAttribute('data-id', rows._id);
        }

        arrRows.forEach(([key, valor]) => {

            if (key === setting.dataValue) {
                valName = valor;
            }
            if (key === elem.name) {
                let val = '';
                if (typeof valor === 'object') {

                    Object.entries(valor).forEach(([k, v]) => {
                        if (k === "_id") {
                            val = v;
                        }

                    });
                } else {

                    val = valor;
                }

                if (key === setting.dataId) {
                    elem.setAttribute('data-city-id', valor);
                    elem.value = valName;
                } else {
                    elem.value = val;
                }
            }


        });
    }


    return;
};

const loadValueIntoControls = (tagName, value) => {
    let values = '';
    switch (tagName) {
        case 'INPUT':
            values = value;
            break;
        case 'SELECT':
            values = value
        default:
            break;
    }

    return values
}

const validateForms = (forms) => {
    let flagValidation = true;
    let pass = '';
    for (let v of forms.elements) {
        if (v.required && v.value.trim().length === 0) {
            flagValidation = false
            alertStatus(forms, 409, 'Se debe completar los campos requeridoss.')
            break;
        } else {
            if (v.type === 'password') {
                if (v.name) {
                    pass = v.value;
                } else {
                    if (pass !== v.value) {
                        flagValidation = false
                        alertStatus(forms, 409, 'Las contraseñas no coinciden')
                        break;
                    }
                }
            }
        }


    }

    return flagValidation;

}