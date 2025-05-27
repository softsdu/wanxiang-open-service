viewModels.com_Component3DParameter = {
  id:"cdf62323-f9d9-4897-bd61-da4fb6fc0752",
  name:"com_Component3DParameter",
  dataName:"com_Component3DParameter",
  title:"构件3D模型参数",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"groupname", label:"分组", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"parametername", label:"参数名", width:70, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"propertytypeid", label:"属性类型ID", width:0, hidden:true, sortable:false, search:false, resizable:false, editable:true, align:'left', canEdit:false, nullable:false, edittype:"text", dispunitType:"text"},
    {name:"propertytypename", label:"属性名", width:70, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:false, edittype:"text", dispunitType:"pop"},
    {name:"valuetypename", label:"值类型", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"unittypeshortname", label:"计量单位", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"editable", label:"允许编辑", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"isnullable", label:"可为空", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:true, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"islist", label:"列表选择", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'center', canEdit:true, nullable:false, edittype:"checkbox", dispunitType:"checkbox"},
    {name:"decimalnum", label:"小数位数", width:70, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"pvalue", label:"属性值", width:300, hidden:false, sortable:false, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"component3did", label:"物料3D模型ID", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:false, hidden:true, dispunitType:"text", },
    {name:"groupname", label:"分组", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"parametername", label:"参数名", editable:true,nullable:false, hidden:false, dispunitType:"text", },
    {name:"propertytypeid", label:"属性类型ID", editable:false,nullable:false, hidden:true, dispunitType:"text", },
    {name:"propertytypename", label:"属性名", editable:true,nullable:false, hidden:false, dispunitType:"pop", },
    {name:"valuetypename", label:"值类型", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"unittypeshortname", label:"计量单位", editable:false,nullable:true, hidden:false, dispunitType:"text", },
    {name:"editable", label:"允许编辑", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"isnullable", label:"可为空", editable:true,nullable:true, hidden:false, dispunitType:"checkbox", },
    {name:"islist", label:"列表选择", editable:true,nullable:false, hidden:false, dispunitType:"checkbox", },
    {name:"decimalnum", label:"小数位数", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"pvalue", label:"属性值", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"component3did", label:"物料3D模型ID", editable:true,nullable:true, hidden:true, dispunitType:"text", }
  ]
}
