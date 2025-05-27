<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>选择构件</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	
	<script type="text/javascript" src="${dataModel}/com_ComponentModel3D.js"></script>
	<script type="text/javascript" src="${viewModel}/com_ComponentRvt3D.js"></script>
	<script type="text/javascript" src="${viewModel}/com_BuildingRvt3D.js"></script>
	
	
	<script> 
	$(document).ready(function(){ 
		var initParam = window.parent.popInitParam;    

		var codePrefix = initParam.codePrefix;
		var useType = initParam.useType;
		var viewModel = null;
		var where = [];		 
		where.push({parttype:"field", field:"usetype", operator:"=", value: useType});  
		where.push({parttype:"field", field:"status", operator:"=", value: "succeed"}); 
		switch(useType){
			case "component":{
				where.push({parttype:"field", field:"componentid", operator:"is not null", value: null});
				viewModel = viewModels.com_ComponentRvt3D;
				break;
			}
			case "building":{
				viewModel = viewModels.com_BuildingRvt3D;
				break;
			}
		}
		if(codePrefix != null && codePrefix.length != 0){ 
			where.push({parttype:"field", field:"code", operator:"like", value: codePrefix + "%"});
		}
				
		var p = { 
			containerId: "testGridContainer",   
			multiselect: false,  
			dataModel: dataModels.com_ComponentModel3D,
			onePageRowCount: 20, 
			viewModel: viewModel,
			where: where
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
			var addAsPart = $("#addAsPartBtnId").prop("checked");
			initParam.closeWin({selectedRows:selectedRows, addAsPart: addAsPart});
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
					<a name="closeBtn" href="#" class="zlpToolbarBtn closeBtn">关闭</a> 
					<a name="returnNullBtn" href="#" class="zlpToolbarBtn returnNullBtn">返回空值</a>
					<a name="returnBtn" href="#" class="zlpToolbarBtn returnBtn">返回</a> 
					<span style="position:relative;float:right;display:block;width:auto;padding-left:15px;padding-right:15px;height:34px;line-height:34px;margin-left:5px;margin-right:5px;"><input type="checkbox" id="addAsPartBtnId" style="position:absolute;top:5px;height:16px;width:16px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;拆分插入</span>
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