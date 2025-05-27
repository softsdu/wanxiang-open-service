viewModels.d5_ModelMaterial = {
  id:"77d7464c-4644-4f88-83db-0c41d5c2bc13",
  name:"d5_ModelMaterial",
  dataName:"d5_ModelMaterial",
  title:"模型材质",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"materialid", label:"材质ID", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"materialname", label:"材质名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"color", label:"颜色", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"modelid", label:"模型ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"mtlid", label:"云材质ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"mtlname", label:"云材质", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"materialid", label:"材质ID", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"materialname", label:"材质名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"color", label:"颜色", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"modelid", label:"模型ID", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"mtlid", label:"云材质ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"mtlname", label:"云材质", editable:true,nullable:true, hidden:false, dispunitType:"pop", }
  ]
}
