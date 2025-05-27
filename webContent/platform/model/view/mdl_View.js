viewModels.mdl_View = {
  id:"bebd025c-6b4b-4763-91f0-e5a8f6f830a2",
  name:"mdl_View",
  dataName:"mdl_View",
  title:"模型视图",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"accessoryid", label:"附件ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"modelid", label:"模型ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modelname", label:"模型名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createuser_xid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createusername", label:"创建人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifyuser_xid", label:"修改人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"modifyusername", label:"修改人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"companyid", label:"所属公司ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"accessoryid", label:"附件ID", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"modelid", label:"模型ID", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"modelname", label:"模型名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createuser_xid", label:"创建人id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createusername", label:"创建人", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifyuser_xid", label:"修改人id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"modifyusername", label:"修改人", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"companyid", label:"所属公司ID", editable:false,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
