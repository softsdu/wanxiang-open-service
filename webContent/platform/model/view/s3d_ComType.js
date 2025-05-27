viewModels.s3d_ComType = {
  id:"1ae576fa-f03e-47b4-9af9-0f0e0f96d551",
  name:"s3d_ComType",
  dataName:"s3d_ComType",
  title:"S3D组件类型",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isleaf", label:"叶节点", width:0, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"isactive", label:"已启用", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"isleaf", label:"叶节点", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"isactive", label:"已启用", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
