viewModels.d5_ModelElementSelect = {
  id:"6420100e-0912-488c-8019-f9169dbf1f62",
  name:"d5_ModelElementSelect",
  dataName:"d5_ModelElementSelect",
  title:"模型构件选择",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"fullname", label:"全名", width:350, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"elementid", label:"构件标识", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modelid", label:"modelid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"modelname", label:"模型名", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"fullname", label:"全名", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"elementid", label:"构件标识", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"modelid", label:"modelid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"modelname", label:"模型名", editable:false,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
