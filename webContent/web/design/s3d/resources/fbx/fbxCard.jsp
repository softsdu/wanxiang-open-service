<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>fbx相关文件</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	
	
	<script type="importmap">
		{
			"imports": {
				"three": "../../../common/js/threejs/build/three.module.js",
				"three/addons/": "../../../common/js/threejs/examples/jsm/",
				"common/js/":"../../../common/js/"
			}
		}
	</script>
	<%@ include file="../../../../base.jsp" %>
	<%@ include file="../../../common/commonDesignJs.jsp" %>
	<script type="text/javascript" src="${dataModel}/res_Fbx.js"></script>
	<script type="text/javascript" src="${viewModel}/res_Fbx.js"></script>
	
	<script type="module">
		import FbxViewer from "./js/fbxViewer.js";
		var fbxViewer = null;
		$(document).ready(function(){ 			
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testCardContainer";
			var cardWin = new NcpMultiStyleCardWin(initParam);  
			
			cardWin.initOtherEvent = function(cardCtrl){ 
				var externalObject = {
					afterDoPage:function(param){
					    var row = param.datatable.getRowByIndex(0);
						if(row != null){
							fbxViewer = new FbxViewer();
							fbxViewer.init({
								viewContainerId: "fbxViewerId",
								resFbxId: row.getValue("id")
							});
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
							<td class="zlpDispUnitValue" style="width:700px;" colspan="3"><input type="text" name="name" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td>&nbsp;</td> 
						</tr>  
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;">附件名称</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="accessoryname" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
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
							<td class="zlpDispUnitTitle" style="width:100px;">修改人</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="modifyusername" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;">修改时间</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="modifytime" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td>&nbsp;</td> 
						</tr> 
						<tr style="height:500px;">
							<td class="zlpDispUnitTitle" style="width:100px;">预览</td>
							<td class="zlpDispUnitValue" colspan="3" >
								<div id="fbxViewerId" style="width:700px;height:500px;overflow:auto;border:solid 1px #505050;">
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