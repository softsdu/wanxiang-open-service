<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>S3D本地模型</title>
	<script type="text/javascript" src="${dataModel}/s3d_ComponentServer.js"></script>
	<script type="text/javascript" src="${viewModel}/s3d_ComponentServer.js"></script>
	
	<script>
		const args = cmnPcr.getQueryStringArgs();
		const appId = args["appId"];
		const appName = args["appName"];

		$(document).ready(function(){
			let p = {
				containerId: "testGridContainer",
				multiselect: true,
				dataModel: dataModels.s3d_ComponentServer,
				onePageRowCount: 20,
				isRefreshAfterSave: false,
				viewModel: viewModels.s3d_ComponentServer
			};
			let grid = new NcpGrid(p);
			let externalObject = {
				beforeDoPop: function (param){
					switch (param.fieldName){
						case "comtypename":{
							param.fieldModel.inputHelpName = "/web/design/s3d/pop/s3dComType_Tree.jsp"
							break;
						}
					}
					return true;
				}
			};
			grid.addExternalObject(externalObject);
			grid.show();
		});  
	</script>
</head>  
<body id="testGridContainer">
	<div class="zlpGridStyleContainer">
		<div class="zlpGridStyleInnerContainer">
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