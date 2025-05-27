viewModels.d_Org = {
  id:"105",
  name:"d_Org",
  dataName:"d_Org",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"简称", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"partcode", label:"本级编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isleaf", label:"是否叶节点", width:50, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'center', canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"简称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"partcode", label:"本级编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isleaf", label:"是否叶节点", editable:false,nullable:false, hidden:true, dispunitType:"checkbox", }
  ]
}
