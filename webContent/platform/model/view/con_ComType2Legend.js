viewModels.con_ComType2Legend = {
  id:"cc0bc89c-ac5c-4dd3-845e-03d47fb17743",
  name:"con_ComType2Legend",
  dataName:"con_ComType2Legend",
  title:"构件类型与图例的对应",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"concomtypeid", label:"构件类型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"blueprinttypebydirectionid", label:"蓝图类型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"blueprinttypebydirection", label:"蓝图类型", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"legendid", label:"图例id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"legendname", label:"图例文件", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"blockname", label:"块名称", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"shiftx", label:"平移X距离", width:80, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"shifty", label:"平移Y距离", width:80, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"description", label:"描述", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"concomtypeid", label:"构件类型id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"blueprinttypebydirectionid", label:"蓝图类型id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"blueprinttypebydirection", label:"蓝图类型", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"legendid", label:"图例id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"legendname", label:"图例文件", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"blockname", label:"块名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"shiftx", label:"平移X距离", editable:true,nullable:true, hidden:true, dispunitType:"decimal", },
    {name:"shifty", label:"平移Y距离", editable:true,nullable:true, hidden:true, dispunitType:"decimal", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
