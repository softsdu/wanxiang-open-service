viewModels.p3d_ContainerStatus = {
  id:"c34c7a2c-2727-481e-b947-9faba420f53c",
  name:"p3d_ContainerStatus",
  dataName:"p3d_ContainerStatus",
  title:"容器状态信息",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"podstatusid", label:"podstatusid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"nodestatusid", label:"nodestatusid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"clusterstatusid", label:"clusterstatusid", width:0, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"statusinfoid", label:"statusinfoid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"namespace", label:"命名空间", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"logtime", label:"记录时间", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"clusterstatusname", label:"集群名称", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"nodestatusip", label:"节点IP", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"podstatusname", label:"容器组名称", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"container_cpu_usage", label:"容器CPU用量(core)", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"container_memory_usage_wo_cache", label:"容器内存使用量(Byte)", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"podstatusid", label:"podstatusid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"nodestatusid", label:"nodestatusid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"clusterstatusid", label:"clusterstatusid", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"statusinfoid", label:"statusinfoid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"namespace", label:"命名空间", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"logtime", label:"记录时间", editable:true,nullable:true, hidden:false, dispunitType:"time", },
    {name:"clusterstatusname", label:"集群名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"nodestatusip", label:"节点IP", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"podstatusname", label:"容器组名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"container_cpu_usage", label:"容器CPU用量(core)", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"container_memory_usage_wo_cache", label:"容器内存使用量(Byte)", editable:true,nullable:true, hidden:false, dispunitType:"decimal", }
  ]
}
