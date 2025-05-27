<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>材质</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	
	<script type="text/javascript" src="${dataModel}/mtl_Material.js"></script>
	<script type="text/javascript" src="${viewModel}/mtl_Material.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var p = { 
				containerId:"testGridContainer",   
				multiselect:true,  
				dataModel:dataModels.mtl_Material,
				onePageRowCount:20,
				isRefreshAfterSave:true,
				viewModel:viewModels.mtl_Material 
			};
			var grid = new NcpGrid(p); 
			grid.show();

			$("#generateStandardMaterialFileBtnId").click(function(){
				var requestParam = { };
				serverAccess.request({
					serviceName:"materialNcpService",
					funcName:"generateStandardMaterialFile",
					args:{requestParam:cmnPcr.jsonToStr(requestParam)},
					successFunc: function(obj) {
						msgBox.error({title:"提示", info: "生成成功"});
					},
					failFunc: function(obj) {
						msgBox.error({title:"提示", info: obj.message});
					}
				});
				return false;
			});

			$("#generateMaterialConfigFileBtnId").click(function(){
				var requestParam = { };
				serverAccess.request({
					serviceName:"s3dSystemNcpService",
					funcName:"generateMaterialConfigFile",
					args:{requestParam:cmnPcr.jsonToStr(requestParam)},
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
					<a id="generateStandardMaterialFileBtnId" href="#" class="zlpToolbarBtn">生成标准材质文件</a>
					<a id="generateMaterialConfigFileBtnId" href="#" class="zlpToolbarBtn">生成S3D材质文件</a>
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