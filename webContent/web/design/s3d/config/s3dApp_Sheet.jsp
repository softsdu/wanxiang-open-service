<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>S3D应用</title>
	
	<script type="text/javascript" src="${dataModel}/s3d_App.js"></script>
	<script type="text/javascript" src="${viewModel}/s3d_App.js"></script>
	<script type="text/javascript" src="${sheetModel}/s3dApp.js"></script>
	
	<script> 
		$(document).ready(function(){ 		
			let initParam = window.parent.multiStyleWinInitParam;
			initParam.containerId = "testSheetContainer";
			let sheetWin = new NcpMultiStyleSheetWin(initParam);
			sheetWin.show();
			let sheetCtrl = sheetWin.sheetCtrl;
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
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">应用名称</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="appname" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">App Key</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="appkey" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
						</tr>
						<tr style="height:80px;">
							<td class="zlpDispUnitTitle" style="text-align:right;">App URLs</td>
							<td class="zlpDispUnitValue" colspan="3"><textarea name="appurls" class="zlpDispUnitInput" style="width:700px;height:75px;" cardCtrl="true"></textarea></td>
						</tr>
						<tr style="height:80px;">
							<td class="zlpDispUnitTitle" style="text-align:right;">相对路径</td>
							<td class="zlpDispUnitValue" colspan="3"><textarea name="apprelativepath" class="zlpDispUnitInput" style="width:700px;height:75px;" cardCtrl="true"></textarea></td>
						</tr>
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">超期时间</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="expiretime" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">描述</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="description" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
						</tr>  
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">创建时间</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="createtime" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">修改时间</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="modifytime" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
						</tr>  
					</table>
				</div>
			</div>
		</div>
	</div>
</body>
</html>