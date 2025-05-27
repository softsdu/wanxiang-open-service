<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<title>testParamWin</title>
	<link rel="stylesheet" href="commonForm.css">  
	<script type="text/javascript" src="commonForm.js?t='20221109'"></script>
	<!-- 引用构件参数分类 js added by ls 20230731 -->
	<script type="text/javascript" src="js3PropertyCategories.js"></script>  
		<script type="text/javascript" src="${expressionjs}/expressionEditor.js"></script>
	<script type="text/javascript" src="../../js/js3StandardMaterials.js?t=<%=System.currentTimeMillis()%>"></script>
	<script type="text/javascript" src="../../js/js3Static.js"></script>
	<script>     
		//参数过长，改变传递参数的方式 modified by ls 20210902
		//var args = cmnPcr.getQueryStringArgs(); 
		//var parameterStr = cmnPcr.decodeURI(args["parameters"]);
		//var valueParameterStr = cmnPcr.decodeURI(args["valueParameters"]);
		//var parentParameterStr = cmnPcr.decodeURI(args["parentParameters"]);
		
		//增加图例id added by liyh 20210825
		//var imgId = args["imgId"];
		 
		var parameterStr = window.parent.popUnitParameters.parameters;
		var valueParameterStr = window.parent.popUnitParameters.valueParameters;
		var parentParameterStr = window.parent.popUnitParameters.parentParameters;	
		var imgId = window.parent.popUnitParameters.imgId;	
		var detailLevel = window.parent.popUnitParameters.detailLevel;	
		
		
		var comForm;
		var getParameters = function(){
			return comForm.getParameters();
		}
		
		//增加设置参数的方法 added by ls 20220607
		var setParameterValue = function(p){
			return comForm.setParameterValue(p);
		}
		
		$(document).ready(function(){   
			comForm = new CommonForm();
			comForm.init({ 
				containerId: "formContainerId", 
				parameters: cmnPcr.strToJson(parameterStr), 
				valueParameters: cmnPcr.strToJson(valueParameterStr),
				parentParameters: cmnPcr.strToJson(parentParameterStr),
				imgId: imgId,
				detailLevel: detailLevel
	    	});
		});
	</script>
</head>  
<body>
	<div class="zlpCardStyleContainer" id="formContainerId">
		<div class="zlpCardStyleInnerContainer"> 
			<!-- 更改布局 modified by ls 20230801 -->
			<div class="zlpCardContainer" style="top:0px;" name="cardDiv">
				<div class="zlpCardMainContainer parameterMainContainer">
				</div> 
			</div>
		</div>
	</div>
</body> 
</html>