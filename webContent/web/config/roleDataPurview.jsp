<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Data模型</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/d_RoleDataPurview.js"></script>
	<script type="text/javascript" src="${viewModel}/d_RoleDataPurview.js"></script>
	<script type="text/javascript" src="${treeModel}/org.js"></script>
	
	<script> 
		$(document).ready(function(){ 			
			var p = { 
						containerId:"testGridContainer",   
						multiselect:true,  
						dataModel:dataModels.d_RoleDataPurview,
						onePageRowCount:-1,
						isRefreshAfterSave:false,
						viewModel:viewModels.d_RoleDataPurview,
						isShowData:false
			};
			var grid = new NcpGrid(p); 
			var externalObject = {
					beforeDoAdd:function(param){
						if(grid.currentRoleId == undefined){
							msgBox.alert({info:"请选中数据权限要素及角色."});
							return false;
						}
						else{
							return true;
						}
					}, 
					processAddData:function(param){
						for(var rowId in param.newRowsTable.allRows()){
							var row = param.newRowsTable.rows(rowId);			
							row.setValue("roleid",grid.currentRoleId);		
							row.setValue("datapurviewfactorid",grid.currentFactorId);	 
						}
					},
					beforeDoSave:function(param){
						//判断填写的数据是否完整有效
						var errors = [];
						 if(param.insert.count()!=0){
							 for(var rowId in param.insert.allRows()){
								 var row = param.insert.rows(rowId);
								 var valueA = row.getValue("valuea");
								 var valueB = row.getValue("valueb");
								 if((valueA == null || valueA == "")
										 &&(valueB == null || valueB == "")){
									 errors.push("起始值和结束值不可都为空");
								 }
								 else{
									 if(valueA != null && valueA != ""){
										 if(cmnPcr.canConvert(valueA,grid.currentFactorValueType)){
											 errors.push("值 " + valueA + " 错误, " + cmnPcr.getAlertFormatString(grid.currentFactorValueType));
										 }
									 }
									 if(valueB != null && valueB != ""){
										 if(cmnPcr.canConvert(valueB, grid.currentFactorValueType)){
											 errors.push("值 " + valueB + " 错误, " + cmnPcr.getAlertFormatString(grid.currentFactorValueType));
										 }
									 }
								 }								 
							 }
						 }
						 if(param.update.count()!=0){
							 for(var rowId in param.update.allRows()){
								 var row = param.update.rows(rowId);
								 var valueA = row.getValue("valuea");
								 var valueB = row.getValue("valueb");
								 if((valueA == null || valueA == "")
										 &&(valueB == null || valueB == "")){
									 errors.push("起始值和结束值不可都为空");
								 }
								 else{
									 if(valueA != null && valueA != ""){
										 if(cmnPcr.canConvert(valueA,grid.currentFactorValueType)){
											 errors.push("值 " + valueA + " 错误, " + cmnPcr.getAlertFormatString(grid.currentFactorValueType));
										 }
									 }
									 if(valueB != null && valueB != ""){
										 if(cmnPcr.canConvert(valueB, grid.currentFactorValueType)){
											 errors.push("值 " + valueB + " 错误, " + cmnPcr.getAlertFormatString(grid.currentFactorValueType));
										 }
									 }
								 }
							 }
						 }
						 if(errors.length == 0){
							 return true;
						 }
						 else{
						 	msgBox.alert({info:cmnPcr.arrayToString(errors, "。\n")});
						 	return false;
						 }
					}
				};
			grid.addExternalObject(externalObject);
			grid.show();			
			
			//初始化角色、数据权限要素树
			var initTree = function(roleDt, factorDt){
				var treeData = [];
				for(var factorRowId in factorDt.allRows()){
					var factorRow = factorDt.rows(factorRowId);
					var factorId = factorRow.getValue("id");
					var factorName = factorRow.getValue("name");
					var type = factorRow.getValue("valuetype");
					var typeName = cmnPcr.getValueTypeName(type); 
					var isDefaultAll = factorRow.getValue("isdefaultall");
					var factorObj = {text:factorName + "(" + typeName + ", " + (isDefaultAll ? "默认拥有所有权限" : "") + ")",
							state:"closed",
							attributes:{id:factorId, valueType:type},
							children:[]};
					for(var roleRowId in roleDt.allRows()){
						var roleRow = roleDt.rows(roleRowId);
						var roleId = roleRow.getValue("id");
						var roleCode = roleRow.getValue("code");
						var roleName = roleRow.getValue("name");
						var roleObj = {text:roleName + "(" + roleCode + ")",
								attributes:{id:roleId}};
						factorObj.children.push(roleObj);
					}					
					treeData.push(factorObj);	
				}
				
				
				$("#treeDiv").tree({
					data:treeData,
					//单击打开菜单，放弃onDblClick
					onClick:function(node){
						if(grid.currentRoleId != node.attributes.id){
							//执行菜单项表达式
							if(grid.currentStatus != formStatusType.browse){
								grid.doCancel({isShowConfirm:false});
							}
							grid.currentRoleId = node.attributes.id;			
							var factorNode = $("#treeDiv").tree("getParent",node.target);
							grid.currentFactorId = factorNode.attributes.id;
							grid.currentFactorValueType = factorNode.attributes.valueType; 
							grid.doPage({
								pageNumber:1,
								where:[{parttype:"field", field:"roleid", operator:"=", value: grid.currentRoleId} ,
									   {parttype:"field", field:"datapurviewfactorid", operator:"=", value: grid.currentFactorId}] 
							
							}); 
						}  
					}
				});
			};;
			
			//从服务器端获取角色、数据权限要素	
			var serverAccess = new ServerAccess();	
			var requestParam ={serviceName : "dataPurviewNcpService",
					waitingBarParentId : "treeDiv",
					funcName : "getRoleAndDataPurviewFactor", 
					successFunc : function(obj){ 
						var roleDt = serverAccess.getDataTableFromBackInfo(obj.result.roleDt);
						var factorDt = serverAccess.getDataTableFromBackInfo(obj.result.factorDt);
						initTree(roleDt, factorDt);
					},
					args : {requestParam:cmnPcr.jsonToStr(null)}
					};
			serverAccess.request(requestParam); 			
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;">
	<div data-options="region:'west',split:true" style="width:300px;">
		 <div id="treeDiv" style="width:100%;height:100%;">
		 	
		 </div>
	</div>
	<div data-options="region:'center' ">	 
		<div class="easyui-layout"  id ="testGridContainer" data-options="fit:true"> 
			<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">	 
				<span class="ncpGridToolbar">
					<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
					<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
					<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
					<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a> 
					<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
				</span>
			</div>   
			<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
				<table name="gridCtrl" ></table>  
			</div> 
		</div>
	</div>
</body>	 
</html>