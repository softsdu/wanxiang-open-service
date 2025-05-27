viewModels.con_RevitToConType = {
  id:"802d1f27-64c4-47c1-bf40-efe3e3aad0e9",
  name:"con_RevitToConType",
  dataName:"con_RevitToConType",
  title:"Revit category和构件类型的映射",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"revitcategoryname", label:"族类型", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"revitfamilyname", label:"族名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"concomtypeid", label:"建筑构件类型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"concomtypecode", label:"建筑构件类型编码", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"concomtypename", label:"建筑构件类型", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"revitcategoryname", label:"族类型", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"revitfamilyname", label:"族名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"concomtypeid", label:"建筑构件类型id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"concomtypecode", label:"建筑构件类型编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"concomtypename", label:"建筑构件类型", editable:true,nullable:true, hidden:false, dispunitType:"pop", }
  ]
}
