viewModels.sys_DataEventExpression = {
  id:"a4cc8cf8-b7d4-4fde-91aa-b1fa356650ad",
  name:"sys_DataEventExpression",
  dataName:"sys_DataEventExpression",
  title:"sys_DataEventExpression",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"eventid", label:"事件Id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"eventname", label:"事件名称", width:80, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"list"},
    {name:"eventdescription", label:"事件描述", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"eventcategory", label:"类型", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"eventresultvaluetype", label:"返回值类型", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"exp", label:"执行表达式", width:300, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"runexp", label:"运行时表达式", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"执行内容描述", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"eventid", label:"事件Id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"eventname", label:"事件名称", editable:true,nullable:true, hidden:false, dispunitType:"list", },
    {name:"eventdescription", label:"事件描述", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"eventcategory", label:"类型", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"eventresultvaluetype", label:"返回值类型", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"exp", label:"执行表达式", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"runexp", label:"运行时表达式", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"description", label:"执行内容描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
