viewModels.con_UsescenesDistanceComLOD = {
  id:"ff2f9804-ef44-47ec-937a-76e3f42f025f",
  name:"con_UsescenesDistanceComLOD",
  dataName:"con_UsescenesDistanceComLOD",
  title:"应用场景、距离与构件类型LOD级别对应",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:10, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"lodtypeid", label:"LOD级别id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"lodtype", label:"LOD级别", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"concomtypeid", label:"构件类型id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"concomtype", label:"构件类型", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"castshadow", label:"产生阴影", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"receiveshadow", label:"接受阴影", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"lodtypeid", label:"LOD级别id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"lodtype", label:"LOD级别", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"concomtypeid", label:"构件类型id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"concomtype", label:"构件类型", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"castshadow", label:"产生阴影", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"receiveshadow", label:"接受阴影", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", }
  ]
}
