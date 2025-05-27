<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>选择图例</title> 
	
	<script type="text/javascript" src="${dataModel}/cat_CategoryList.js"></script>
	<script type="text/javascript" src="${viewModel}/cat_CategoryList.js"></script>
	<script type="text/javascript" src="${treeModel}/catetoryList.js"></script> 
	
	<script type="text/javascript" src="${dataModel}/mdl_Component.js"></script>
	<script type="text/javascript" src="${viewModel}/mdl_ComponentList.js"></script> 
	
	
	<script>
	var grid;
	var treee;
	$(document).ready(function(){ 

        //列 added by liyh 20210824
        var imgIdColModel = null;
        for(var i = 0; i < viewModels.mdl_ComponentList.colModel.length; i++){
        	var cModel = viewModels.mdl_ComponentList.colModel[i];
        	if(cModel.name == "imgid"){
        		imgIdColModel = cModel;
        		break;
        	}
        }
		imgIdColModel.formatter = function(cellvalue, options, rowObject) {
            var id = rowObject.id;
            var rowId = options.rowId;
            var containerId = "id_" + rowId;
            var imgId = rowObject.imgid;
            if (imgId != null) {
                var imgUrl = "../../accessory/getImage?id=" + imgId.split(",")[0];
                return "<div style=\"text-align:center;\"><img id=\"" + containerId + "\"  style=\"width:auto;height:auto;max-width: 90%;max-height: 30px;\" src=\"" + imgUrl + "\" onclick=\"showImage('" + imgUrl + "', '" + rowObject.name + "');\"></div>";
            } 
            else {
                return "";
            }
        } 
		
		var initParam = window.parent.popInitParam;
		var pMdlCom = { 
			containerId: "mdlComtGridContainer",   
			multiselect: false,  
			dataModel: dataModels.mdl_Component,
			onePageRowCount: 20, 
			viewModel: viewModels.mdl_ComponentList
		};
		grid = new NcpGrid(pMdlCom); 

		var pCat = { 
			containerId:"catGridContainer", 
			treeModel:treeModels.catetoryList,
			isExpandRoot:false,
			multiselect:false
		};
		tree = new NcpTree(pCat);
		
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
		
		//过滤2d组件 added by ls 20221124
		grid.sysWhere = [{parttype:"field", field: "mdltype", operator:"=", value: "component2d"}];
		tree.treeGridCtrl.sysWhere = [{parttype:"field", field: "mdltype", operator:"=", value: "component2d"}];
		
		tree.treeGridCtrl.addExternalObject({
			afterRowSelect: function(rowId){
				var catRow = tree.treeGridCtrl.datatable.rows(rowId);
				var categoryCode = catRow.getValue("code");
				grid.sysWhere = [{parttype:"field", field: "categorycode", operator:"like", value: categoryCode + "%"}];
				grid.doPage({pageNumber: 1});
			}
		});

		grid.show();	
		tree.show();

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
	function showImage(imgUrl,title){
        var popContainer = new PopupContainer( {
            width : 800 ,
            height : 500,
            top : 15,
            title: title
        });

        popContainer.show();
        var inputId = cmnPcr.getRandomValue();
        var innerHtml = "<div style=\"position:absolute;width:100%;height:100%;text-align:center; vertical-align: middle;display:table-cell; overflow:auto;" +
			"background:url(" + imgUrl + ") center no-repeat;\">"
            + "</img>";

        $("#" + popContainer.containerId).html(innerHtml);
    }
	</script>
</head>  
<body id="testGridContainer">
	<div class="zlpGridStyleContainer" id="catGridContainer" style="position:absolute;left:0px;top:0px;bottom:0px;width:213px;">
		<div class="zlpGridStyleInnerContainer">
			<div class="zlpGridContainer" name="gridDiv" style="bottom:0px;top:0px">
				<table name="gridCtrl" class="zlpGridTable"></table>
			</div> 
		</div>
	</div>
	<div class="zlpGridStyleContainer" id="mdlComtGridContainer" style="position:absolute;right:0px;top:0px;bottom:0px;left:220px;width:auto;">
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