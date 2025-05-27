viewModels.com_Component3DMesh = {
  id:"7a2a1c8d-0f72-41f6-83b0-cef768f3ae92",
  name:"com_Component3DMesh",
  dataName:"com_Component3DMesh",
  title:"物料3D云模型Mesh",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"component3did", label:"component3did", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"meshid", label:"MeshID", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"materialpositionid", label:"材质位置ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"materialposition", label:"材质位置", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"list"},
    {name:"description", label:"描述", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"component3did", label:"component3did", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"meshid", label:"MeshID", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"materialpositionid", label:"材质位置ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"materialposition", label:"材质位置", editable:true,nullable:true, hidden:false, dispunitType:"list", },
    {name:"description", label:"描述", editable:true,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
