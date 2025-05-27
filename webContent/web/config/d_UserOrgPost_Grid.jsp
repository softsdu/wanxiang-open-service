<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>用户-部门-岗位</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/d_UserOrgPost.js"></script>
	<script type="text/javascript" src="${viewModel}/d_UserOrgPost.js"></script>
	<script type="text/javascript" src="${dataModel}/d_Org.js"></script>
	<script type="text/javascript" src="${viewModel}/d_Org.js"></script>
	<script type="text/javascript" src="${treeModel}/org.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var userOrgPostParam = { 
					containerId:"testUserOrgPostGridContainer",   
					multiselect:true,  
					dataModel:dataModels.d_UserOrgPost,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					viewModel:viewModels.d_UserOrgPost,
					isShowData:true,
					where:[{parttype:"clause", clause:"1<>1"}]
			};
			var userOrgPostParamGrid = new NcpGrid(userOrgPostParam); 
			userOrgPostParamGrid.show(); 
			var externalObject = {
					beforeDoAdd:function(param){
						if(userOrgPostParamGrid.org == undefined || userOrgPostParamGrid.org.id == null){
							msgBox.alert({info:"请选中部门."});
							return false;
						}
						else{
							return true;
						}
					},
					processAddData:function(param){
						for(var rowId in param.newRowsTable.allRows()){
							var row = param.newRowsTable.rows(rowId);
							row.setValue("orgid",userOrgPostParamGrid.org.id);
							row.setValue("orgname",userOrgPostParamGrid.org.name);
							row.setValue("orgcode",userOrgPostParamGrid.org.code);
						}
						return true;
					},
					beforeDoSave:function(param){
                        if(param.update == undefined && param.insert == undefined){
                            alert("请先编辑！");
                            return false;
                        }else{
                            return true;
                        }
                    }
				};
			userOrgPostParamGrid.addExternalObject(externalObject);

			var orgParam = { 
				containerId:"testOrgGridContainer", 
				treeModel:treeModels.org, 
				editWinHeight:150,
				editWinWidth:500,
				isExpandRoot:true,
				hideOperateColumn: true
			};
			var orgTree = new NcpTree(orgParam);  
			
			var externalObject = { 
				afterRowSelect : function(rowId){
					if(rowId == undefined){
						userOrgPostParamGrid.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"orgId", operator:"is", value:""}]
						});
						userOrgPostParamGrid.org = {id:null, name:null, code:null};
					}
					else{ 
						var row = orgTree.treeGridCtrl.datatable.rows(rowId);
						var orgid = row.getValue("id");
						var orgname = row.getValue("name");
						var orgcode = row.getValue("code");
						userOrgPostParamGrid.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"orgid", operator:"=", value: orgid.toString()}]
						});
						userOrgPostParamGrid.org = {id:orgid, name:orgname, code:orgcode};
					}
				} 
			};
			orgTree.show();
			orgTree.treeGridCtrl.addExternalObject(externalObject);
		});  
	</script>
</head>   
<body id="testGridContainer">
	<div class="zlpGridStyleContainer" style="position:absolute;left:0px;width:400px;top:0px;bottom:0px;">
		<div class="zlpGridStyleInnerContainer" id = "testOrgGridContainer">
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
		<div class="zlpGridStyleInnerContainer" id = "testUserOrgPostGridContainer">
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