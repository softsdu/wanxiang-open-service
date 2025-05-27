viewModels.con_BlueprintContentConfigComType = {
  id:"b0d0ead9-6f3f-4616-b2ea-cc800ab1f93c",
  name:"con_BlueprintContentConfigComType",
  dataName:"con_BlueprintContentConfigComType",
  title:"蓝图内容配置之构件类型",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"areatypeid", label:"区域id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"areatype", label:"区域", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"areatypecode", label:"区域类型编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"comtypeid", label:"构件类型id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"comtype", label:"构件类型", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"comtypecode", label:"构件类型编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"layername", label:"图层名", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"layerid", label:"图层id", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"areatypeid", label:"区域id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"areatype", label:"区域", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"areatypecode", label:"区域类型编码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"comtypeid", label:"构件类型id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"comtype", label:"构件类型", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"comtypecode", label:"构件类型编码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"layername", label:"图层名", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"parentid", label:"parentid", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"layerid", label:"图层id", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
