viewModels.d5_ModelLevel = {
  id:"33bab114-d8c3-4631-9536-6db3489855b6",
  name:"d5_ModelLevel",
  dataName:"d5_ModelLevel",
  title:"d5_ModelLevel",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"levelid", label:"层ID", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"levelname", label:"层名称", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modelid", label:"modelid", width:100, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"sortindex", label:"序号", width:50, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"levelid", label:"层ID", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"levelname", label:"层名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"modelid", label:"modelid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"sortindex", label:"序号", editable:true,nullable:true, hidden:false, dispunitType:"decimal", }
  ]
}
