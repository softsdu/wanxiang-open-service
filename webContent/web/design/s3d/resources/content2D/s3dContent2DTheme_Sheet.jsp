<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>二维页面主题</title>

	<script type="text/javascript" src="${dataModel}/s3d_Content2DTheme.js"></script>
	<script type="text/javascript" src="${viewModel}/s3d_Content2DTheme.js"></script>
	<script type="text/javascript" src="${dataModel}/s3d_Content2DModule.js"></script>
	<script type="text/javascript" src="${viewModel}/s3d_Content2DModule.js"></script>
	<script type="text/javascript" src="${sheetModel}/s3dContent2DTheme.js"></script>
	
	<script> 
		$(document).ready(function(){ 		
			let initParam = window.parent.multiStyleWinInitParam;
			initParam.containerId = "testSheetContainer";
			let sheetWin = new NcpMultiStyleSheetWin(initParam);
			sheetWin.show();
		});  
	</script>
</head>  
<body id="testSheetContainer">
	<div class="zlpCardStyleContainer">
		<div class="zlpCardStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer"> 
					<a name="backBtn" href="#" class="zlpToolbarBtn backBtn">切换</a>  
					<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>  
					<a name="editBtn" href="#" class="zlpToolbarBtn editBtn">编辑</a>  
					<a name="saveBtn" href="#" class="zlpToolbarBtn saveBtn">保存</a>
					<a name="cancelBtn" href="#" class="zlpToolbarBtn cancelBtn">取消</a> 
				</div> 
			</div>
			<div class="zlpCardContainer" name="cardDiv">
				<div class="zlpCardMainContainer">
					<table class="zlpCardMainTable">
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">编码</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="code" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">名称</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="name" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">已启用</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="checkbox" name="isactive" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
						</tr>
						<tr style="height:80px;">
							<td class="zlpDispUnitTitle" style="text-align:right;">描述</td>
							<td class="zlpDispUnitValue" colspan="5"><textarea name="description" class="zlpDispUnitInput" style="width:1100px;height:75px;" cardCtrl="true"></textarea></td>
						</tr>
					</table>
				</div>
				<div class="zlpCardDetailContainer">
					<ul class="nav nav-tabs zlpCardDetailTabbar">
						<li class="active"><a href="#">页面</a></li>
					</ul>
					<div class="zlpCardDetailGridContainer zlpCardDetailGridContainerActive" sheetPart="s3d_Content2DTemplatePage" >
						<div class="zlpToolbarContainer zlpToolbarContainerGrid">
							<div class="zlpToolbarLeftContainer">
								<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>
								<a name="deleteBtn" href="#" class="zlpToolbarBtn deleteBtn">删除</a>
							</div>
						</div>
						<div class="zlpSubGridContainer" name="gridDiv">
							<table name="gridCtrl" class="zlpGridTable"></table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>