viewModels.d_Menu = {
  id:104,
  name:"d_Menu",
  dataName:"d_Menu",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, edittype:"checkbox", dispunitType:"checkbox"},    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:false, edittype:"text", dispunitType:"decimal"},
    {name:"code", label:"编码", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:false, search:true, resizable:true, editable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:false, edittype:"text", dispunitType:"decimal"},
    {name:"description", label:"描述", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, edittype:"text", dispunitType:"text"},
    {name:"isdefaultenable", label:"默认可用", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"ishidden", label:"隐藏", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, edittype:"checkbox", dispunitType:"checkbox"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,dispunitType:"decimal", },
    {name:"code", label:"编码", editable:true,dispunitType:"text", },
    {name:"name", label:"名称", editable:true,dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,dispunitType:"decimal", },
    {name:"description", label:"描述", editable:true,dispunitType:"text", },
    {name:"isdefaultenable", label:"默认可用", editable:true,dispunitType:"checkbox", },
    {name:"ishidden", label:"隐藏", editable:true,dispunitType:"checkbox", }
  ]
};;
