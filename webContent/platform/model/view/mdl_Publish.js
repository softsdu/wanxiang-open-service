viewModels.mdl_Publish = {
  id:"ff92dae7-090f-4414-99c5-6389600ea1ad",
  name:"mdl_Publish",
  dataName:"mdl_Publish",
  title:"模型发布",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:300, hidden:false, sortable:false, search:true, resizable:false, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"componentName", label:"模型名称", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'', canEdit:false, nullable:true, edittype:"", dispunitType:""},
    {name:"componentcode", label:"模型编码", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"versionnum", label:"模型版本", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"detaillevel", label:"细节级别", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"viewlevel", label:"显示级别", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"publishstatus", label:"发布状态", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"errorinfo", label:"错误信息", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"componentid", label:"模型ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"componentName", label:"模型名称", editable:false,nullable:true, hidden:false, dispunitType:"", },
    {name:"componentcode", label:"模型编码", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"versionnum", label:"模型版本", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"detaillevel", label:"细节级别", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"viewlevel", label:"显示级别", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"publishstatus", label:"发布状态", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"errorinfo", label:"错误信息", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"componentid", label:"模型ID", editable:false,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
