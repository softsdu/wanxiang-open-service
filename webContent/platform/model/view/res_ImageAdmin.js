viewModels.res_ImageAdmin = {
  id:"99ae5cf4-2e3d-4696-bf56-872ac6aefbbb",
  name:"res_ImageAdmin",
  dataName:"res_Image",
  title:"res_Image",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"accessoryid", label:"附件ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"companyid", label:"所属公司ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ispublic", label:"公共", width:50, hidden:false, sortable:false, search:false, resizable:false, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"createusername", label:"创建人", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"createuser_xid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"accessoryid", label:"附件ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"companyid", label:"所属公司ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"ispublic", label:"公共", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"createusername", label:"创建人", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"createuser_xid", label:"创建人id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:true,nullable:true, hidden:false, dispunitType:"time", }
  ]
}
