viewModels.d_User = {
  id:"109",
  name:"d_User",
  dataName:"d_User",
  title:"d_User",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"姓名", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isusing", label:"可用", width:50, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"email", label:"邮箱", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"mobilenum", label:"电话号码", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"companyid", label:"所属公司ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"companyname", label:"所属公司", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"description", label:"描述", width:240, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"姓名", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isusing", label:"可用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"email", label:"邮箱", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"mobilenum", label:"电话号码", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"companyid", label:"所属公司ID", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"companyname", label:"所属公司", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
