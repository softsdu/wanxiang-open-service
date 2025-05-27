function getPopContainer(param){
	var popContainer = new PopupContainer( {
		width : 800,
		height : 500,
		top : 50
	});
	return popContainer;
}
function showDataFieldListPage(param) {
	var popContainer = this.getPopContainer(param);
	popContainer.show();
	var initParam = {
		closeWin : function(p) {
			var selectedRows = p.selectedRows;
			popContainer.close();  
			autoAddDispUnits(selectedRows);
		},
		cardName: param.cardName,
		selectedNames: param.selectedNames, 
		isMultiValue:param.isMultiValue, 
		popDataField : "name",
		showField : "name"
	}
	window.popInitParam = initParam;

	//var popNames = param.fieldModel.inputHelpName.split(".");
	var popPageUrl = "pop_DataFields.jsp";

	var frameId = cmnPcr.getRandomValue();
	var iFrameHtml = "<iframe id=\""
			+ frameId
			+ "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
	$("#" + popContainer.containerId).html(iFrameHtml);
	$("#" + frameId).attr("src", popPageUrl);
}

var autoAddDispUnits = function(dataFields){
	if(msgBox.confirm({info: "确定添加吗?"})){	
		 
		//添加子表记录	
		var dispUnitGrid = sheetCtrl.getPartCardCtrl("line");	
		var newRows = new Array(); 
		for(var key in dataFields){
			var fieldInfo = dataFields[key];
			var fieldValues = {}
			fieldValues["name"] = fieldInfo.name;
			fieldValues["label"] = fieldInfo.displayname;
			fieldValues["colwidth"] = fieldInfo.valuelength * 10;
			fieldValues["colsortable"] = false;
			fieldValues["colsearch"] = false;
			fieldValues["colresizable"] = true;
			fieldValues["editable"] = true;
			fieldValues["nullable"] = true;
			fieldValues["colvisible"] = true; 
			newRows.push({fieldValues: fieldValues});
		} 
		var param = {
			rows: newRows
		};
		dispUnitGrid.doAdd(param);  
	}
}

var sheetWin = null;
var sheetCtrl = null;

$(document).ready(function(){ 	
	var initParam = window.parent.multiStyleWinInitParam; 
	initParam.containerId = "testSheetContainer";
	sheetWin = new NcpMultiStyleSheetWin(initParam); 
	sheetWin.show();	
	sheetCtrl = sheetWin.sheetCtrl; 
	
	$("#multiAddDispUnitBtnId").click(function(){ 
		var mainCardCtrl = sheetCtrl.getMainCardCtrl();
		var row = mainCardCtrl.datatable.getRowByIndex(0);
		var cardName = row == null ? null : row.getValue("dataname");
		if(cardName == null || cardName.length == 0){
			msgBox.show({
				info: "请先指定数据模型"
			});
		}
		
		var selectedNames = new Array();
		var dispUnitGridCtrl = sheetCtrl.getPartCardCtrl("line");
		for(var childRowId in dispUnitGridCtrl.datatable.allRows()){
			var dispUnitRow = dispUnitGridCtrl.datatable.rows(childRowId);
			var dispUnitName = dispUnitRow.getValue("name");
			if(dispUnitName.length != 0){
				selectedNames.push({
					name: dispUnitName
				});
			}
		}
		
		showDataFieldListPage({
			cardName: cardName,
			selectedNames: selectedNames
		});
	}); 
	
	$("#generateJsBtn").click(function(){
		var mainCard = sheetCtrl.getMainCardCtrl();
	 	var idValue = mainCard.getCurrentIdValue();
	 	if(idValue == null){
	 		msgBox.alert({info:"没有记录."});
	 	}
	 	else{
	 		mainCard.doOtherAction({
				actionName:"generateJs",
				customParam:{viewId: idValue},
				successFunc: function(obj){ 
					if(obj.result.succeed == "true"){
						alert( "生成JS模型成功.");
					}
					else{
						var errors = obj.result.errors;
						var errorStr = cmnPcr.arrayToString(errors, "\r\n");							
						alert("提示:\r\n" + errorStr);								
					} 
				},
				failFunc:function(obj){
					alert("生成JS模型失败.\r\n" + obj.code + ": " + obj.message);
				}
			});
	 	}
	}); 
	
	$("#generatePageBtn").click(function(){ 
		var mainCard = sheetCtrl.getMainCardCtrl();
	 	var idValue = mainCard.getCurrentIdValue();
	 	if(idValue == null){
	 		msgBox.alert({info:"没有记录."});
	 	}
	 	else{
	 		mainCard.doOtherAction({
				actionName:"generatePage",
				customParam:{viewId: idValue},
				successFunc: function(obj){ 
					if(obj.result.succeed == "true"){
						alert( "生成JSP页面成功.");
					}
					else{
						var errors = obj.result.errors;
						var errorStr = cmnPcr.arrayToString(errors, "\r\n");							
						alert("提示:\r\n" + errorStr);								
					} 
				},
				failFunc:function(obj){
					alert("生成JSP页面失败.\r\n" + obj.code + ": " + obj.message);
				}
			});
	 	}
	});  
});  