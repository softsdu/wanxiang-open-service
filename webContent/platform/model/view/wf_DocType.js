viewModels.wf_DocType = {
  id:"58eb2b7b-611c-4d84-9af2-5a6e771e2c50",
  name:"wf_DocType",
  dataName:"wf_DocType",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sheetname", label:"Sheet模型", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"useridfieldname", label:"用户ID字段", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"orgidfieldname", label:"组织ID字段", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isdeletedfieldname", label:"删除标记字段", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"checkavailablebeforecreate", label:"制单前判断可用", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"createpageurl", label:"制单页面Url", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"querypageurl", label:"查询页面Url", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"sheetname", label:"Sheet模型", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"useridfieldname", label:"用户ID字段", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"orgidfieldname", label:"组织ID字段", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isdeletedfieldname", label:"删除标记字段", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"checkavailablebeforecreate", label:"制单前判断可用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"createpageurl", label:"制单页面Url", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"querypageurl", label:"查询页面Url", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
