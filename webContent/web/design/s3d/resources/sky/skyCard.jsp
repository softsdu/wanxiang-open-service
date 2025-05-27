<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>天空</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">

	<script type="text/javascript" src="${dataModel}/res_Sky.js"></script>
	<script type="text/javascript" src="${viewModel}/res_Sky.js"></script>
	
	<script> 
		$(document).ready(function(){ 			
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testCardContainer";
			var cardWin = new NcpMultiStyleCardWin(initParam);
			cardWin.show();
		});  
	</script>
</head>   
<body id="testCardContainer">
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
							<td class="zlpDispUnitTitle" style="width:100px;">名称</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="name" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;">类型</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="skytype" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td>&nbsp;</td>
						</tr>
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;">HDR名称</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="hdrname" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;">图片名称</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="imagename" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td>&nbsp;</td>
						</tr>
					</table>   
				</div> 
			</div>
		</div>
	</div>
</body>
</html>