viewModels.mdl_ComponentList = {
  id:"9f3eb71e-c31b-42a4-81b4-cb3d5b1b7d04",
  name:"mdl_ComponentList",
  dataName:"mdl_Component",
  title:"组件列表",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"imgid", label:"图例", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"versionnum", label:"版本号", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"categorycode", label:"所属类型编码", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"categoryname", label:"所属类型", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"imgid", label:"图例", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"versionnum", label:"版本号", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"categorycode", label:"所属类型编码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"categoryname", label:"所属类型", editable:true,nullable:true, hidden:false, dispunitType:"pop", }
  ]
}
