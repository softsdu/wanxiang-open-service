<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>物料信息扩展接口</title>

	<script type="text/javascript" src="${dataModel}/mdl_extendmaterial.js"></script>
	<script type="text/javascript" src="${viewModel}/mdl_extendmaterial.js"></script>
	
	
	<script>
	var grid;
	var treee;
	$(document).ready(function(){ 

		var initParam = window.parent.popInitParam;
		var pMdlCom = { 
			containerId: "mdlExtMatGridContainer",
			multiselect: false,  
			dataModel: dataModels.mdl_extendmaterial,
			onePageRowCount: 20, 
			viewModel: viewModels.mdl_extendmaterial
		};
		grid = new NcpGrid(pMdlCom); 


		var closePop = function(rowIds){
			var selectedRows = null; 
			if(rowIds == null){
				selectedRows = null;
			}
			else{
				selectedRows = {};
				for(var i =0 ;i<rowIds.length;i++){
					var rowId = rowIds[i];
					selectedRows[rowId] = grid.datatable.rows(rowId).allCells();
				}
			}  
			initParam.closeWin({selectedRows:selectedRows});
		};;
				
		grid.setGridOtherParam = function(initParam){
			initParam.ondblClickRow = function(rowId, iRow, iCol, e){   
				closePop([rowId]);
			}
		};;
		grid.show();	


		$("#testGridContainer").find("a[name='returnBtn']").click(function(){
			var rowIds = grid.getSelectedRowIds();
			if(rowIds.length == 0){
				msgBox.alert({info:"请选中记录."});
			}
			else{
				closePop(rowIds);
			}
		});
		$("#testGridContainer").find("a[name='returnNullBtn']").click(function(){
			closePop([]);
		});
		$("#testGridContainer").find("a[name='closeBtn']").click(function(){
			closePop(null);
		});		
	});  
	</script>
</head>  
<body id="testGridContainer">

	<div class="zlpGridStyleContainer" id="mdlExtMatGridContainer" style="position:absolute;right:0px;top:0px;bottom:0px;left:0px;width:auto;">
		<div class="zlpGridStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">
					<a name="closeBtn" href="#" class="zlpToolbarBtn closeBtn">关闭</a> 
					<a name="returnNullBtn" href="#" class="zlpToolbarBtn returnNullBtn">返回空值</a>
					<a name="returnBtn" href="#" class="zlpToolbarBtn returnBtn">返回</a> 
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