viewModels.con_Projectunit = {
  id:"2bd8d021-d9ba-426d-b4b4-169973ae687f",
  name:"con_Projectunit",
  dataName:"con_Projectunit",
  title:"项目单体信息",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:100, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:160, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:160, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"说明", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createuser_xid", label:"创建人id", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:200, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"createusername", label:"创建人", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"modifytime", label:"修改时间", width:200, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifyusername", label:"修改人", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"modifyuser_xid", label:"修改人id", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isdeleted", label:"已删除", width:10, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"deletetime", label:"删除时间", width:200, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"projectid", label:"项目id", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"description", label:"说明", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createuser_xid", label:"创建人id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:true,nullable:true, hidden:true, dispunitType:"time", },
    {name:"createusername", label:"创建人", editable:true,nullable:true, hidden:true, dispunitType:"pop", },
    {name:"modifytime", label:"修改时间", editable:true,nullable:true, hidden:true, dispunitType:"time", },
    {name:"modifyusername", label:"修改人", editable:true,nullable:true, hidden:true, dispunitType:"pop", },
    {name:"modifyuser_xid", label:"修改人id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"isdeleted", label:"已删除", editable:true,nullable:true, hidden:true, dispunitType:"checkbox", },
    {name:"deletetime", label:"删除时间", editable:true,nullable:true, hidden:true, dispunitType:"time", },
    {name:"projectid", label:"项目id", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
