viewModels.d5_ConvertModelLog = {
  id:"7f10fb52-e041-4cab-937a-81f922b13492",
  name:"d5_ConvertModelLog",
  dataName:"d5_ConvertModelLog",
  title:"d5_ConvertModelLog",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"accessoryid", label:"附件Id", width:200, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"status", label:"状态", width:70, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"info", label:"信息", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"begintime", label:"开始时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"stepbegintime", label:"步骤开始时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"endtime", label:"结束时间", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"userid", label:"用户Id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"accessoryfilepath", label:"源文件地址", width:150, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"username", label:"操作人", width:80, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:false,nullable:false, hidden:false, dispunitType:"text", },
    {name:"accessoryid", label:"附件Id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"status", label:"状态", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"info", label:"信息", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"begintime", label:"开始时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"stepbegintime", label:"步骤开始时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"endtime", label:"结束时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"userid", label:"用户Id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"accessoryfilepath", label:"源文件地址", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"username", label:"操作人", editable:false,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
