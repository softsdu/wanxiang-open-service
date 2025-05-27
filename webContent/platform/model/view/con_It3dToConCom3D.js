viewModels.con_It3dToConCom3D = {
  id:"fa8c781c-9b3d-4115-bba6-51367c23b3cc",
  name:"con_It3dToConCom3D",
  dataName:"con_It3dToConCom3D",
  title:"IT3D组件和通用构件三维模型的映射",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"it3dcomid", label:"IT3D组件id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"it3dcomcode", label:"IT3D组件编码", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"it3dcomname", label:"IT3D组件", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"concom3did", label:"建筑构件3D模型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"concom3dcode", label:"建筑构件3D模型编码", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"concom3dname", label:"建筑构件3D模型", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"it3dcomid", label:"IT3D组件id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"it3dcomcode", label:"IT3D组件编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"it3dcomname", label:"IT3D组件", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"concom3did", label:"建筑构件3D模型id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"concom3dcode", label:"建筑构件3D模型编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"concom3dname", label:"建筑构件3D模型", editable:true,nullable:true, hidden:false, dispunitType:"pop", }
  ]
}
