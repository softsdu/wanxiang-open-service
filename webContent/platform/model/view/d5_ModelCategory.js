viewModels.d5_ModelCategory = {
  id:"be07df38-190a-46ec-b3a0-76b0f795482c",
  name:"d5_ModelCategory",
  dataName:"d5_ModelCategory",
  title:"族类型",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"dbid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"categoryid", label:"类型ID", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"categoryname", label:"名称", width:300, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"categorytype", label:"categorytype", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modelid", label:"modelid", width:100, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"canland", label:"可以行走", width:80, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"canpass", label:"可以穿越", width:80, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"dbid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"categoryid", label:"类型ID", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"categoryname", label:"名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"categorytype", label:"categorytype", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"modelid", label:"modelid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"canland", label:"可以行走", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"canpass", label:"可以穿越", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", }
  ]
}
