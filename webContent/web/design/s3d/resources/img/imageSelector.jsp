<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>图片</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/res_Image.js"></script>
	<script type="text/javascript" src="${viewModel}/res_Image.js"></script>
	
	<script> 
		$(document).ready(function(){  
			var p = { 
					containerId:"testGridContainer",   
					multiselect:true,  
					dataModel:dataModels.res_Image,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					viewModel:viewModels.res_Image,
					detailPageUrl:"image_Card.jsp"
				};
			var win = new NcpMultiStyleWin(p); 
			win.show();
			var gridCtrl = win.gridStyleCtrl;
			
			$("#selectImageBtnId").click(function(){
				var row = gridCtrl.getCurrentRow();
				if(row != null){
					var imageId = row.getValue("id");
					var accessoryId = row.getValue("accessoryid");
					window.parent.selectImage({
						imageId: imageId,
						accessoryId: accessoryId
					});
				} 
				else{
					msgBox.alert({info: "请选择图片"});
				}
			});
		});
	</script>
</head> 
<body style="position:relative;width:100%;height:100%;">  
	<div style="position:absolute;width:100%;top:0px;bottom:35px;left:0px;" id="testGridContainer">
		<div class="zlpGridStyleContainer">
			<div class="zlpGridStyleInnerContainer">
				<div class="zlpToolbarContainer">
					<div class="zlpToolbarLeftContainer">  
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
	</div>
	<div style="position:absolute;width:100%;height:35px;bottom:0px;left:0px;">
		<span style="float:right;width:10px;">&nbsp;</span>
		<input id="selectImageBtnId" type="button" value="确定" style="margin-top:5px;width:80px;height:25px;float:right;"/>
	</div>  
</body>
</html>