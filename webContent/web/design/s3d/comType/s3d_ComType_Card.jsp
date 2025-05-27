
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

		let initParam = window.parent.treeCardInitParam;
		initParam.containerId = "testCardContainer";
		const treeCard = new NcpTreeCard(initParam);
		let externalObject = {
			processAddData: function (param){
				let rows = param.newRowsTable.allRows();
				for(let rowId in rows){
					let row = rows[rowId];
					row.setValue("appid", appId);
					row.setValue("appname", appName);
				}
				return true;
			}
		};
		treeCard.cardCtrl.addExternalObject(externalObject);
		treeCard.show(); 
	}); 
	</script>
</head>  
<body id="testCardContainer">
	<div class="zlpCardStyleContainer">
		<div class="zlpCardStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">   
					<a name="saveBtn" href="#" class="zlpToolbarBtn saveBtn">保存</a>
				</div>
			</div> 
			<div class="zlpCardContainer" name="cardDiv">
				<div class="zlpCardMainContainer">
					<table class="zlpCardMainTable">
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">编码</td>
							<td class="zlpDispUnitValue" style="width:150px;"><input type="text" name="code" class="zlpDispUnitInput"  style="width:150px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">名称</td>
							<td class="zlpDispUnitValue" style="width:150px;"><input type="text" name="name" class="zlpDispUnitInput"  style="width:150px;" cardCtrl="true"></input></td>
						</tr>  
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">已启用</td>
							<td class="zlpDispUnitValue" style="width:150px;"><input type="checkbox" name="isactive" class="zlpDispUnitInput"  style="width:150px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">&nbsp;</td>
							<td class="zlpDispUnitValue" style="width:150px;">&nbsp;</td>
						</tr>
						<tr style="height:95px;">
							<td class="zlpDispUnitTitle" style="width:80px;text-align:right;">描述</td>
							<td class="zlpDispUnitValue" colspan="3"><textarea name="description" class="zlpDispUnitInput zlpDispunitContent"  style="width:380px;height:90px" cardCtrl="true"></textarea></td>
						</tr>
					</table>
				</div> 
			</div>
		</div>
	</div>
</body>
</html>