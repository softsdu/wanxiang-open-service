viewModels.bsp_api_key = {
  id:"b11a8863-9532-427a-845e-92bce8005ee8",
  name:"bsp_api_key",
  dataName:"bsp_api_key",
  title:"apikey",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"keycode", label:"apikey唯一码", width:260, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"org_xid", label:"企业ID", width:260, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"启用", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"keycode", label:"apikey唯一码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"org_xid", label:"企业ID", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"启用", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
