viewModels.s3d_ComponentServer = {
  id:"d1a2502b-648a-4d8e-b293-dca448ee30e8",
  name:"s3d_ComponentServer",
  dataName:"s3d_ComponentServer",
  title:"S3D在线组件",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"componentid", label:"构件ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"componentname", label:"构件名称", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"componentcode", label:"构件编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"componentversionnum", label:"构件版本", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isactive", label:"已启用", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"comtypeid", label:"组件类型类型ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"comtypename", label:"组件类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"comtypecode", label:"类型编码", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"componentid", label:"构件ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"componentname", label:"构件名称", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"componentcode", label:"构件编码", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"componentversionnum", label:"构件版本", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isactive", label:"已启用", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"comtypeid", label:"组件类型类型ID", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"comtypename", label:"组件类型", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"comtypecode", label:"类型编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
