viewModels.sys_StatPage = {
  id:"38eb5c38-cbf9-4ec5-afde-26f03da6873e",
  name:"sys_StatPage",
  dataName:"sys_StatPage",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"已启用", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createusername", label:"创建人", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifyusername", label:"修改人", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifyuser_xid", label:"修改人id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createuser_xid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"已启用", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createusername", label:"创建人", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"createtime", label:"创建时间", editable:true,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifyusername", label:"修改人", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"modifytime", label:"修改时间", editable:true,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifyuser_xid", label:"修改人id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createuser_xid", label:"创建人id", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
