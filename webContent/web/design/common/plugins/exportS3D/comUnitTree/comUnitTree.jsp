<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>testParamWin</title>
	<link rel="stylesheet" href="comUnitTree.css">
	<script type="importmap">
			{
				"imports": {
					"three": "../../../../common/js/threejs/build/three.module.js",
					"three/addons/": "../../../../common/js/threejs/examples/jsm/",
					"common/js/":"../../../../common/js/"
				}
			}
    	</script>
	<script type="text/javascript" src="../../../../common/js/js3CommonFunction.js"></script>
	<script type="text/javascript" src="../../../../common/js/js3SysCatAndCom.js"></script>
	<script type="module" src="comUnitTree.js"></script>
    <script type="module" src="../../../../common/js/loaders/constants.js"></script>
	<script type="module" src="../../../../common/js/threejs/build/three.module.js"></script>
	<script type="module">
		import ComUnitTree from "./comUnitTree.js";
		let subComGroupInfos = window.parent.js3CommandProcessors["exportS3D"].subComGroupInfos;
		
		$(document).ready(function(){
			window.componentUnitTree = new ComUnitTree();
			window.componentUnitTree.init({
				containerId: "comTypeTreeItemContainerId",
				firstLevelComGroupInfos: subComGroupInfos
	    	});
		});
	</script>
</head>  
<body>
	<div class="comTypeTreeContainer">
		<div class="comTypeTreeColumnContainer">
			<div class="columnComType">构件类型</div>
			<div class="columnCanExplode">是否分解</div>
		</div>
		<div class="comTypeTreeItemContainer" id="comTypeTreeItemContainerId"></div>
	</div>
</body> 
</html>