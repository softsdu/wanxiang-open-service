<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>fbx相关文件</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	
	<script type="text/javascript" src="${dataModel}/res_Fbx.js"></script>
	<script type="text/javascript" src="${viewModel}/res_Fbx.js"></script>
	
	<script> 
		$(document).ready(function(){  
			var p = { 
					containerId:"testGridContainer",   
					multiselect:true,  
					dataModel:dataModels.res_Fbx,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					viewModel:viewModels.res_Fbx, 
					detailPageUrl:"fbxCard.jsp"
				};
			var win = new NcpMultiStyleWin(p); 
			win.show(); 

			$("#uploadBtnId").click(function(){ 
				window.parent.iocClient.mainPageTab().showPage("fbxUpload","FBX组件上传","../design/external/fbx/importFbx.jsp")
			});
		});  
	</script>
</head>   
<body id="testGridContainer">
	<div class="zlpGridStyleContainer">
		<div class="zlpGridStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">  
					<a id="uploadBtnId" href="#" class="zlpToolbarBtn addBtn">上传</a>  
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