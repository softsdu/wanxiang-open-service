<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title></title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	
	<script type="text/javascript" src="${dataModel}/cat_Category.js"></script>
	<script type="text/javascript" src="${viewModel}/cat_Category.js"></script>
	<script type="text/javascript" src="${treeModel}/catCategory.js"></script>
	
	<script> 
	$(document).ready(function(){ 
		var initParam = window.parent.popInitParam; 

		var p = { 
			containerId:"testGridContainer", 
			treeModel:treeModels.catCategory,
			isExpandRoot:true,
			multiselect:initParam.isMultiValue
		};
		var tree = new NcpTree(p);  
		

		//数据权限过滤
		var externalObject = {
				beforeDoPage:function(param){
					param.previousField = initParam.previousField;
					param.previousData = initParam.previousData;
					param.popDataField = initParam.popDataField;
					return true;
				} 
		};
		tree.treeGridCtrl.addExternalObject(externalObject); 		


		var closePop = function(rowIds){
			var selectedRows = null; 
			if(rowIds == null ){
				selectedRows = null;
			} 
			else{
				selectedRows = {};
				for(var i =0 ;i<rowIds.length;i++){
					var rowId = rowIds[i];
					selectedRows[rowId] = tree.treeGridCtrl.datatable.rows(rowId).allCells();
				}
			} 
			initParam.closeWin({selectedRows:selectedRows});
		}
		
		tree.setGridOtherParam = function(initParam){
			initParam.ondblClickRow = function(rowId, iRow, iCol, e){   
				closePop([rowId]);
			}
		}
		tree.show();	

		$("#testGridContainer").find("a[name='returnBtn']").click(function(){
			var rowIds = tree.treeGridCtrl.getSelectedRowIds();
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
					<a name="closeBtn" href="#" class="zlpToolbarBtn closeBtn">关闭</a> 
					<a name="returnNullBtn" href="#" class="zlpToolbarBtn returnNullBtn">返回空值</a>
					<a name="returnBtn" href="#" class="zlpToolbarBtn returnBtn">返回</a> 
				</div> 
			</div>
			<div class="zlpGridContainer" name="gridDiv" style="bottom:0px;">
				<table name="gridCtrl" class="zlpGridTable"></table>
			</div> 
		</div>
	</div>
</body>  
</html>