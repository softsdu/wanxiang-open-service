viewModels.bsp_api_key_name = {
  id:"4ab71113-488d-40cc-b0ec-f0ec0eb58dec",
  name:"bsp_api_key_name",
  dataName:"bsp_api_key_name",
  title:"接口",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"apiname", label:"接口名称", width:260, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"启用", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"parent_id", label:"父ID", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"apiname", label:"接口名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"启用", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"parent_id", label:"父ID", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
