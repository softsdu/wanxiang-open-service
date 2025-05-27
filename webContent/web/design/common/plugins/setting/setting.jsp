<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<title>testParamWin</title>
	<link rel="stylesheet" href="setting.css">  
	<script type="text/javascript" src="setting.js"></script>   
	<script type="text/javascript" src="../../../common/js/js3CommonFunction.js"></script>
	<script type="text/javascript" src="../../../common/js/js3StandardMaterials.js"></script>
    <script type="text/javascript" src="../../../common/js/js3Static.js"></script>
	<script>  
		var settingForm;
		var settingInfo = window.parent.design3DPluginSettingInfo;
		var getParameters = function(){
			return settingForm.getParameters();
		}
		
		$(document).ready(function(){   
			settingForm = new SettingForm();
			settingForm.init({ 
				containerId: "formContainerId",
				parameters: settingInfo
	    	});
		});
	</script>
</head>  
<body>
	<div class="zlpCardStyleContainer" id="formContainerId">
		<div class="zlpCardMainContainer">
			<table class="zlpCardMainTable"> 	
				<tr style="height:30px;"> 
					<td class="zlpDispUnitTitle" colspan="2" style="font-weight:600;font-size:14px;position:relative;">
						<span style="position:absolute;height:28px;line-height:28px;bottom:2px;left:10px;right:0px;text-align:left;text-indent:30px;">渲染</span>
					</td>
				</tr>	
				<!-- 增加显示级别 added by ls 23230403  -->
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">显示级别</td>
					<td class="zlpDispUnitValue" style="width:250px;">
						<input type="text" name="viewleveltext" class="zlpDispUnitInput" style="width:250px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">细节级别</td>
					<td class="zlpDispUnitValue" style="width:250px;">
						<input type="text" name="detaillevel" class="zlpDispUnitInput" style="width:250px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">背景颜色</td>
					<td class="zlpDispUnitValue" style="width:250px;">
						<input type="color" name="backgroundColor" class="zlpDispUnitInput" style="width:250px;" paramCtrl="true"></input>
					</td>
				</tr>		
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">是否显示网格</td>
					<td class="zlpDispUnitValue" style="width:250px;">
						<input type="checkbox" name="gridVisible" class="zlpDispUnitInput" style="width:250px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">外部资源外框</td>
					<td class="zlpDispUnitValue" style="width:250px;">
						<input type="checkbox" name="resBoxVisible" class="zlpDispUnitInput" style="width:250px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">材质渲染效果</td>
					<td class="zlpDispUnitValue" style="width:250px;">
						<input type="checkbox" name="materialRenderEffect" class="zlpDispUnitInput" style="width:250px;" paramCtrl="true"></input>
					</td>
				</tr>
			</table>
		</div>
	</div>
</body> 
</html>