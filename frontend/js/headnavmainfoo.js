let timerInterval = null,
    timePassed = 0,
    timeLimit = 0;
const handleItemLi = () => {
    return ['Contactos', 'Compañías', 'Regiones', 'Usuarios']
}

const handleCreateMenu = (payload) => {
    const menuItem = handleItemLi();
    if (payload.rol !== 'admin') {
        menuItem.pop();
    }

    const ulTag = handleCreateElement('ul', 'ulDW', 'ulDW');
    menuItem.forEach(el => {
        const liTag = handleCreateElement('li', 'liDW', 'liDW');
        const aTag = handleCreateText('a', 'aDW', 'aDW' + el.substring(0, 3), el);
        aTag.href = '#';

        switch (el.substring(0, 3)) {
            case 'Con':

                aTag.addEventListener('click', async (e) => {
                    const contView = await contactsView();
                    createViewMainDW(contView);
                }, false);
                break;
            case 'Com':

                aTag.addEventListener('click', async (e) => {
                    const compViewDW = await companiesView();
                    createViewMainDW(compViewDW);
                }, false);
                break;
            case 'Reg':

                aTag.addEventListener('click', async (e) => {
                    const regViewDW = await regionsView();
                    createViewMainDW(regViewDW);
                }, false);
                break;
            case 'Usu':
                if (payload.rol === 'admin') {
                    console.log(payload.rol);
                    aTag.addEventListener('click', async (e) => {
                        const userViewDW = await usersView();
                        createViewMainDW(userViewDW);
                    }, false);
                }
                break;

            default:
                break;
        }
        liTag.appendChild(aTag)
        ulTag.appendChild(liTag);
    });
    return ulTag;
};

const createViewMainDW = (sections) => {
    removeElementId('seccontacts-cont');
    removeElementId('secuser-cont');
    removeElementId('seccompanie-cont');
    removeElementId('secregion-cont');
    const mainDW = elementId('mainDW');
    mainDW.appendChild(sections);
    return;
}

const logoDW = () => {
    const figLogo = handleCreateElement('figure', 'figLogo', 'figLogo');
    const imgLogo = handleCrearImg('images/logoCDP.jpg', 'DW', 'DW', 'logo', '', '', '', '')
    figLogo.appendChild(imgLogo);
    return figLogo;
}
const headerView = () => {
    const header = handleCreateElement('header', 'headDW', 'headDW');
    const aTagExit=handleCreateElement('a', 'aExits');
    aTagExit.addEventListener('click',  (e) => {
        login();
    }, false);
    const imgExist=handleCrearImg('images/systemshutdown.png','Exit','Exit','imgExist','','','','');
    aTagExit.appendChild(imgExist);
    header.appendChild(aTagExit);
    return header;
};
const mainView = () => {
    return handleCreateElement('main', 'mainDW', 'mainDW');
}
const navbarView = (payload) => {

    const navbar = handleCreateElement('nav', 'navDW', 'navDW');
    const menu = handleCreateMenu(payload);
    const profile = profileView(payload);
    const countdownSession =countdownTimerView();
    navbar.appendChild(countdownSession);
    navbar.appendChild(profile);
    navbar.appendChild(menu);
    return navbar;
};

const profileView = (payload) => {
    const divProfile = handleCreateElement('div', 'divProfile', 'divProfile');
    const spanUsername = handleCreateText('span', 'spanUsername', 'spanUsername', payload.name);
    const spanFullname = handleCreateText('span', 'spanFullname', 'spanFullname', payload.fullname);
    const spanRol = handleCreateText('span', 'spanRol', 'spanRol', payload.rol);
    divProfile.appendChild(spanUsername);
    divProfile.appendChild(spanFullname);
    divProfile.appendChild(spanRol);
    return divProfile
}

const countdownTimerView = () => {
    const divContCountdown = handleCreateElement('div', 'divContCountdown', 'divContCountdown');
    const divCountdown = handleCreateElement('div', 'divCountdown color-full', 'divCountdown');
    const divTitleCountdown = handleCreateElement('div', 'divTitleCountdown', 'divTitleCountdown');
    const spanTitle = handleCreateText('span', 'spanTitle', 'spanTitle', 'TIEMPO DE SESIÓN');
    const spanRol = handleCreateText('span', 'spanTime', 'spanTime', '');
    divTitleCountdown.appendChild(spanTitle);
    divCountdown.appendChild(spanRol);
    divContCountdown.appendChild(divTitleCountdown);
    divContCountdown.appendChild(divCountdown);
    return divContCountdown;
}
const countdownTimer = () => {
    const divCountdown=elementId('divCountdown');
    console.log(divCountdown);
    let timeLeft = timeLimit;
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = timeLimit - timePassed;
        if ( timeLeft < ( timeLimit / 2 ) )  {
            divCountdown.classList.remove('color-full');
            divCountdown.classList.add('color-half');
        } 
        if ( timeLeft < ( timeLimit / 4 ) )  {
            divCountdown.classList.remove('color-half');
            divCountdown.classList.add('color-empty');
        } 
        elementId('spanTime').innerHTML = formatTime(timeLeft);
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            login();
        }
    }, 1000);
};

const formatTime = (time) => {

    const minutes = Math.floor(time / 60);

    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
};

const headerNavMainDW = (divContPrincipal) => {
    removeElementId('headDW');
    removeElementId('mainDW');
    removeElementId('navDW');
    removeElementId('figLogo');
    removeElementId('seclogin');
    divContPrincipal.classList.toggle('contenedor-principal-view');
    const payload = getInfoJwtPayload();
    timeLimit=payload.exp - payload.iat;
    console.log(timeLimit);
    const header = headerView();
    const navbar = navbarView(payload);
    const main = mainView();
    const logo = logoDW();
    const footerDW=footerView();
    divContPrincipal.appendChild(logo);
    divContPrincipal.appendChild(header);
    divContPrincipal.appendChild(navbar);
    divContPrincipal.appendChild(main);
    divContPrincipal.appendChild(footerDW);
    return divContPrincipal;
};

const footerView=()=>{
    const footer=handleCreateElement('footer','footDW','footDW');
    return footer;
}