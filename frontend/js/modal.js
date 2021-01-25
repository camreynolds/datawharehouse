const handleModal= (title,body,footer)=>{
    const divmodal = handleCreateElement('div', 'modal', 'modal')
    const formModalContent = handleCreateElement('form', 'modal-content', 'modal-content');


    const modalHeader = handleCreateElement('header', 'modalHeader', 'modalHeader');
    const modalBtnClose = handleCreateElement('button', 'btnModalClose', 'btnModalClose');
    modalBtnClose.addEventListener('click', () => {
        removeElementId('modal');
    });
    modalHeader.appendChild(title);
    modalHeader.appendChild(modalBtnClose);

    const modalBody= handleCreateElement('section', 'modalBody', 'modalBody');
    modalBody.appendChild(body);

    const modalFooter = handleCreateElement('footer', 'modalFooter', 'modalFooter');
    modalFooter.appendChild(footer);
    formModalContent.appendChild(modalHeader);
    formModalContent.appendChild(modalBody);
    formModalContent.appendChild(modalFooter);
    divmodal.appendChild(formModalContent);
    const cont=elementId('contenedor-principal');
    cont.appendChild(divmodal)
    
    document.getElementsByClassName("modal")[0].style.display = "flex";
    return  ;

}