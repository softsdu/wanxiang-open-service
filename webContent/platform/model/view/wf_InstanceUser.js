viewModels.wf_InstanceUser = {
  id:"a1b0a92e-2086-48a5-8c8f-6f803ffb84d5",
  name:"wf_InstanceUser",
  dataName:"wf_InstanceUser",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"instanceid", label:"实例id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"nodeid", label:"节点id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"nodename", label:"节点名称", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"stepid", label:"步骤id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"用户id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"usercode", label:"用户编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"username", label:"用户名", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"instanceid", label:"实例id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"nodeid", label:"节点id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"nodename", label:"节点名称", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"stepid", label:"步骤id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"userid", label:"用户id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"usercode", label:"用户编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"username", label:"用户名", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", }
  ]
}
