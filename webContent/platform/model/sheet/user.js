sheetModels.user = {
  id:"104",
  name:"user",
  parts:{
    lineUR:{name:"lineUR",view:"d_UserRole",labelField:"rolename",parentPartName:"main",parentPointerField:"roleid"},
    lineUOP:{name:"lineUOP",view:"d_UserOrgPost",labelField:"orgname",parentPartName:"main",parentPointerField:"userid"},
    main:{name:"main",view:"d_User",labelField:"name",parentPartName:"",parentPointerField:"null"}
  }
};;
