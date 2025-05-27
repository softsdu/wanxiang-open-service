viewModels.cms_Audio = {
  id:"26b3af9f-dc45-485a-a014-a9cdeb6f84b9",
  name:"cms_Audio",
  dataName:"cms_Audio",
  title:"音频",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"accessoryid", label:"accessoryid", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"createusername", label:"创建人", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"createuser_xid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isdeleted", label:"已删除", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"accessoryid", label:"accessoryid", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:true,nullable:true, hidden:false, dispunitType:"time", },
    {name:"createusername", label:"创建人", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"createuser_xid", label:"创建人id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"isdeleted", label:"已删除", editable:true,nullable:true, hidden:true, dispunitType:"checkbox", }
  ]
}
