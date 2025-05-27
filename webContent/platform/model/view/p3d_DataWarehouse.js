viewModels.p3d_DataWarehouse = {
  id:"3a5b53be-7b67-418e-abf7-e219be8e92a0",
  name:"p3d_DataWarehouse",
  dataName:"p3d_DataWarehouse",
  title:"数据仓库",
  colModel:[
    {name:"ncpRowSelect", label:" ", width:30, hidden:false, sortable:false, search:false, resizable:false, editable:false, canEdit:false, nullable:true, align:'center', edittype:"checkbox", dispunitType:"checkbox"},
    {name:"id", label:"id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"name", label:"名称", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"ip", label:"IP地址", width:150, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"port", label:"端口", width:30, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"maxvolume", label:"最大容量", width:100, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'right', canEdit:true, nullable:true, edittype:"text", dispunitType:"decimal"},
    {name:"abilitycenterid", label:"所属能力中心id", width:0, hidden:true, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"abilitycentername", label:"所属能力中心", width:200, hidden:false, sortable:true, search:true, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"pop"},
    {name:"description", label:"描述", width:400, hidden:false, sortable:false, search:false, resizable:true, editable:true, align:'left', canEdit:true, nullable:true, edittype:"text", dispunitType:"text"},
    {name:"createtime", label:"创建时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"modifytime", label:"修改时间", width:150, hidden:false, sortable:true, search:false, resizable:true, editable:true, align:'left', canEdit:false, nullable:true, edittype:"text", formatter:timeFormater, dispunitType:"time"},
    {name:"ncpRowOperate", label:"操作", width:150, hidden:false, sortable:false, search:false, resizable:true, editable:false, canEdit:false, nullable:true, align:'center'}
  ],
  dispUnitModel:[
    {name:"id", label:"id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"name", label:"名称", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"ip", label:"IP地址", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"port", label:"端口", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"maxvolume", label:"最大容量", editable:true,nullable:true, hidden:false, dispunitType:"decimal", },
    {name:"abilitycenterid", label:"所属能力中心id", editable:true,nullable:true, hidden:true, dispunitType:"text", },
    {name:"abilitycentername", label:"所属能力中心", editable:true,nullable:true, hidden:false, dispunitType:"pop", },
    {name:"description", label:"描述", editable:true,nullable:true, hidden:false, dispunitType:"text", },
    {name:"createtime", label:"创建时间", editable:false,nullable:true, hidden:false, dispunitType:"time", },
    {name:"modifytime", label:"修改时间", editable:false,nullable:true, hidden:false, dispunitType:"time", }
  ]
}
