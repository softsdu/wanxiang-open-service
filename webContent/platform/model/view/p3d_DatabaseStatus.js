viewModels.p3d_DatabaseStatus = {
  id:"b8bfc1ad-f063-4579-838a-f8c85fa6c706",
  name:"p3d_DatabaseStatus",
  dataName:"p3d_DatabaseStatus",
  title:"数据库状态",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"database_size_available", label:"可用存储空间大小(Byte)", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"database_size_capacity", label:"存储空间总容量(Byte)", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"database_size_usage", label:"存储空间使用量(Byte)", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"database_size_utilisation", label:"存储空间使用率(Byte)", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:true,nullable:true, hidden:false, dispunitType:"time", },
    {name:"database_size_available", label:"可用存储空间大小(Byte)", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"database_size_capacity", label:"存储空间总容量(Byte)", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"database_size_usage", label:"存储空间使用量(Byte)", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"database_size_utilisation", label:"存储空间使用率(Byte)", editable:true,nullable:true, hidden:false, dispunitType:"decimal", }
  ]
}
