viewModels.sys_Tree = {
  id:"10",
  name:"sys_Tree",
  dataName:"sys_Tree",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:250, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"title", label:"标题", width:250, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"viewname", label:"视图", width:250, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"labelfield", label:"显示名字段", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentpointerfield", label:"上级外键字段", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isleaffield", label:"叶节点字段", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sortfield", label:"排序字段", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"sysmodule", label:"所属模块", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"list"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"title", label:"标题", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"viewname", label:"视图", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"labelfield", label:"显示名字段", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"parentpointerfield", label:"上级外键字段", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isleaffield", label:"叶节点字段", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"sortfield", label:"排序字段", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"sysmodule", label:"所属模块", editable:true,nullable:true, hidden:false, dispunitType:"list", }
  ]
}
