/*
containerId jqgrid的容器id
outerId整个view编辑控件的容器
datatype:默认"local"，一般不改变此参数值
height:如果使用fill停靠，那么不需要赋值
width:如果使用fill停靠，那么不需要赋值
shrinkToFit:默认为false，一般不修改此参数
caption:默认为空"",不建议使用此参数
onePageRowCount(对应jqgrid的rowNum):默认为15,
multiselect:允许多选

列
colNames:字符串数组
colModel:{name:label:width:sortable:search:resizable:hidden:formatter:formatoptions:frozen :}

合并表头
useColSpanStyle: true,   
groupHeaders:[{  startColumnName:'id',numberOfColumns: 2,titleText: '<input type="text"/>'}  ]	 

显示合计行
footerrow : true, 
*/

//NcpGrid
function NcpGrid(p) {

	var that = this;

	//显示的定义，注意dataModel是数据模型定义
	this.colModel = p.viewModel.colModel;

	//Card方式显示域定义
	this.dispUnitModel = p.viewModel.dispUnitModel;

	//基类
	this.base = NcpView;
	this.base(p);

	//jqgrid控件
	this.gridCtrl = null;

	//jqgrid控件所属控件
	this.gridDiv = null;

	//导航控件
	this.paginationCtrl = null;

	//是否取合计
	this.isGetSum = true;

	//是否取记录数
	this.isGetCount = true;

	//翻页导航所用参数
	this.totalRowCount = 0;
	this.pageNumber = 1;

	//编辑窗口地址
	this.editInCard = p.editInCard ? true : false;
	this.editPageUrl = p.editPageUrl;

	//编辑窗口大小
	this.editWinHeight = p.editWinHeight;
	this.editWinWidth = p.editWinWidth;
	
	//本地执行列排序
	this.columnLocalSort = p.columnLocalSort === undefined ? false : p.columnLocalSort;
	
	//是否包含详情页
	this.hideOperateColumn = p.hideOperateColumn === undefined ? true : p.hideOperateColumn;
	this.hasRowBtnDelete = p.hasRowBtnDelete === undefined ? true : p.hasRowBtnDelete;
	this.hasRowBtnAccessory = p.hasRowBtnAccessory === undefined ? false : p.hasRowBtnAccessory;
	
	//每页可以显示多少行的选择 added by ls 20210914
	this.pageRowCountList = p.pageRowCountList == undefined ? [20, 50, 100] : p.pageRowCountList;

	//获取当前行Id
	this.getCurrentIdValue = function() {
		var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
		if (selRowId != undefined) {
			var row = this.datatable.rows(selRowId);
			return row == null ? null : row
					.getValue(this.dataModel.idFieldName);
		} else {
			return null;
		}
	}
	//获取当前行
	this.getCurrentRow = function() {
		var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
		if (selRowId != undefined) {
			var row = this.datatable.rows(selRowId);
			return row;
		} else {
			return null;
		}
	}
	//初始化某个录入控件
	this.initGridCtrl = function(ctrlContainer, rowId, fieldName) {
		var cModel = this.getCModel(fieldName);
		var fieldModel = this.dataModel.fields[fieldName];
		var style = null;
		switch (cModel.editoptions.edittype) {
			case "text":
			case "textarea":
			case "decimal":
			case "date":
			case "time":
			case "list":
			case "checkbox":
			case "button":
				style = {
					width : "100%",
					height : "100%",
					border : "solid 0px #95B8E7",
					padding : "0px"
				};
				break;
		}
		var options = {};
		var editCtrl = this.createDispUnit(cModel.name, cModel.dispunittype, ctrlContainer, fieldModel, options, style);
	}
	
	//获取列的显示定义
	this.getCModel = function(name) {
		for ( var i = 0; i < this.colModel.length; i++) {
			var cModel = this.colModel[i];
			if (name == cModel.name) {
				return cModel;
			}
		}
		return null;
	}

	this.afterBaseList = function(param) {
		//显示下拉 
		$("#" + param.rowId + "_" + param.fieldName).listDispunit("showList",
				param.rows);
	}

	this.getSelectedRowIds = function() {
		var rowIds = new Array();
		for ( var rowId in this.datatable.allRows()) {
			if ($("#" + rowId + "_ncpRowSelect").prop("checked")) {
				rowIds.push(rowId);
			}
		}
		if (rowIds.length == 0) {
			var rowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
			if (rowId != undefined) {
				rowIds.push(rowId);
			}
		}
		return rowIds;
	}

	this.doEdit = function(param) {
		if (this.currentStatus == formStatusType.browse || this.editInCard) {
			if (this.beforeBaseEdit(param) && this.beforeDoEdit(param)) {
				this.baseEdit(param);
			}
		}
	}

	this.baseAdd = function(param) {
		if (this.editInCard) {
			var newRowId = cmnPcr.getRandomValue();
			param.rowId = newRowId;
			param.isEdit = false;
			param.dataModel = this.dataModel;
			param.dispUnitModel = this.dispUnitModel;
			this.editRowInPage(param);
		} 
		else {
			if(!that.needTriggerServerAdd || param.rows != null){
				//modify by ls 20190610 处理了手工添加新行，并有默认值的情况
				if(param.rows == null){ 
					if(param.newRowCount == null){
						param.newRowCount = 1;
					} 
				}
				else{
					param.newRowCount = param.rows.length;
				}

				var newBlankRows = new Array();
				for(var i = 0; i < param.newRowCount; i++){
					newBlankRows.push({});
				}
				
				param.newRowsTable = that.getDataTableFromBackInfo(newBlankRows);				
				if(param.rows != null) {
					var newRowIndex = 0;
					for(var newRowId in param.newRowsTable.allRows()){
						var fieldValues = param.rows[newRowIndex].fieldValues;
						var newBlankRow = param.newRowsTable.rows(newRowId);
						for(var fieldName in fieldValues){
							newBlankRow.setValue(fieldName, fieldValues[fieldName]);
						} 
						newRowIndex++;
					} 
				}
				
				that.setCtrlStatus(formStatusType.edit);
				that.processAddData(param);
				that.afterBaseAdd(param);
				that.afterDoAdd(param);
			} 
			else{
				var requestParam = {
					serviceName : this.serviceName,
					waitingBarParentId : this.containerId,
					funcName : "add",
					successFunc : function(obj) {
						param.newRowsTable = that
								.getDataTableFromBackInfo(obj.result.defaultValues);
						that.setCtrlStatus(formStatusType.edit);
						that.processAddData(param);
						that.afterBaseAdd(param);
						that.afterDoAdd(param);
					},
					args : {
						requestParam : cmnPcr.jsonToStr( {
							dataName : this.dataModel.name,
							newRowCount : param.newRowCount == undefined ? 1
									: param.newRowCount,
							otherRequestParam:param.otherRequestParam
						})
					}
				};
				this.ProcessServerAccess(requestParam);
			}
		}
	}

	this.baseEdit = function(param) {
		if (this.editInCard) {
			var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
			if (selRowId != undefined) {
				var idValue = this.datatable.rows(selRowId).getValue(
						this.dataModel.idFieldName);
				param.rowId = selRowId;
				param.isEdit = true;
				param.idValue = idValue;
				param.dataModel = this.dataModel;
				param.dispUnitModel = this.dispUnitModel;
				this.editRowInPage(param);
			} else {
				msgBox.alert( {
					info : "请先选中记录."
				});
			}
		} else {
			that.setCtrlStatus(formStatusType.edit);
			that.processEditData(param);
			that.afterBaseEdit(param);
			that.afterDoEdit(param);
		}
	}

	this.editRowInPage = function(initParam) {
		window.gridCardInitParam = initParam;
		initParam.closeWin = function(param) {
			//如果处理成功，在进行相应的后续操作
			if (param.succeed) {
				if (initParam.isEdit) {
					//编辑模式修改当前Grid行数据					
					param.updateRowsTable = param.update;
					that.setCtrlStatus(formStatusType.edit);
					that.processEditData(param);
					that.afterBaseEdit(param);
					that.afterDoEdit(param);
				} else {
					//新建模式 ，添加当前Grid行数据
					param.newRowsTable = param.insert;
					that.setCtrlStatus(formStatusType.edit);
					that.processAddData(param);
					that.afterBaseAdd(param);
					that.afterDoAdd(param);
				}
			}
			popContainer.close();
		}

		var popContainer = new PopupContainer( {
			width : that.editWinWidth,
			height : that.editWinHeight,
			top : 100
		});
		popContainer.show();
		var frameId = cmnPcr.getRandomValue();
		var iFrameHtml = "<iframe id=\""
				+ frameId
				+ "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		$("#" + popContainer.containerId).html(iFrameHtml);
		$("#" + frameId).attr("src", this.editPageUrl);

	}

	this.beforeBaseDelete = function(param) {
		//var rowIds = $(this.gridCtrl).jqGrid("getGridParam", "selarrrow");
		var rowIds = this.getSelectedRowIds();
		if (rowIds.length == 0) {
			msgBox.alert( {
				info : "请选择要删除的记录."
			});
			return false;
		} else {
			param.existRowIdValues = {};
			param.existRowIds = new Array();
			param.newRowIds = new Array();
			for ( var i = 0; i < rowIds.length; i++) {
				var rowId = rowIds[i];
				var row = this.datatable.rows(rowId);
				if (row.isNewRow(this.dataModel.idFieldName)) {
					//新建的
					param.newRowIds.push(rowId);
				} else {
					//已存在的
					param.existRowIds.push(rowId);
					param.existRowIdValues[rowId] = row
							.getValue(this.dataModel.idFieldName);
				}
			}
			return msgBox.confirm( {
				info : "确定要删除选中数据吗?" + (rowIds.length > 1 ? "\r\n共 " + rowIds.length + " 条记录" : "")
			});
		}
	}

	this.afterBaseDelete = function(param) {
		var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
		for ( var i = 0; i < param.existRowIds.length; i++) {
			var existRowId = param.existRowIds[i];
			$(this.gridCtrl).jqGrid("delRowData", existRowId);
			this.datatable.remove(existRowId);
			if (selRowId == existRowId) {
				this.afterRowSelect(undefined);
			}
		}
		for ( var i = 0; i < param.newRowIds.length; i++) {
			var newRowId = param.newRowIds[i];
			this.restoreRow(newRowId);
			if (selRowId == newRowId) {
				this.afterRowSelect(undefined);
			}
		}

		//在本地增加一下记录数，这个数不准，只是给用户的视觉效果
		this.totalRowCount -= param.existRowIds.length;
		this.refreshPaginationCtrl();

		//增加计算合计值的功能 added by ls 20190723
		this.reCalcAllSumValues();
	}

	this.afterBaseCancel = function(param) {
		for ( var i = 0; i < param.editRowIds.length; i++) {
			var editRowId = param.editRowIds[i];
			this.restoreRow(editRowId);
		}
		for ( var i = 0; i < param.newRowIds.length; i++) {
			var newRowId = param.newRowIds[i];
			this.restoreRow(newRowId);
		}

		//增加计算合计值的功能 added by ls 20190723
		this.reCalcAllSumValues();
	}

	this.beforeBasePage = function(param) {
		//param.fromIndex = (param.pageNumber - 1) * that.onePageRowCount;
		param.currentPage = param.pageNumber;
		return true;
	}

	//将新增记录显示在界面中
	this.afterBaseAdd = function(param) {
		for ( var rowId in param.newRowsTable.allRows()) {
			var newRow = param.newRowsTable.rows(rowId);
			this.datatable.addRow(rowId, newRow);
			$(this.gridCtrl).jqGrid("addRowData", rowId, newRow.allCells());
			this.initRowSelectContrl(rowId);
			this.initRowOperateContrl(rowId);
			//$(this.gridCtrl).jqGrid("setSelection",rowId);
			this.selectRowInGrid(rowId);
		}
		//增加计算合计值的功能 added by ls 20190723
		this.reCalcAllSumValues();
	}

	this.afterBaseEdit = function(param) {
		if (this.editInCard) {
			for ( var rowId in param.updateRowsTable.allRows()) {
				var updateRow = param.updateRowsTable.rows(rowId);
				this.datatable.replaceRow(rowId, updateRow);
				$(this.gridCtrl).jqGrid("setRowData", rowId,
						updateRow.allCells());
				this.editRowInGrid(updateRow);
			}
		}
	}

	//保存后刷新数据
	this.afterBaseSave = function(param) {

		//在本地增加一下记录数，这个数不准，只是给用户的视觉效果
		this.totalRowCount += param.insert.count();

		//将编辑区域变为浏览状态		
		for ( var rowId in param.insert.allRows()) {
			var row = this.datatable.rows(rowId);
			row.setIsEdited(false);
			row.setValue(this.dataModel.idFieldName, param.rowIdToIdValues[rowId]);
			$(this.gridCtrl).jqGrid("restoreRow", rowId);

			if (!this.isRefreshAfterSave) {
				var insertRow = param.insert.rows(rowId);
				for ( var k in insertRow.allCells()) {
					if (k != this.dataModel.idFieldName) {
						row.setValue(k, insertRow.getValue(k));
					}
				}
				$(this.gridCtrl).jqGrid("setRowData", rowId, row.allCells());
			}
		}
		for ( var rowId in param.update.allRows()) {
			var row = this.datatable.rows(rowId);
			row.setIsEdited(false);
			$(this.gridCtrl).jqGrid("restoreRow", rowId);
			var updateRow = param.update.rows(rowId);

			if (!this.isRefreshAfterSave) {
				for ( var k in updateRow.allCells()) {
					row.setValue(k, updateRow.getValue(k));
				}
				$(this.gridCtrl).jqGrid("setRowData", rowId, row.allCells());
			}
		}

		for ( var rowId in param.table.allRows()) {
			var newRow = param.table.rows(rowId);
			this.datatable.replaceRow(rowId, newRow);
			$(this.gridCtrl).jqGrid("setRowData", rowId, newRow.allCells());
		}
		this.refreshPaginationCtrl();

		//增加计算合计值的功能 added by ls 20190723
		this.reCalcAllSumValues();
	}

	this.beforeBaseSave = function(param) {
		var insertDt = new DataTable();
		var updateDt = new DataTable();
		for ( var rowId in this.datatable.allRows()) {
			var row = this.datatable.rows(rowId);
			if (row.isNewRow(this.dataModel.idFieldName)) {
				//获取新建的行
				var newShowRow = this.getRowFromEditCtrl(rowId);
				insertDt.addRow(rowId, newShowRow);
			} else if (row.getIsEdited()) {
				//获取编辑的行
				var editShowRow = this.getRowFromEditCtrl(rowId);
				editShowRow.setValue(this.dataModel.idFieldName, row
						.getValue(this.dataModel.idFieldName));
				updateDt.addRow(rowId, editShowRow);
			}
		}
		if (insertDt.count() == 0 && updateDt.count() == 0) {
			//msgBox.alert({info:"没有需要保存的记录."});		
			return true;
		} else {
			param.update = updateDt;
			param.insert = insertDt;			
			return this.checkNotNullable(param);
		}
	}
	
	this.checkNotNullable = function(param){
		var errorStr = "";
		if(param.update.count()>0){
	        for (var k in param.update.allRows()) {
	        	var row = param.update.rows(k);
	        	var es = this.checkRowNotNullable(row);
	        	if(es.length !=0){
	        		var index = this.datatable.getRowIndex(row.rowId);
	        		errorStr += ("第 " + (index + 1) + " 行:\r" + es);
	        	}
	        }
		}
		if(param.insert.count()>0){
	        for (var k in param.insert.allRows()) {
	        	var row = param.insert.rows(k);
	        	var es = this.checkRowNotNullable(row);
	        	if(es.length !=0){
	        		var index = this.datatable.getRowIndex(row.rowId);
	        		errorStr += ("第 " + (index + 1) + " 行:\r" + es);
	        	}
	        }
		}
		if(errorStr.length == 0){
			return true;
		}
		else{
			msgBox.alert({info:errorStr});
			return false;
		}
	}
	
	//验证某行的必填项是否填写完整
	this.checkRowNotNullable = function(row){
		var str = "";
		for ( var i = 0; i < p.viewModel.colModel.length; i++) {
			var unitModel = p.viewModel.colModel[i];
			if(!unitModel.nullable && !unitModel.hidden){
				var value =  row.getValue(unitModel.name);
				if(value == null || value ===""){
					str += ( "  字段 " + unitModel.label + " 的值不可为空;\r");
				}				
			}			
		}
		return str;
	}
	
	//从编辑控件里获取编辑后的记录值
	this.getRowFromEditCtrl = function(rowId) {
		var oldRow = this.datatable.rows(rowId);
		var row = new DataRow();
		row.rowId = rowId;
		//先处理带有maps的 modified by ls 20230512
		for ( var i = 0; i < this.colModel.length; i++) {
			var cModel = this.colModel[i];
			var fieldModel = this.dataModel.fields[cModel.name];
			if (fieldModel != undefined && that.isInitEditCtrl(cModel)) {
				if (fieldModel.maps != null) {
					var ctrl = $("#" + rowId + "_" + cModel.name);
					var newValue =  this.doCtrlCoreMethod(ctrl, cModel.dispunitType, cModel.name, "getValue");
					for (var k in fieldModel.maps){
						row.setValue(k, newValue == null ? null : newValue[fieldModel.maps[k]]); 
					}
				}  
			}
		}
		for( var i = 0; i < this.colModel.length; i++) {
			var cModel = this.colModel[i];
			var fieldModel = this.dataModel.fields[cModel.name];
			if (fieldModel != undefined && that.isInitEditCtrl(cModel)) {
				if (fieldModel.maps == undefined) {
					var ctrl = $("#" + rowId + "_" + cModel.name);
					var newValue =  this.doCtrlCoreMethod(ctrl, cModel.dispunitType, cModel.name, "getValue");
					row.setValue(fieldModel.name, newValue);
				} 
			}
		}
		return row;
	}

	//从当前编辑的单元格中获取字段值
	this.getEditValue = function(rowId, fieldModel) {
		var value = null;
		switch (fieldModel.valueType) {
		case valueType.decimal:
		case valueType.string:
		case valueType.date:
		case valueType.time:
			value = $("#" + rowId + "_" + fieldModel.name).val();
			break;
		case valueType.boolean:
			value = $("#" + rowId + "_" + fieldModel.name).prop("checked");
			break;
		}
		return value;
	}

	//将数据显示在界面中
	this.afterBasePage = function(param) {
		$(this.gridCtrl).jqGrid("clearGridData", true);

		that.datatable = param.datatable;

		for ( var rowId in param.datatable.allRows()) {
			$(that.gridCtrl).jqGrid("addRowData", rowId,
					param.datatable.rows(rowId).allCells());
			that.initRowSelectContrl(rowId);
			that.initRowOperateContrl(rowId);
		}

		that.totalRowCount = param.totalRowCount;
		that.pageNumber = param.pageNumber;
		that.refreshPaginationCtrl();
		
		//按照实际显示数据行数显示Grid高度
		if(param.autoHeight){
			//$(that.gridCtrl).setGridHeight('100%');//在平台platFormNew中有效，在此无法实现Grid展示高度等于实际数据的高度的效果，暂时屏蔽
			$(that.gridCtrl).setGridHeight(that.gridCtrl.clientHeight);//如此设置，Grid展示高度等于实际数据的高度
		}
		
		//显示第一行
		//$(that.gridCtrl).
	}
	
	//添加Grid头列多选控件
	this.initRowSelectContrl = function(rowId) {
		var rowCheckId = rowId + "_ncpRowSelect";
        var ischecked = p.checked == "checked"?p.checked:"";
		$(this.gridCtrl).jqGrid(
			"setCell",
			rowId,
			"ncpRowSelect",
			"<input class='ncpRowSelect' type='checkbox' rowId='" + rowId + "' id='" + rowCheckId + "' "+ischecked +"/>");
		$("#" + rowCheckId).click(function(){
			var rowId = $(this).attr("rowId");
			var checked = $(this).is(":checked");
			that.onRowCheckClick(rowId, checked);
			that.refreshRowAllSelectCheckbox();
		});
	}
	
	//选中所有行 added by ls 20190712
	this.selectAllRows = function(isSelected){
		for(var rowId in that.datatable.allRows()){
			that.setRowSelectCheck(rowId, isSelected);	
		}
		that.refreshRowAllSelectCheckbox();
	}

	//刷新全选按钮的状态  added by ls 20190712
	this.refreshRowAllSelectCheckbox = function(){
		var isAllSelected = true;
		for(var rowId in that.datatable.allRows()){
			var rowCheckId = rowId + "_ncpRowSelect";
			var checked = $("#" + rowCheckId).is(":checked");
			if(!checked){
				isAllSelected = false;
				break;
			}
		} 
		var allSelectedCheckboxId =  that.containerId + "_ncpRowSelect"; 
		$("#" + allSelectedCheckboxId).prop("checked", isAllSelected);
	}
	
	//设置是否选中(复选框)
	this.setRowSelectCheck = function(rowId, isSelect){
		var rowCheckId = rowId + "_ncpRowSelect"; 
		$("#" + rowCheckId).prop("checked", isSelect);
	}
	
	//当行选择控件被点击时
	this.onRowCheckClick = function(rowId, checked){
		
	}
	 
	//外部程序初始化行操作个性化定义的控件
	this.initOtherRowOperateHtml = function(rowId){ 
		return this.doExternalFunctionReturnHtml("initOtherRowOperateHtml", {rowId: rowId});
	}

	//外部程序初始化行操作个性化定义的控件处理事件
	this.bindOtherRowOperateEvent = function(rowId){ 
		return this.doExternalFunctionContinue("bindOtherRowOperateEvent", {rowId: rowId});
	}
	
	//初始化行操作个性化定义的控件
	this.baseInitOtherRowOperateHtml = function(rowId){  
		var rowDeleteBtnId = rowId + "_ncpRowOperate_delete"; 
		var rowAccessoryBtnId = rowId + "_ncpRowOperate_accessory"; 
		var html = (that.hasRowBtnDelete ? ("<a class='ncpRowOperateBtn deleteBtn' rowId='" + rowId + "' id='" + rowDeleteBtnId + "' title=\"删除本行记录\">删除</a>") : "")
			+ (that.hasRowBtnAccessory ? ("<a class='ncpRowOperateBtn accessoryBtn' rowId='" + rowId + "' id='" + rowAccessoryBtnId + "' title=\"附件\">附件</a>") : "");
		return html;
	}

	//初始化行操作个性化定义的控件处理事件
	this.baseBindOtherRowOperateEvent = function(rowId){  
		var rowDeleteBtnId = rowId + "_ncpRowOperate_delete"; 
		var rowAccessoryBtnId = rowId + "_ncpRowOperate_accessory"; 
		$("#" + rowDeleteBtnId).click(function(){
			var rowId = $(this).attr("rowId");
			that.selectRowInGrid(rowId)
			var currentRow = that.getCurrentRow();
			if(currentRow != null && currentRow.rowId == rowId){
				that.doDelete({});
			} 
		});
		$("#" + rowAccessoryBtnId).click(function(){
			var rowId = $(this).attr("rowId");
			that.selectRowInGrid(rowId)
			var currentRow = that.getCurrentRow();
			if(currentRow != null && currentRow.rowId == rowId){
				alert("附件");
			}
		});
	}
	
	//添加Grid行操作控件
	this.initRowOperateContrl = function(rowId) { 
		var operateHtml = "<div class=\"rowOperateContainer\">"
		+ that.baseInitOtherRowOperateHtml(rowId) 
		+ that.initOtherRowOperateHtml(rowId) 
		+ "</div>";		
		$(this.gridCtrl).jqGrid(
				"setCell",
				rowId,
				"ncpRowOperate",
				operateHtml); 

		that.baseBindOtherRowOperateEvent(rowId);
		that.bindOtherRowOperateEvent(rowId);
	}
	
	this.refreshRowOperateControl = function(rowId){
		var rowDeleteBtnId = rowId + "_ncpRowOperate_delete"; 
		var rowDetailBtnId = rowId + "_ncpRowOperate_detail"; 
		var rowAccessoryBtnId = rowId + "_ncpRowOperate_accessory"; 
	}
	
	//设置是否选中(复选框)
	this.setRowSelectCheck = function(rowId, isSelect){
		var rowCheckId = rowId + "_ncpRowSelect";
		$("#" + rowCheckId).prop("checked", isSelect);
	}
	
	//当行选择控件被点击时
	this.onRowCheckClick = function(rowId, checked){
		
	}

	//刷新导航栏
	this.refreshPaginationCtrl = function() {  
		//翻页后，定位到第一行
		$(that.gridCtrl).parent().parent().scrollTop(0); 
		
		var pageCount = Math.ceil(that.totalRowCount / that.onePageRowCount);
		var linkNums = new Array();
		if(pageCount <= 5){
			for(var i = 1; i <= pageCount; i++){
				linkNums.push(i);
			}
		}
		else{
			for(var i = 1; i <= pageCount; i++){
				if(i == 1){
					linkNums.push(i);
				}
				else if(i == 2 && that.pageNumber <= 4){
					linkNums.push(i);
				}
				else if(i == pageCount - 1 && pageCount - that.pageNumber <= 3){
					linkNums.push(i);
				}
				else if(Math.abs(that.pageNumber - i) <= 1){
					linkNums.push(i);
				}
				else if(i == pageCount){
					linkNums.push(i);
				}			
			}
		}

		var paginationHtml = "";
		for(var i = 0; i < linkNums.length; i++){
			var linkNum = linkNums[i];
			if(i == 1){
				if(linkNum - linkNums[0] > 1){
					paginationHtml += "<li class=\"disabled\"><a href=\"#\">...</a></li>";
				}
			}
			if(i == linkNums.length - 1 && i > 0){
				if(linkNum - linkNums[linkNums.length - 2] > 1){
					paginationHtml += "<li class=\"disabled\"><a href=\"#\">...</a></li>";
				}
			}
			paginationHtml += ("<li" + (that.pageNumber == linkNum ? " class=\"active\"" : "") + "><a href=\"#\" class=\"pageBtn\" pageNum=\"" + linkNum + "\">" + linkNum + "</a></li>");			
		} 
		paginationHtml += ("<li class=\"disabled\"><span>共" + that.totalRowCount + "条<span></li>");
		$("#" + that.containerId + " .zlpNavUl").html(paginationHtml);
		$("#" + that.containerId + " .pageBtn").click(function(){
			var pageNum = $(this).attr("pageNum");
			that.doPage({pageNumber: parseInt(pageNum)});
			return false;
		});
	}

	//最大化填充
	this.fulfill = function() { 
		setTimeout(function(){
			var h = $(that.gridDiv).height()-35; 
			if(p.footerrow != undefined && p.footerrow){
				h = $(that.gridDiv).height()-41;
			}
			var tableWidth = $(that.gridDiv).width();
			$(that.gridCtrl).setGridWidth(tableWidth);
			$(that.gridCtrl).setGridHeight(h);
		}, 100);
	}

	//取消此行的编辑，如果是新建，那么删除此行，如果是编辑，那么还原为原来的显示内容
	this.restoreRow = function(rowId) {
		if (this.datatable.isNewRow(rowId, this.dataModel.idFieldName)) {
			var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
			$(this.gridCtrl).jqGrid("delRowData", rowId);
			this.datatable.remove(rowId);
			if (selRowId == rowId) {
				this.afterRowSelect(undefined);
			}
		} else {
			$(this.gridCtrl).jqGrid("restoreRow", rowId);
			this.markEditRow(rowId, false);
		}
	}

	//初始化
	this.initGrid = function(p) {
		this.gridCtrl = $("#" + this.containerId).find("table[name='gridCtrl']")[0];
		this.gridDiv = $("#" + this.containerId).find("div[name='gridDiv']")[0];

		//给jqgrid控件id赋值，jqgrid存在bug，如果其不存在id属性，那么清除数据时出错
		if ($(this.gridCtrl).attr("id") == undefined) {
			$(this.gridCtrl).attr("id", cmnPcr.getRandomValue());
		}
		
		//设置默认值
		p.shrinkToFit = p.shrinkToFit == undefined ? false : p.shrinkToFit;
		p.multiselect = p.multiselect == undefined ? false : p.multiselect;
		p.useColSpanStyle = p.useColSpanStyle == undefined ? true: p.useColSpanStyle;
		p.footerrow = p.footerrow == undefined ? false : p.footerrow;
		for ( var i = 0; i < p.viewModel.colModel.length; i++) {
			var col = p.viewModel.colModel[i];
			if (col.editoptions == undefined) {
				col.editoptions = {
					dataInit : function(elem) {
						//$(elem).focus(function(){ this.select();}) 
					},
					dataEvents : [ {
						type : "keydown",
						fn : function(e) {
							switch (e.keyCode) { 
							default:
								break;
							}
						}
					} ]
				}
				if (col.edittype == "checkbox" && col.name != "ncpRowSelect") {
					col.formatter = function(cellValue, options, rowObject) {
						if (cellValue === true || cellValue == "是") {
							return "是";
						} else if (cellValue === false || cellValue == "否") {
							return "否";
						} else {
							return "";
						}
					}
				}
			}
		}
		
		//在js模型里，初始化多选按钮
		that.initAllSelectInModel(p.viewModel.colModel);
		
		var initParam = {
			datatype : "local",
			height : p.height,
			width : p.width,
			shrinkToFit : p.shrinkToFit,
			caption : "",
			rowNum : p.onePageRowCount,
			multiselect : false,//p.multiselect,
			multiboxonly : true,
			colNames : p.colNames,
			colModel : p.viewModel.colModel,
			footerrow : p.footerrow,
			onSelectRow : function(id, status) {
				var row = that.datatable.rows(id);
				that.editRowInGrid(row);
				if (status) {
					that.afterRowSelect(id);
				}
			},
			//列宽改变时，改变一下可编辑显示域的宽度
			resizeStop : function(newWidth, index){
				//此处尚未实现，需要重新计算并改变一下显示域控件大小
			},
			onSortCol : function(colName, index, sortOrder){
				if(!that.columnLocalSort){
					var fieldModel = that.dataModel.fields[colName];
					that.orderby = [{name:fieldModel.name, direction:sortOrder}];
					if(fieldModel != null){
						that.doPage( {
							pageNumber : that.pageNumber
						});
					}
					return "stop";
				}
			}
		};

		this.setGridOtherParam(initParam);
		//构造grid控件
		$(that.gridCtrl).jqGrid(initParam);

		//多级表头
		if (p.groupHeaders != undefined) {
			$(that.gridCtrl).jqGrid("setGroupHeaders", {
				useColSpanStyle : true,
				groupHeaders : p.groupHeaders
			});
		}

		//冻结 
		for ( var i = 0; i < p.viewModel.colModel.length; i++) {
			if (p.viewModel.colModel[i].frozen) {
				$(that.gridCtrl).jqGrid("setFrozenColumns");
				$(that.gridCtrl).triggerHandler("jqGridAfterGridComplete");
				break;
			}
		}

		//自适应大小
		if (that.gridDiv != null) {
			$(window).bind("resize", function() {
				that.fulfill();				 
			});
			this.fulfill();
		}

		//是否显示多选列
		if (!p.multiselect) {
			$(that.gridCtrl).jqGrid("hideCol", "ncpRowSelect");
		} 
		
		//隐藏操作列
		if(that.hideOperateColumn){
			$(that.gridCtrl).jqGrid("hideCol", "ncpRowOperate");
		}
		
		//设置全选按钮事件
		that.initAllSelectEvent();
	}
	//在js模型里，初始化多选按钮 added by ls 20190712
	this.initAllSelectInModel = function(colModel){

		var ncpRowSelectColModel = null;
		for(var i = 0; i < colModel.length; i++){
			var tempColModel = colModel[i];
			if(tempColModel.name == "ncpRowSelect"){
				ncpRowSelectColModel = tempColModel;
				break;
			}
		}
		var allSelectContainerId = that.containerId + "_ncpRowSelectContainer";
		ncpRowSelectColModel.label = "<div id=\"" + allSelectContainerId + "\" style=\"width:100%; height:100%;\"></div>";
	}
	
	//设置全选按钮事件 added by ls 20190712
	this.initAllSelectEvent = function(){
		var allSelectContainerId = that.containerId + "_ncpRowSelectContainer";
		var allSelectCheckboxId = that.containerId + "_ncpRowSelect";
		var checkboxHtml = "<input type=\"checkbox\" id=\"" + allSelectCheckboxId + "\" style=\"height: 14px;width: 14px;margin: 0;margin-top:5px !important;\"/>";
		$("#" + allSelectContainerId).html(checkboxHtml);
 
		$("#" + allSelectCheckboxId).click(function(e){
			var checked = $(this).is(":checked");
			that.selectAllRows(checked);
			e.stopPropagation();
		});
	}

	this.hideMultiSelectColumn = function(){
		$(that.gridCtrl).jqGrid("hideCol", "ncpRowSelect");
	}

	this.hideMultiSelectColumn = function(){
		$(that.gridCtrl).jqGrid("hideCol", "ncpRowSelect");
	}

	this.setGridOtherParam = function(initParam) {

	}

	this.doAllEdit = function() {
		for ( var rowId in this.datatable.allRows()) {
			var row = this.datatable.rows(rowId);
			this.editRowInGrid(row);
		}
	}

	//如果是树形节点列、ncpRowSelect列，那么不用初始化其编辑控件
	this.isInitEditCtrl = function(cModel) {
		return !(cModel.name == "ncpRowSelect" || cModel.isSpecial == true);
	}

	this.editRowInGrid = function(row) {
		var rowId = row.rowId;
		if (that.canEditRow(rowId) && this.beforeRowEditIn(row)) {
			$(that.gridCtrl)
					.jqGrid(
							"editRow",
							rowId,
							{
								keys : false,
								oneditfunc : function(rowId) {
									that.markEditRow(rowId, true);
									var row = that.datatable.rows(rowId);
									for ( var i = 0; i < that.colModel.length; i++) {
										var cModel = that.colModel[i];
										if (that.isInitEditCtrl(cModel)) {
											var fieldModel = that.dataModel.fields[cModel.name];
											var ctrlId = rowId + "_" + cModel.name;
											//$("#" + ctrlId).width($("#" + ctrlId).parent().width());//20180905
											$("#" + ctrlId).addClass("zlpDispUnitInput");
											that.initGridDispunitCtrl($("#" + ctrlId), cModel, fieldModel, rowId);
											that.setEditValue($("#" + ctrlId), cModel, fieldModel, row);
											that.doCtrlCoreMethod($("#" + ctrlId), cModel.dispunitType, cModel.name, "setReadonly", !cModel.canEdit);

											$("#" + ctrlId).css({
												left: "0px",
												width: "100%"
											});
											/*
											1.grid方式下，无论此列是否可编辑，都初始化一个编辑控件，然后设置只读；
											2.从列表中的控件中获取字段值；
											3.查看card方式下的数据编辑保存；
											4.grid方式下点击编辑，系统自动切换到卡片方式，但是子表不能操作？？？
											 */
										} else {
											var fieldModel = that.dataModel.fields[cModel.name];
											if (fieldModel != null) {
												var ctrlId = rowId + "_"
														+ cModel.name;
												$("#" + ctrlId).attr(
														"disabled", "disabled");
												$("#" + ctrlId)
														.css(
																{
																	"border" : "0px",
																	"background-color" : "transparent"
																});
											}
										}
									}
									that.afterRowEditIn(row);
								}
							});

			$("#" + rowId).find("input").focus(function() {
				if ($(this).attr("class") != "cbox") {
					if (that.selectRowInGrid(rowId)) {
						$(this).focus();
					}
				}
			});
		}
	}

	this.selectRowInGrid = function(rowId) {
		if ($(this.gridCtrl).jqGrid("getGridParam", "selrow") != rowId) {
			return $(this.gridCtrl).jqGrid("setSelection", rowId, true);
		} else {
			return false;
		}
	}

	this.canEditRow = function(rowId) {
		return that.currentStatus == formStatusType.edit;
	}

	//从当前编辑的单元格中获取字段值
	this.setEditValue = function(ctrl, cModel, fieldModel, row) {
		//如果有对应的字段定义 modified by ls 20150721
		if(fieldModel != null) {
			if (fieldModel.maps == null) {
				this.doCtrlCoreMethod(ctrl, cModel.dispunitType, cModel.name,
						"setValue", row == null ? null : row.getValue(cModel.name));
			} else {
				var value = {};
				if (row != null) {
					for ( var viewField in fieldModel.maps) {
						var listField = fieldModel.maps[viewField];
						value[listField] = row.getValue(viewField);
					}
				}
				this.doCtrlCoreMethod(ctrl, cModel.dispunitType, cModel.name,
						"setValue", value);
			}
		}
		else{
			this.setCustomDispunitEditValue(ctrl, cModel, fieldModel, row);
		}
	}
	
	this.setCustomDispunitEditValue = function(ctrl, cModel, fieldModel, row){
		
	}

	//初始化某个录入控件
	this.initGridDispunitCtrl = function(ctrl, cModel, fieldModel, rowId) {
		var style = {};
		switch (cModel.dispunitType) {
		case "text":
		case "textarea":
		case "decimal":
		case "date":
		case "time":
		case "list":
			style = {"min-height": "24px"};
			break;
		case "checkbox":
			style = {"min-height": "18px"};
			break;
		}
		var options = {
			rowId : rowId,
			changeFunc : this.dispunitValueChange,
			enterPressFunc : this.dispunitEnterPress
		};
		this.createDispunit(cModel.name, cModel.dispunitType, ctrl, fieldModel, options, style);		
	}
	
	//回车后，定位到下一行(shift按下是为上一行)的此字段
	this.dispunitEnterPress = function(jq, shiftKey, rowId){
		var toRowId = shiftKey ?  that.datatable.getPreviousRowId(rowId) :  that.datatable.getNextRowId(rowId);
		if(toRowId != null){		
			var fieldName = $(jq).attr("fieldName");
			that.focusCell(toRowId, fieldName)
		}
	}
	
	this.dispunitValueChange = function(jq, newValue, rowId) {
		var fieldName = $(jq).attr("fieldName");
		var fieldModel = that.dataModel.fields[fieldName];
		if (fieldModel.maps != null) {
			for ( var desFieldName in fieldModel.maps) {
				if (desFieldName != fieldName) {
					var cSameGroupFieldModel = that.getCModel(desFieldName);
					var cellValue = newValue[fieldModel.maps[desFieldName]];
					var ctrl = $("#" + rowId + "_" + desFieldName);
					that.doCtrlCoreMethod(ctrl,
							cSameGroupFieldModel.dispunitType,
							cSameGroupFieldModel.name, "setValue", cellValue);
				}
			}
		}
		that.valueChange(jq, rowId, newValue);
		
		//增加了处理合计字段事件  modified by ls 20190723
		if(fieldModel.isSum){
			var sumValue = that.getSumValue(fieldName);
			var param = {
				values:[{
					field: fieldName,
					value: sumValue
				}]
			}
			that.afterSumChange(param);
		}
	}

	//获取合计字段的合计值  modified by ls 20190723
	this.getSumValue = function(fieldName){
		var tableGridCtrl = $("#" + that.containerId).find("table[name=gridCtrl]")[0];
		var tableId = $(tableGridCtrl).attr("id");
		var sumValue = 0;
		for(var rowId in that.datatable.allRows()){
			var tempText = 0;
			var inputCtrls = $("#" + rowId + "_" + fieldName);
			if(inputCtrls.length != 0){
				tempText = $(inputCtrls[0]).val();
			}
			else{
				var tempText = $(tableGridCtrl).find("tr[id=" + rowId + "]").find("td[aria-describedby=" + tableId + "_" + fieldName + "]").text();

			} 
			if(tempText.length != 0){
				var tempValue = parseFloat(tempText);
				sumValue += (tempValue == null ? 0 : tempValue); 
			}
		}
		return sumValue;
	}
	
	//重新计算所有合计字段值
	this.reCalcAllSumValues = function(){
		var sumValues = new Array();
		for(var fieldName in that.dataModel.fields){
			var fieldModel = that.dataModel.fields[fieldName];
			if(fieldModel.isSum){
				var sumValue = that.getSumValue(fieldName, null, null);
				sumValues.push({
					field: fieldName,
					value: sumValue
				});
			}
		}
		that.afterSumChange({
			values: sumValues
		});
	}

	//合计字段值改变事件  modified by ls 20190723
	this.afterSumChange = function(param) {
		//param.values = [{field: field_1, value: value_2}];
		return this.doExternalFunctionContinue("afterSumChange", param);
	}

	//显示域值改变时调用此函数，(用于扩展)
	this.valueChange = function(jq, rowId, newValue) {
		//alert($(jq).attr("id") + " " + $(jq).attr("fieldName") + " " + newValue);
	}

	this.getWinBtnStatus = function() {
		return gridWinBtnStatus;
	}

	//给控制按钮们绑定事件
	this.regOperateCtrl = function(ctrlType, operateType, ctrlName, eventName, func) {
		var toolbarContainer = $("#" + this.containerId + " .zlpToolbarContainer")[0];
		var ctrls = $(toolbarContainer).find(ctrlType + "[name='" + ctrlName + "']");
		if (ctrls.length > 0) {
			var ctrl = ctrls[0];
			this.allToolbarCtrls.set(operateType, ctrl);
			if (eventName != undefined) {
				$(ctrl).bind(eventName, func);
			}
		}
	}

	this.showColumn = function(colNames) {
		if (typeof (colNames) == "string")
			$(this.gridCtrl).jqGrid('showCol', [ colNames ]);
		else
			$(this.gridCtrl).jqGrid('showCol', colNames);
	}

	this.hideColumn = function(colNames) {
		if (typeof (colNames) == "string")
			$(this.gridCtrl).jqGrid('hideCol', [ colNames ]);
		else
			$(this.gridCtrl).jqGrid('hideCol', colNames);
	}

	this.setGridCell = function(rowId, colname, data) {
		$(this.gridCtrl).jqGrid("setCell", rowId, colname, data);
	}

	this.setCurrentRowCell = function(colname, data) {
		var rowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
		if (rowId != undefined) {
			$(this.gridCtrl).jqGrid("setCell", rowId, colname, data);
		}
	}

	//进入Grid编辑状态之前
	this.beforeRowEditIn = function(row) {
		return this.doExternalFunctionContinue("beforeRowEditIn", row);
	}

	//进入Grid编辑状态之后
	this.afterRowEditIn = function(row) {
		return this.doExternalFunction("afterRowEditIn", row);
	}

	//选中单元格
	this.focusCell = function(rowId, fieldName){
		$(this.gridCtrl).jqGrid("setSelection", rowId, true);
		var ctrlId = rowId + "_" + fieldName; 
		$("#" + ctrlId).focus();
		$("#" + ctrlId).select(); 
	}

	//注册其他控件操作方法
	this.regOtherOperateCtrls = function(){
		this.regOperateCtrl("a", "complexQuery", "complexQueryBtn", "click", function() {
			if (that.getWinBtnStatus()["complexQuery"][that.currentStatus]) {
				that.complexQuery();
			}
		});
		
		var searchBtnCtrl = $("#" + this.containerId + " .zlpToolbarQueryBtn");
		if(searchBtnCtrl.length != 0){
			$(searchBtnCtrl[0]).click(function(){
				that.where = null;
			    that.doPage({ pageNumber : 1 });
			    return false;
			});
		}
		
		var searchInputCtrl = $("#" + this.containerId + " .zlpToolbarQueryInputText");
		if(searchInputCtrl.length != 0){
			$(searchInputCtrl[0]).keydown(function(event){
				if (event.keyCode == 13) {
					that.where = null;
				    that.doPage({ pageNumber : 1 });
				}
			});
		}
	}
	
	//高级查询
	this.complexQueryControl = null;
	this.serverConditionStr = null;
	this.complexQuery = function(){	
		if(that.complexQueryControl == null){
			that.complexQueryControl =  that.initComplexQueryControl();
		}
		else{
			that.complexQueryControl.show();
		}
	}
	
	this.initComplexQueryControl =function(){
		var popContainer = new PopupContainer( {
			width : 600,
			height : 400,
			top : 50,
			title: "高级查询",
			canClose: false
		});
		popContainer.show(); 
		var winId = cmnPcr.getRandomValue(); 
		var innerContainerId = winId + "_inner";
		var buttonContainerId = winId + "_buttonContainer";
		var okBtnId = winId + "_ok";
		var clearQueryBtnId = winId + "_clearQuery";
		var cancelBtnId = winId + "_cancel";

		var innerHtml = "<div id=\"" + innerContainerId + "\" class=\"popInnerContainer\" style=\"position:absolute;left:0px;right:0px;top:0px;bottom:40px;font-size:14px;text-align:center;overflow:auto;border-bottom:#dddddd 1px solid;\"></div>"
	 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;right:0px;bottom:0px;width:250px;height:40px;font-size:14px;text-align:right;line-height:30px;\">" 
	 	+ "<a id=\"" + okBtnId +"\" href=\"#\" class=\"zlpToolbarBtn okBtn\" style=\"cursor:pointer;margin-top:5px;\" >查询</a>" 
	 	+ "<a id=\"" + clearQueryBtnId +"\" href=\"#\" class=\"zlpToolbarBtn clearBtn\" style=\"cursor:pointer;margin-top:5px;\" >全部数据</a>" 
	 	+ "<a id=\"" + cancelBtnId +"\" href=\"#\" class=\"zlpToolbarBtn cancelBtn\" style=\"cursor:pointer;margin-top:5px;\" >取消</a></div>";
		$("#" + popContainer.containerId).html(innerHtml); 		 
		
		//获取可检索的字段列表
		var getQueryFieldList = function(){
			var fieldArray = new Array();
			
			var colCount = that.colModel.length;
			for(var i=0;i<colCount;i++){
			   var col = that.colModel[i];
			   var fieldModel = that.dataModel.fields[col.name];
			   if(fieldModel != null){
				   var canSearch = col.search;
				   if(canSearch){
					   var label = col.label == "" ? col.name : col.label; 
					   var dispunitType = col.dispunitType;  
					   fieldArray.push({
						   fieldModel:fieldModel, 
						   label:label,
						   dispunitType:dispunitType
					   });
				   }
			   }
			}
			return fieldArray;			
		}
		
		//连接控件
		var initJoinTypeControl = function(ap) {
			var containerId = ap.containerId;
			var defaultJoinType = ap.joinType;
			var joinCtrlId =  ap.trId + "_join";
			var typeHtml = "<input id=\"" + joinCtrlId + "\" class=\"zlpDispUnitInput\" style=\"width:100%;height:28px;\" />";
			$("#" + containerId).append(typeHtml);	
			var rows = [{code:"and", name:"而且"}, {code:"or", name:"或者"}];
			var defaultRow = null;
			for(var i=0;i<rows.length;i++){
				var row = rows[i];
				if(row.code == defaultJoinType){
					defaultRow = row;
					break;
				}
			}

			$("#" + joinCtrlId).listDispunit({
				idField:"code",
				textField:"name",
				onlySelect:true,
				columns:[[{field:"code", valueType:valueType.string, title:"code", width:0, hidden:true},
				         {field:"name", valueType:valueType.string, title:"连接", width:40, hidden:false}]],
				getListFunc:function(p){
					$("#" + joinCtrlId).listDispunit("showList", rows);
				},
				options:{},
				style:{}
			});
			$("#" + joinCtrlId).listDispunit("setValue", (defaultRow == null ? rows[0] : defaultRow));
			$("#" + joinCtrlId).parent().parent().css({
				"border-right-width": "0px"
			});
		}
		
		//删除控件
		var initRemoveControl = function(rp) {
			var containerId = rp.containerId;
			var removeCtrlId =  cmnPcr.getRandomValue();
			var removeImgUrl = baseImages + "/common/remove.png"; 
			var removeHtml = "<div id=\"" + removeCtrlId + "\" style=\"width:16px;height:24px;background-image:url(" + removeImgUrl + ");background-repeat:no-repeat;background-position:center;display:none;\"></div>";
			$("#" + containerId).append(removeHtml); 
			$("#" + rp.trId).mouseover(function(){
				$("#" + removeCtrlId).css("display", "block");
			});
			$("#" + rp.trId).mouseout(function(){
				$("#" + removeCtrlId).css("display", "none");
			});

			$("#" + removeCtrlId).click(function(){
				var table = $("#" + rp.trId).parent();		
				if($(table).find(".complexQueryConditionTr").length == 1){
					msgBox.alert({info: "至少保留一个查询条件"});
				}
				else{
					$("#" + rp.trId).remove();
					var firstTr = $(table).children()[0];
					var firstTrJoinContainerId = $(firstTr).attr("id") + "_joinContainer";
					$("#" + firstTrJoinContainerId).html("查询条件:");
				}
			});
		}
		
		//值录入控件
		var initValueControl =  function(vp){
			var valueCtrlId = vp.trId + "_value";
			var currentValueType = $("#" + valueCtrlId).attr("valueType");
			var currentOperatorType = $("#" + valueCtrlId).attr("operatorType");
			var currentDispunitType = $("#" + valueCtrlId).attr("dispunitType");
			if(vp.operatorRow.code == "is null" || vp.operatorRow.code == "is not null"){
				$("#" + vp.containerId).empty();
			}
			else{  
				var fieldModel = that.dataModel.fields[vp.fieldModelRow.name];
				var newDispunitType = vp.fieldModelRow.dispunitType;
				var newValueType = fieldModel.valueType;
				if(vp.operatorRow.code == "like" && newValueType == valueType.string){
					//如果是字符串类型，那么为文本输入值
					newDispunitType = "text";
				}	
				
				if(currentDispunitType != newDispunitType || newDispunitType == "pop" || newDispunitType == "list" ){
					//需要重新构造值录入控件
					var inputType = newDispunitType == "checkbox" ? "checkbox" : "text";
					var valueHtml = "<input type=\"" + inputType + "\" isField=\"true\" trId=\"" + vp.trId + "\" class=\"zlpDispUnitInput\" id=\"" + valueCtrlId + "\" style=\"width:100%;height:28px;\" />";
					$("#" + vp.containerId).html(valueHtml);
					$("#" + valueCtrlId).attr("fieldName", fieldModel.name);
					var options = {fieldName : fieldModel.name};
					var style = {};
					switch (newDispunitType) {
						case "text": 
						case "textarea": 
							$("#" + valueCtrlId).textDispunit( {
								options : options,
								style : style
							});
							break;
						case "decimal":
							$("#" + valueCtrlId).decimalDispunit( {
								groupSeparator : (fieldModel.isComma ? "," : ""),
								precision : fieldModel.decimalNum,
								options : options,
								style : style
							});
							break;
						case "date":
							$("#" + valueCtrlId).dateDispunit( {
								options : options,
								style : style
							});
							break;
						case "time":
							$("#" + valueCtrlId).timeDispunit( {
								options : options,
								style : style
							});
							break;
						case "checkbox":
							//param包含，以后扩展是否允许三态
							$("#" + valueCtrlId).checkboxDispunit( {
								options : options,
								style : style
							});
							break;
						case "list":
							//param包含container、idField、textField、columns、getListFunc、changeFunc、options(扩展属性,在NcpView中，包含了rowId)
							$("#" + valueCtrlId).listDispunit({
								idField : fieldModel.foreignKeyName == "" ? null
										: fieldModel.maps[fieldModel.foreignKeyName],
								textField : fieldModel.maps[fieldModel.name],
								columns : [ fieldModel.list.columns ],
								getListFunc : function(p) {
									var fieldModel = that.dataModel.fields[p.options.fieldName];
									//{value:value, options:param.options, showList:function(data)
									var param = {
										listName : fieldModel.list.name,
										fieldName : fieldModel.name,
										dataModel : that.dataModel,
										fieldModel : fieldModel
									};
									var requestParam = {
										serviceName : this.serviceName,
										waitingBarParentId : null,
										funcName : "getList",
										successFunc : function(obj) {
											var rows = that.getListRowsFromBackInfo(obj.result.table.rows, param.fieldModel.list.columns);

											$("#" + valueCtrlId).listDispunit("showList", rows);
										},
										args : {
											requestParam : cmnPcr.jsonToStr( {
												dataName : that.dataModel.name,
												listName : param.listName,
												where : param.where == undefined ? [] : param.where,
												orderby : param.orderby == undefined ? [] : param.orderby,
												//数据权限过滤
												previousField : param.fieldModel.name,
												previousData : that.dataModel.name,
												popDataField : param.fieldModel.maps[param.fieldModel.name],
												otherRequestParam:param.otherRequestParam
											})
										}
									};
									that.ProcessServerAccess(requestParam);
								},
								options : options,
								style : style
							});
							break;
						case "pop":
							$("#" + valueCtrlId).popDispunit({
								idField : fieldModel.foreignKeyName == "" ? null
										: fieldModel.maps[fieldModel.foreignKeyName],
								textField : fieldModel.maps[fieldModel.name],
								showPopFunc : function(p) {
									var fieldModel = that.dataModel.fields[p.options.fieldName];
									var param = {
										viewName : fieldModel.view.name,
										value : p.value,
										rowId : p.options.rowId,//card方式下此属性无用，grid方式下有用，用来确定是哪一行的
										fieldName : fieldModel.name,
										fieldModel : fieldModel,
										dataModel : that.dataModel,
										changeValueFunc : p.changeValueFunc
									};

									var popContainer = new PopupContainer( {
										width : 600,
										height : 500,
										top : 50
									});
									popContainer.show();
									var initParam = {
										closeWin : function(p) {
											var selectedRows = null;
											if (p.selectedRows != undefined) { 
												selectedRows = {};
												for(var rowId in p.selectedRows) {
													var row = {};
													var selectedRow = p.selectedRows[rowId];
													for ( var destFieldName in param.fieldModel.maps) {
														var sourceFieldName = param.fieldModel.maps[destFieldName];
														row[sourceFieldName] = selectedRow[sourceFieldName];
													}
													selectedRows = row; 
													break;
												}
											}

											popContainer.close();
											if(selectedRows != undefined){
												p.changeValueFunc(selectedRows);
											}
										}, 						
										//数据权限过滤
										previousField : param.fieldModel.name,
										previousData : param.dataModel.name,
										popDataField : param.fieldModel.maps[param.fieldModel.name],
										showField : param.fieldModel.maps[param.fieldModel.name]
									};
									window.popInitParam = initParam;

									//var popNames = param.fieldModel.inputHelpName.split(".");
									var popPageUrl =basePath + "/" + param.fieldModel.inputHelpName; //"../pop/" + popNames[0] + "_" + popNames[1] + ".jsp";

									var frameId = cmnPcr.getRandomValue();
									var iFrameHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
									$("#" + popContainer.containerId).html(iFrameHtml);
									$("#" + frameId).attr("src", popPageUrl);
								},
								options : options,
								style : style
							}); 
							break;
					}
					$("#" + valueCtrlId).css({
						left: "0px",
						width: "100%"
					});
					$("#" + valueCtrlId).parent().css({
						"border-left-width": "0px"
					});
				}
			}
		}
		
		//一个过滤条件
		var initConditionControl = function(cp){
			var allQueryFields = getQueryFieldList();
			var serverCondition = cp.serverCondition;
			if(allQueryFields.length == 0){
				cmnPcr.alert({info:"没有可以查询的字段"});
			}
			else{
				var nextTrId = cp.nextTrId;
				var hasJoinCtrl = $("#" + cp.nextTrId).prev().length != 0;
				var cId = cmnPcr.getRandomValue();
				var cJoinContainerId = cId + "_joinContainer";
				var cFieldContainerId = cId + "_fieldContainer";
				var cOperatorContainerId = cId + "_operatorContainer";
				var cValueContainerId = cId + "_valueContainer";
				var cRemoveContainerId = cId + "_removeContainer";
				var cHtml = "<tr style=\"height:5px;display:block;\"><td style=\"display:none;\">&nbsp;</td><td style=\"display:none;\">&nbsp;</td><td style=\"display:none;\">&nbsp;</td><td style=\"display:none;\">&nbsp;</td></td>"
				+ "<tr isCondition=\"true\" id=\"" + cId + "\" class=\"complexQueryConditionTr\" style=\"height:28px;\">"  
				+ "<td id=\"" + cJoinContainerId + "\" style=\"width:40px;\"></td>"
				+ "<td id=\"" + cFieldContainerId + "\" style=\"width:100px;\"></td>"
				+ "<td id=\"" + cOperatorContainerId + "\" style=\"width:50px;\"></td>"
				+ "<td id=\"" + cValueContainerId + "\"></td>"
				+ "<td id=\"" + cRemoveContainerId + "\" style=\"width:24px;cursor:pointer;\"></td>"
				+ "</tr>";
				
				$("#" + nextTrId).before(cHtml); 
				if(hasJoinCtrl){
					initJoinTypeControl({
						containerId:cJoinContainerId,
						trId:cId,
						joinType:(serverCondition == null ? "and" : serverCondition.joinType)
					});
				}
				else{

					$("#" + cJoinContainerId).html("查询条件:");
				}
				
				initRemoveControl({
					containerId:cRemoveContainerId, 
					trId:cId
				});
	
				 
				//字段列表
				var cFieldId =  cId + "_field";
				var fieldHtml = "<input isField=\"true\" trId=\"" + cId + "\" class=\"zlpDispUnitInput\" id=\"" + cFieldId + "\" style=\"width:100%;height:28px;\" />";
				$("#" + cFieldContainerId).append(fieldHtml);	
				var fieldRows = new Array();
				var defaultFieldRow = null;
				for(var i=0;i<allQueryFields.length;i++){
					var field = allQueryFields[i];
					var fieldRow = {name:field.fieldModel.name, label:field.label, valueType:field.fieldModel.valueType, dispunitType:field.dispunitType};
					fieldRows.push(fieldRow);
					if(serverCondition != null && fieldRow.name == serverCondition.fieldName){
						defaultFieldRow = fieldRow;
					}
				}
	
				$("#" + cFieldId).listDispunit({
					idField:"name",
					textField:"label",
					onlySelect:true,
					columns:[[{field:"name", valueType:valueType.string, title:"name", width:0, hidden:true},
						         {field:"label", valueType:valueType.string, title:"字段", width:120, hidden:false},
						         {field:"valueType", valueType:valueType.string, title:"valueType", width:0, hidden:true},
						         {field:"dispunitType", valueType:valueType.string, title:"dispunitType", width:0, hidden:true}]],
					getListFunc:function(p){ 
						$("#" + cFieldId).listDispunit("showList", fieldRows);
					},
					options:{trId:cId,
						changeFunc:function(jq, listRow, parentRowId){
							var operatorCtrlId = cId + "_operator";
							var fieldCtrlId = cId + "_field";
							var valueCtrlId = cId + "_value";
							var operatorRow = $("#" + operatorCtrlId).listDispunit("getValue");
							initValueControl({
								trId:cId, 
								containerId:cValueContainerId,
								operatorRow: operatorRow, 
								fieldModelRow: listRow
							});							
						}},
					style:{}
				});
	 
				//操作符
				var cOperatorId =  cId + "_operator";
				var operatorHtml = "<input isOperator=\"true\" trId=\"" + cId + "\" class=\"zlpDispUnitInput\" id=\"" + cOperatorId + "\" style=\"width:100%;height:28px;\" />";
				$("#" + cOperatorContainerId).append(operatorHtml);

				var operatorRows = [{code:"=", name:"="},
				            {code:"<>", name:"<>"},
				            {code:">", name:">"},
				            {code:">=", name:">="},
				            {code:"<", name:"<"},
				            {code:"<=", name:"<="},
				            {code:"like", name:"匹配"},
				            {code:"is null", name:"为空"},
				            {code:"is not null", name:"不为空"}]; 
				var defaultOperatorRow = null;
				if(serverCondition != null){
					var operatorCount = operatorRows.length;
					for(var i=0;i<operatorCount;i++){
						var operatorRow = operatorRows[i];
						if(serverCondition.operatorType == operatorRow.code){
							defaultOperatorRow = operatorRow;
							break;
						}
					}
				}
				
				$("#" + cOperatorId).listDispunit({
					idField:"code",
					textField:"name",
					onlySelect:true,
					columns:[[{field:"code", valueType:valueType.string, title:"code", width:0, hidden:true},
					         {field:"name", valueType:valueType.string, title:"操作符", width:70, hidden:false}]],
					getListFunc:function(p){
						//字段类型不同，支持的操作符不同，此处应该细化 
						var fieldCtrlId = p.options.trId + "_field";
						var operatorCtrlId = p.options.trId + "_operator";
						var currentField = $("#" + fieldCtrlId).listDispunit("getValue");
						$("#" + operatorCtrlId).listDispunit("showList", operatorRows);
					},
					options:{trId:cId,
						changeFunc:function(jq, listRow, parentRowId){
							var operatorCtrlId = cId + "_operator";
							var fieldCtrlId = cId + "_field";
							var valueCtrlId = cId + "_value";
							var fieldModelRow = $("#" + fieldCtrlId).listDispunit("getValue");
							initValueControl({
								trId:cId, 
								containerId:cValueContainerId, 
								operatorRow: listRow, 
								fieldModelRow: fieldModelRow
							});							
						}},
					style:{}
				});
				$("#" + cOperatorId).parent().parent().css({
					"border-left-width": "0px"
				});
				
				//初始化值
				defaultFieldRow = defaultFieldRow == null ? fieldRows[0] : defaultFieldRow;
				defaultOperatorRow = defaultOperatorRow == null ? operatorRows[0] : defaultOperatorRow;
				$("#" + cFieldId).listDispunit("setValue", defaultFieldRow);
				$("#" + cOperatorId).listDispunit("setValue", defaultOperatorRow);				 
				initValueControl({
					trId:cId, 
					containerId:cValueContainerId, 
					operatorRow:defaultOperatorRow, 
					fieldModelRow: defaultFieldRow
				});
			}
		}

		var initAddControl = function(ap){
			var containerId = ap.containerId;
			var addItemBtnId =  cmnPcr.getRandomValue();
			var addGroupBtnId =  cmnPcr.getRandomValue();
			var addItemImgUrl = baseImages + "/common/addItem.png"; 
			var addGroupImgUrl = baseImages + "/common/addGroup.png"; 
			var addHtml = "<div isAddGroup=\"true\" title=\"添加查询分组\" id=\"" + addGroupBtnId + "\" style=\"float:left;cursor:pointer;width:24px;height:24px;background-image:url(" + addGroupImgUrl + ");background-repeat:no-repeat;background-position:center;\"></div>"
				+ "<div isAddItem=\"true\" title=\"添加查询条件\" id=\"" + addItemBtnId + "\" style=\"float:left;cursor:pointer;width:24px;height:24px;background-image:url(" + addItemImgUrl + ");background-repeat:no-repeat;background-position:center;\"></div>";
			$("#" + containerId).append(addHtml);
			
			$("#" + addItemBtnId).click(function(){
				//增加查询条件
				var groupAddTrId = $("#" + addItemBtnId).parent().parent().attr("id");
				initConditionControl({
					nextTrId:groupAddTrId
				});
			});
			
			$("#" + addGroupBtnId).click(function(){
				//增加分组条件 
				var groupAddTrId = $("#" + addGroupBtnId).parent().parent().attr("id");
				initSubGroupControl({
					nextTrId:groupAddTrId
				});
			});
		}
		
		//主分组控件
		var initSubGroupControl = function(sgp){
			var allQueryFields = getQueryFieldList();
			var serverCondition = sgp.serverCondition;
			if(allQueryFields.length == 0){
				cmnPcr.alert({info:"没有可以查询的字段"});
			}
			else{
				var nextTrId = sgp.nextTrId;
				var hasJoinCtrl = $("#" + sgp.nextTrId).prev().length != 0 || serverCondition != null;
				var cId = cmnPcr.getRandomValue();
				var cJoinContainerId = cId + "_joinContainer"; 
				var cGroupContainerId = cId + "_subGroupContainer";
				var cRemoveContainerId = cId + "_removeContainer";
				var cHtml = "<tr style=\"height:5px;display:block;\"><td style=\"display:none;\">&nbsp;</td><td style=\"display:none;\">&nbsp;</td><td style=\"display:none;\">&nbsp;</td><td style=\"display:none;\">&nbsp;</td></td>"
				+ "<tr isSubGroup=\"true\" id=\"" + cId + "\" class=\"complexQueryConditionTr\" style=\"height:28px;\">"  
				+ "<td id=\"" + cJoinContainerId + "\" style=\"width:40px;\"></td>"
				+ "<td colspan=\"3\" id=\"" + cGroupContainerId + "\" style=\"width:100px;border:solid 1px #DDDDDD;\"></td>"
				+ "<td id=\"" + cRemoveContainerId + "\" style=\"width:16px;cursor:pointer;\"></td>"
				+ "</tr>";
				
				$("#" + nextTrId).before(cHtml); 
				if(hasJoinCtrl){
					initJoinTypeControl({
						containerId:cJoinContainerId, 
						trId:cId, 
						joinType:(serverCondition == null ? "and" : serverCondition.joinType)
					});
				}
				
				initRemoveControl({
					containerId:cRemoveContainerId, 
					trId:cId
				});

				initGroupControl({
					containerId:cGroupContainerId,
					serverConditions:(serverCondition == null ? null : serverCondition.subConditions)
				});
			}
		}
		
		//主分组控件
		var initGroupControl = function(gp){
			var containerId = gp.containerId; 
			var serverConditions = gp.serverConditions;
			var groupId = cmnPcr.getRandomValue(); 
			var groupAddTrId = groupId + "_addTr";
			var groupAddTdId = groupId + "_addTd";
			var groupHtml = "<table isGroup=\"true\" id=\"" + groupId + "\" style=\"width:100%;\"><tr id=\"" + groupAddTrId + "\">"  
			+ "<td id=\"" + groupAddTdId + "\" style=\"width:60px;\">&nbsp;</td>"
			+ "<td colspan=\"3\"></td>"
			+ "<td style=\"width:16px;\">&nbsp;</td>"
			+ "</tr></table>";
			
			$("#" + containerId).append(groupHtml);
 
			initAddControl({containerId:groupAddTdId});
			if(serverConditions != null){
				var scCount = serverConditions.length;
				for(var i=0;i<scCount;i++){
					var serverCondition = serverConditions[i];
					if(serverCondition.isSubGroup){
						initSubGroupControl({
							nextTrId:groupAddTrId,
							serverCondition:serverCondition
						}); 
					}
					else{
						initConditionControl({
							nextTrId:groupAddTrId, 
							serverCondition:serverCondition
						});
					}
				}
			}
			else{
				initConditionControl({
					nextTrId:groupAddTrId
				});
			}
		}
		
		var getAllConditions = function(groupContainerId){
			var allTrs = $("#" + groupContainerId).children("table[isGroup='true']").children("tbody").children("tr");
			var conditions = new Array();
			for(var i=0;i<allTrs.length;i++){
				var tr = allTrs[i];
				var trId = $(tr).attr("id");
				var joinId = trId + "_join"; 
				var isCondition = $(tr).attr("isCondition") == "true";
				if(isCondition){
					var joinRow = $("#" + joinId).length == 0 ? null : $("#" + joinId).listDispunit("getValue");
					var joinType = joinRow == null ? null : joinRow.code;
					
					var fieldId = trId + "_field";
					var fieldRow = $("#" + fieldId).listDispunit("getValue");
					var fieldName = fieldRow.name;
					
					var operatorId = trId + "_operator";
					var operatorRow = $("#" + operatorId).listDispunit("getValue");
					var operatorType = operatorRow.code;
					
					var valueId = trId + "_value";
					var value= null;
					var dispunitType = $("#" + valueId).attr("dispunitType");
					switch(dispunitType){
						case "text":
							value = $("#" + valueId).textDispunit("getValue");
							break;
						case "time":
							value = $("#" + valueId).timeDispunit("getValue");
						break;
						case "date":
							value = $("#" + valueId).dateDispunit("getValue");
							break;
						case "decimal":
							value = $("#" + valueId).decimalDispunit("getValue");
							break;
						case "checkbox":
							value = $("#" + valueId).checkboxDispunit("getValue");
							break;
						case "list":
							var fieldName = $("#" + valueId).attr("idField");
							var row = $("#" + valueId).listDispunit("getValue");
							value = row == null ? null : row[fieldName];
							break;
						case "pop":
							var fieldName = $("#" + valueId).attr("idField");
							var row = $("#" + valueId).popDispunit("getValue");
							value = row == null ? null : row[fieldName];
							break;
					}					
					
					conditions.push({
						joinType:joinType,
						fieldName:fieldName,
						operatorType:operatorType,
						value:value,
						isSubGroup:false
					});	
				}
				else{
					var isSubGroup = $(tr).attr("isSubGroup") == "true";	
					if(isSubGroup){
						var joinRow = $("#" + joinId).length == 0 ? null : $("#" + joinId).listDispunit("getValue");
						var joinType = joinRow == null ? null : joinRow.code;
						
						var subGroupContainerId = trId + "_subGroupContainer";
						//var subGroup = $("#" + subGroupContainerId).children("table")[0];
						//var subGroupId = $(subGroup).attr("id");
						var subConditions = getAllConditions(subGroupContainerId);
						conditions.push({
							joinType:joinType,
							subConditions:subConditions,
							isSubGroup:true
							});
					}
				}
			}
			return conditions;
		}
		
		var convertToWhereClause = function(conditions){
			var cCount = conditions.length;
			for(var i=0;i<cCount;i++){
				var condition = conditions[i];
				var previousCondition = i == 0 ? null: conditions[i - 1];
				var nextCondition = i == cCount - 1 ? null: conditions[i + 1];
				if(condition.joinType == "and" || (nextCondition != null &&nextCondition.joinType == "and")){
					condition.level = 1;
				}
				else{
					condition.level = 0;
				}
			}

			var orConditions = {parttype:"or",value:[]};
			var tempAndConditions = null;
			for(var i=0;i<cCount;i++){
				var condition = conditions[i];
				if(condition.level == 0){ 
					if(tempAndConditions != null){
						orConditions.value.push(tempAndConditions);
						tempAndConditions = null;
					}
					if(condition.isSubGroup){
						var childWhereClause = convertToWhereClause(condition.subConditions);
						orConditions.value.push(childWhereClause);
					}
					else{
						orConditions.value.push({
							parttype:"field",
							field:condition.fieldName,
							operator:condition.operatorType,
							value:condition.value
						});
					}
				}
				else{
					if(tempAndConditions == null){
						tempAndConditions = {parttype:"and",value:[]};
					}
					if(condition.isSubGroup){
						var childWhereClause = convertToWhereClause(condition.subConditions);
						tempAndConditions.value.push(childWhereClause);
					}
					else{
						tempAndConditions.value.push({
							parttype:"field",
							field:condition.fieldName,
							operator:condition.operatorType,
							value:condition.value
						});
					}
				}
			}
			if(tempAndConditions != null){
				orConditions.value.push(tempAndConditions);
				tempAndConditions = null;
			}
			return orConditions;
		}
		
		var convertConditionToServerObjects = function(conditions){
			var serverObjects =null;
			var cCount = conditions.length;
			if(cCount > 0){
				serverObjects = new Array();
				for(var i=0;i<conditions.length;i++){
					var condition = conditions[i];
					if(condition.isSubGroup){
						var serverObj = {
							joinType:condition.joinType,
							subConditions:convertConditionToServerObjects(condition.subConditions),
							isSubGroup:true
						}
						serverObjects.push(serverObj);
					}
					else{
						serverObjects.push({
							joinType:condition.joinType,
							fieldName: encodeURIComponent(condition.fieldName),
							operatorType:condition.operatorType, 
							isSubGroup:false
						});	
					}
				}
			}
			return serverObjects;
		}
		
		var saveConditionToServer = function(conditions){
			var serverObjects = convertConditionToServerObjects(conditions);
			var conditionStr = cmnPcr.jsonToStr(serverObjects);
			if(that.serverConditionStr != conditionStr){
				var requestParam = {
					serviceName : "viewGridNcpService",
					waitingBarParentId : that.containerId,
					funcName : "saveComplexQuery",
					successFunc : function(obj) {
						that.serverConditionStr = conditionStr;
					},
					args : {
						requestParam : cmnPcr
								.jsonToStr( {
									modelName : that.viewModel.name,
									featureName : "ViewGridComplexQuery",
									content:encodeURIComponent(conditionStr),
									description : ""
								})
					}
				};
				that.ProcessServerAccess(requestParam);
			}
		}
		
		var initAfterGetServerConditions = function(p){
			var requestParam = {
				serviceName : "viewGridNcpService",
				waitingBarParentId : that.containerId,
				funcName : "getComplexQuery",
				successFunc : function(obj) { 
					var serverConditionStr = decodeURIComponent(obj.result.complexQueryContent);
					var serverConditions = cmnPcr.strToJson(serverConditionStr);
					that.serverConditionStr = serverConditionStr;
					initGroupControl({
						containerId:p.innerContainerId,
						serverConditions:serverConditions
						});
				},
				args : {
					requestParam : cmnPcr
							.jsonToStr( {
								modelName : that.viewModel.name,
								featureName : "ViewGridComplexQuery",
								otherRequestParam:p.otherRequestParam
							})
				}
			};
			that.ProcessServerAccess(requestParam);
		}
		
		//不再从服务器加载
		//initAfterGetServerConditions({innerContainerId:innerContainerId});
		initGroupControl({
			containerId: innerContainerId,
			serverConditions: null
			});
		
		$("#" + okBtnId).click(function(){
			
			//构造查询条件
			var conditions = getAllConditions(innerContainerId);
			
			//调用ViewGridService服务，将condition保存在服务器端
			saveConditionToServer(conditions);

			//转换成服务器端可识别的查询条件
			var whereClause = convertToWhereClause(conditions);
			
			//关闭查询条件窗口
			popContainer.hide(); 
			
			//刷新界面
			that.where = whereClause.value.length == 0 ? [] : [whereClause]; 
			$("#" + that.containerId + " .zlpToolbarQueryInputText").val("");
	        that.doPage({ pageNumber : 1 });
	        return false;
		});
		
		$("#" + cancelBtnId).click(function(){ 
			popContainer.hide(); 
	        return false;
		});
		
		$("#" + clearQueryBtnId).click(function(){ 
			popContainer.hide(); 
			that.where = null;
	        that.doPage({ pageNumber : 1 });
	        return false;
		});
		
		return popContainer;
	}

	//显示
	this.show = function() {

		//为控件绑定功能，并使控件受状态控制
		that.regOperateCtrls();

		//设置控件状态
		that.setCtrlStatus(formStatusType.browse);

		//初始化grid
		that.initGrid(p);
		
		//显示可选的每页条数
		that.initPageRowCountList();

		//加载第一页数据
		if (that.isShowData) {
			that.doPage( {
				pageNumber : 1
			});
		} else {
			that.setCtrlStatus(formStatusType.browse);
		}
		
		//更新布局 added by ls 20230517
		that.updateLayout();
	}
	
	//更新布局 added ls 20230517
	this.updateLayout = function(){
		var toolbarHeight = $("#" + that.containerId).find(".zlpToolbarLeftContainer").height();
		$("#" + that.containerId).find(".zlpGridContainer").css({top: toolbarHeight + "px"});
	}
	
	//初始化每页显示的条数下拉 added by ls 20210914
	this.initPageRowCountList = function(){
		var pageRowCountSelectCtrls = $("#" + that.containerId).find(".zlpNavPageRowCountSelect");
		if(pageRowCountSelectCtrls.length > 0){
			var pageRowCountSelectCtrl = pageRowCountSelectCtrls[0];
			var allOptionHtml = "";
			for(var i = 0; i < that.pageRowCountList.length; i++){
				var pageRowCount = that.pageRowCountList[i];
				allOptionHtml += ("<option value=\"" + pageRowCount + "\">" + pageRowCount + "条/页</option>"); 
			}
			$(pageRowCountSelectCtrl).html(allOptionHtml);
			$(pageRowCountSelectCtrl).change(function(){
				var pageRowCount = parseInt($(this).val());
				that.onePageRowCount = pageRowCount;
				that.doPage( {
					pageNumber : 1
				});
			});
		}
	}

	//从返回值中获取value
	this.getValueFromBackInfo = function(text, valueType, fieldName) {
		var tempValue = text;
		tempValue = cmnPcr.replace(tempValue, "\\\\\"", "\"");	
		
		//grid方式下不显示换行
		tempValue = cmnPcr.replace(tempValue, "\\\\r", "");
		tempValue = cmnPcr.replace(tempValue, "\\\\n", "");	
		tempValue = cmnPcr.replace(tempValue, "\\r", "");
		tempValue = cmnPcr.replace(tempValue, "\\n", "");		
			
		
		var value = cmnPcr.strToObject(tempValue, valueType);
		return value;
	}
}