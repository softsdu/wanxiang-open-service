<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<title>函数帮助</title>
	<link rel="stylesheet" href="helper.css?t='20220916'">
	<script type="text/javascript" src="helper.js?t='20220916'"></script>
	<script type="text/javascript" src="helperFunctionList.js?t='20220916'"></script>
	<script type="text/javascript" src="../../../../../platform/expression/functionList.js"></script>    
	<script>  
		var helperForm;		
		$(document).ready(function(){   
			helperForm = new HelperForm();
			helperForm.init({ 
				containerId: "containerId",
				functionList: expFunctions,
				helperFunctionList: helperFunctionList
	    	});
		});
	</script>
</head>  
<body>
	<div class="mainContainer" id="containerId">
		<div class="tabContainer"></div>
		<div class="subTabContainer"></div>
		<div class="detailContainer"></div>
	</div>
</body> 
</html>