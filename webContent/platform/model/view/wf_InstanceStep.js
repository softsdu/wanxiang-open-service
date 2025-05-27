viewModels.wf_InstanceStep = {
  id:"6e310d92-78fd-4d67-a75c-d4d1f97453e9",
  name:"wf_InstanceStep",
  dataName:"wf_InstanceStep",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"instanceid", label:"实例id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"nodeid", label:"节点id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"nodename", label:"节点名称", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"intime", label:"到达时间", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"outtime", label:"离开时间", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"statustype", label:"状态", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"timingprocesstime", label:"定时处理时间", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"invokeid", label:"异步调用id", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"instanceid", label:"实例id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"nodeid", label:"节点id", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"nodename", label:"节点名称", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"intime", label:"到达时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"outtime", label:"离开时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"statustype", label:"状态", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"timingprocesstime", label:"定时处理时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"invokeid", label:"异步调用id", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
