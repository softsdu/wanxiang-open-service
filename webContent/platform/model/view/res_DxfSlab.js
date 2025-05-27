viewModels.res_DxfSlab = {
  id:"f733702d-095c-4902-a52e-3d089d97c90a",
  name:"res_DxfSlab",
  dataName:"res_DxfSlab",
  title:"叠合板图纸",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:40, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"filetype", label:"文件类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"jsonaccessoryid", label:"JSON附件ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"validated", label:"解析成功", width:60, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"accessoryid", label:"附件ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"accessoryname", label:"附件名称", width:100, hidden:true, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"上传时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"createusername", label:"上传人", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"modifytime", label:"修改时间", width:150, hidden:true, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifyusername", label:"修改人", width:100, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"modifyuser_xid", label:"修改人ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createuser_xid", label:"上传人ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"filetype", label:"文件类型", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"jsonaccessoryid", label:"JSON附件ID", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"validated", label:"解析成功", editable:false,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"accessoryid", label:"附件ID", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"accessoryname", label:"附件名称", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createtime", label:"上传时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"createusername", label:"上传人", editable:false,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:true, dispunitType:"time", },
    {name:"modifyusername", label:"修改人", editable:false,nullable:true, hidden:true, dispunitType:"pop", },
    {name:"modifyuser_xid", label:"修改人ID", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"createuser_xid", label:"上传人ID", editable:false,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
