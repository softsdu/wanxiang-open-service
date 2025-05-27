viewModels.cat_CategoryList = {
  id:"e21bdbef-ce06-4794-8d05-0937790eb00c",
  name:"cat_CategoryList",
  dataName:"cat_CategoryList",
  title:"组件类型",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"codename", label:"类型", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"isleaf", label:"isleaf", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"code", label:"编码", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"codename", label:"类型", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"isleaf", label:"isleaf", editable:true,nullable:true, hidden:true, dispunitType:"checkbox", },
    {name:"parentid", label:"parentid", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"code", label:"编码", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
