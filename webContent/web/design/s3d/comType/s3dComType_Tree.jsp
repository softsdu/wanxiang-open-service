<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>S3D组件类型</title>
	<script type="text/javascript" src="${dataModel}/s3d_ComType.js"></script>
	<script type="text/javascript" src="${viewModel}/s3d_ComType.js"></script>
	<script type="text/javascript" src="${treeModel}/s3dComType.js"></script>
	
	<script> 
		$(document).ready(function(){
			const args = cmnPcr.getQueryStringArgs();
			const appId = args["appId"];
			const appName = args["appName"];

			var p = { 
				containerId: "testGridContainer",
				treeModel: treeModels.s3dComType,
				editPageUrl: "s3d_ComType_Card.jsp?appId=" + appId + "&appName=" + appName,
				editWinHeight: 350,
				editWinWidth: 500
			};
			var tree = new NcpTree(p);
			tree.show();    
		});  
	</script>
</head>  
<body id="testGridContainer">
	<div class="zlpGridStyleContainer">
		<div class="zlpGridStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">
					<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建根节点</a> 
					<a name="addchildBtn" href="#" class="zlpToolbarBtn addChildBtn">新建子节点</a>
					<a name="editBtn" href="#" class="zlpToolbarBtn editBtn">编辑</a>
					<a name="deleteBtn" href="#" class="zlpToolbarBtn deleteBtn">删除</a>
				</div> 
			</div>
			<div class="zlpGridContainer" name="gridDiv" style="bottom:0px;">
				<table name="gridCtrl" class="zlpGridTable"></table>
			</div> 
		</div>
	</div>
</body> 
</html>