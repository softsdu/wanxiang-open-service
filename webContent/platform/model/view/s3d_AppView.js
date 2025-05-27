viewModels.s3d_AppView = {
  id:"f21d2767-afda-44ad-b782-045743f45dc7",
  name:"s3d_AppView",
  dataName:"s3d_App",
  title:"S3D应用",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"appname", label:"应用名称", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"appkey", label:"Key", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"expiretime", label:"过期时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"appname", label:"应用名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"appkey", label:"Key", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"expiretime", label:"过期时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"createtime", label:"创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"description", label:"描述", editable:false,nullable:false, hidden:false, dispunitType:"text", }
  ]
}
