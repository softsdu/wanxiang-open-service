<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title></title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	
	<script type="text/javascript" src="${dataModel}/sys_DataField.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_DataField.js"></script>
	
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
		initParam.isMultiValue = true;
		
		var multiSelectedRowIdValueToRow = new Object();
		
		var p = { 
			containerId:"testGridContainer",   
			multiselect:initParam.isMultiValue,  
			dataModel:dataModels.sys_DataField,
			onePageRowCount:200, 
			viewModel:viewModels.sys_DataField,
			sysWhere: [{parttype:"clause", clause:"df.parentid in (select d.id from sys_data d where name='" + initParam.cardName + "')"}]
		};
		var grid = new NcpGrid(p);	

		//数据权限过滤
		var externalObject = {
			afterDoPage:function(param){
				for(var rowId in grid.datatable.allRows()){
					var row = grid.datatable.rows(rowId);
					var name = row.getValue("name");
					var isSelected = false;
					for(var i = 0; i < initParam.selectedNames.length; i++){
						if(name == initParam.selectedNames[i].name){
							isSelected = true;
							break;
						}
					}
					if(isSelected){
						$("tr[id='" + rowId + "'] td").css({color: "#dddddd"});
					}
				}
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
			if(initParam.isMultiValue){ 
				for (var k in multiSelectedRowIdValueToRow)
				{ 
					count++; 
				} 
			}
			else{
				multiSelectedRowIdValueToRow = new Object();
				var currentRow = grid.getCurrentRow();
				if(currentRow != null){
				    var idValue = grid.getCurrentIdValue();
					multiSelectedRowIdValueToRow[idValue] = currentRow.allCells();
					count++; 
				}
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
<body id="testGridContainer">
	<div class="zlpGridStyleContainer">
		<div class="zlpGridStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer"> 
					<a name="closeBtn" href="#" class="zlpToolbarBtn closeBtn">关闭</a>  
					<a name="returnBtn" id="returnBtnId" href="#" class="zlpToolbarBtn returnBtn">返回</a>
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