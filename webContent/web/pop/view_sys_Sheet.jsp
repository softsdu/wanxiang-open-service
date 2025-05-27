<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title></title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/sys_Sheet.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Sheet.js"></script>
	
	<style>
	.ncpMultiSelectItemSpan{
		border:solid 1px #A6C9E2;
		margin:2px;
		font-size:9px;
		height:16px;
		display:inline-block;
	}
	.ncpMultiSelectItemSpanCurrent{
		background-color:#FF9393;
	}
	.ncpMultiSelectItemValueSpan{
		line-height:16px; 
		height:16px;	
		display:inline-block;
		vertical-align:top;
	}
	.ncpMultiSelectItemDelete{
		width:16px;
		height:16px;
		display:inline-block;
		border-left:solid 1px #A6C9E2;
    	background:url(../../platform-style/plugins/platform/themes/default/images/remove.png) center center;
    	cursor:pointer;
	}
	</style>
	
	<script> 
	$(document).ready(function(){ 
		var initParam = window.parent.popInitParam; 
		
		var multiSelectedRowIdValueToRow = new Object();
		
		var p = { 
			containerId:"testGridContainer",   
			multiselect:initParam.isMultiValue,  
			dataModel:dataModels.sys_Sheet,
			onePageRowCount:20, 
			viewModel:viewModels.sys_Sheet 
		};
		var grid = new NcpGrid(p); 

		//数据权限过滤
		var externalObject = {
				beforeDoPage:function(param){
					param.previousField = initParam.previousField;
					param.previousData = initParam.previousData;
					param.popDataField = initParam.popDataField;
					return true;
				} 
		};
		grid.addExternalObject(externalObject); 		

		var closePop = function(rows){ 
			initParam.closeWin({selectedRows:rows});
		}
				
		grid.setGridOtherParam = function(initParam){
			initParam.ondblClickRow = function(rowId, iRow, iCol, e){  
				var selectedRows = new Object();
				selectedRows[rowId] = grid.datatable.rows(rowId).allCells();
				closePop(selectedRows);
			}
		}
		
		var checkHadSelected = function(idValue){
			return multiSelectedRowIdValueToRow[idValue] != null;
		}
		
		var showSelectedTotalCount = function(){
			var count = getSelectedTotalCount();
			$("#returnBtnId").text("返回(" + count + "条)");
		}
		
		var getSelectedTotalCount = function(){
			var count = 0; 
			for (var k in multiSelectedRowIdValueToRow)
			{ 
				count++; 
			} 
			return count;
		}

		var addSelectedItem = function(idValue, row){
			var showFieldName = initParam.showField; 
			var showValue = row[showFieldName]; 
			if(!checkHadSelected(idValue)){
				multiSelectedRowIdValueToRow[idValue] = row;
				var itemId = idValue + "selectedItem";
				var itemValueId = idValue + "selectedItemValue";
				var itemDeleteId = idValue + "selectedItemDelete";
				
				//添加到显示界面
				var itemHtml = "<span class=\"ncpMultiSelectItemSpan\" idValue=\"" + idValue + "\" id=\"" + itemId + "\"><span class=\"ncpMultiSelectItemValueSpan\" id=\"" + itemValueId + "\"></span><span class=\"ncpMultiSelectItemDelete\" id=\"" + itemDeleteId + "\" idValue=\"" + idValue + "\" ></span></span>";
				$("#selectedItemsContainerId").append(itemHtml);
				$("#" + itemValueId).text(showValue);
				$("#" + itemDeleteId).click(function(){
					var deleteIdValue = $(this).attr("idValue");
					removeSelectedItem(deleteIdValue);
					var idFieldName = grid.dataModel.idFieldName;
			        var rowId = grid.datatable.getRowIdByIdField(deleteIdValue, idFieldName);
			        grid.setRowSelectCheck(rowId, false);
				});
			}
			
			showSelectedTotalCount();
			
			//高亮显示被选中项
			$(".ncpMultiSelectItemSpan").each(function(){
				var iv = $(this).attr("idValue");
				if(iv == idValue){
					$(this).addClass("ncpMultiSelectItemSpanCurrent");
				}
				else{
					$(this).removeClass("ncpMultiSelectItemSpanCurrent");
				}
			});
		}
		var removeSelectedItem = function(idValue){ 
			var itemId = idValue + "selectedItem"; 
	        delete multiSelectedRowIdValueToRow[idValue];
	        $("#" + itemId).empty();
	        $("#" + itemId).remove();
	        showSelectedTotalCount();
		}
		grid.onRowCheckClick = function(rowId, checked){
			var row = grid.datatable.rows(rowId).allCells()
			var idFieldName = grid.dataModel.idFieldName;
			var idValue = row[idFieldName];
			if(checked){
				addSelectedItem(idValue, row);
			}
			else{
				removeSelectedItem(idValue);
			}
		} 
		
		grid.show();	

		$("#testGridContainer").find("a[name='returnBtn']").click(function(){
			//20160127修改此处代码，多选时返回multiSelectedRowIdValueToRow保存的rows！！！！！！！！！！！！！！！！！！！！！！！！！！！
			var selectedCount = getSelectedTotalCount();
			if(selectedCount == 0){
				msgBox.alert({info:"请选中记录."});
			}
			else{
				closePop(multiSelectedRowIdValueToRow);
			}
		});
		$("#testGridContainer").find("a[name='returnNullBtn']").click(function(){
			closePop(new Object());
		});
		$("#testGridContainer").find("a[name='closeBtn']").click(function(){
			closePop(null);
		});
		
		var initShowSelectItems = function(){
			if(initParam.isMultiValue){
				var idFieldName = grid.dataModel.idFieldName;
				for (var rowId in initParam.value)
				{ 
					var row = initParam.value[rowId]; 
					var idValue = row[idFieldName];
					addSelectedItem(idValue, row)
				} 
			}
		}
		initShowSelectItems();
		
	});  
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
		<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
		<a name="closeBtn" href="#" class="easyui-linkbutton"style="float:right;"  data-options="plain:true">关闭</a>
		<a name="returnNullBtn" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true">返回空值</a>
		<a name="returnBtn" id="returnBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true">返回</a>
	</div>
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">
		<table name="gridCtrl" ></table>
	</div>
	<div id="selectedItemsDiv" class="ncpSelectedItemsDiv" data-options="region:'south',border:false">
		<div id="selectedItemsContainerId" class="ncpSelectedItemsContainerDiv"  ></div>
	</div> 
</body>	 
</html>