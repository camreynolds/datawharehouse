const elementId = (p_id) => {
    return document.getElementById(p_id);
};

const removeElementId = (p_id) => {
    let elementremove = elementId(p_id);
    if (elementremove != null) elementremove.remove();
    return;
};

const handleCreateElement = (p_tag, p_class, p_id, ) => {
    let element = document.createElement(p_tag);
    
    if(p_id)element.setAttribute('id', p_id);
    if(p_class)element.setAttribute('class', p_class);
    return element;
};

const handleCreateText = (p_tag, p_class, p_id, p_text) => {
    let element = handleCreateElement(p_tag, p_class, p_id);
    let textNode = document.createTextNode(p_text);
    element.appendChild(textNode);
    return element;
};

const handleCrearImg = (p_src, p_alt, p_title, p_id, p_data_target, p_user, p_offset,p_typePage) => {
    let imagenGrid = document.createElement('img');
    imagenGrid.setAttribute('id', p_id);
    imagenGrid.setAttribute('src', p_src);
    if (p_data_target) imagenGrid.setAttribute('data-target-id', p_data_target);
    if (p_user) imagenGrid.setAttribute('data-target-username', p_user);
    if (p_offset) imagenGrid.setAttribute('data-target-offset', p_offset);
    if (p_typePage) imagenGrid.setAttribute('data-type-page', p_typePage);
    if (p_alt) imagenGrid.alt = p_alt;
    if (p_title) imagenGrid.title = p_title;
    return imagenGrid;
};

const handleCreateInput=(id, type, placeholder, name, required) =>{
    const idName='txt'+id;
    let classValid='';
    (required===true)? classValid=idName+' validate': classValid=idName;
   
    const input=handleCreateElement('input','txtPrincipal '+classValid,idName);
    input.setAttribute('type',type);
    input.setAttribute('placeholder',placeholder);
    input.setAttribute('name',name);
    input.setAttribute('data-name',name);
    input.setAttribute('autocomplete', 'off');
    if (required)input.required=required;
    return input;
};

const handelCreateSelectOptions = (selTag,p_id, p_class, p_arrRows) =>{
     p_arrRows.forEach(row => {
        const option=handleCreateText('option',p_class,p_id,row.text);
        option.setAttribute('value',row.value);
      selTag.add(option);
    });
    return;
};


