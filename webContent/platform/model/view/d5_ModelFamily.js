viewModels.d5_ModelFamily = {
  id:"bbadf832-be56-4200-889f-86c71befe1df",
  name:"d5_ModelFamily",
  dataName:"d5_ModelFamily",
  title:"构件所属族",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modelid", label:"模型ID", width:150, hidden:true, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"familyid", label:"族ID", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"familyname", label:"族名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"categorydbid", label:"所属类型ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"categoryname", label:"所属类型", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"modelid", label:"模型ID", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"familyid", label:"族ID", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"familyname", label:"族名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"categorydbid", label:"所属类型ID", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"categoryname", label:"所属类型", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
