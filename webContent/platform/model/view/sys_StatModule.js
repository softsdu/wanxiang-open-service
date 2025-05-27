viewModels.sys_StatModule = {
  id:"a9f7fd91-c82e-4398-9c7c-10922174a6f8",
  name:"sys_StatModule",
  dataName:"sys_StatModule",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:250, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"已启用", width:70, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"paramwinname", label:"参数窗口模型", width:250, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isauto", label:"自动显示数据", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createusername", label:"创建人", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifyusername", label:"修改人", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"createuser_xid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"modifyuser_xid", label:"修改人id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"已启用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"paramwinname", label:"参数窗口模型", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isauto", label:"自动显示数据", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createusername", label:"创建人", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifyusername", label:"修改人", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"createuser_xid", label:"创建人id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"modifyuser_xid", label:"修改人id", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
