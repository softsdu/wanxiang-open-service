viewModels.func_stepvalue = {
  id:"df7c55f0-d61f-43d6-b7fc-07363483597c",
  name:"func_stepvalue",
  dataName:"func_stepvalue",
  title:"阶梯函数值配置",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"case_value", label:"阶梯值", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'right', canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"result", label:"返回值", width:400, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:400, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"case_value", label:"阶梯值", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"result", label:"返回值", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
