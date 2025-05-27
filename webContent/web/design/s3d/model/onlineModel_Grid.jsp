<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>场景三维模型</title>
	<script type="text/javascript" src="${dataModel}/s3d_Model.js"></script>
	<script type="text/javascript" src="${viewModel}/s3d_Model.js"></script>
	<link rel="stylesheet" href="./css/onlineModule_Grid.css">
	<script type="text/javascript" src="js/onlineModelGrid.js?t=<%=fileVersion%>"></script>
	
	<script>
		var modelGrid = null;
		var grid = null;

		const appName = "ExhibitEditor";

		$(document).ready(function(){
			let p = {
				containerId: "testGridContainer",
				multiselect: true,
				dataModel: dataModels.s3d_Model,
				onePageRowCount: 20,
				isRefreshAfterSave: false,
				viewModel: viewModels.s3d_Model,
				sysWhere: [{parttype:"field", field: "appname", operator:"=", value: appName}]
			};
			grid = new NcpGrid(p);
			grid.show();

			modelGrid = new OnlineModelGrid();
			modelGrid.init({
				appName: appName
			});

			//修改新建组件的方法 modified by ls 20210823
			$("#addBtnId").click(function(){
				modelGrid.createModel({
					afterCreateModelFunc: function(p){
						grid.doPage({pageNumber: 1});
					}
				});
				return false;
			});

			$("#editBtnId").click(function(){
				let row = grid.getCurrentRow();
				if(row == null){
					msgBox.alert({info: "请选中行."});
				}
				else{
					let id = row.getValue("id");
					let name = row.getValue("name");
					modelGrid.openEditPage(id, name);
				}
				return false;
			});

			//新增复制功能 modified by ls 20210823
			$("#copyBtnId").click(function(){
				let row = grid.getCurrentRow();
				if(row == null){
					msgBox.alert({info: "请选中行."});
				}
				else{
					let id = row.getValue("id");
					let name = row.getValue("name");
					modelGrid.copyModel({
						initValues: {
							id: id,
							name: name,
						},
						afterCopyModelFunc: function(p){
							grid.doPage({pageNumber: 1});
						}
					});
				}
				return false;
			});
		});  
	</script>
</head>  
<body id="testGridContainer">
	<div class="zlpGridStyleContainer">
		<div class="zlpGridStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">
					<a id="addBtnId" href="#" class="zlpToolbarBtn addBtn">新建</a>
					<a id="editBtnId" href="#" class="zlpToolbarBtn editBtn">绘制</a>
					<a name="deleteBtn" href="#" class="zlpToolbarBtn deleteBtn">删除</a>
					<a id="copyBtnId" href="#" class="zlpToolbarBtn copyBtn">复制</a>
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