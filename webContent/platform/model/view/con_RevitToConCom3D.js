viewModels.con_RevitToConCom3D = {
  id:"deb178bc-e8bc-4181-aeb8-058272425514",
  name:"con_RevitToConCom3D",
  dataName:"con_RevitToConCom3D",
  title:"Revit family与通用构件三维模型的映射",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"revitcategoryname", label:"族类型", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"revitfamilyname", label:"族名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"revitfamilysymbolname", label:"Family Symbol", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"concom3did", label:"建筑构件3D模型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"concom3dcode", label:"建筑构件3D模型编码", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"concom3dname", label:"建筑构件3D模型", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"revitcategoryname", label:"族类型", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"revitfamilyname", label:"族名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"revitfamilysymbolname", label:"Family Symbol", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"concom3did", label:"建筑构件3D模型id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"concom3dcode", label:"建筑构件3D模型编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"concom3dname", label:"建筑构件3D模型", editable:true,nullable:true, hidden:false, dispunitType:"pop", }
  ]
}
