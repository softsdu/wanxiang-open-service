<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Sheet模型列表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/sys_Sheet.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Sheet.js"></script>
	<script type="text/javascript" src="${dataModel}/sys_SheetPart.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_SheetPart.js"></script>
	<script type="text/javascript" src="${sheetModel}/sheet.js"></script>
	 
	<script> 
		$(document).ready(function(){  

			var p = { 
				containerId:"testGridContainer",   
				multiselect:true,  
				dataModel:dataModels.sys_Sheet,
				onePageRowCount:20,
				isRefreshAfterSave:true,
				viewModel:viewModels.sys_Sheet,
				sheetModel:sheetModels.sheet,
				detailPageUrl:"sheet_Sheet.jsp"
			};
			var win = new NcpMultiStyleWin(p); 
			win.show();
			var gridCtrl = win.gridStyleCtrl; 
			
			$("#generateJsBtn").click(function(){ 
			 	var idValue = gridCtrl.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有选定行."});
			 	}
			 	else{
			 		gridCtrl.doOtherAction({
						actionName:"generateJs",
						customParam:{sheetId: idValue},
						successFunc: function(obj){ 
							if(obj.result.succeed == "true"){
								alert( "生成JS模型成功.");
							}
							else{
								var errors = obj.result.errors;
								var errorStr = cmnPcr.arrayToString(errors, "\r\n");							
								alert("提示:\r\n" + errorStr);								
							}
						},
						failFunc:function(obj){
							alert("生成JS模型失败.\r\n" + obj.code + ": " + obj.message);
						}
					});
			 	}
			});  
			
			$("#generatePageBtn").click(function(){ 
			 	var idValue = gridCtrl.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有选定行."});
			 	}
			 	else{
			 		gridCtrl.doOtherAction({
						actionName:"generatePage",
						customParam:{sheetId: idValue},
						successFunc: function(obj){ 
							if(obj.result.succeed == "true"){
								alert( "生成JSP页面成功.");
							}
							else{
								var errors = obj.result.errors;
								var errorStr = cmnPcr.arrayToString(errors, "\r\n");							
								alert("提示:\r\n" + errorStr);								
							}
						},
						failFunc:function(obj){
							alert("生成JSP页面失败.\r\n" + obj.code + ": " + obj.message);
						}
					});
			 	}
			});  
	});  
	</script>
</head>
<body id="testGridContainer">
	<div class="zlpGridStyleContainer">
		<div class="zlpGridStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer"> 
					<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>  
					<a name="editBtn" href="#" class="zlpToolbarBtn editBtn">编辑</a>  
					<a name="saveBtn" href="#" class="zlpToolbarBtn saveBtn">保存</a>
					<a name="cancelBtn" href="#" class="zlpToolbarBtn cancelBtn">取消</a>
					<a name="deleteBtn" href="#" class="zlpToolbarBtn deleteBtn">删除</a>
					<a href="#" id="generateJsBtn" class="zlpToolbarBtn">生成JS模型</a>  
					<a href="#" id="generatePageBtn" class="zlpToolbarBtn">生成JSP页面</a> 
					<div class="zlpToolbarQueryContainer">
						<input type="text" class="zlpToolbarQueryInputText" placeholder="请输入关键字" />
						<a name="queryBtn" href="#" class="zlpToolbarQueryBtn">查询</a>
					</div>
				</div> 
			</div>
			<div class="zlpGridContainer" name="gridDiv">
				<table name="gridCtrl" class="zlpGridTable"></table>
			</div>
			<div class="zlpBottomContainer">
				<ul class="zlpNavUl pagination">
				</ul> 
			</div>
		</div>
	</div>
</body> 	 
</html>