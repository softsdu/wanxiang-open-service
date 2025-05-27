viewModels.ais_Invoke = {
  id:"6f0a220d-b79b-416a-8aab-b9b1ba1bb65e",
  name:"ais_Invoke",
  dataName:"ais_Invoke",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"invoketime", label:"调用时间", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"endtime", label:"结束时间", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"nextchecktime", label:"状态检测时间", width:150, hidden:false, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"timeouttime", label:"超时时间", width:150, hidden:false, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"serviceid", label:"服务id", width:0, hidden:true, sortable:false, search:true, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"servicename", label:"服务名称", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"statustype", label:"状态", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"note", label:"备注", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"fromid", label:"来源Id", width:150, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"fromname", label:"来源名称", width:150, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"userid", label:"创建人id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"username", label:"创建人", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"createtime", label:"创建时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"invoketime", label:"调用时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"endtime", label:"结束时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"nextchecktime", label:"状态检测时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"timeouttime", label:"超时时间", editable:false,nullable:false, hidden:false, dispunitType:"time", },
    {name:"serviceid", label:"服务id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"servicename", label:"服务名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"statustype", label:"状态", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"note", label:"备注", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"fromid", label:"来源Id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"fromname", label:"来源名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"userid", label:"创建人id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"username", label:"创建人", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", }
  ]
}
