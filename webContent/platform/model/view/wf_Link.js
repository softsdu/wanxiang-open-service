viewModels.wf_Link = {
  id:"343cd86a-e9fe-4e77-9f1c-dee98f3a5f5c",
  name:"wf_Link",
  dataName:"wf_Link",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"fromnodeid", label:"出点", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"tonodeid", label:"入点", width:100, hidden:false, sortable:false, search:false, resizable:false, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"conditiondef", label:"条件", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"conditionexp", label:"条件表达式", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"linetype", label:"线类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"workflowid", label:"流程id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"fromnodeid", label:"出点", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"tonodeid", label:"入点", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"conditiondef", label:"条件", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"conditionexp", label:"条件表达式", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"linetype", label:"线类型", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"workflowid", label:"流程id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
