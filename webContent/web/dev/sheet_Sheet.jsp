<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Sheet模型</title>
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
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testSheetContainer";
			var sheetWin = new NcpMultiStyleSheetWin(initParam); 
			sheetWin.show();	
			var sheetCtrl = sheetWin.sheetCtrl;

			$("#generateJsBtn").click(function(){
				var mainCard = sheetCtrl.getMainCardCtrl();
			 	var idValue = mainCard.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有记录."});
			 	}
			 	else{
			 		mainCard.doOtherAction({
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
				var mainCard = sheetCtrl.getMainCardCtrl();
			 	var idValue = mainCard.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有记录."});
			 	}
			 	else{
			 		mainCard.doOtherAction({
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
<body id="testSheetContainer">
	<div class="zlpCardStyleContainer">
		<div class="zlpCardStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer"> 
					<a name="backBtn" href="#" class="zlpToolbarBtn backBtn">切换</a>  
					<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>  
					<a name="editBtn" href="#" class="zlpToolbarBtn editBtn">编辑</a>  
					<a name="saveBtn" href="#" class="zlpToolbarBtn saveBtn">保存</a>
					<a name="cancelBtn" href="#" class="zlpToolbarBtn cancelBtn">取消</a>
					<a href="#" id="generatePageBtn" class="zlpToolbarBtn">生成JSP页面</a>  
					<a href="#" id="generateJsBtn" class="zlpToolbarBtn">生成JS模型</a>
				</div> 
			</div>
			<div class="zlpCardContainer" name="cardDiv">
				<div class="zlpCardMainContainer">
					<table class="zlpCardMainTable">
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">名称</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="name" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td>
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">标题</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="title" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
						</tr>
						<tr style="height:35px;">
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">描述</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="description" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
							<td class="zlpDispUnitTitle" style="width:100px;text-align:right;">所属模块</td>
							<td class="zlpDispUnitValue" style="width:300px;"><input type="text" name="sysmodule" class="zlpDispUnitInput" style="width:300px;" cardCtrl="true"></input></td> 
						</tr> 
					</table>
				</div>
				<div class="zlpCardDetailContainer">
					<ul class="nav nav-tabs zlpCardDetailTabbar">
						<li class="active"><a href="#">显示区域</a></li>
					</ul>
					<div class="zlpCardDetailGridContainer zlpCardDetailGridContainerActive" sheetPart="line" > 
						<div class="zlpToolbarContainer zlpToolbarContainerGrid">
							<div class="zlpToolbarLeftContainer"> 
								<a name="addBtn" href="#" class="zlpToolbarBtn addBtn">新建</a>   
								<a name="deleteBtn" href="#" class="zlpToolbarBtn deleteBtn">删除</a>
							</div> 
						</div>
						<div class="zlpSubGridContainer" name="gridDiv">
							<table name="gridCtrl" class="zlpGridTable"></table>
						</div>
					</div> 
				</div>
			</div>
		</div>
	</div>
</body>  
</html>