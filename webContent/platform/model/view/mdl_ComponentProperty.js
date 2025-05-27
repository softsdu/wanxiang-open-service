viewModels.mdl_ComponentProperty = {
  id:"e623a4b9-4629-4a34-85dd-7fafd48832c2",
  name:"mdl_ComponentProperty",
  dataName:"mdl_ComponentProperty",
  title:"组件属性",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"componentid", label:"组件Id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"propertyname", label:"属性名", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"valuetype", label:"值类型", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"stringvalue", label:"字符串值", width:300, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"decimalvalue", label:"数值", width:200, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:false, edittype:"text", dispunitType:"decimal"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"componentid", label:"组件Id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"propertyname", label:"属性名", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"valuetype", label:"值类型", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"stringvalue", label:"字符串值", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"decimalvalue", label:"数值", editable:true,nullable:false, hidden:false, dispunitType:"decimal", }
  ]
}
