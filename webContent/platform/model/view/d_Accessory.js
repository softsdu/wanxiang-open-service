viewModels.d_Accessory = {
  id:"155",
  name:"d_Accessory",
  dataName:"d_Accessory",
  title:"d_Accessory",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"文件名", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"filetype", label:"类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"uploadtime", label:"上传时间", width:160, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"filtertype", label:"过滤类型", width:200, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"filtervalue", label:"过滤值", width:200, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"ID", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"文件名", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"filetype", label:"类型", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"uploadtime", label:"上传时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"filtertype", label:"过滤类型", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"filtervalue", label:"过滤值", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
