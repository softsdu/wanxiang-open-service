viewModels.cat_Category = {
  id:"0457b03a-c87d-4e0f-b7aa-b2c34fe15619",
  name:"cat_Category",
  dataName:"cat_Category",
  title:"材料类型",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"code", label:"编码", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"mdltype", label:"mdl类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isleaf", label:"叶节点", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"parentid", label:"父类ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"mdltype", label:"mdl类型", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isleaf", label:"叶节点", editable:true,nullable:true, hidden:true, dispunitType:"checkbox", },
    {name:"parentid", label:"父类ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
