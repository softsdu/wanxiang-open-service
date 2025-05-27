viewModels.sys_Data = {
  id:"3",
  name:"sys_Data",
  dataName:"sys_Data",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:10, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"savetype", label:"目标类型", width:80, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"savedest", label:"目标名称", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"dstype", label:"源类型", width:70, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"dsexp", label:"源表达式", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"idfieldname", label:"主键字段", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isusing", label:"启用", width:40, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"sysmodule", label:"所属模块", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"list"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"savetype", label:"目标类型", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"savedest", label:"目标名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"dstype", label:"源类型", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"dsexp", label:"源表达式", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"idfieldname", label:"主键字段", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isusing", label:"启用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"sysmodule", label:"所属模块", editable:true,nullable:true, hidden:false, dispunitType:"list", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
