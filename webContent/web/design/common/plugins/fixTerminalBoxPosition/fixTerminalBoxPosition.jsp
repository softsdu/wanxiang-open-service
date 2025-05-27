<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<title>testParamWin</title>
	<link rel="stylesheet" href="fixTerminalBoxPosition.css">  
	<script type="importmap">
			{
				"imports": {
					"three": "../../../common/js/threejs/build/three.module.js",
					"three/addons/": "../../../common/js/threejs/examples/jsm/",
					"common/js/":"../../../common/js/"
				}
			}
    	</script>
	<script type="text/javascript" src="../../../common/js/js3CommonFunction.js"></script>     
	<script type="module" src="fixTerminalBoxPosition.js"></script>   
    <script type="module" src="../../../common/js/loaders/constants.js"></script>
	<script type="module" src="../../../common/js/threejs/build/three.module.js"></script>
    <script type="module" src="../../../common/js/js3HitDetection.js"></script>
	<script type="module">
		import FixTerminalBoxPositionForm from "./fixTerminalBoxPosition.js";
		var fixTerminalBoxPositionForm;
		var design3DPluginFixTerminalBoxPosition = window.parent.design3DPluginFixTerminalBoxPosition;
		var getParameters = function(){
			return fixTerminalBoxPositionForm.getParameters();
		}
		
		$(document).ready(function(){   
			fixTerminalBoxPositionForm = new FixTerminalBoxPositionForm();
			fixTerminalBoxPositionForm.init({ 
				containerId: "formContainerId",
				editor: design3DPluginFixTerminalBoxPosition.editor,
				boxObject3DId: design3DPluginFixTerminalBoxPosition.boxObject3DId,
				wallObject3DId: design3DPluginFixTerminalBoxPosition.wallObject3DId,
				steelbarObject3DIds: design3DPluginFixTerminalBoxPosition.steelbarObject3DIds
	    	});
		});
	</script>
</head>  
<body>
	<div class="zlpCardStyleContainer" id="formContainerId">
		<div class="zlpCardMainContainer">
			<table class="zlpCardMainTable"> 
				<tr style="height:40px;"> 
					<td class="zlpDispUnitTitle" colspan="2">
						<div class="steelbarListContainer"> 
						</div>
					</td>
				</tr> 
				<tr style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">碰撞解决方式</td>
					<td class="zlpDispUnitValue" style="width:350px;">
						<input type="text" name="fixtypetitle" class="zlpDispUnitInput" style="width:350px;" paramCtrl="true"></input>
					</td>
				</tr> 
				<tr style="height:35px;display:none;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">碰撞解决方式</td> 
					<td class="zlpDispUnitValue" style="width:350px;">
						<input type="text" name="fixtypename" class="zlpDispUnitInput" style="width:350px;" paramCtrl="true"></input>
					</td>
				</tr> 
				<tr class="steelbarSettingContainer" name="bendSteelbar" style="height:35px;display:table-row;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">钢筋弯曲距离</td>
					<td class="zlpDispUnitValue" style="width:350px;">
						<input type="text" name="bendsteelbardistance" class="zlpDispUnitInput" style="width:350px;" paramCtrl="true"></input>
					</td>
				</tr> 
				<tr class="steelbarSettingContainer" name="moveSteelbar" style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">钢筋移动距离</td>
					<td class="zlpDispUnitValue" style="width:350px;">
						<input type="text" name="movesteelbardistance" class="zlpDispUnitInput" style="width:350px;" paramCtrl="true"></input>
					</td>
				</tr> 
				<tr class="steelbarSettingContainer" name="moveBox" style="height:35px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">线盒移动距离</td>
					<td class="zlpDispUnitValue" style="width:350px;">
						<input type="text" name="moveboxdistance" class="zlpDispUnitInput" style="width:350px;" paramCtrl="true"></input>
					</td>
				</tr> 
				<tr style="height:35px;display:none;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">钢筋弯曲方式</td>
					<td class="zlpDispUnitValue" style="width:350px;">
						<input type="text" name="bendtypename" class="zlpDispUnitInput" style="width:350px;" paramCtrl="true"></input>
					</td>
				</tr> 
				<tr class="steelbarSettingContainer" name="bendSteelbar" style="height:35px;display:table-row;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">钢筋弯曲方式</td>
					<td class="zlpDispUnitValue" style="width:350px;">
						<input type="text" name="bendtypetitle" class="zlpDispUnitInput" style="width:350px;" paramCtrl="true"></input>
					</td>
				</tr> 
				<tr style="height:38px;"> 
					<td class="zlpDispUnitTitle"  style="width:100px;text-align:right;font-weight:400;">&nbsp;</td>
					<td class="zlpDispUnitValue" style="width:350px;">
						<input type="button" name="fixBtn" class="zlpDispUnitButton" style="width:350px;height:32px;" value="执 行"></input>
					</td>
				</tr> 
			</table>
		</div>
	</div>
</body> 
</html>