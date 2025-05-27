viewModels.con_ProjectBlueprint = {
  id:"26bf9730-ebdb-4f4c-a734-5d737461ad79",
  name:"con_ProjectBlueprint",
  dataName:"con_ProjectBlueprint",
  title:"项目蓝图信息",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"fileid", label:"DXF文件id", width:200, hidden:true, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"projectid", label:"所属项目id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"projectname", label:"所属项目", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"blueprinttypeid", label:"类型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"blueprinttype", label:"类型", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"modelid", label:"模型id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modelname", label:"模型名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"versionnum", label:"版本", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"fileid", label:"DXF文件id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"projectid", label:"所属项目id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"projectname", label:"所属项目", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"blueprinttypeid", label:"类型id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"blueprinttype", label:"类型", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"modelid", label:"模型id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"modelname", label:"模型名称", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"versionnum", label:"版本", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", }
  ]
}
