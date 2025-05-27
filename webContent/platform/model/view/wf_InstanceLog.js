viewModels.wf_InstanceLog = {
  id:"2fcc2011-bea6-425f-bef0-dcf72260b762",
  name:"wf_InstanceLog",
  dataName:"wf_InstanceLog",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"instanceid", label:"实例id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"operatetype", label:"操作类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isdisabled", label:"已无效", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"note", label:"备注", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"processtime", label:"处理时间", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"stepid", label:"步骤id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"用户id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"usercode", label:"用户编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"username", label:"用户名", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"nodeid", label:"节点id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"instanceid", label:"实例id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"operatetype", label:"操作类型", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isdisabled", label:"已无效", editable:false,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"note", label:"备注", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"processtime", label:"处理时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"stepid", label:"步骤id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"userid", label:"用户id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"usercode", label:"用户编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"username", label:"用户名", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"nodeid", label:"节点id", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
