viewModels.con_BlueprintContentConfigTagType = {
  id:"52d0818a-2ea3-43da-9ee0-ec1711f6262b",
  name:"con_BlueprintContentConfigTagType",
  dataName:"con_BlueprintContentConfigTagType",
  title:"蓝图内容配置之标注类型",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"areatypeid", label:"区域类型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"areatype", label:"区域类型", width:200, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"list"},
    {name:"tagtypeid", label:"标注类型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"tagtype", label:"标注类型", width:200, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"list"},
    {name:"layerid", label:"图层id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"layername", label:"所属图层", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"description", label:"描述", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"areatypeid", label:"区域类型id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"areatype", label:"区域类型", editable:true,nullable:true, hidden:false, dispunitType:"list", },
    {name:"tagtypeid", label:"标注类型id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"tagtype", label:"标注类型", editable:true,nullable:true, hidden:false, dispunitType:"list", },
    {name:"layerid", label:"图层id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"layername", label:"所属图层", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
