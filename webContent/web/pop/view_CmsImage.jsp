<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>图片</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	
	<script type="text/javascript" src="${dataModel}/cms_Image.js"></script>
	<script type="text/javascript" src="${viewModel}/cms_Image.js"></script>
	
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

	var grid = null;
	
	//操作按钮列的名称
	var operateColumnName = "operateColumn";
			
	//获取操作按钮单元格内容html
	function getLinkHtml(rowId){
		var row = grid.datatable.getRowByIdField(rowId, "id"); 
		var nameValue = row.getValue("name");
		var timeMark = (new Date()).getMilliseconds();
		var html = "<a href=\"#\" target=\"blank\" style=\"line-height:38px;width:100%;height:100%;\" onclick=\"return clickLink('" + rowId + "')\">预览</a>";
		return html;
	}
	
	//操作按钮列ID
	function getCellContainerId(rowId){
		return operateColumnName + "_" + rowId;
	}
	
	//手工刷新操作按钮列内容
	function clickLink(rowId){
		var row = grid.datatable.getRowByIdField(rowId, "id"); 
		var imageUrl = "../../cms/getCMSImage?id=" + row.getValue("accessoryid");
		$("#previewImageId").attr("src", imageUrl);
		return false;
	}

	//从模型中增加操作按钮列
	viewModels.cms_Image.colModel.push({name:operateColumnName,
		label:"操作",
		width:50,
		hidden:false,
		sortable:false, 
		search:false,
		resizable:true,
		editable:false,
		canEdit:false,
		formatter:function(cellvalue, options, rowObject){
			var html = getLinkHtml(rowObject.id);
			var containerId = getCellContainerId(rowObject.id);
			return "<div id=\"" + containerId + "\" style=\"width:100%;height:100%;text-align:center;\">" + html + "</div>";
		}
	});
	$(document).ready(function(){ 
		var initParam = window.parent.popInitParam; 
		
		var multiSelectedRowIdValueToRow = new Object();
		
		var p = { 
			containerId:"testGridContainer",   
			multiselect:initParam.isMultiValue,  
			dataModel:dataModels.cms_Image,
			onePageRowCount:20, 
			viewModel:viewModels.cms_Image 
		};
		grid = new NcpGrid(p); 

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
<body id="testGridContainer">
	<div class="zlpGridStyleContainer">
		<div class="zlpGridStyleInnerContainer">
			<div class="zlpToolbarContainer">
				<div class="zlpToolbarLeftContainer">  
					<a name="returnNullBtn" href="#" class="zlpToolbarBtn editBtn">返回空值</a>  
					<a name="returnBtn" id="returnBtnId" href="#" class="zlpToolbarBtn editBtn">确定</a>		  
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