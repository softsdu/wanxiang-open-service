viewModels.wf_InstanceLogList = {
  id:"d73cbf04-0543-498e-88b0-c5fe539735a5",
  name:"wf_InstanceLogList",
  dataName:"wf_InstanceLogList",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"username", label:"审批人", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"nodename", label:"节点名称", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"note", label:"意见", width:260, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"processtime", label:"处理时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"operatetype", label:"操作方式", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"instanceid", label:"实例id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isdisabled", label:"已无效", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"nodeid", label:"节点id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"stepid", label:"步骤id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"审批人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"username", label:"审批人", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"nodename", label:"节点名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"note", label:"意见", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"processtime", label:"处理时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"operatetype", label:"操作方式", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"instanceid", label:"实例id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"isdisabled", label:"已无效", editable:false,nullable:false, hidden:true, dispunitType:"checkbox", },
    {name:"nodeid", label:"节点id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"stepid", label:"步骤id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"userid", label:"审批人id", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
