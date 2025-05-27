viewModels.wf_Instance = {
  id:"66b61c78-0d40-4905-b06a-ff288fcdc0af",
  name:"wf_Instance",
  dataName:"wf_Instance",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:100, hidden:false, sortable:false, search:true, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"workflowid", label:"流程id", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"用户id", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"usercode", label:"用户编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"username", label:"用户名", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isend", label:"已结束", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"isdeleted", label:"已删除", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"currentnodes", label:"当前节点", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"currentstatus", label:"当前状态", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"endtime", label:"完成时间", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"orgid", label:"组织id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"orgcode", label:"组织编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"orgname", label:"组织名称", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"workflowid", label:"流程id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"userid", label:"用户id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"usercode", label:"用户编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"username", label:"用户名", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isend", label:"已结束", editable:false,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"isdeleted", label:"已删除", editable:false,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"currentnodes", label:"当前节点", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"currentstatus", label:"当前状态", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"endtime", label:"完成时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"orgid", label:"组织id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"orgcode", label:"组织编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"orgname", label:"组织名称", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
