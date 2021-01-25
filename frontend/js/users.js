const usersView = async () => {
    const configDefault = {
        limit: 5,
        offset: 1,
        endpoint: 'users',
        forms: 'secuser',
        checkbox: false,
        action: true,
        grid: 'secuser-grid',
        columns: ['Nombre', 'Apellido', 'Email', 'Perfil'],
        colspan: 0,
        totalCount:0,
        edit: false,
        editNotValidateType: 'password',
        textSearch:''
    };

    const secUserCont = handleCreateElement('section', 'secuser-cont', 'secuser-cont');

    const secUser = handleCreateElement('form', 'secuser', 'secuser');
    secUser.setAttribute('name', 'fmrUsers');
    secUser.setAttribute('action', '');
    const titUser = handleCreateText('h1', 'titUser', 'titUser', 'Crear Usuario');
    const txtNombre = handleCreateInput('Nombre', 'text', 'Nombre', 'firstname', true);
    const txtApellido = handleCreateInput('Apellido', 'text', 'Apellido', 'lastname', true);
    const txtEmail = handleCreateInput('Email', 'email', 'Email', 'email', true);
    const arrRows = [{
            text: "Basic",
            value: "basic"
        },
        {
            text: "Admin",
            value: "admin"
        }
    ];


    const selPerfil = handleCreateElement('select', 'selPrincipal validate');
    handelCreateSelectOptions(selPerfil, '', '', arrRows);
    selPerfil.setAttribute('name', 'profile');
    const txtPassword = handleCreateInput('Password', 'password', 'Contraseña', 'password', true);
    const txtRepetirPassword = handleCreateInput('Password2', 'password', 'Repetir Contraseña', '', true);
    const secGridUser = handleCreateElement('section', 'secuser-grid', 'secuser-grid');
    await dataGridView(secGridUser, configDefault);
    const btn = handleCreateElement('button', 'btn btn-primary btnCreateUser', 'btnCreateUser');
    btn.innerHTML = 'GRABAR';
    btn.setAttribute('name', 'save');
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (validateForms(secUser)) {
            let method = '',
                id = '';          
            (e.target.dataset.id) ? id = e.target.dataset.id: id = '';
            (configDefault.edit) ? method = 'PUT': method = 'POST';
           const result= await apiCreateDeleteModify(method, id, configDefault);

            if (result.ok){
                await dataGridView(secGridUser, configDefault); 
            }
        }
    }, false);
   

    secUser.appendChild(titUser);
    secUser.appendChild(txtNombre);
    secUser.appendChild(txtApellido);
    secUser.appendChild(txtEmail);
    secUser.appendChild(selPerfil);
    secUser.appendChild(txtPassword);
    secUser.appendChild(txtRepetirPassword);
    secUser.appendChild(btn);
    secUserCont.appendChild(secUser)
    secUserCont.appendChild(secGridUser)
    return secUserCont;
};