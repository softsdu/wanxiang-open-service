viewModels.sys_DownListField = {
  id:"9",
  name:"sys_DownListField",
  dataName:"sys_DownListField",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:20, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:10, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:10, hidden:true, sortable:false, search:false, resizable:false, editable:true, canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"valuetype", label:"类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"displayname", label:"显示名", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"isshow", label:"可见", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"showwidth", label:"列宽", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"iscomma", label:"千分符", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"decimalnum", label:"小数位数", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"showindex", label:"顺序号", width:50, hidden:false, sortable:true, search:true, resizable:true, editable:true, canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"datapurviewfactor", label:"数据权限要素", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, canEdit:true, nullable:true, edittype:"text", dispunitType:"text"}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"valuetype", label:"类型", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"displayname", label:"显示名", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"isshow", label:"可见", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"showwidth", label:"列宽", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"iscomma", label:"千分符", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"decimalnum", label:"小数位数", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"showindex", label:"顺序号", editable:true,nullable:false, hidden:false, dispunitType:"decimal", },
    {name:"datapurviewfactor", label:"数据权限要素", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
};;
