/*
containerId jqgrid的容器id
outerId整个view编辑控件的容器
datatype:默认"local"，一般不改变此参数值
height:如果使用fill停靠，那么不需要赋值
width:如果使用fill停靠，那么不需要赋值
shrinkToFit:默认为false，一般不修改此参数
caption:默认为空"",不建议使用此参数
onePageRowCount(对应jqgrid的rowNum):默认为20,
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

//NcpCard
function NcpCard(p) {

	var that = this;

	//显示的定义
	this.dispUnitModel = p.viewModel.dispUnitModel;

	//基类
	this.base = NcpView;
	this.base(p);

	//所有编辑控件
	this.allCardCtrls = new Hashtable();

	//导航控件
	this.paginationCtrl = null;

	//翻页导航所用参数
	this.totalRowCount = p.totalRowCount;

	//当前记录是第几条记录,卡片方式时，页序号就是记录序号
	this.pageNumber = p.pageNumber == undefined ? 1 : p.pageNumber;

	//单页获取记录数为1，必须为1
	this.onePageRowCount = 1;

	this.where = p.where;

	this.orderby = p.orderby;

	//添加、修改后保存成功后，是否重新获取当前记录在所有记录中的序号，如果记录太多，速度会比较慢
	this.isRefreshPageNumber = p.isRefreshPageNumber == undefined ? true
			: p.isRefreshPageNumber;

	//获取当前行Id
	this.getCurrentIdValue = function() {
		var row = this.datatable.getRowByIndex(0);
		return row == null ? null : row.getValue(this.dataModel.idFieldName);
	};

	this.afterBaseList = function(param) {
		//显示下拉
		var ctrl = this.allCardCtrls.get(param.fieldName);
		$(ctrl).listDispunit("showList", param.rows);
	};

	this.beforeBaseDelete = function(param) {
		param.existRowIds = [];
		param.newRowIds = [];
		param.existRowIdValues = {};
		var row = this.datatable.getRowByIndex(0);
		var rowId = row.rowId;
		if (row.isNewRow(this.dataModel.idFieldName)) {
			//新建的
			param.newRowIds.push(rowId);
		} else {
			//已存在的
			param.existRowIds.push(rowId);
			param.existRowIdValues[rowId] = row.getValue(this.dataModel.idFieldName);
		}
		return msgBox.confirm( {
			info : "确定要删除吗?"
		});
	};

	this.afterBaseDelete = function(param) {
		this.setCtrlStatus(formStatusType.browse);
		//在本地增加一下记录数，这个数不准，只是给用户的视觉效果
		this.totalRowCount -= param.existRowIds.length;

		var newPageNumber = this.pageNumber >= this.totalRowCount ? this.totalRowCount : this.pageNumber;
		this.doPage( {
			pageNumber : newPageNumber
		});
	};

	this.beforeBaseCancel = function(param) {
		param.editRowIds = [];
		param.newRowIds = [];
		var row = this.datatable.getRowByIndex(0);
		var rowId = row.rowId;
		if (row.isNewRow(this.dataModel.idFieldName)) {
			//获取新建的行
			param.newRowIds.push(rowId);
		} else {
			//获取编辑的行
			param.editRowIds.push(rowId);
		}
		return msgBox.confirm( {
			info : "确定要取消编辑吗?"
		});
	};

	this.afterBaseCancel = function(param) {
		if (param.editRowIds.length > 0) {
			for ( var i = 0; i < param.editRowIds.length; i++) {
				var editRowId = param.editRowIds[i];
				this.restoreRow(editRowId);
			}
			this.refreshAllEditCtrlStatus();
		}
		if (param.newRowIds.length > 0) {
			this.doPage( {
				pageNumber : this.pageNumber
			});
		}
	};

	this.beforeBasePage = function(param) {
		//param.fromIndex = param.pageNumber - 1;
		param.currentPage = param.pageNumber;
		return true;
	};

	//将新增记录显示在界面中
	this.afterBaseAdd = function(param) {
		this.datatable = param.newRowsTable;
		var row = this.datatable.getRowByIndex(0);
		for ( var name in this.allCardCtrls.allKeys()) {
			this.setEditValue(row, name);
		}
		this.afterRowSelect(row.rowId);
		this.refreshAllEditCtrlStatus();
	};

	//保存后刷新数据
	this.afterBaseSave = function(param) {
		for ( var rowId in param.table.allRows()) {
			var row = param.table.rows(rowId);
			this.datatable.replaceRow(rowId, row);
			for ( var name in this.allCardCtrls.allKeys()) {
				this.setEditValue(row, name);
			}
		}
		if (param.insert.count() > 0) {
			this.totalRowCount += param.insert.count();
			this.pageNumber = this.totalRowCount;
		}
		this.refreshPaginationCtrl();
		this.refreshAllEditCtrlStatus();
	};

	this.afterBaseEdit = function(param) {
		this.refreshAllEditCtrlStatus();
	};

	this.beforeBaseSave = function(param) {
		var insertDt = new DataTable();
		var updateDt = new DataTable();
		var row = this.datatable.getRowByIndex(0);
		var rowId = row.rowId;
		if (row.isNewRow(this.dataModel.idFieldName)) {
			//获取新建的行
			var newShowRow = this.getRowFromEditCtrl(rowId);
			insertDt.addRow(rowId, newShowRow);
		} else {
			//获取编辑的行
			var editShowRow = this.getRowFromEditCtrl(rowId);
			editShowRow.setValue(this.dataModel.idFieldName, row
					.getValue(this.dataModel.idFieldName));
			updateDt.addRow(rowId, editShowRow);
		}
		param.update = updateDt;
		param.insert = insertDt;
		return this.checkNotNullable(param);
	};

	//验证必填项是否填写完整
	this.checkNotNullable = function(param){
		var errorStr = "";
		if(param.update.count()>0){
	        for (var k in param.update.allRows()) {
	        	errorStr += this.checkRowNotNullable(param.update.rows(k));
	        }
		}
		if(param.insert.count()>0){
	        for (var k in param.insert.allRows()) {
	        	errorStr += this.checkRowNotNullable(param.insert.rows(k));
	        }
		}
		if(errorStr.length == 0){
			return true;
		}
		else{
			msgBox.alert({info:errorStr});
			return false;
		}
	};
	
	//验证某行的必填项是否填写完整
	this.checkRowNotNullable = function(row){
		var str = "";
		for ( var i = 0; i < p.viewModel.dispUnitModel.length; i++) {
			var unitModel = p.viewModel.dispUnitModel[i];
			if(!unitModel.nullable && !unitModel.hidden ){
				var value =  row.getValue(unitModel.name);
				if(value == null || value ===""){
					str += ( "  字段 " + unitModel.label + " 的值不可为空;\r");
				}				
			}			
		}
		return str;
	};
	
	//从编辑控件里获取编辑后的记录值
	this.getRowFromEditCtrl = function(rowId) {
		var row = new DataRow();
		row.rowId = rowId;
		for ( var name in this.allCardCtrls.allKeys()) {
			var field = this.dataModel.fields[name];
			var newValue = this.doCtrlMethod(name, "getValue");
			/*
			//如果此字段需要保存
			if (field.isSave) {
				if (field.maps == undefined) {
					row.setValue(name, newValue);
				} else {
					row.setValue(name, newValue[field.maps[name]]);
				}
			}
			*/
			
			//所有字段都传输到服务器端
			if (field.maps == undefined) {
				row.setValue(name, newValue);
			} else {
				row.setValue(name, newValue[field.maps[name]]);
			}
			
			//如果此字段的外键字段存在且需要保存
			if (field.foreignKeyName != ""
					&& this.dataModel.fields[field.foreignKeyName].isSave) {
				row.setValue(field.foreignKeyName,
						newValue[field.maps[field.foreignKeyName]]);
			}
		}
		return row;
	};

	//从当前编辑的单元格中获取字段值
	this.setEditValue = function(row, fieldName) {
		var fieldModel = this.dataModel.fields[fieldName];
		if (fieldModel.maps == null) {
			this.doCtrlMethod(fieldName, "setValue", row == null ? null : row
					.getValue(fieldName));
		} else {
			var value = {};
			if (row != null) {
				for ( var viewField in fieldModel.maps) {
					var listField = fieldModel.maps[viewField];
					value[listField] = row.getValue(viewField);
				}
			}
			this.doCtrlMethod(fieldName, "setValue", value);
		}
	};

	//将数据显示在界面中
	this.afterBasePage = function(param) {
		this.datatable = param.datatable;
		var row = param.datatable.getRowByIndex(0);
		for ( var name in this.allCardCtrls.allKeys()) {
			this.setEditValue(row, name);
			//this.doCtrlMethod(name, "setValue", row == null ? null : row.getValue(name));	 
		}
		this.pageNumber = param.pageNumber;
		this.refreshPaginationCtrl();
		this.afterRowSelect(row == null ? undefined : row.rowId);
		this.refreshAllEditCtrlStatus();
		if (row == null) {
			//msgBox.alert({info:"此条记录已不存在，请关闭此窗口后重新打开."});
		}
	};

	//刷新导航栏
	this.refreshPaginationCtrl = function() {
	};

	//最大化填充
	this.fulfill = function() {
		$(this.gridCtrl).setGridWidth($(this.gridDiv).width() - 2);
		$(this.gridCtrl).setGridHeight($(this.gridDiv).height() - 23);
	};

	//取消此行的编辑，如果是新建，那么删除此行，如果是编辑，那么还原为原来的显示内容
	this.restoreRow = function(rowId) {
		var row = this.datatable.rows(rowId);
		for ( var name in this.allCardCtrls.allKeys()) {
			this.setEditValue(row, name);
		}
	};

	//初始化
	this.initCard = function(p) {
		for ( var i = 0; i < p.viewModel.dispUnitModel.length; i++) {
			//显示单元的模型定义
			var unitModel = p.viewModel.dispUnitModel[i];
			//字段的模型定义
			var fieldModel = p.dataModel.fields[unitModel.name];

			//用div做容器
			var ctrls = $("#" + this.containerId).find(
					"input[cardCtrl='true'][name='" + unitModel.name + "']");
			if (ctrls.length > 0) {
				this.initCardDispunitCtrl(ctrls[0], unitModel, fieldModel);
			}

			//用td做容器
			var ctrls = $("#" + this.containerId).find(
					"textarea[cardCtrl='true'][name='" + unitModel.name + "']");
			if (ctrls.length > 0) {
				this.initCardDispunitCtrl(ctrls[0], unitModel, fieldModel);
			}
		}
	};

	//初始化某个录入控件
	this.initCardDispunitCtrl = function(ctrl, unitModel, fieldModel) {
		var style = {};
		switch (unitModel.dispunitType) {
		case "text":
		case "textarea":
		case "decimal":
		case "date":
		case "time":
		case "list":
		case "checkbox":
			break;
		}
		var options = {
			changeFunc : this.dispunitValueChange,
			fieldName : fieldModel.name
		};
		this.createDispunit(unitModel.name, unitModel.dispunitType, ctrl, fieldModel, options,
				style);
		this.doCtrlCoreMethod(ctrl, unitModel.dispunitType, fieldModel.name,
				"setReadonly", true);
		this.allCardCtrls.add(fieldModel.name, ctrl);
	};
	 
	 //获取列的显示定义
	 this.getDispUnitModel = function(name) {
	  for ( var i = 0; i < this.dispUnitModel.length; i++) {
	   var dModel = this.dispUnitModel[i];
	   if (name == dModel.name) {
	    return dModel;
	   }
	  }
	  return null;
	 }

	 this.dispunitValueChange = function(jq, newValue) {
	  var fieldName = $(jq).attr("fieldName");
	  var fieldModel = that.dataModel.fields[fieldName];
	  if (fieldModel.maps != null) {
	   var row = that.datatable.getRowByIndex(0);
	   for ( var desFieldName in fieldModel.maps) {
	    if (desFieldName != fieldName) {
	     var cSameGroupFieldModel = that.getDispUnitModel(desFieldName);
	     var cellValue = newValue[fieldModel.maps[desFieldName]];
	     row.setValue(desFieldName, cellValue);
	     that.doCtrlMethod(desFieldName, "setValue", cellValue);
	    }
	   }
	  }
	  that.valueChange(jq, newValue);
	 }	

	//显示域值改变时调用此函数，(用于扩展)
	this.valueChange = function(jq, newValue) {
		//alert($(jq).attr("id") + " " + $(jq).attr("fieldName") + " " + newValue);
	};

	//刷新所有编辑控件状态
	this.refreshAllEditCtrlStatus = function() {
		var isReadonly = this.currentStatus != formStatusType.edit;
		for ( var name in this.allCardCtrls.allKeys()) {
			var unitModel = this.getUnitModel(name);
			this.doCtrlMethod(name, "setReadonly", isReadonly ? isReadonly
					: !unitModel.editable);
		}
	};

	//获取显示域的显示定义
	this.getUnitModel = function(name) {
		for ( var i = 0; i < this.viewModel.dispUnitModel.length; i++) {
			var unitModel = this.viewModel.dispUnitModel[i];
			if (name == unitModel.name) {
				return unitModel;
			}
		}
		return null;
	};

	this.getWinBtnStatus = function() {
		return cardWinBtnStatus;
	};

	this.doCtrlMethod = function(fieldName, methodName, value) {
		var dispunitType = this.getUnitModel(fieldName).dispunitType;
		var ctrl = this.allCardCtrls.get(fieldName);
		return this.doCtrlCoreMethod(ctrl, dispunitType, fieldName, methodName,
				value);
	};
	//给控制按钮们绑定事件
	this.regOperateCtrl = function(ctrlType, operateType, ctrlName, eventName,
			func) {
		var toolbarContainer = $("#" + this.containerId
				+ " .zlpToolbarContainer")[0];
		var ctrls = $(toolbarContainer).find(
				ctrlType + "[name='" + ctrlName + "']");
		if (ctrls.length > 0) {
			var ctrl = ctrls[0];
			this.allToolbarCtrls.set(operateType, ctrl);
			if (eventName != undefined) {
				$(ctrl).bind(eventName, func);
			}
		}
	};

	//显示
	this.show = function() {

		//为控件绑定功能，并使控件受状态控制
		this.regOperateCtrls();

		//设置控件状态
		this.setCtrlStatus(formStatusType.browse);

		//初始化Card
		this.initCard(p);

		//加载第一页数据
		if (this.isShowData) {
			this.doPage( {
				pageNumber: this.pageNumber,
				where: [{
					parttype : "field",
					field : this.dataModel.idFieldName,
					operator : "=",
					value : p.idValue.toString()
				}]
			});
		} else {
			this.setCtrlStatus(formStatusType.browse);
		}
	}
}