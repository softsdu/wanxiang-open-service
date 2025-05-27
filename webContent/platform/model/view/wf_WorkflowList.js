viewModels.wf_WorkflowList = {
  id:"6a40fdc3-3434-4d38-906e-ef6972807ff9",
  name:"wf_WorkflowList",
  dataName:"wf_Workflow",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"code", label:"编码", width:220, hidden:true, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"已启用", width:60, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"doctypename", label:"单据类型", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"orgname", label:"适用组织", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"createusername", label:"创建人", width:60, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"code", label:"编码", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"已启用", editable:false,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"doctypename", label:"单据类型", editable:false,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"orgname", label:"适用组织", editable:false,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"createusername", label:"创建人", editable:false,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"createtime", label:"创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
