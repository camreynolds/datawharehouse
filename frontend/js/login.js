const loginView=()=>{
    removeElementId('headDW');
    removeElementId('mainDW');
    removeElementId('navDW');
    removeElementId('figLogo');
    removeElementId('seclogin');
    removeElementId('footDW');
    sessionStorage.removeItem('tokenDW')
    const configDefault = {
        endpoint: 'auth/login',
        forms: 'frmLogin',
        method: 'POST',
        body: {}
    };
    const secLogin=handleCreateElement('section', 'seclogin','seclogin');
    const secCont=handleCreateElement('section', 'secCont','secCont');
    const secForm=handleCreateElement('section','secForm','secForm');
    const secError=handleCreateElement('section', 'secError','secError');
    const figLogo=handleCreateElement('figure','figLogo','figLogo');
    const imgLogo=handleCrearImg('images/logoCDP.jpg','DW','DW','logo','','','','')
    figLogo.appendChild(imgLogo);
    const txtUser=handleCreateInput('User','email','Usuario','username', true);
    
    const txtPass=handleCreateInput('Pass','password','Contraseña','password', true);
    const btnLogin=handleCreateElement('button','btn btn-primary btnLogin','btnLogin');
    btnLogin.innerHTML='INGRESAR';
    btnLogin.addEventListener('click',async(e)=>{
        e.preventDefault();
        configDefault.body={
            username: txtUser.value,
            password: txtPass.value
        }
        const res=await apiDW(configDefault.endpoint,configDefault.method,JSON.stringify(configDefault.body),'','');
        console.log(res);
        if (res.result.status===401){
            alertStatus(secError, res.result.status, res.json.error);
            sessionStorage.removeItem('tokenDW');
        }else{
            
            sessionStorage.setItem('tokenDW','Bearer '+res.json.accessToken);
            const contenedorPrincipal=elementId('contenedor-principal');
            headerNavMainDW(contenedorPrincipal);
            countdownTimer();
        }
        
    },false)
    secForm.appendChild(figLogo);
    secForm.appendChild(txtUser);
    secForm.appendChild(txtPass);
    secForm.appendChild(btnLogin);
    secCont.appendChild(secForm);
    secCont.appendChild(secError);
    secLogin.appendChild(secCont);
    return secLogin;
}

const getInfoJwtPayload=()=>{
    
    const tokDW=sessionStorage.getItem('tokenDW').split(' ')[1];
    return JSON.parse(atob(tokDW.split('.')[1]));
}

const login=()=>{
    const contenedorPrincipal=elementId('contenedor-principal');

    if (contenedorPrincipal.classList[1]==='contenedor-principal-view'){
        contenedorPrincipal.classList.remove('contenedor-principal-view');
    }
    const login=loginView();
    contenedorPrincipal.appendChild(login);
}