viewModels.p3d_ContainerMicroService = {
  id:"8f1d78f0-25b8-4958-8978-72febcb74840",
  name:"p3d_ContainerMicroService",
  dataName:"p3d_ContainerMicroService",
  title:"容器的微服务",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"containerid", label:"容器id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"microserviceid", label:"微服务id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"microservicename", label:"微服务", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"containerid", label:"容器id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"microserviceid", label:"微服务id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"microservicename", label:"微服务", editable:true,nullable:true, hidden:false, dispunitType:"pop", }
  ]
}
