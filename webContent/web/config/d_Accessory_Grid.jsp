<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>附件</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	
	<script type="text/javascript" src="${dataModel}/d_Accessory.js"></script>
	<script type="text/javascript" src="${viewModel}/d_Accessory.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var p = { 
				containerId:"testGridContainer",
				multiselect:true,
				dataModel:dataModels.d_Accessory,
				onePageRowCount:20,
				isRefreshAfterSave:true,
				viewModel:viewModels.d_Accessory
			};
			var grid = new NcpGrid(p); 
			grid.show();

			$("#deleteUnrelatedAccessoryBtn").click(function (){
				if(msgBox.confirm({info: "确定执行清除操作吗?"})) {
					serverAccess.request({
						serviceName: "accessoryNcpService",
						funcName: "deleteUnrelatedAccessory",
						args: {requestParam: cmnPcr.jsonToStr({})},
						successFunc: function (obj) {
							msgBox.alert({title: "提示", info: "清理完成."});
							grid.doPage({pageNumber: 1});
						},
						failFunc: function (obj) {
							msgBox.alert({title: "提示", info: obj.message});
						},
						waitingBarParentId: p.containerId
					});
				}
				return false;
			});

			$("#backupAllAccessoryFilesBtn").click(function (){
				if(msgBox.confirm({info: "确定执行备份操作吗?"})) {
					serverAccess.request({
						serviceName: "accessoryNcpService",
						funcName: "backupAllAccessoryFiles",
						args: {requestParam: cmnPcr.jsonToStr({})},
						successFunc: function (obj) {
							msgBox.alert({
								title: "提示",
								info: "已完成备份.\r\n附件数: " + obj.result.backup.count + "\r\n保存目录: " + obj.result.backup.dir
							});
						},
						failFunc: function (obj) {
							msgBox.alert({title: "提示", info: obj.message});
						},
						waitingBarParentId: p.containerId
					});
				}
				return false;
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
					<div class="zlpToolbarQueryContainer">
						<input type="text" class="zlpToolbarQueryInputText" placeholder="请输入关键字" />
						<a name="queryBtn" href="#" class="zlpToolbarQueryBtn">查询</a>
					</div>
					<a href="#" id="deleteUnrelatedAccessoryBtn" class="zlpToolbarBtn">清理无用附件</a>
					<a href="#" id="backupAllAccessoryFilesBtn" class="zlpToolbarBtn">备份所有附件</a>
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