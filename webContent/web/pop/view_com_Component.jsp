<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>选择物料</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	
	<script type="text/javascript" src="${dataModel}/com_Component.js"></script>
	<script type="text/javascript" src="${viewModel}/com_Component.js"></script>
	
	<script> 
	$(document).ready(function(){ 
		var initParam = window.parent.popInitParam; 
				
		var p = { 
			containerId: "testGridContainer",   
			multiselect: false,  
			dataModel: dataModels.com_Component,
			onePageRowCount: 20, 
			viewModel: viewModels.com_Component 
		};
		var grid = new NcpGrid(p); 
		
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
	<div class="zlpGridStyleContainer">
		<div class="zlpGridStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">
					<a name="returnNullBtn" href="#" class="zlpToolbarBtn returnNullBtn">返回空值</a>
					<a name="returnBtn" href="#" class="zlpToolbarBtn returnBtn">返回</a> 
				</div> 
			</div>
			<div class="zlpGridContainer" name="gridDiv" style="bottom:0px;">
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