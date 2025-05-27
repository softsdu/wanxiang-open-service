viewModels.s3d_Content2DNavigator = {
  id:"0ba1e894-804e-4eec-b86b-2bbb070b058d",
  name:"s3d_Content2DNavigator",
  dataName:"s3d_Content2DNavigator",
  title:"二维页面导航",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:300, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"description", label:"描述", width:400, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", }
  ]
}
