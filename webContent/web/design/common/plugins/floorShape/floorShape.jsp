<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<title>testParamWin</title>
	<link rel="stylesheet" href="floorShape.css">  
	<script type="text/javascript" src="floorShape.js"></script>   
	<script type="text/javascript" src="../../../common/js/js3CommonFunction.js"></script>    
	<script>  
		var deployForm;
		var floorShapeInfo = window.parent.floorShapeInfo;
		var getParameters = function(){
			return deployForm.getParameters();
		}
		
		$(document).ready(function(){   
			deployForm = new DeployForm();
			deployForm.init({ 
				containerId: "formContainerId",
				points: floorShapeInfo.points
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
						<span style="position:absolute;height:32px;line-height:32px;bottom:2px;left:10px;right:0px;background-color:#DBF0FF;text-align:left;text-indent:30px;">地板款式</span>
					</td>
				</tr>
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">名称</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="componentname" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">编码</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="componentcode" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">版本</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="versionnum" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td>
				</tr>
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle" colspan="2" style="font-weight:600;font-size:14px;position:relative;">
						<span style="position:absolute;height:32px;line-height:32px;bottom:2px;left:10px;right:0px;background-color:#DBF0FF;text-align:left;text-indent:30px;">排布方式</span>
					</td>
				</tr>
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">起铺点</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="startpointname" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr> 
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">起铺点坐标</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="startpointvalue" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr> 
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">排布方式</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="layouttype" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr> 
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">排布方向</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="directiontype" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr>  
				<tr style="height:35px;">
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">忽略距离</td>
					<td class="zlpDispUnitValue" style="width:650px;">
						<input type="text" name="ignoredistance" class="zlpDispUnitInput" style="width:650px;" paramCtrl="true"></input>
					</td> 
				</tr>  
			</table>
		</div>
	</div>
</body> 
</html>