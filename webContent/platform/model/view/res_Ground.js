viewModels.res_Ground = {
  id:"952ca32d-eeed-4782-9806-48c1409b2f3b",
  name:"res_Ground",
  dataName:"res_Ground",
  title:"地形数据",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"filetype", label:"文件类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"已启用", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"accessoryid", label:"附件ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"accessoryname", label:"附件名称", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"createusername", label:"创建人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"createuser_xid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifyusername", label:"修改人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"modifyuser_xid", label:"修改人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"filetype", label:"文件类型", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"已启用", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"accessoryid", label:"附件ID", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"accessoryname", label:"附件名称", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"createusername", label:"创建人", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"createuser_xid", label:"创建人id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifyusername", label:"修改人", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"modifyuser_xid", label:"修改人id", editable:false,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
