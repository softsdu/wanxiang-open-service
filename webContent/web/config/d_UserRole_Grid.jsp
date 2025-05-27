<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>用户角色</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	
	<script type="text/javascript" src="${dataModel}/d_Role.js"></script>
	<script type="text/javascript" src="${viewModel}/d_Role.js"></script>
	<script type="text/javascript" src="${dataModel}/d_UserRole.js"></script>
	<script type="text/javascript" src="${viewModel}/d_UserRole.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var userRoleParam = { 
					containerId:"testUserRoleGridContainer",   
					multiselect:true,  
					dataModel:dataModels.d_UserRole,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					viewModel:viewModels.d_UserRole,
					isShowData:true,
					where:[{parttype:"clause", clause:"1<>1"}]
			};
			var userRoleParamGrid = new NcpGrid(userRoleParam); 
			userRoleParamGrid.show(); 
			var externalObject = {
					beforeDoAdd:function(param){
						if(userRoleParamGrid.role == undefined || userRoleParamGrid.role.id == null){
							msgBox.alert({info:"请选中角色."});
							return false;
						}
						else{
							return true;
						}
					}, 
					processAddData:function(param){
						for(var rowId in param.newRowsTable.allRows()){
							var row = param.newRowsTable.rows(rowId);			
							row.setValue("roleid",userRoleParamGrid.role.id);		
							row.setValue("rolename",userRoleParamGrid.role.name);		
							row.setValue("rolecode",userRoleParamGrid.role.code);
						}
					}
				};
			userRoleParamGrid.addExternalObject(externalObject);
			
			var roleParam = { 
					containerId:"testRoleGridContainer",   
					multiselect:true,  
					dataModel:dataModels.d_Role,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					viewModel:viewModels.d_Role ,
					hideOperateColumn: true
			};
			var roleGrid = new NcpGrid(roleParam); 
			
			var externalObject = { 
				afterRowSelect : function(rowId){
					if(rowId == undefined){
						userRoleParamGrid.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"roleId", operator:"is", value:""}]
						});
						userRoleParamGrid.role = {id:null, name:null, code:null};
					}
					else{ 
						var row = roleGrid.datatable.rows(rowId);
						var roleid = row.getValue("id");
						var rolename = row.getValue("name");
						var rolecode = row.getValue("code");
						userRoleParamGrid.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"roleid", operator:"=", value: roleid.toString()}]
						});
						userRoleParamGrid.role = {id:roleid, name:rolename, code:rolecode};
					}
				} 
			};
			roleGrid.addExternalObject(externalObject);
			roleGrid.show();
		});  
	</script>
</head>  
<body id="testGridContainer">
	<div class="zlpGridStyleContainer" style="position:absolute;left:0px;width:400px;top:0px;bottom:0px;">
		<div class="zlpGridStyleInnerContainer" id = "testRoleGridContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">  
					<div class="zlpToolbarQueryContainer">
						<input type="text" class="zlpToolbarQueryInputText" placeholder="请输入关键字" />
						<a name="queryBtn" href="#" class="zlpToolbarQueryBtn">查询</a>
					</div>
				</div> 
			</div>
			<div class="zlpGridContainer" name="gridDiv">
				<table name="gridCtrl" class="zlpGridTable"></table>
			</div>
			<div class="zlpBottomContainer">
				<ul class="zlpNavUl pagination">
				</ul> 
			</div>
		</div>
	</div>
	<div class="zlpGridStyleContainer" style="position:absolute;left:410px;right:0px;top:0px;bottom:0px;width:auto;">
		<div class="zlpGridStyleInnerContainer" id = "testUserRoleGridContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer"> 
					<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>  
					<a name="editBtn" href="#" class="zlpToolbarBtn editBtn">编辑</a>  
					<a name="saveBtn" href="#" class="zlpToolbarBtn saveBtn">保存</a>
					<a name="cancelBtn" href="#" class="zlpToolbarBtn cancelBtn">取消</a>
					<a name="deleteBtn" href="#" class="zlpToolbarBtn deleteBtn">删除</a>
					<div class="zlpToolbarQueryContainer">
						<input type="text" class="zlpToolbarQueryInputText" placeholder="请输入关键字" />
						<a name="queryBtn" href="#" class="zlpToolbarQueryBtn">查询</a>
					</div>
				</div> 
			</div>
			<div class="zlpGridContainer" name="gridDiv">
				<table name="gridCtrl" class="zlpGridTable"></table>
			</div>
			<div class="zlpBottomContainer">
				<ul class="zlpNavUl pagination">
				</ul> 
			</div>
		</div>
	</div>
</body>
</html>