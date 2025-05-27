viewModels.d5_ModelFamilySymbol = {
  id:"0e904624-fcd2-4fca-897a-02ee2fc88e89",
  name:"d5_ModelFamilySymbol",
  dataName:"d5_ModelFamilySymbol",
  title:"构件所属类型",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modelid", label:"模型ID", width:150, hidden:true, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"familysymbolid", label:"族类型ID", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"familysymbolname", label:"族类型名", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"familydbid", label:"族DBID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"familyname", label:"族名称", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"modelid", label:"模型ID", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"familysymbolid", label:"族类型ID", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"familysymbolname", label:"族类型名", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"familydbid", label:"族DBID", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"familyname", label:"族名称", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
