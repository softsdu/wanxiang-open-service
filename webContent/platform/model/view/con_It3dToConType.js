viewModels.con_It3dToConType = {
  id:"7d36b39b-7c25-4d94-8463-dcccff8458b1",
  name:"con_It3dToConType",
  dataName:"con_It3dToConType",
  title:"IT3D组件类型与构件类型的映射",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"it3dcatid", label:"IT3D类型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"it3dcatcode", label:"IT3D类型编码", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"it3dcatname", label:"IT3D类型", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"concomtypeid", label:"建筑构件类型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"concomtypecode", label:"建筑构件类型编码", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"concomtypename", label:"建筑构件类型", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"it3dcatid", label:"IT3D类型id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"it3dcatcode", label:"IT3D类型编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"it3dcatname", label:"IT3D类型", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"concomtypeid", label:"建筑构件类型id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"concomtypecode", label:"建筑构件类型编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"concomtypename", label:"建筑构件类型", editable:true,nullable:true, hidden:false, dispunitType:"pop", }
  ]
}
