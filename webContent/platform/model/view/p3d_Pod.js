viewModels.p3d_Pod = {
  id:"ada668d9-dc1f-4656-96d7-04b8e2a3e5a2",
  name:"p3d_Pod",
  dataName:"p3d_Pod",
  title:"Pod",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"namespace", label:"命名空间", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ownername", label:"所有者", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ownerkind", label:"所有者类型", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"nodeid", label:"所属节点id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"nodeip", label:"所属节点", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"description", label:"描述", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"namespace", label:"命名空间", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"ownername", label:"所有者", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"ownerkind", label:"所有者类型", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"nodeid", label:"所属节点id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"nodeip", label:"所属节点", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", }
  ]
}
