sheetModels.comComponent = {
  id:"ff2923f8-9aa3-4c18-8522-de6322196083",
  name:"comComponent",
  parts:{
    com_Accessory:{name:"com_Accessory",view:"com_Accessory",labelField:"accessorycomponent",parentPartName:"com_Component",parentPointerField:"componentid"},
    com_Material:{name:"com_Material",view:"com_Material",labelField:"materialname",parentPartName:"com_Component",parentPointerField:"componentid"},
    com_FamilyFile:{name:"com_FamilyFile",view:"com_FamilyFile",labelField:"filename",parentPartName:"com_Component",parentPointerField:"componentid"},
    com_Component3DMesh:{name:"com_Component3DMesh",view:"com_Component3DMesh",labelField:"meshid",parentPartName:"com_ComponentModel3D",parentPointerField:"component3did"},
    com_ComponentModel3D:{name:"com_ComponentModel3D",view:"com_ComponentModel3D",labelField:"code",parentPartName:"com_Component",parentPointerField:"componentid"},
    com_Component:{name:"com_Component",view:"com_Component",labelField:"code",parentPartName:"",parentPointerField:"null"},
    com_ComponentPropertyType:{name:"com_ComponentPropertyType",view:"com_ComponentPropertyType",labelField:"propertytypecode",parentPartName:"com_Component",parentPointerField:"componentid"}
  }
}
