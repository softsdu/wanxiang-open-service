viewModels.wf_InstanceStepForBackList = {
  id:"fb6e1d20-a447-4fd8-a63e-330ffa5a78e9",
  name:"wf_InstanceStepForBackList",
  dataName:"wf_InstanceStepForBackList",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"nodeid", label:"节点id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"nodename", label:"节点名称", width:110, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"outtime", label:"流转时间", width:160, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"statustype", label:"状态", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"instanceid", label:"实例id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"canbackfrom", label:"可从此节点退回", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"canbackto", label:"可退回至此节点", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"nodeid", label:"节点id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"nodename", label:"节点名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"outtime", label:"流转时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"statustype", label:"状态", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"instanceid", label:"实例id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"canbackfrom", label:"可从此节点退回", editable:false,nullable:false, hidden:true, dispunitType:"checkbox", },
    {name:"canbackto", label:"可退回至此节点", editable:false,nullable:false, hidden:true, dispunitType:"checkbox", }
  ]
}
