viewModels.ds_SystemButton = {
  id:"8ffc2337-3492-4c47-84dc-7fa08e462260",
  name:"ds_SystemButton",
  dataName:"ds_SystemButton",
  title:"设计系统工具栏按钮",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sortindex", label:"序号", width:50, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'right', canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"code", label:"编码", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"btntype", label:"类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"componentcode", label:"关联构件编码", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"componentname", label:"关联构件名称", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"componentid", label:"关联构件ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"sortindex", label:"序号", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"code", label:"编码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"btntype", label:"类型", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"componentcode", label:"关联构件编码", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"componentname", label:"关联构件名称", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"componentid", label:"关联构件ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
