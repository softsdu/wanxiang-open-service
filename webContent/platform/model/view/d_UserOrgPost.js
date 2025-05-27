viewModels.d_UserOrgPost = {
  id:"110",
  name:"d_UserOrgPost",
  dataName:"d_UserOrgPost",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"用户id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"username", label:"用户名", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"usercode", label:"用户编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"orgid", label:"部门id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"orgname", label:"部门名称", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"orgcode", label:"部门编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"postid", label:"岗位id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"postname", label:"岗位名称", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"postcode", label:"岗位编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"userid", label:"用户id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"username", label:"用户名", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"usercode", label:"用户编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"orgid", label:"部门id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"orgname", label:"部门名称", editable:false,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"orgcode", label:"部门编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"postid", label:"岗位id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"postname", label:"岗位名称", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"postcode", label:"岗位编码", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
};;
