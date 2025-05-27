<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>S3D应用</title>
	<script type="text/javascript" src="${dataModel}/s3d_App.js"></script>
	<script type="text/javascript" src="${viewModel}/s3d_AppView.js"></script>
	<script type="text/javascript" src="./js/s3dAppView.js"></script>
</head>  
<body id="testGridContainer">
	<div class="zlpGridStyleContainer">
		<div class="zlpGridStyleInnerContainer">
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
</body>
</html>