<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>二维页面导航</title>
	<script type="text/javascript" src="${dataModel}/s3d_Content2DNavigator.js"></script>
	<script type="text/javascript" src="${viewModel}/s3d_Content2DNavigator.js"></script>
	
	<script>
		$(document).ready(function(){
			let p = {
				containerId: "testGridContainer",
				multiselect: true,
				dataModel: dataModels.s3d_Content2DNavigator,
				onePageRowCount: 20,
				isRefreshAfterSave: false,
				viewModel: viewModels.s3d_Content2DNavigator
			};
			let grid = new NcpGrid(p);
			grid.show();

			$("#generateContent2DConfigFileBtnId").click(function (){
				serverAccess.request({
					serviceName:"s3dContent2DNcpService",
					funcName:"generateContent2DConfigFile",
					args:{requestParam:cmnPcr.jsonToStr({})},
					successFunc: function(obj) {
						msgBox.error({title:"提示", info: "生成成功"});
					},
					failFunc: function(obj) {
						msgBox.error({title:"提示", info: obj.message});
					}
				});
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
					<a id="generateContent2DConfigFileBtnId" href="#" class="zlpToolbarBtn">生成配置文件</a>
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