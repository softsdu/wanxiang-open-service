<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<title>testParamWin</title>
	<link rel="stylesheet" href="deployElement.css">  
	<script type="text/javascript" src="deployElement.js"></script>    
	<script>  
		var deployForm;
		var getParameters = function(){
			return deployForm.getParameters();
		}
		
		$(document).ready(function(){   
			deployForm = new DeployForm();
			deployForm.init({ 
				containerId: "formContainerId" 
	    	});
		});
	</script>
</head>  
<body>
	<div class="zlpCardStyleContainer" id="formContainerId">
		<div class="zlpCardMainContainer">
			<table class="zlpCardMainTable"> 
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle" colspan="2" style="font-weight:600;font-size:14px;position:relative;">
						<span style="position:absolute;height:32px;line-height:32px;bottom:2px;left:10px;right:0px;background-color:#DBF0FF;text-align:left;text-indent:30px;">组件</span>
					</td>
				</tr>
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">组件名称</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="componentname" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">组件编码</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="componentcode" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">组件版本</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="versionnum" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle" colspan="2" style="font-weight:600;font-size:14px;position:relative;">
						<span style="position:absolute;height:32px;line-height:32px;bottom:2px;left:10px;right:0px;background-color:#DBF0FF;text-align:left;text-indent:30px;">分布</span>
					</td>
				</tr>
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">X边距</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="startx" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr> 
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">Y边距</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="starty" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr> 
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">Z边距</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="startz" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr> 
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">X间隔</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="spacex" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr> 
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">Z间隔</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="spacez" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr> 
			</table>
		</div>
	</div>
</body> 
</html>