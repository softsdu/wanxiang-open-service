viewModels.sys_ViewDispunit = {
  id:"2",
  name:"sys_ViewDispunit",
  dataName:"sys_ViewDispunit",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"label", label:"显示名", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"colwidth", label:"列宽", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"colsortable", label:"列可排序", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"colsearch", label:"列查询", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"colresizable", label:"列宽可变", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"editable", label:"可编辑", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"nullable", label:"可为空", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"colvisible", label:"列可见", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"colindex", label:"列顺序", width:60, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"id", label:"id", width:10, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:10, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"label", label:"显示名", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"colwidth", label:"列宽", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"colsortable", label:"列可排序", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"colsearch", label:"列查询", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"colresizable", label:"列宽可变", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"editable", label:"可编辑", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"nullable", label:"可为空", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"colvisible", label:"列可见", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"colindex", label:"列顺序", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
