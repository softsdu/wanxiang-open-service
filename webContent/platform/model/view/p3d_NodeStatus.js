viewModels.p3d_NodeStatus = {
  id:"c20ebcb4-5ecd-42dd-ab56-c41e4234be56",
  name:"p3d_NodeStatus",
  dataName:"p3d_NodeStatus",
  title:"节点状态信息",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ip", label:"IP地址", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"clusterstatusid", label:"clusterstatusid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"statusinfoid", label:"statusinfoid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"logtime", label:"记录时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"clusterstatusname", label:"集群名称", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"node_cpu_total", label:"节点CPU总量(core)", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"node_cpu_usage", label:"节点CPU用量(core)", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"node_cpu_utilisation", label:"节点CPU使用率", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"node_load1", label:"节点1分钟CPU平均负载", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"node_load5", label:"节点5分钟CPU平均负载", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"ip", label:"IP地址", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"clusterstatusid", label:"clusterstatusid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"statusinfoid", label:"statusinfoid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"logtime", label:"记录时间", editable:true,nullable:true, hidden:false, dispunitType:"time", },
    {name:"clusterstatusname", label:"集群名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"node_cpu_total", label:"节点CPU总量(core)", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"node_cpu_usage", label:"节点CPU用量(core)", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"node_cpu_utilisation", label:"节点CPU使用率", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"node_load1", label:"节点1分钟CPU平均负载", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"node_load5", label:"节点5分钟CPU平均负载", editable:true,nullable:true, hidden:false, dispunitType:"decimal", }
  ]
}
