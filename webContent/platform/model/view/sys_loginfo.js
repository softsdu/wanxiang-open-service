viewModels.sys_loginfo = {
  id:"7ae851e5-c258-499d-8848-96974cebeba4",
  name:"sys_loginfo",
  dataName:"sys_loginfo",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"log_user_xid", label:"用户id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"usercode", label:"用户code", width:120, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"username", label:"用户名称", width:120, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"用户描述", width:120, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"log_address", label:"登录地址", width:120, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"log_time", label:"登录时间", width:120, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"log_event", label:"操作内容", width:400, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"log_type", label:"类型", width:120, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"log_user_xid", label:"用户id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"usercode", label:"用户code", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"username", label:"用户名称", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"description", label:"用户描述", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"log_address", label:"登录地址", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"log_time", label:"登录时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"log_event", label:"操作内容", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"log_type", label:"类型", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
