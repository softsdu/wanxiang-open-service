<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<title>关系构件</title>
	<link rel="stylesheet" href="insertRelatedUnit.css">
	<script type="text/javascript" src="../../../common/js/js3CommonFunction.js"></script>    
	<script type="text/javascript" src="../../../common/js/js3MapComs.js"></script>
	<script type="text/javascript" src="insertRelatedUnit.js"></script>
	<script>  
		var args = cmnPcr.getQueryStringArgs(); 
		var code = args["code"];
		var versionNum = args["versionNum"];
		var mapTypeCode = args["mapTypeCode"];
		var selectForm;
		var getSelectedComponent = function(){
			return selectForm.getSelectedComponent();
		}
		
		$(document).ready(function(){   
			selectForm = new SelectComponentForm();
			selectForm.init({ 
				containerId: "formContainerId",
				code: code,
				versionNum: versionNum,
				mapTypeCode: mapTypeCode
	    	});
		});
	</script>
</head>  
<body>
	<div class="mainDiv" id="formContainerId">
	</div>
</body> 
</html>