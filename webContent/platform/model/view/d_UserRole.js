viewModels.d_UserRole = {
  id:"111",
  name:"d_UserRole",
  dataName:"d_UserRole",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"用户id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"username", label:"用户名", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"usercode", label:"用户编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"roleid", label:"角色id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"rolename", label:"角色名", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"rolecode", label:"角色编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"userid", label:"用户id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"username", label:"用户名", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"usercode", label:"用户编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"roleid", label:"角色id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"rolename", label:"角色名", editable:false,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"rolecode", label:"角色编码", editable:false,nullable:false, hidden:false, dispunitType:"text", }
  ]
};;
