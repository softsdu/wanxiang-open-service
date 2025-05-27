<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>角色菜单</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	
	<script type="text/javascript" src="${dataModel}/d_RoleMenu.js"></script>
	<script type="text/javascript" src="${viewModel}/d_RoleMenu.js"></script>
	<script type="text/javascript" src="${dataModel}/d_Role.js"></script>
	<script type="text/javascript" src="${viewModel}/d_Role.js"></script>
	
	
	<script> 
		$(document).ready(function(){ 
			var roleMenuParam = { 
					containerId:"testRoleMenuGridContainer",   
					multiselect:true,  
					dataModel:dataModels.d_RoleMenu,
					onePageRowCount:20,
					isRefreshAfterSave:false,
					viewModel:viewModels.d_RoleMenu,
					isShowData:true,
					where:[{parttype:"clause", clause:"1<>1"}],
					parentTreeIdField:"menuparentid",
					treeIdField:"menuid",
					labelField:"menuname"
			};
			var roleMenuParamGrid = new NcpTreeStyleGrid(roleMenuParam);
			roleMenuParamGrid.show();
			var roleMenuExternalObject = {
					afterDoEdit:function(param){
						roleMenuParamGrid.treeStyleGridCtrl.doAllEdit();
					}
			};;
			roleMenuParamGrid.treeStyleGridCtrl.addExternalObject(roleMenuExternalObject);
			
			
			var roleParam = { 
					containerId:"testRoleGridContainer",   
					multiselect:true,  
					dataModel:dataModels.d_Role,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					viewModel:viewModels.d_Role,
					hideOperateColumn: true
			};
			var roleGrid = new NcpGrid(roleParam); 
			
			var externalObject = { 
				afterRowSelect : function(rowId){
					if(rowId == undefined){
						roleMenuParamGrid.treeStyleGridCtrl.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"roleId", operator:"is", value:""}]
						});
						roleMenuParamGrid.role = {id:null, name:null, code:null};
					}
					else{ 
						var row = roleGrid.datatable.rows(rowId);
						var roleid = row.getValue("id");
						var rolename = row.getValue("name");
						var rolecode = row.getValue("code");
						roleMenuParamGrid.treeStyleGridCtrl.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"roleid", operator:"=", value: roleid.toString()}]
						});
						roleMenuParamGrid.role = {id:roleid, name:rolename, code:rolecode};
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
		<div class="zlpGridStyleInnerContainer" id = "testRoleMenuGridContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">  
					<a name="editBtn" href="#" class="zlpToolbarBtn editBtn">编辑</a>  
					<a name="saveBtn" href="#" class="zlpToolbarBtn saveBtn">保存</a>
					<a name="cancelBtn" href="#" class="zlpToolbarBtn cancelBtn">取消</a>  
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