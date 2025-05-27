<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>图片</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	
	<script type="text/javascript" src="${dataModel}/res_Image.js"></script>
	<script type="text/javascript" src="${viewModel}/res_ImageAdmin.js"></script>
	
	<script> 
		$(document).ready(function(){ 			
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testCardContainer";
			var cardWin = new NcpMultiStyleCardWin(initParam); 
			
			cardWin.initOtherEvent = function(cardCtrl){ 
				var externalObject = {
					afterDoPage:function(param){
					    var row = param.datatable.getRowByIndex(0);
						if(row != null){
							$("#imageId").attr("src", "../../../../../res/getResImage?id=" + row.getValue("accessoryid"));
						}
					}
				};
				cardCtrl.addExternalObject(externalObject);
			} 
			cardWin.show();	
			var cardCtrl = cardWin.cardCtrl; 
		});  
	</script>
</head>   
<body id="testCardContainer">
	<div class="zlpCardStyleContainer">
		<div class="zlpCardStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">
					<a name="backBtn" href="#" class="zlpToolbarBtn backBtn">切换</a>
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
							<td class="zlpDispUnitTitle" style="width:100px;">附件Id</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="accessoryid" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td>&nbsp;</td> 
						</tr>
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;">创建人</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="createusername" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;">创建时间</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="createtime" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td>&nbsp;</td>
						</tr>
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;">公开</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="checkbox" name="ispublic" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;">&nbsp;</td>
							<td class="zlpDispUnitValue" style="width:300px;">&nbsp;</td>
							<td>&nbsp;</td>
						</tr>
						<tr style="height:500px;">
							<td class="zlpDispUnitTitle" style="width:100px;">图片</td>
							<td class="zlpDispUnitValue" colspan="4" >
								<div style="width:700px;height:500px;overflow:auto;">
									<img id="imageId" style="width:auto;height:auto;margin:0px;" />
								</div>
							</td>
						</tr>
					</table>   
				</div> 
			</div>
		</div>
	</div>
</body>
</html>