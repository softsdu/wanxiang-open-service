<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>组织架构</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	<script type="text/javascript" src="${dataModel}/d_Org.js"></script>
	<script type="text/javascript" src="${viewModel}/d_Org.js"></script>
	<script type="text/javascript" src="${treeModel}/org.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var p = { 
				containerId:"testGridContainer", 
				treeModel:treeModels.org,
				editPageUrl:"d_Org_Card.jsp",
				editWinHeight:320,
				editWinWidth:500
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
			<div class="zlpBottomContainer">
				<ul class="zlpNavUl pagination">
				</ul> 
			</div>
		</div>
	</div>
</body> 
</html>