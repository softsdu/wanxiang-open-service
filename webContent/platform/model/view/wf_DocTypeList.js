viewModels.wf_DocTypeList = {
  id:"2a4a539d-83d2-4e3c-b070-5a58c2f8e8d4",
  name:"wf_DocTypeList",
  dataName:"wf_DocType",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"checkavailablebeforecreate", label:"制单前判断可用", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"createpageurl", label:"制单页面Url", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"单据类型名称", width:173, hidden:false, sortable:false, search:true, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"querypageurl", label:"查询页面Url", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sheetname", label:"sheet模型名称", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"checkavailablebeforecreate", label:"制单前判断可用", editable:false,nullable:false, hidden:true, dispunitType:"checkbox", },
    {name:"createpageurl", label:"制单页面Url", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"单据类型名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"querypageurl", label:"查询页面Url", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"sheetname", label:"sheet模型名称", editable:false,nullable:false, hidden:true, dispunitType:"pop", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"description", label:"描述", editable:false,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
