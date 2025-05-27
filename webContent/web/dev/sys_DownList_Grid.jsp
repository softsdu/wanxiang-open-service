<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>下拉数据列表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	
	<script type="text/javascript" src="${dataModel}/sys_DownList.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_DownList.js"></script>
	<script type="text/javascript" src="${sheetModel}/downlist.js"></script>
	
	<script> 
		$(document).ready(function(){
			var p = { 
				containerId:"testGridContainer",   
				multiselect:true,  
				dataModel:dataModels.sys_DownList,
				onePageRowCount:20,
				isRefreshAfterSave:true,
				viewModel:viewModels.sys_DownList,
				sheetModel:sheetModels.downlist,
				detailPageUrl:"sys_DownList_Sheet.jsp"
				};
			var win = new NcpMultiStyleWin(p); 
			win.show();
			var gridCtrl = win.gridStyleCtrl; 
			
			$("#updateRuntimeModelBtn").click(function(){ 
			 	var idValue = gridCtrl.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有选定行."});
			 	}
			 	else{
			 		gridCtrl.doOtherAction({
						actionName:"updateRuntimeModel",
						customParam:{downListId: idValue},
						successFunc: function(obj){
							alert(cmnPcr.jsonToStr(obj));
						},
						failFunc:function(obj){
							alert(cmnPcr.jsonToStr(obj)); 
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
					<a id="updateRuntimeModelBtn" href="#" class="zlpToolbarBtn">生成代码</a>  
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