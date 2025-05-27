//NcpView
function NcpView(p) {

	var that = this;
	
	this.serviceName = "dataNcpService";

	//容器id
	this.containerId = p.containerId;

	//数据模型，调用时赋值，具体模型是由服务器端自动生成的，注意和
	this.dataModel = p.dataModel;

	//展示模型
	this.viewModel = p.viewModel;

	//等待进度栏父控件
	this.waitingBarParentId = p.waitingBarParentId;

	this.onePageRowCount = p.onePageRowCount == undefined ? 20
			: p.onePageRowCount;

	//是否自动加载数据
	this.isShowData = p.isShowData == undefined ? true : p.isShowData;

	//数据集
	this.datatable = null;

	//是否取合计
	this.isGetSum = false;

	//是否取记录数
	this.isGetCount = false;

	//当前窗口状态
	this.currentStatus = null;
	
	//是否触发Server端的Add
	this.needTriggerServerAdd = p.needTriggerServerAdd == undefined ? false : p.needTriggerServerAdd;

	//保存记录后是否自动刷新保存的数据
	this.isRefreshAfterSave = p.isRefreshAfterSave == undefined ? true
			: p.isRefreshAfterSave;

	//过滤条件
	this.where = p.where == undefined ? [] : p.where;
	
    //是否按照实际显示数据行数显示Grid高度
    this.autoHeight = p.autoHeight == undefined ? false : p.autoHeight;

	//系统过滤条件
	this.sysWhere = p.sysWhere == undefined ? [] : p.sysWhere;

	//排序条件
	this.orderby = p.orderby == undefined ? [] : p.orderby;

	//所有外部程序声明
	this.externalObjects = new Array();

	//添加外部程序声明
	this.addExternalObject = function(externalObj) {
		/*外部程序方法包括
		    afterRowSelect
			beforeDoPage
			afterDoPage
			beforeDoList
			afterDoList
			beforeDoPop
			afterDoPop
			beforeDoAdd
			afterDoAdd
			beforeDoSave
			afterDoSave
			beforeDoEdit
			afterDoEdit
			beforeDoDelete
			afterDoDelete
			beforeDoCancel
			afterDoCancel

		 */
		if (externalObj != null) {
			this.externalObjects.push(externalObj);
			externalObj.owner = this;
		}
	}

	//执行外部程序，返回html
	this.doExternalFunctionReturnHtml = function(functionName, param) {
		var html = "";
		for ( var i = 0; i < this.externalObjects.length; i++) {
			var externalObj = this.externalObjects[i];
			var func = externalObj[functionName];
			if (func != null) {
				html += func(param);
			}
		}
		return html;
	}

	//执行外部程序
	this.doExternalFunction = function(functionName, param) {
		for ( var i = 0; i < this.externalObjects.length; i++) {
			var externalObj = this.externalObjects[i];
			var func = externalObj[functionName];
			if (func != null) {
				func(param);
			}
		}
	}

	//执行外部程序，判断是否可以继续执行
	this.doExternalFunctionContinue = function(functionName, param) {
		for ( var i = this.externalObjects.length - 1; i >= 0; i--) {
			var externalObj = this.externalObjects[i];
			var func = externalObj[functionName];
			if (func != null) {
				if (!func(param)) {
					return false;
				}
			}
		}
		return true;
	}

	//调用服务器端
	this.ProcessServerAccess = function(requestParam) {
		var serverAccess = new ServerAccess();
		serverAccess.request(requestParam);
	}

	//当选中某行数据时
	this.afterRowSelect = function(rowId) {
		this.doExternalFunction("afterRowSelect", rowId);
	}

	//初始化按钮们的事件
	this.regOperateCtrls = function() {
		this.regOperateCtrl("a", "add", "addBtn", "click", function() {
			if (that.getWinBtnStatus()["add"][that.currentStatus]) {
				that.doAdd( {});
			}
			return false;
		});
		this.regOperateCtrl("a", "edit", "editBtn", "click", function() {
			if (that.getWinBtnStatus()["edit"][that.currentStatus]) {
				that.doEdit( {});
			}
			return false;
		});
		this.regOperateCtrl("a", "delete", "deleteBtn", "click", function() {
			if (that.getWinBtnStatus()["delete"][that.currentStatus]) {
				that.doDelete( {});
			}
			return false;
		});
		this.regOperateCtrl("a", "cancel", "cancelBtn", "click", function() {
			if (that.getWinBtnStatus()["cancel"][that.currentStatus]) {
				that.doCancel( {});
			}
			return false;
		});
		this.regOperateCtrl("a", "save", "saveBtn", "click", function() {
			if (that.getWinBtnStatus()["save"][that.currentStatus]) {
				that.doSave( {});
			}
			return false;
		}); 
		
		//翻页导航控件
		var ctrls = $("#" + this.containerId + " .zlpNavUl");
		if (ctrls.length > 0) {
			this.paginationCtrl = ctrls[0];
		}
		
		this.regOtherOperateCtrls();
	}
	
	//获取模糊查询过滤条件 added by ls 20180426
	this.getFuzzyWhereParam = function(){
		var searchCtrl = $("#" + that.containerId + " .zlpToolbarQueryInputText");
		if(searchCtrl.length != 0){
			var value = $(searchCtrl[0]).val().trim();
			if(value.length > 0){
				var queryParm = [];
		        var cModel = null;
		        //循环视图模型中定义的列
		        for(var i=0;i<that.colModel.length;i++) {
		            cModel = that.colModel[i];
		            //列可见且允许被搜索
		            if(null != cModel && false == cModel.hidden && true == cModel.search){
		                //将可以进行查询的列添加至数组中
		                queryParm.push({parttype: "field",
		                	field: cModel.name, 
		                	operator: "like",
		                	value: "%" + value + "%" });
		            }
		        }
		        
		        //如果没有查询字段，那么提示报错 modified by ls 20190729
		        if(queryParm.length == 0){
		        	msgBox.alert({info: "未指定查询字段"});
		        	return null;
		        }
		        else{
			        return {
			            parttype : "or",
			            field : "name",//如果parttype=or或and，此处没有意义，但不能为空
			            operator : '=',//如果parttype=or或and，此处没有意义，但不能为空
			            value : queryParm
			        };
		        }
	        } 
        }
	    return null; 
	}
	
	//注册其他控件操作方法
	this.regOtherOperateCtrls = function(){}

	//窗口上的操作控件
	this.allToolbarCtrls = new Hashtable();

	//翻页
	this.doOtherAction = function(param) {
		//param.customParam可序列号的json对象
		//param.successFunc
		//param.failFunc
		//如果还想增加一些参数，例如超时时间，异步等待效果等，那你自己构造requestParam，通过ServerAccess.request调用吧,我可不再给你封装了

		var requestParam = {
			serviceName : this.serviceName,
			waitingBarParentId : this.containerId,
			funcName : "doOtherAction",
			timeout : param.timeout,
			successFunc : function(obj) {
				if (param.successFunc != undefined) {
					param.successFunc(obj);
				}
			},
			failFunc : function(obj) {
				if (param.failFunc != undefined) {
					param.failFunc(obj);
				}
			},
			args : {
				requestParam : cmnPcr.jsonToStr( {
					dataName : this.dataModel.name,
					actionName : param.actionName,
					customParam : param.customParam,
					otherRequestParam:param.otherRequestParam
				})
			}
		};
		this.ProcessServerAccess(requestParam);
	}

	//翻页
	this.basePage = function(param) {
	
		//增加模糊查询过滤条件 added by ls 20180426
		var fuzzyWhere = that.getFuzzyWhereParam();
		if(fuzzyWhere != null){
			if(param.where == null){
				param.where = [fuzzyWhere];
			} 
			else{
				param.where.push(fuzzyWhere);
			}
		} 
		
        
        //增加是否按照实际显示数据行数显示Grid高度功能
        that.autoHeight = param.autoHeight == undefined ? (that.autoHeight == undefined ? false : that.autoHeight) : param.autoHeight;
	
		var requestParam = {
			serviceName : this.serviceName,
			waitingBarParentId : this.containerId,
			funcName : "select",
			successFunc : function(obj) {
				param.datatable = that.getDataTableFromBackInfo(obj.result.table.rows);
				param.sumRow = null;// that.getSumRow(obj);  
				param.totalRowCount = obj.result.rowCount;
				
                //增加是否按照实际显示数据行数显示Grid高度功能
                param.autoHeight = that.autoHeight;
				
				that.setCtrlStatus(formStatusType.browse);
//				that.processPageData(param);
				that.afterBasePage(param);
				that.afterDoPage(param);
			},
			args : {
				requestParam : cmnPcr
						.jsonToStr( {
							dataName : this.dataModel.name,
							getDataType : "page",

							//fromIndex:param.fromIndex,
							currentPage : param.currentPage,
							//onePageRowCount:that.onePageRowCount,
							pageSize : that.onePageRowCount,

							isGetSum : that.isGetSum,
							isGetCount : that.isGetCount,
							where : param.where == undefined ? (that.where == undefined ? []
									: that.where)
									: param.where,
							sysWhere : that.sysWhere == undefined ? []
									: that.sysWhere,
							orderby : that.orderby == undefined ? []
									: that.orderby,
							previousField : param.previousField == undefined ? ""
									: param.previousField,
							previousData : param.previousData == undefined ? ""
									: param.previousData,
							popDataField : param.popDataField == undefined ? ""
									: param.popDataField,
							otherRequestParam:param.otherRequestParam
						})
			}
		};
		this.ProcessServerAccess(requestParam);
	}
	this.processPageData = function(param) {
		this.doExternalFunctionContinue("processPageData", param);
	}
	this.beforeBasePage = function(param) {
		return true;
	}
	this.afterBasePage = function(param) {
	}
	this.beforeDoPage = function(param) {
		return this.doExternalFunctionContinue("beforeDoPage", param);
	}
	this.afterDoPage = function(param) {
		this.doExternalFunction("afterDoPage", param);
	}
	this.doPage = function(param) {
		if (this.currentStatus == formStatusType.browse) {
			if (this.beforeBasePage(param) && this.beforeDoPage(param)) {
				this.basePage(param);
			}
		}
	}

	//下拉
	this.baseList = function(param) {
		var requestParam = {
			serviceName : this.serviceName,
			waitingBarParentId : null,
			funcName : "getList",
			successFunc : function(obj) {
				param.rows = that.getListRowsFromBackInfo(
						obj.result.table.rows, param.fieldModel.list.columns);
				that.processListData(param);
				that.afterBaseList(param);
				that.afterDoList(param);
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
		this.ProcessServerAccess(requestParam);
	}
	this.processListData = function(param) {
		this.doExternalFunctionContinue("processListData", param);
	}
	this.beforeBaseList = function(param) {
		if (param.value != undefined && param.value != null
				&& param.value != "") {
			param.where = [ {
				parttype : "field",
				field : "name",
				operator : "like",
				value : (param.value + "%")
			} ];
		}
		return true;
	}
	this.afterBaseList = function(param) {
	}
	this.beforeDoList = function(param) {
		return this.doExternalFunctionContinue("beforeDoList", param);
	}
	this.afterDoList = function(param) {
		this.doExternalFunction("afterDoList", param);
	}
	this.doList = function(param) {
		if (this.beforeBaseList(param) && this.beforeDoList(param)) {
			this.baseList(param);
		}
	}
	
	this.getPopContainer = function(param){
		var queryIndex = param.fieldModel.inputHelpName.indexOf("?");
		var queryString = queryIndex < 0 ? "" : param.fieldModel.inputHelpName.substr(queryIndex + 1);
		var args = cmnPcr.getQueryArgsFromString(queryString);
		var width = args.w == null ? 800 : parseInt(args.w);
		var height = args.h == null ? 500 : parseInt(args.h);
		var top = args.t == null ? 50 : parseInt(args.t);
		
		var popContainer = new PopupContainer( {
			width : width,
			height : height,
			top : top,
			title: param.fieldModel.displayName + " - 选择窗口"
		});
		return popContainer;
	}

	//pop和list的区别就是，pop是模仿模态，弹出选择返回后，才调用after的方法们，list是下拉获取下拉列表的值后就执行after方法们
	this.basePop = function(param) {
		var popContainer = this.getPopContainer(param);
		popContainer.show();
		var initParam = {
			closeWin : function(p) {
				param.selectedRows = null;
				if (p.selectedRows != undefined) {
					if(param.isMultiValue){
						param.selectedRows = {};
						for(var rowId in p.selectedRows) {
							var row = {};
							var selectedRow = p.selectedRows[rowId];
							for ( var destFieldName in param.fieldModel.maps) {
								var sourceFieldName = param.fieldModel.maps[destFieldName];
								row[sourceFieldName] = selectedRow[sourceFieldName];
							}
							param.selectedRows[rowId] = row; 
						}
					}
					else{
						param.selectedRows = {};
						for(var rowId in p.selectedRows) {
							var row = {};
							var selectedRow = p.selectedRows[rowId];
							for ( var destFieldName in param.fieldModel.maps) {
								var sourceFieldName = param.fieldModel.maps[destFieldName];
								row[sourceFieldName] = selectedRow[sourceFieldName];
							}
							param.selectedRows = row; 
							break;
						}
					}
				}

				popContainer.close();
				that.afterBasePop(param);
				that.afterDoPop(param);
				if(param.selectedRows != undefined){
					param.changeValueFunc(param.selectedRows);
				}
			},
			value : param.value,
			
			//多值
			isMultiValue:param.isMultiValue,

			//数据权限过滤
			previousField : param.fieldModel.name,
			previousData : param.dataModel.name,
			popDataField : param.fieldModel.maps[param.fieldModel.name],
			showField : param.fieldModel.maps[param.fieldModel.name],
			otherValues : param.otherValues
		}
		window.popInitParam = initParam;

		//var popNames = param.fieldModel.inputHelpName.split(".");
		var popPageUrl =basePath + "/" + param.fieldModel.inputHelpName; //"../pop/" + popNames[0] + "_" + popNames[1] + ".jsp";

		var frameId = cmnPcr.getRandomValue();
		var iFrameHtml = "<iframe id=\""
				+ frameId
				+ "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		$("#" + popContainer.containerId).html(iFrameHtml);
		$("#" + frameId).attr("src", popPageUrl);
	}
	this.processPopData = function(param) {
		this.doExternalFunctionContinue("processPopData", param);
	}
	this.beforeBasePop = function(param) {
		return true;
	}
	this.afterBasePop = function(param) {
	}
	this.beforeDoPop = function(param) {
		return this.doExternalFunctionContinue("beforeDoPop", param);
	}
	this.afterDoPop = function(param) {
		this.doExternalFunction("afterDoPop", param);
	}
	this.doPop = function(param) {
		if (this.beforeBasePop(param) && this.beforeDoPop(param)) {
			this.basePop(param);
		}
	}

	//新建
	this.baseAdd = function(param) {
		if(!that.needTriggerServerAdd){
			param.newRowsTable = that.getDataTableFromBackInfo([{}]);
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
	this.processAddData = function(param) {
		this.doExternalFunctionContinue("processAddData", param);
	}
	this.beforeBaseAdd = function(param) {
		return true;
	}
	this.afterBaseAdd = function(param) {
	}
	this.beforeDoAdd = function(param) {
		return this.doExternalFunctionContinue("beforeDoAdd", param);
	}
	this.afterDoAdd = function(param) {
		this.doExternalFunction("afterDoAdd", param);
	}
	this.doAdd = function(param) {
		if (this.beforeBaseAdd(param) && this.beforeDoAdd(param)) {
			this.baseAdd(param);
		}
	} 
	
	//获取datatable的哈希
	this.getDatatableHash = function(dt) {
		var rowHash = {};
		if (dt != null) {
			for ( var rowId in dt.allRows()) {
				var row = dt.rows(rowId);
				var rowObject = {};
				for ( var fieldName in row.allCells()) {
					var field = this.dataModel.fields[fieldName];
					if (field.isSave) {
						var value = row.getValue(fieldName);
						var tempValue = cmnPcr.objectToStr(value, field.valueType); 
						rowObject[fieldName] = tempValue;
					}
				}
				rowHash[rowId] = rowObject;
			}
		}
		return rowHash;
	}

	//保存
	this.baseSave = function(param) {
		var requestParam = {
			serviceName : this.serviceName,
			waitingBarParentId : this.containerId,
			funcName : "save",
			successFunc : function(obj) {
				var dt = that.getDataTableFromBackInfo(
						obj.result.table == undefined ? null
								: obj.result.table.rows,
						obj.result.idValueToRowIds == undefined ? null
								: obj.result.idValueToRowIds);
				param.table = dt;

				//从idvalue到rowid的对应关系中，获取rowid到idvalue
				var rowIdToIdValues = {};
				for ( var idValue in obj.result.idValueToRowIds) {
					var rowId = obj.result.idValueToRowIds[idValue];
					rowIdToIdValues[rowId] = idValue;
				}
				param.rowIdToIdValues = rowIdToIdValues;

				that.setCtrlStatus(formStatusType.browse);
				that.processSaveData(param);
				that.afterBaseSave(param);
				that.afterDoSave(param);
			},
			args : {
				requestParam : cmnPcr.jsonToStr( {
					dataName : this.dataModel.name,
					isRefreshAfterSave : this.isRefreshAfterSave,
					update : that.getDatatableHash(param.update),
					insert : that.getDatatableHash(param.insert),
					otherRequestParam:param.otherRequestParam
				})
			}
		};
		this.ProcessServerAccess(requestParam);
	}
	this.processSaveData = function(param) {
		this.doExternalFunctionContinue("processSaveData", param);
	}
	this.beforeBaseSave = function(param) {
		return true;
	}
	this.afterBaseSave = function(param) {
	}
	this.beforeDoSave = function(param) {
		return this.doExternalFunctionContinue("beforeDoSave", param);
	}
	this.afterDoSave = function(param) {
		this.doExternalFunction("afterDoSave", param);
	}
	this.doSave = function(param) {
		if (this.currentStatus == formStatusType.edit) {
			if (this.beforeBaseSave(param) && this.beforeDoSave(param)) {
				this.baseSave(param);
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return true;
		}
	}

	//标示编辑的行
	this.markEditRow = function(rowId, isEdited) {
		this.datatable.rows(rowId).setIsEdited(isEdited);
	}

	//编辑 
	this.baseEdit = function(param) {
		that.setCtrlStatus(formStatusType.edit);
		that.processEditData(param);
		that.afterBaseEdit(param);
		that.afterDoEdit(param);
	}
	this.processEditData = function(param) {
		this.doExternalFunctionContinue("processEditData", param);
	}
	this.beforeBaseEdit = function(param) {
		return true;
	}
	this.afterBaseEdit = function(param) {
	}
	this.beforeDoEdit = function(param) {
		return this.doExternalFunctionContinue("beforeDoEdit", param);
	}
	this.afterDoEdit = function(param) {
		this.doExternalFunction("afterDoEdit", param);
	}
	this.doEdit = function(param) {
		if (this.currentStatus == formStatusType.browse) {
			if (this.beforeBaseEdit(param) && this.beforeDoEdit(param)) {
				this.baseEdit(param);
			}
		}
	}

	//删除
	this.baseDelete = function(param) {
		var requestParam = {
			serviceName : this.serviceName,
			waitingBarParentId : this.containerId,
			funcName : "delete",
			successFunc : function(obj) {
				//编辑状态下也可以删除，所以删除后不用转换为浏览状态
			//that.setCtrlStatus(formStatusType.browse);
			that.processDeleteData(param);
			that.afterBaseDelete(param);
			that.afterDoDelete(param);
		},
		args : {
			requestParam : cmnPcr.jsonToStr( {
				dataName : this.dataModel.name,
				deleteRows : param.existRowIdValues,
				otherRequestParam:param.otherRequestParam
			})
		}
		};
		this.ProcessServerAccess(requestParam);
	}
	this.processDeleteData = function(param) {
		this.doExternalFunctionContinue("processDeleteData", param);
	}
	this.beforeBaseDelete = function(param) {
		return true;
	}
	this.afterBaseDelete = function(param) {
	}
	this.beforeDoDelete = function(param) {
		return this.doExternalFunctionContinue("beforeDoDelete", param);
	}
	this.afterDoDelete = function(param) {
		this.doExternalFunction("afterDoDelete", param);
	}
	this.doDelete = function(param) {
		if (this.beforeBaseDelete(param) && this.beforeDoDelete(param)) {
			this.baseDelete(param);
		}
	}

	//取消
	this.baseCancel = function(param) {
		that.setCtrlStatus(formStatusType.browse);
		that.processCancelData(param);
		that.afterBaseCancel(param);
		that.afterDoCancel(param);
	}
	this.processCancelData = function(param) {
		this.doExternalFunctionContinue("processCancelData", param);
	}
	this.beforeBaseCancel = function(param) {
		param.editRowIds = new Array();
		param.newRowIds = new Array()
		for ( var rowId in this.datatable.allRows()) {
			var row = this.datatable.rows(rowId);
			if (row.isNewRow(this.dataModel.idFieldName)) {
				//获取新建的行
				param.newRowIds.push(rowId);
			} else if (row.getIsEdited()) {
				//获取编辑的行
				param.editRowIds.push(rowId);
			}
		}
		var count = param.newRowIds.length + param.editRowIds.length;

		if (param.isShowConfirm || param.isShowConfirm == undefined) {
			if (count == 0) {
				return true;
			} else {
				return msgBox.confirm( {
					info : "确定要取消本次编辑吗?"
							+ (count > 1 ? "\r\n共 " + count + " 条记录" : "")
				});
			}
		}

		return true;
	}
	this.afterBaseCancel = function(param) {
	}
	this.beforeDoCancel = function(param) {
		return this.doExternalFunctionContinue("beforeDoCancel", param);
	}
	this.afterDoCancel = function(param) {
		this.doExternalFunction("afterDoCancel", param);
	}
	this.doCancel = function(param) {
		if (this.currentStatus == formStatusType.edit) {
			if (this.beforeBaseCancel(param) && this.beforeDoCancel(param)) {
				this.baseCancel(param);
			}
		}
	} 

	//从返回值中获取value
	this.getValueFromBackInfo = function(text, valueType) {
		var tempValue = text;
		tempValue = cmnPcr.replace(tempValue, "\\\\\"", "\"");		
		tempValue = cmnPcr.replace(tempValue, "\\\\r", "\r");
		tempValue = cmnPcr.replace(tempValue, "\\\\n", "\n");		
		var value = cmnPcr.strToObject(tempValue, valueType);
		return value;
	}

	//从返回值中获取datatable
	this.getDataTableFromBackInfo = function(allServerRows, idValueToRowIds) {
		var dt = new DataTable();
		if (allServerRows != null) {
			for ( var i = 0; i < allServerRows.length; i++) {
				var serverRow = allServerRows[i];
				var row = new DataRow();
				var idValue = null;
				for ( var fieldName in this.dataModel.fields) {
					var valueType = this.dataModel.fields[fieldName].valueType;
					var tempValue = serverRow[fieldName];
					var value = that.getValueFromBackInfo(tempValue, valueType, fieldName);
					row.setValue(fieldName, value);
					if (fieldName == this.dataModel.idFieldName) {
						idValue = value;
					}
				}

				var rowId = idValueToRowIds != undefined
						&& idValueToRowIds[idValue] != undefined ? idValueToRowIds[idValue]
						: cmnPcr.getRandomValue();
				row.rowId = rowId;
				dt.addRow(rowId, row);
			}
		}
		return dt;
	}

	//从返回值中获取下拉的数据
	this.getListRowsFromBackInfo = function(allServerRows, columns) {
		var rows = new Array();
		for ( var i = 0; i < allServerRows.length; i++) {
			var serverRow = allServerRows[i];
			var row = {};
			for ( var j = 0; j < columns.length; j++) {
				var column = columns[j];
				var valueType = column.valueType;
				var value = cmnPcr.strToObject(serverRow[column.field],
						valueType);
				row[column.field] = value;
			}
			rows.push(row);
		}
		//增加空本行
		rows.push( {});
		return rows;
	}

	this.getWinBtnStatus = function() {
		return gridWinBtnStatus;
	}

	//设置控件状态
	this.setCtrlStatus = function(statusName) {
		var winBtnStatus = this.getWinBtnStatus();
		this.currentStatus = statusName;
		for ( var operateType in this.allToolbarCtrls.allKeys()) {
			var ctrl = this.allToolbarCtrls.get(operateType);
			var enable = winBtnStatus[operateType][statusName];
			if(enable){
				$(ctrl).removeClass("toolbarBtnDisable");
			}
			else{
				if(!$(ctrl).hasClass("toolbarBtnDisable")){
					$(ctrl).addClass("toolbarBtnDisable");
				}
			}
		}
	}

	this.createDispunit = function(name, dispunitType, ctrl, fieldModel, options, style) {
		//如果有对应的字段定义 modified by ls 20150721 
		if(fieldModel != null) {
			$(ctrl).attr("fieldName", fieldModel.name);
			options.fieldName = fieldModel.name;
			switch (dispunitType) {
			case "text":
				//param 
				return $(ctrl).textDispunit( { options : options, style : style });
			case "textarea":
				//param 
				return $(ctrl).textareaDispunit( { options : options, style : style });
			case "decimal":
				//param包含isComma、decimalNum
				return $(ctrl).decimalDispunit( { groupSeparator : (fieldModel.isComma ? "," : ""), precision : fieldModel.decimalNum, options : options, style : style	});
			case "date":
				return $(ctrl).dateDispunit( { options : options, style : style });
			case "time":
				return $(ctrl).timeDispunit( { options : options, style : style });
			case "checkbox":
				//param包含，以后扩展是否允许三态
				return $(ctrl).checkboxDispunit( { options : options, style : style });
			case "list":
				//param包含container、idField、textField、columns、getListFunc、changeFunc、options(扩展属性,在NcpView中，包含了rowId)
				return $(ctrl)
						.listDispunit(
								{
									idField : fieldModel.foreignKeyName == "" ? null
											: fieldModel.maps[fieldModel.foreignKeyName],
									textField : fieldModel.maps[fieldModel.name],
									columns : [ fieldModel.list.columns ],
									getListFunc : function(p) {
										var fieldModel = that.dataModel.fields[p.options.fieldName];
										//{value:value, options:param.options, showList:function(data)
										that.doList( {
											listName : fieldModel.list.name,
											value : p.value,
											rowId : p.options.rowId,//card方式下此属性无用，grid方式下有用，用来确定是哪一行的
											fieldName : fieldModel.name,
											dataModel : that.dataModel,
											fieldModel : fieldModel
										});
									},
									options : options,
									style : style
								});
			case "pop":
				return $(ctrl)
						.popDispunit(
								{
									idField : fieldModel.foreignKeyName == "" ? null
											: fieldModel.maps[fieldModel.foreignKeyName],
									textField : fieldModel.maps[fieldModel.name],
									options : options,
									showPopFunc : function(p) {
										var fieldModel = that.dataModel.fields[p.options.fieldName];
										that.doPop( {
											viewName : fieldModel.view.name,
											value : p.value,
											rowId : p.options.rowId,//card方式下此属性无用，grid方式下有用，用来确定是哪一行的
											fieldName : fieldModel.name,
											fieldModel : fieldModel,
											dataModel : that.dataModel,
											changeValueFunc : p.changeValueFunc
										});
									},
									style : style
								});
			default:
				return this.createCustomDispunit(name, dispunitType, ctrl, fieldModel, options, style);
			}
		}
		else{
			return this.createCustomDispunit(name, dispunitType, ctrl, fieldModel, options, style);
		}
	}

	this.createCustomDispunit = function(name, dispunitType, ctrl, fieldModel, options, style) {
		return null;
	}

	this.doCtrlCoreMethod = function(ctrl, dispunitType, fieldName, methodName,
			value) {
		switch (dispunitType) {
		case "text":
			return $(ctrl).textDispunit(methodName, value);
		case "textarea":
			return $(ctrl).textareaDispunit(methodName, value);
		case "decimal":
			return $(ctrl).decimalDispunit(methodName, value);
		case "date":
			return $(ctrl).dateDispunit(methodName, value);
		case "time":
			return $(ctrl).timeDispunit(methodName, value);
		case "checkbox":
			return $(ctrl).checkboxDispunit(methodName, value);
		case "list":
			return $(ctrl).listDispunit(methodName, value);
		case "pop":
			return $(ctrl).popDispunit(methodName, value);
		case "popMulti":
			return $(ctrl).popMultiDispunit(methodName, value);
		default:
			return null;
		}
	}
}