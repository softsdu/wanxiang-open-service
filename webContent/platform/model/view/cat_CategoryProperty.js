viewModels.cat_CategoryProperty = {
  id:"f22392b8-5a25-4c0b-980f-73ae7efb16df",
  name:"cat_CategoryProperty",
  dataName:"cat_CategoryProperty",
  title:"图元类型属性",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"属性名", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"paramtype", label:"类型", width:100, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"list"},
    {name:"isnullable", label:"可为空", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"iseditable", label:"可编辑", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"isgeo", label:"几何相关", width:50, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"defaultvalue", label:"默认值", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"exp", label:"表达式", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"listvalues", label:"可选值", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parentid", label:"parentid", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"groupname", label:"分组", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:false,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"属性名", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"paramtype", label:"类型", editable:true,nullable:false, hidden:false, dispunitType:"list", },
    {name:"isnullable", label:"可为空", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"iseditable", label:"可编辑", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"isgeo", label:"几何相关", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"defaultvalue", label:"默认值", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"exp", label:"表达式", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"listvalues", label:"可选值", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"parentid", label:"parentid", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"groupname", label:"分组", editable:true,nullable:true, hidden:false, dispunitType:"text", }
  ]
}
