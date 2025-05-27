function NcpDocumentMultiStyleWin(p){ 
	var that = this;
	
	//基类
	this.base = NcpMultiStyleWin;
	this.base(p);
	
	this.dataModel = p.dataModel;

	this.viewModel = p.viewModel;
	
	this.sheetModel = p.sheetModel;
	
	this.containerId = p.containerId;
	
	this.gridStyleCtrl = null;
	
	this.iframeId = null;
	
	this.detailPageParam = null;
	
	this.docTypeName = p.docTypeName;
	
	this.docType = null;
	
	this.windowType = p.windowType; 
	
	this.batchSubmitBtnId = p.batchSubmitBtnId;
	this.batchDriveBtnId = p.batchDriveBtnId;
	
	//是否支持双击编辑
	this.isDoubleClickEdit = p.isDoubleClickEdit == undefined ? true : p.isDoubleClickEdit;
	
	this.show = function(){
		this.initGridStyleCtrl();	  
		this.regOtherOperateCtrls();
	}	
	
	//注册其他控件操作方法
	this.regOtherOperateCtrls = function(){
		$("#" + this.batchSubmitBtnId).click(function(){
			that.batchSubmitDocuments();
		});
		
		$("#" + this.batchDriveBtnId).click(function(){
			that.batchDriveDocuments();
		});
	}
	
	//获取单据状态信息
	this.getDocumentStatus = function(row, instanceStepTable){ 
		var stepId = row.getValue("stepid");
		var status = instanceStepTable[stepId].currentStatus;
		return status;
	}			
	
	//初始化grid方式控件
	this.initGridStyleCtrl = function(){
		//增加状态显示列 
		var colModel = p.viewModel.colModel;
		p.viewModel.colModel = new Array();
		p.viewModel.colModel.push(colModel[0]);
		p.viewModel.colModel.push({name:"doccurrentstatus",
			label:"单据状态",
			width:100,
			hidden:false,
			sortable:false, 
			search:false,
			resizable:true,
			editable:false,
			canEdit:false 
		});
		for(var i=1;i<colModel.length;i++){
			p.viewModel.colModel.push(colModel[i]);
		}
	
		p.colModel = p.viewModel.colModel;
		var gridStyleCtrl = new NcpGrid(p); 
		gridStyleCtrl.setGridOtherParam = function(initParam){
			if(that.isDoubleClickEdit){
				initParam.ondblClickRow = function(rowid, iRow, iCol, e){   
					var row = gridStyleCtrl.datatable.rows(rowid);  
					var idValue = row.getValue(gridStyleCtrl.dataModel.idFieldName);  
					that.showDetailInfo({idValue:idValue, row:row, pageUrl: that.getDetailPageUrl(row)}); 
				}
			}
		}
		this.gridStyleCtrl = gridStyleCtrl;
		this.initGridStyleEvent(gridStyleCtrl);
		gridStyleCtrl.show();
	}
	
	this.getDetailPageUrl = function(row){ 
		var pageUrl = "";
		if(that.windowType == "create"){
			pageUrl = that.docType.createPageUrl;
		}
		else if(that.windowType == "query"){
			pageUrl = that.docType.queryPageUrl;
		}
		else{
			var instanceStep = that.gridStyleCtrl.instanceStepTable[row.getValue("stepid")];
			if(that.windowType == "drive"){
				pageUrl = instanceStep.actionPageUrl;
			}
			else{
				pageUrl = instanceStep.reviewPageUrl;
			}
		}
		return pageUrl;
	}

	//初始化嵌入的窗口
	this.initDetailPage = function(param){
		if(this.iframeId == null){
			var iframeId = cmnPcr.getRandomValue();
			this.iframeId = iframeId;
			var iframeHtml = "<iframe id=\"" + iframeId + "\" style=\"width:100%;height:100%;display:none;\" frameborder=\"0\"/>";  
			$("#" + that.containerId).append(iframeHtml);
		}
		var initParam =  {  
				isRefreshAfterSave:p.isRefreshAfterSave,  
				sheetName:that.sheetModel.name,
				docTypeName:that.docTypeName,
				windowType:that.windowType
			};
		initParam.isNew = param.isNew;
		initParam.isEdit = param.isEdit;
		initParam.idValue = param.idValue;
		initParam.instanceId = param.instanceId;
		initParam.row = param.row;
		
		//card方式保存后刷新grid方式下的行，这里存在新建保存和修改保存两种情况
		initParam.refreshGridRow = function(p){
			var refreshSysWhere = {parttype:"field", field:that.gridStyleCtrl.dataModel.idFieldName, operator:"=", value: p.idValue.toString() };
			var sysWhere = that.gridStyleCtrl.sysWhere;
			if(sysWhere != null){
				sysWhere.push(refreshSysWhere);
			}
			that.gridStyleCtrl.doPage({pageNumber:1, 
				onePageRowCount:1, 
				idValue:p.idValue, 
				instanceId:p.instanceId, 
				isRefreshOneLine:true}); 			
			sysWhere.remove(refreshSysWhere);
			/* 
			that.gridStyleCtrl.sysWhere = [];
			that.gridStyleCtrl.doPage({pageNumber:1, 
				onePageRowCount:1, 
				idValue:p.idValue, 
				instanceId:p.instanceId, 
				isRefreshOneLine:true}); 
			
			sysWhere.remove(refreshSysWhere);
			that.gridStyleCtrl.sysWhere = null;
			*/
		}
		
		initParam.backToGrid = function(p){
			$("#" + iframeId).attr("display", "none");
			//显示grid方式下的控件
			var gridChildren = $("#" + that.containerId).children();
			for(var i=0;i<gridChildren.length;i++){
				if($(gridChildren[i]).attr("id") != that.iframeId){
					$(gridChildren[i]).css("display","block");
				}
			}
			that.gridStyleCtrl.fulfill();
		} 
		that.detailPageParam = initParam;
		window.multiStyleWinInitParam = initParam;  
		$("#" + this.iframeId).attr("src", param.pageUrl);
		this.ShowDetailPage();
	}
	
	//显示嵌入的窗口
	this.ShowDetailPage = function(){
		//隐藏grid方式下的控件
		var gridChildren = $("#" + that.containerId).children();
		for(var i=0;i<gridChildren.length;i++){
			if($(gridChildren[i]).attr("id") != that.iframeId){
				$(gridChildren[i]).css("display", "none");
			}
		} 
		$("#" + that.iframeId).css("display", "block"); 
	}
	
	//显示详细信息
	this.showDetailInfo = function(param){	 
		this.initDetailPage(param); 
		this.ShowDetailPage();
	}
	
	this.getInstanceStepTable = function(instanceStepRows){
		var instanceStepTable = {};
		for(var i = 0; i < instanceStepRows.length; i++){
			var instanceStepRow = instanceStepRows[i];
			var instanceStepJson = that.getInstanceStep(instanceStepRow);
			instanceStepTable[instanceStepJson["stepId"]] = instanceStepJson;
		}
		return instanceStepTable;
	}
	
	this.getDocType = function(docTypeRow){
		var docType = {
			id: docTypeRow["id"],
			id: docTypeRow["sheetName"],
			createPageUrl: docTypeRow["createPageUrl"],
			queryPageUrl: docTypeRow["queryPageUrl"]			
		}
		return docType;
	}
	
	this.getInstanceStep = function(instanceStepRow){ 
		var instanceStepJson = {};
		instanceStepJson["stepId"] = instanceStepRow["stepId"];
		instanceStepJson["instanceId"] = instanceStepRow["instanceId"];
		instanceStepJson["actionPageUrl"] = decodeURIComponent(instanceStepRow["actionPageUrl"]);
		instanceStepJson["reviewPageUrl"] = decodeURIComponent(instanceStepRow["reviewPageUrl"]);
		instanceStepJson["sheetName"] = instanceStepRow["sheetName"];
		instanceStepJson["docId"] = instanceStepRow["docId"];
		instanceStepJson["workflowId"] = instanceStepRow["workflowId"];
		instanceStepJson["abstractNote"] = decodeURIComponent(instanceStepRow["abstractNote"]);
		instanceStepJson["currentStatus"] = decodeURIComponent(instanceStepRow["currentStatus"]);
		instanceStepJson["currentNodes"] = instanceStepRow["currentNodes"];
		instanceStepJson["isEnd"] = "Y" == instanceStepRow["isEnd"];
		instanceStepJson["isBegin"] = "Y" == instanceStepRow["isBegin"];
		return instanceStepJson;
	}
	
	this.initGridStyleEvent = function(gridStyleCtrl){	

		if(that.sheetModel != null){ 
			gridStyleCtrl.baseDelete=function(param){
				var requestParam = {serviceName : "documentNcpService",
					waitingBarParentId : that.containerId,
					funcName : "delete", 
					successFunc : function(obj){  
						gridStyleCtrl.setCtrlStatus(formStatusType.browse);
						gridStyleCtrl.processDeleteData(param);
						gridStyleCtrl.afterBaseDelete(param); 
						gridStyleCtrl.afterDoDelete(param); 
					},
					args : {requestParam:cmnPcr.jsonToStr({
						sheetName: that.sheetModel.name,
						docTypeName: encodeURIComponent(that.docTypeName),
						deleteRows:param.existRowIdValues,
						otherRequestParam:param.otherRequestParam
					})}
				};
				gridStyleCtrl.ProcessServerAccess(requestParam); 
			} 
		}
				
		//翻页 modified by ls 20160612
		gridStyleCtrl.basePage = function(param) {
			var requestParam = {
				serviceName : "documentNcpService",
				waitingBarParentId : gridStyleCtrl.containerId,
				funcName : "select",
				successFunc : function(obj) {
					param.datatable = gridStyleCtrl.getDataTableFromBackInfo(obj.result.table.rows);
					for(var i = 0; i < obj.result.table.rows.length; i++){
						var sourceRow = obj.result.table.rows[i];
						var destRow = param.datatable.getRowByIndex(i);
						destRow.setValue("stepid", sourceRow["stepid"]);
					}
					param.instanceStepTable = that.getInstanceStepTable(obj.result.instanceStepTable);
					param.sumRow = null; 
					param.totalRowCount = obj.result.rowCount;
					
					param.docType = that.getDocType(obj.result.docType);
					
					gridStyleCtrl.setCtrlStatus(formStatusType.browse);
					gridStyleCtrl.processPageData(param);
					gridStyleCtrl.afterBasePage(param);
					gridStyleCtrl.afterDoPage(param);
				},
				args : {
					requestParam : cmnPcr
							.jsonToStr( {
								docTypeName:encodeURIComponent(that.docTypeName),
								windowType: that.windowType,
								dataName : gridStyleCtrl.dataModel.name,
								getDataType : "page", 
								currentPage : param.currentPage == null ?  gridStyleCtrl.pageNumber : param.currentPage, 
								pageSize : param.onePageRowCount == null ? gridStyleCtrl.onePageRowCount : param.onePageRowCount,	
								isGetSum : gridStyleCtrl.isGetSum,
								isGetCount : gridStyleCtrl.isGetCount,
								where : param.where == undefined ? (gridStyleCtrl.where == undefined ? [] : gridStyleCtrl.where) : param.where,
								sysWhere : gridStyleCtrl.sysWhere == undefined ? [] : gridStyleCtrl.sysWhere,
								orderby : gridStyleCtrl.orderby == undefined ? [] : gridStyleCtrl.orderby,
								previousField : param.previousField == undefined ? "" : param.previousField,
								previousData : param.previousData == undefined ? "" : param.previousData,
								popDataField : param.popDataField == undefined ? "" : param.popDataField,
								otherRequestParam:param.otherRequestParam
							})
				}
			};
			gridStyleCtrl.ProcessServerAccess(requestParam);
		}
	
		gridStyleCtrl.afterBasePage = function(param){
			that.docType = param.docType;
			if(gridStyleCtrl.instanceStepTable == null){
				gridStyleCtrl.instanceStepTable = {};
			}
			for(var stepId in param.instanceStepTable){
				gridStyleCtrl.instanceStepTable[stepId] = param.instanceStepTable[stepId];
			} 
	    	 
			if(param.isRefreshOneLine){
			    var rowId = gridStyleCtrl.datatable.getRowIdByIdField(param.idValue, gridStyleCtrl.dataModel.idFieldName);
			    if(rowId == null){
			    	//card方式下刚刚保存了新增记录
			    	var row = param.datatable.getRowByIdField(param.idValue, gridStyleCtrl.dataModel.idFieldName);
			    	rowId = row.rowId;
			    	var docCurrentStatus = that.getDocumentStatus(row, param.instanceStepTable)
			    	row.setValue("docCurrentStatus", docCurrentStatus);
			    	gridStyleCtrl.datatable.addRow(rowId, row);
					$(gridStyleCtrl.gridCtrl).jqGrid("addRowData",rowId, row.allCells());
					gridStyleCtrl.initRowSelectContrl(rowId);
					gridStyleCtrl.totalRowCount = gridStyleCtrl.totalRowCount + 1;
					gridStyleCtrl.refreshPaginationCtrl();
			    }
			    else{
			    	//card方式下刚刚保存、处理了已有记录
			    	
			    	var row = param.datatable.getRowByIdField(param.idValue, gridStyleCtrl.dataModel.idFieldName);
			    	if(row != null){ 
				    	row.rowId = rowId;
				    	var docCurrentStatus = that.getDocumentStatus(row, param.instanceStepTable)
				    	row.setValue("docCurrentStatus", docCurrentStatus);
				    	gridStyleCtrl.datatable.replaceRow(rowId, row);
						$(gridStyleCtrl.gridCtrl).jqGrid("setRowData",rowId, row.allCells()); 
						gridStyleCtrl.refreshPaginationCtrl();			    		
					}	 
					else{
						var selRowId = $(that.gridStyleCtrl.gridCtrl).jqGrid("getGridParam", "selrow"); 
						$(that.gridStyleCtrl.gridCtrl).jqGrid("delRowData", selRowId);
						that.gridStyleCtrl.datatable.remove(selRowId); 
						that.gridStyleCtrl.afterRowSelect(undefined); 
					}		    	
			    }				
			}
			else{
				$(gridStyleCtrl.gridCtrl).jqGrid("clearGridData",true);
				
				gridStyleCtrl.datatable = param.datatable;
				 
				for(var rowId in param.datatable.allRows()){  
					var row = param.datatable.rows(rowId);
			    	var docCurrentStatus = that.getDocumentStatus(row, param.instanceStepTable)
			    	var row = param.datatable.rows(rowId);
			    	row.setValue("docCurrentStatus", docCurrentStatus);
					$(gridStyleCtrl.gridCtrl).jqGrid("addRowData", rowId, row.allCells());
					gridStyleCtrl.initRowSelectContrl(rowId);
				}
				
				gridStyleCtrl.totalRowCount = param.totalRowCount;
				gridStyleCtrl.pageNumber = param.pageNumber;
				gridStyleCtrl.refreshPaginationCtrl();
			}
		}
		var externalObject = {
			beforeDoAdd:function(param){  
				that.showDetailInfo({isNew:true, pageUrl: that.getDetailPageUrl()}); 
				return false;
			},
			beforeDoEdit:function(param){ 
				var selRowId = $(gridStyleCtrl.gridCtrl).jqGrid("getGridParam", "selrow");
				if(selRowId != undefined){
					var row = gridStyleCtrl.datatable.rows(selRowId);  
					var idValue = row.getValue(gridStyleCtrl.dataModel.idFieldName);  					
					that.showDetailInfo({isEdit:true, idValue:idValue, row:row, pageUrl: that.getDetailPageUrl(row)});
				}
				else{
					msgBox.alert({info:"请先选中记录."});
				}
			    return false;
			} 
		};
		that.gridStyleCtrl.addExternalObject(externalObject); 
	}
		
	this.batchSubmitWindow = null;
	this.showBatchSubmitWindow = function(batchSubmitParams, rowIndex, rowCount){
    	if(this.batchSubmitWindow == null){
			var popContainer = new PopupContainer( {
				width : 300,
				height : 100,
				top : 50
			});
			
			popContainer.show(function(){
				that.batchSubmitDocument(batchSubmitParams, rowIndex, rowCount);
			});
	  
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var progressContainerId = frameId + "_progressContainer";
			var buttonContainerId = frameId + "_buttonContainer"; 
			var cancelBtnId = frameId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:20px;line-height:20px;font-size:13px;text-align:center;font-weight:800;\"></div>"
			+ "<div id=\"" + progressContainerId + "\" style=\"witdh:100%;height:50px;font-size:11px;\"></div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;\"><input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:60px;height:20px;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			$("#" + titleId).text("显示提交进度");  
			$("#" + cancelBtnId).click(function(){ 
				that.batchSubmitWindow.close();
				that.batchSubmitWindow = null;
			});	 
			popContainer.progressContainerId = progressContainerId;
			this.batchSubmitWindow = popContainer;
		}   
		$("#" + that.batchSubmitWindow.progressContainerId).text("正在提交......" + rowIndex + "/" + rowCount);
	}
	
	this.batchSubmitDocument = function(batchSubmitParams, rowIndex, rowCount){	
		var batchSubmitParam = batchSubmitParams[rowIndex];		
		var requestParam ={
			serviceName : "documentNcpService",
			waitingBarParentId : that.containerId,
			funcName : "submit", 
			successFunc : function(obj){
				rowIndex++; 
				//删除记录				
				that.showBatchSubmitWindow(batchSubmitParams, rowIndex, rowCount);	
				
				if(rowCount > rowIndex) {
					//删除下一条记录 
					setTimeout(function(){
						if(!that.batchSubmitWindow.isHidden) {
							that.batchSubmitDocument(batchSubmitParams, rowIndex, rowCount);
						}
					}, 100); 
				}
				else{
					that.batchSubmitWindow.close();
					that.batchSubmitWindow = null;
					msgBox.alert({title:"提示",info:"提交完成"});
					that.gridStyleCtrl.doPage({pageNumber: that.pageNumber});	 
				}
			},
			failFunc:function(obj){
				msgBox.alert({title:"提示",info:obj.message});
				that.gridStyleCtrl.doPage({pageNumber: that.pageNumber});	 
			}, 
			args : {requestParam:cmnPcr.jsonToStr({
				sheetName: batchSubmitParam.sheetName,
				docTypeName:encodeURIComponent(batchSubmitParam.docTypeName),
				windowType: "create",
				docId: batchSubmitParam.docId,
				note: "" 
			})}
		}; 
		that.gridStyleCtrl.ProcessServerAccess(requestParam); 
	}
	
	this.batchSubmitDocuments = function(){
		var rowIds = that.gridStyleCtrl.getSelectedRowIds();
		if(rowIds.length > 0) {
			var submitRows = new Array();
			var errors = new Array();
			for(var i=0; i<rowIds.length; i++){
				var rowId = rowIds[i];				
				var row = that.gridStyleCtrl.datatable.rows(rowId); 
				var instanceStep = that.gridStyleCtrl.instanceStepTable[row.getValue("stepid")];
				if(instanceStep.isBegin) {
					submitRows.push({
						rowId: rowId,
						sheetName: instanceStep.sheetName,
						docId: instanceStep.docId,
						docTypeName: that.docTypeName,
						isBegin: instanceStep.isBegin
					});
				}
				else{
					var index = that.gridStyleCtrl.datatable.getRowIndex(rowId);
					errors.push("第" + (index + 1) + "个单据已提交, 不能重复提交");
				}
			}
			if(errors.length > 0){
				msgBox.alert({info:cmnPcr.arrayToString(errors, "\r\n")});
			}
			else {
				var rowCount = submitRows.length; 
				if(msgBox.confirm({info:"确认要提交这" + rowCount + "个单据吗？"})) {
					that.showBatchSubmitWindow(submitRows, 0, rowCount);
				}
			}	
		}
		else {
			msgBox.alert({info:"请选择要提交的单据!"});
		}
	}	
	
	this.batchDriveWindow = null;
	this.showBatchDriveWindow = function(batchDriveParams, rowIndex, rowCount){
    	if(this.batchDriveWindow == null){
			var popContainer = new PopupContainer( {
				width : 300,
				height : 100,
				top : 50
			});
			
			popContainer.show(function(){
				that.batchDriveDocument(batchDriveParams, rowIndex, rowCount);
			});
	  
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var progressContainerId = frameId + "_progressContainer";
			var buttonContainerId = frameId + "_buttonContainer"; 
			var cancelBtnId = frameId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:20px;line-height:20px;font-size:13px;text-align:center;font-weight:800;\"></div>"
			+ "<div id=\"" + progressContainerId + "\" style=\"witdh:100%;height:50px;font-size:11px;\"></div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;\"><input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:60px;height:20px;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			$("#" + titleId).text("显示处理进度");  
			$("#" + cancelBtnId).click(function(){ 
				that.batchDriveWindow.close(); 
				that.batchDriveWindow = null; 
			});	 
			popContainer.progressContainerId = progressContainerId;
			this.batchDriveWindow = popContainer;
		}  
		$("#" + that.batchDriveWindow.progressContainerId).text("正在处理......" + rowIndex + "/" + rowCount);
	}
	
	this.batchDriveDocument = function(batchDriveParams, rowIndex, rowCount){	
		var batchDriveParam = batchDriveParams[rowIndex];		
		var requestParam ={
			serviceName : "documentNcpService",
			waitingBarParentId : that.containerId,
			funcName : "drive", 
			successFunc : function(obj){
				rowIndex++; 
				//删除记录				
				that.showBatchDriveWindow(batchDriveParams, rowIndex, rowCount);	
				
				if(rowCount > rowIndex) {
					//删除下一条记录 
					setTimeout(function(){
						if(!that.batchDriveWindow.isHidden) {
							that.batchDriveDocument(batchDriveParams, rowIndex, rowCount);
						}
					}, 100); 
				}
				else{
					that.batchDriveWindow.close(); 
					that.batchDriveWindow = null; 
					msgBox.alert({title:"提示",info:"处理完成"});
					that.gridStyleCtrl.doPage({pageNumber: that.pageNumber});	 
				}
			},
			failFunc:function(obj){
				msgBox.alert({title:"提示",info:obj.message});
				that.gridStyleCtrl.doPage({pageNumber: that.pageNumber});	 
			}, 
			args : {requestParam:cmnPcr.jsonToStr({
				sheetName: batchDriveParam.sheetName,
				docTypeName:encodeURIComponent(batchDriveParam.docTypeName),
				windowType: "create",
				docId: batchDriveParam.docId,
				stepId: batchDriveParam.stepId,
				note: encodeURIComponent("同意")
			})}
		}; 
		that.gridStyleCtrl.ProcessServerAccess(requestParam); 
	}
	
	this.batchDriveDocuments = function(){
		var rowIds = that.gridStyleCtrl.getSelectedRowIds();
		if(rowIds.length > 0) {
			var driveRows = new Array();
			var errors = new Array();
			for(var i=0; i<rowIds.length; i++){
				var rowId = rowIds[i];
				var row = that.gridStyleCtrl.datatable.rows(rowId); 
				var instanceStep = that.gridStyleCtrl.instanceStepTable[row.getValue("stepid")];
				driveRows.push({
					rowId: rowId,
					sheetName: instanceStep.sheetName,
					docId: instanceStep.docId,
					docTypeName: that.docTypeName,
					stepId: instanceStep.stepId
				}); 
			} 
			var rowCount = driveRows.length; 
			if(msgBox.confirm({info:"确认要处理这" + rowCount + "个单据吗？"})) {
				that.showBatchDriveWindow(driveRows, 0, rowCount);
			} 
		}
		else {
			msgBox.alert({info:"请选择要处理的单据!"});
		}
	}		 
}

function NcpDocumentMultiStyleSheetWin(initParam){
	var that = this;
	
	this.windowType = initParam.windowType;
	this.submitBtnId = initParam.submitBtnId;
	this.driveBtnId = initParam.driveBtnId;
	this.showLogBtnId = initParam.showLogBtnId;
	this.getBackBtnId = initParam.getBackBtnId;
	this.sendBackBtnId = initParam.sendBackBtnId;
	this.showStatusDivId = initParam.showStatusDivId; 
	
	this.sheetCtrl = null;
	this.instance = null;
	
	this.refreshOperateButtons = function(){
		switch(this.windowType){ 
			case "create":{
				if(this.instance == null){
					$("#" + this.submitBtnId).css("display", "block"); 
					$("#" + this.getBackBtnId).css("display", "none"); 
				}
				else if(this.instance.isBegin){
					$("#" + this.submitBtnId).css("display", "block"); 
					$("#" + this.getBackBtnId).css("display", "none"); 
				}
				else {
					$("#" + this.submitBtnId).css("display", "none"); 
					$("#" + this.getBackBtnId).css("display", "block"); 
				}
				break;
			} 
			case "drive":{
				if(this.instance == null){
					$("#" + this.driveBtnId).css("display", "none"); 
					$("#" + this.sendBackBtnId).css("display", "none"); 
				}
				else {
					$("#" + this.driveBtnId).css("display", "block"); 
					$("#" + this.sendBackBtnId).css("display", "block"); 
				} 
				break;
			}	
			case "review":{  
				$("#" + this.getBackBtnId).css("display", "block");  
				break;
			}			
		}
	}
	
	this.submit = function(){	
		var mainCardCtrl = that.sheetCtrl.getMainCardCtrl();
		if(mainCardCtrl.currentStatus == formStatusType.browse){
			if(msgBox.confirm({info:"确认提交此单据吗?"})){
				var requestParam ={
					serviceName : "documentNcpService",
					waitingBarParentId : that.sheetCtrl.containerId,
					funcName : "submit", 
					successFunc : function(obj){
						that.instance = that.getInstance(obj.result.instance);   
						that.refreshOperateButtons(); 
						that.showStatus();
				
						if(initParam.refreshGridRow != null){
							initParam.refreshGridRow({idValue:that.getDocId()});
						}
					},
					failFunc:function(obj){
						msgBox.alert({title:"提示",info:obj.message});	 
					}, 
					args : {requestParam:cmnPcr.jsonToStr({
						sheetName: that.sheetCtrl.sheetModel.name,
						docTypeName:encodeURIComponent(that.sheetCtrl.docTypeName),
						windowType: that.sheetCtrl.windowType,
						docId: that.getDocId(),
						note: "" 
					})}
				}; 
				mainCardCtrl.ProcessServerAccess(requestParam); 
			}
		}
		else{
			msgBox.alert({title:"提示",info:"请先保存单据"});	 
		}
	}
	
	this.inputNoteWindow = null;
    this.showInputNoteWindow = function(p) { 
    	if(this.inputNoteWindow == null){
			var popContainer = new PopupContainer( {
				width : 400,
				height : 200,
				top : 50
			});
			
			popContainer.show();
	  
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var inputNoteContainerId = frameId + "_inputNoteContainer";
			var inputNoteId = frameId + "_inputNote";
			var buttonContainerId = frameId + "_buttonContainer";
			var okBtnId = frameId + "_ok";
			var cancelBtnId = frameId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:20px;line-height:20px;font-size:13px;text-align:center;font-weight:800;\"></div>"
			+ "<div id=\"" + inputNoteContainerId + "\" style=\"witdh:100%;height:150px;font-size:11px;\">"
			+ "<textarea id=\"" + inputNoteId + "\" style=\"width:395px;height:140px;\"></textarea>"
			+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;\"><input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:60px;height:30px;\" />&nbsp;<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:60px;height:30px;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			$("#" + titleId).text("请输入审批意见");     
			$("#" + okBtnId).click(function(){
				var note = $("#" + that.inputNoteWindow.inputNodeId).val();
				p.driveDocument(note);
			});
			$("#" + cancelBtnId).click(function(){ 
				that.inputNoteWindow.hide(); 
			});	 
			that.inputNoteWindow = popContainer;
			that.inputNoteWindow.inputNodeId = inputNoteId; 
		}
		else{
			that.inputNoteWindow.show();
		}
		$("#" + that.inputNoteWindow.inputNodeId).val(p.defaultNote);
    }	
		
	this.drive = function(){	
		var mainCardCtrl = that.sheetCtrl.getMainCardCtrl();
		if(mainCardCtrl.currentStatus == formStatusType.browse){ 
			this.showInputNoteWindow({
				defaultNote:"同意",
				driveDocument:function(note){
					var requestParam ={
						serviceName : "documentNcpService",
						waitingBarParentId : that.sheetCtrl.containerId,
						funcName : "drive", 
						successFunc : function(obj){	
							msgBox.alert({title:"提示",info:"处理完成"});	 			
							if(initParam.refreshGridRow != null){
								initParam.refreshGridRow({idValue:that.getDocId()});
							}
							initParam.backToGrid({});
						},
						failFunc:function(obj){
							msgBox.alert({title:"提示",info:obj.message});	 
						}, 
						args : {requestParam:cmnPcr.jsonToStr({
							sheetName: that.sheetCtrl.sheetModel.name,
							docTypeName:encodeURIComponent(that.sheetCtrl.docTypeName),
							windowType: that.sheetCtrl.windowType,
							docId: that.getDocId(),
							stepId: initParam.row.getValue("stepid"),
							note: encodeURIComponent(note)
						})}
					}; 
					mainCardCtrl.ProcessServerAccess(requestParam); 
				}
			});
		}
		else{
			msgBox.alert({title:"提示",info:"请先保存单据"});	 
		}
	}
	
	this.getBack = function(){
		if(msgBox.confirm({info:"确认取回此单据吗?"})){
			var requestParam ={
				serviceName : "documentNcpService",
				waitingBarParentId : that.sheetCtrl.containerId,
				funcName : "getBack", 
				successFunc : function(obj){
					that.instance = that.getInstance(obj.result.instance);  
					that.refreshOperateButtons();  
					that.showStatus();
			
					if(initParam.refreshGridRow != null){
						initParam.refreshGridRow({idValue:that.getDocId()});
					}
				},
				failFunc:function(obj){
					msgBox.alert({title:"提示",info:obj.message});	 
				}, 
				args : {requestParam:cmnPcr.jsonToStr({
					sheetName: that.sheetCtrl.sheetModel.name,
					docTypeName:encodeURIComponent(that.sheetCtrl.docTypeName),
					windowType: that.sheetCtrl.windowType,
					docId: that.getDocId(),
					note: "" 
				})}
			}; 
			var mainCardCtrl = that.sheetCtrl.getMainCardCtrl();
			mainCardCtrl.ProcessServerAccess(requestParam); 
		}
	}	
	
	this.sendBackWindow = null;
    this.showSendBackWindow = function(p) { 
    	if(this.sendBackWindow == null){
			var popContainer = new PopupContainer( {
				width : 300,
				height : 300,
				top : 50
			});
			
			popContainer.show();
	  
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var selectStepContainerId = frameId + "_selectStepContainer"; 
			var buttonContainerId = frameId + "_buttonContainer";
			var okBtnId = frameId + "_ok";
			var cancelBtnId = frameId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:20px;line-height:20px;font-size:13px;text-align:center;font-weight:800;\"></div>"
			+ "<div id=\"" + selectStepContainerId + "\" style=\"width:100%;height:250px;font-size:11px;\"><div name=\"gridDiv\" class=\"ncpGridDiv\" style=\"width:300px;height:250px;border-color:transparent;\"><table name=\"gridCtrl\" ></table></div></div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;\"><input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:60px;height:30px;\" />&nbsp;<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:60px;height:30px;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			$("#" + titleId).text("退回至");   
			var initSelStepParam = { 
					containerId:selectStepContainerId,   
					multiselect:false,  
					dataModel:dataModels.wf_InstanceStepForBackList,
					viewModel:viewModels.wf_InstanceStepForBackList,
					onePageRowCount:100,
					isShowData:false
				};
			var selectStepGrid = new NcpGrid(initSelStepParam);    
			selectStepGrid.show();   
			$("#" + okBtnId).click(function(){  
				var selRowId = $(selectStepGrid.gridCtrl).jqGrid("getGridParam", "selrow");
				if(selRowId != undefined){
					var row = selectStepGrid.datatable.rows(selRowId);  
					var stepId = row.getValue("id");  
					p.sendBackDocument(stepId);
				}
				else{
					msgBox.alert({info:"请选择要退回至的处理环节"});
				}
			});
			$("#" + cancelBtnId).click(function(){ 
				that.sendBackWindow.hide(); 
			});	  
			this.sendBackWindow = popContainer;
			this.sendBackWindow.selectStepGrid = selectStepGrid;
		}
		else{
			this.sendBackWindow.show();
		}
		this.sendBackWindow.selectStepGrid.sysWhere = [{parttype:"field", field:"instanceid", operator:"=", value:p.instanceId}];
		this.sendBackWindow.selectStepGrid.doPage({pageNumber:1});
    }
    
	this.sendBack = function(){
		this.showSendBackWindow({
			instanceId:that.instance.instanceId,
			sendBackDocument:function(toStepId){
				var requestParam ={
					serviceName : "documentNcpService",
					waitingBarParentId : that.sheetCtrl.containerId,
					funcName : "sendBack", 
					successFunc : function(obj){			
						if(initParam.refreshGridRow != null){
							initParam.refreshGridRow({idValue:that.getDocId()});
						}
						initParam.backToGrid({});
					},
					failFunc:function(obj){
						msgBox.alert({title:"提示",info:obj.message});	 
					}, 
					args : {requestParam:cmnPcr.jsonToStr({
						sheetName: that.sheetCtrl.sheetModel.name,
						docTypeName: that.sheetCtrl.docTypeName,
						windowType: that.sheetCtrl.windowType,
						docId: that.getDocId(),
						currentStepId:initParam.row.getValue("stepid"),
						backToStepId:toStepId,
						note: "" 
					})}
				}; 
				var mainCardCtrl = that.sheetCtrl.getMainCardCtrl();
				mainCardCtrl.ProcessServerAccess(requestParam); 
			}
		});
	}
	
	this.logWindow = null;
    this.showLogWindow = function(p) { 
    	if(this.logWindow == null){
			var popContainer = new PopupContainer( {
				width : 700,
				height : 500,
				top : 50
			});
			
			popContainer.show();
	  
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var logPageContainerId = frameId + "_logPageContainer"; 
			var buttonContainerId = frameId + "_buttonContainer";
			var okBtnId = frameId + "_ok";
			var cancelBtnId = frameId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:20px;line-height:20px;font-size:13px;text-align:center;font-weight:800;\"></div>"
			+ "<iframe id=\"" + logPageContainerId + "\" style=\"width:690px;height:450px;font-size:11px;border:0px;\"></iframe>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;\"><input type=\"button\" id=\"" + cancelBtnId +"\" value=\"关 闭\" style=\"width:60px;height:30px;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			$("#" + titleId).text("显示流程");    
			$("#" + cancelBtnId).click(function(){ 
				that.logWindow.hide(); 
			});	  
			this.logWindow = popContainer;
			this.logWindow.logPageContainerId = logPageContainerId;
		}
		else{
			this.logWindow.show();
		}
		$("#" + that.logWindow.logPageContainerId).attr("src", p.logPageUrl);
    }
	this.showLog = function(){
		this.showLogWindow({logPageUrl: workflowPath + "/management/workflowAndLogViewer.jsp?workflowid=" + that.instance.workflowId + "&instanceid=" + that.instance.instanceId});
	}
	
	this.showStatus = function(){
		if(this.instance == null){
			$("#" + this.showStatusDivId).text("制单");
		}
		else{
			$("#" + this.showStatusDivId).text(this.instance.currentStatus);
		} 
	}
	
	this.detailStatusWindow = null;
    this.showDetailStatusWindow = function(p) { 
    	if(this.detailStatusWindow == null){
			var popContainer = new PopupContainer( {
				width : 400,
				height : 300,
				top : 50
			});
			
			popContainer.show(function(){	
				if(p.instanceId != null){			
					var requestParam ={
						serviceName : "documentNcpService",
						waitingBarParentId : that.containerId,
						funcName : "getDetailStatus", 
						successFunc : function(obj){  
							var stepInfoArray = obj.result.detailStatus;
							var statusStr = "";
							var doesShowIndex = (stepInfoArray.length > 1);
							for(var i=0;i<stepInfoArray.length;i++){
								var stepInfo = stepInfoArray[i];
								statusStr += ((doesShowIndex ? (i + 1) + ") " : "") + decodeURIComponent(stepInfo.statusName)); 
								statusStr += (", 进入时间: " + stepInfo.inTime + ". ");

								var users = stepInfo.users; 
								if(users != null && users.length > 0){
									statusStr += "等待 ";
									for(var j=0;j<users.length;j++){	
										var u = users[j]; 
										statusStr += ((j == 0 ? "" : ",") +  u.userName);	 
									}
									statusStr += " 处理.";
								}
								
								var stepStatusName = "";
								switch(stepInfo.statusType){
									case "asynProcessing":{
										stepStatusName = "正在异步处理";
									}
									break;
									case "asynError":{
										stepStatusName = "异步处理出错";
									}
									break;
									
								}
								if(stepStatusName != "") {
									statusStr += (", 异步调用状态: " + stepStatusName);
								}
								statusStr += "\r\n";
								var invokes = stepInfo.invokes;
								var invokeStatusType = "";
								for(var j=0;j<invokes.length;j++){	
									var invoObj = invokes[j];
									var invokeStatusType = "";
									switch(invoObj.invokeStatusType){
										case "running":{
											invokeStatusType = "正在执行";
										}
										break;
										case "timeout":{
											invokeStatusType = "超时";
										}
										break;
										case "succeed":{
											invokeStatusType = "调用成功";
										}
										break;
										case "error":{
											invokeStatusType = "调用出错";
										}
										break;
									}
									
									statusStr += ("  异步调用操作:\r\n");
									statusStr += ("    创建时间: " + invoObj.createTime + "\r\n");
									statusStr += ("    调用时间: " + (invoObj.invokeTime == null ? "无" : invoObj.invokeTime) + "\r\n");	
									statusStr += ("    完成时间: " + (invoObj.endTime == null ? "无" : invoObj.endTime) + "\r\n");	
									statusStr += ("    检测时间: " + (invoObj.nextCheckTime == null ? "无" : invoObj.nextCheckTime) + "\r\n");	
									statusStr += ("    超时时间: " + (invoObj.timeoutTime == null ? "无" : invoObj.timeoutTime) + "\r\n");	 
									statusStr += ("    状态: " + invokeStatusType + "\r\n");	 
									statusStr += ("    描述: " + decodeURIComponent(invoObj.note) + "\r\n");
									statusStr += ("    -------------------------------\r\n");	 
								}
							}
							$("#" + that.detailStatusWindow.detailStatusContainerId).val(statusStr);
						},
						failFunc: function(obj){ 
							msgBox.alert({info: obj.message});
						},
						args : {requestParam:cmnPcr.jsonToStr({
							instanceId: p.instanceId
						})}
					};
					serverAccess.request(requestParam); 
				}
				else{
					var statusStr = $("#" + that.showStatusDivId).text();
				    $("#" + that.detailStatusWindow.detailStatusContainerId).val(statusStr);
				}
			});
	  
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var detailStatusContainerId = frameId + "_detailStatusContainer"; 
			var buttonContainerId = frameId + "_buttonContainer";
			var okBtnId = frameId + "_ok";
			var cancelBtnId = frameId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:20px;line-height:20px;font-size:13px;text-align:center;font-weight:800;\"></div>"
			+ "<textarea id=\"" + detailStatusContainerId + "\" readonly=\"readonly\" style=\"width:390px;height:240px;font-size:11px;border:1px #EEEEEE solid;\"></textarea>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;\"><input type=\"button\" id=\"" + cancelBtnId +"\" value=\"关 闭\" style=\"width:60px;height:30px;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			$("#" + titleId).text("当前状态");    
			$("#" + cancelBtnId).click(function(){ 
				that.detailStatusWindow.close(); 
				that.detailStatusWindow = null;
			});	  
			this.detailStatusWindow = popContainer; 
			this.detailStatusWindow.detailStatusContainerId = detailStatusContainerId; 
		}
    }
	this.showDetailStatus = function(){
		var instanceId = that.instance == null ? null : that.instance.instanceId;
		that.showDetailStatusWindow({
			instanceId : instanceId
		});
	}
	
	this.getDocId = function(){
		var docId = this.sheetCtrl.getMainCardIdFieldValue();
		return docId;
	} 
			
	this.initSheet = function(){
		initParam.isShowData = false;
		initParam.fromIndex = 0;
		initParam.onePageRowCount = 1;
		initParam.needTriggerServerAdd = true;
		var sheet = new NcpDocumentSheet(initParam); 
		
		this.initSheetEvent(sheet);
		
		sheet.show();	
		
		var mainCardCtrl = sheet.getMainCardCtrl();
		
		//为以后执行操作提供方法
		initParam.doAdd = function(addParam){
			mainCardCtrl.doAdd({});
		}
		initParam.doEdit = function(editParam){
			mainCardCtrl.sysWhere = [{parttype:"field", field:mainCardCtrl.dataModel.idFieldName, operator:"=", value: editParam.idValue.toString() }];
			mainCardCtrl.doPage({
				isEdit:true,
				pageNumber:1}); 
		}
		initParam.doShow = function(showParam){
			mainCardCtrl.sysWhere = [{parttype:"field", field:mainCardCtrl.dataModel.idFieldName, operator:"=", value: showParam.idValue.toString() }];
			mainCardCtrl.doPage({
				isEdit:false,
				pageNumber:1}); 
		}

		//第一次打开窗口，执行操作
		if(initParam.isNew){
			initParam.doAdd(initParam);
		}
		else if(initParam.isEdit){
			initParam.doEdit(initParam);
		}
		else{
			initParam.doShow(initParam);
		} 
		this.sheetCtrl = sheet;
	}
	
	this.getInstance = function(instanceRow){ 
		if(instanceRow == null){
			return null;
		}
		else{
			var instanceJson = {};
			instanceJson["instanceId"] = instanceRow["instanceId"];
			instanceJson["workflowId"] = instanceRow["workflowId"];
			instanceJson["docId"] = instanceRow["docId"];
			instanceJson["abstractNote"] = decodeURIComponent(instanceRow["abstractNote"]);
			instanceJson["currentStatus"] = decodeURIComponent(instanceRow["currentStatus"]);
			instanceJson["currentNodes"] = instanceRow["currentNodes"];
			instanceJson["isEnd"] = "Y" == instanceRow["isEnd"];
			instanceJson["isBegin"] = "Y" == instanceRow["isBegin"];
			return instanceJson;
		}
	}
	
	this.initSheetEvent = function(sheetCtrl){
		sheetCtrl.initOtherEvent = function(partModel, partCtrl, externalObject){
			if(sheetCtrl.getMainPartModel() == partModel){
				partCtrl.basePage = function(param) {
					var requestParam = {
						serviceName : "documentNcpService",
						waitingBarParentId : partCtrl.containerId,
						funcName : "select",
						successFunc : function(obj) {
							param.datatable = partCtrl.getDataTableFromBackInfo(obj.result.table.rows);
							param.instance = obj.result.instanceStepTable.length == 0 ? null : that.getInstance(obj.result.instanceStepTable[0]);
							param.sumRow = null;
							param.totalRowCount = obj.result.rowCount;
							partCtrl.setCtrlStatus(formStatusType.browse);
							partCtrl.processPageData(param);
							partCtrl.afterBasePage(param);
							partCtrl.afterDoPage(param);
						},
						args : {
							requestParam : cmnPcr
								.jsonToStr( {
									docTypeName:encodeURIComponent(sheetCtrl.docTypeName),
									windowType: sheetCtrl.windowType,
									dataName : partCtrl.dataModel.name,
									getDataType : "page", 
									currentPage : param.currentPage, 
									pageSize : partCtrl.onePageRowCount,			
									isGetSum : partCtrl.isGetSum,
									isGetCount : partCtrl.isGetCount,
									where : param.where == undefined ? (partCtrl.where == undefined ? [] : partCtrl.where) : param.where,
									sysWhere : partCtrl.sysWhere == undefined ? [] : partCtrl.sysWhere,
									orderby : partCtrl.orderby == undefined ? [] : partCtrl.orderby,
									previousField : param.previousField == undefined ? "" : param.previousField,
									previousData : param.previousData == undefined ? "" : param.previousData,
									popDataField : param.popDataField == undefined ? "" : param.popDataField,
									otherRequestParam:param.otherRequestParam
								})
						}
					};
					partCtrl.ProcessServerAccess(requestParam);
				}
			
				partCtrl.baseSave = function(param){
					
					//需要继续开发保存功能
				
					sheetCtrl.dealCacheBeforeSave();
					
					sheetCtrl.dealDocStatusCacheBeforeSave();
		
					var requestParam ={
						serviceName : "documentNcpService",
						waitingBarParentId : partCtrl.containerId,
						funcName : "save", 
						successFunc : function(obj){
							var dt = partCtrl.getDataTableFromBackInfo(obj.result.table.rows, obj.result.idValueToRowIds);  
							param.table = dt;
							
							//从idvalue到rowid的对应关系中，获取rowid到idvalue
							var rowIdToIdValues = {};
							for(var idValue in obj.result.idValueToRowIds){
								var rowId = obj.result.idValueToRowIds[idValue];
								rowIdToIdValues[rowId] = idValue;
							}
							param.rowIdToIdValues = rowIdToIdValues;
							
							param.instance = that.getInstance(obj.result.instance);
							
							partCtrl.setCtrlStatus(formStatusType.browse);
							partCtrl.processSaveData(param);
							partCtrl.afterBaseSave(param); 
							partCtrl.afterDoSave(param); 
						},
						failFunc:function(obj){
							msgBox.alert({title:"提示",info:obj.message});	
							//如果保存失败，那么递归重新设置子表为可编辑
						    var childPartModels = sheetCtrl.getChildPartModels(partCtrl.partModelName);
						    for(var i = 0;i<childPartModels.length;i++){
						    	var childPartModel = childPartModels[i];
						    	var childPartCtrl = sheetCtrl.partHash.get(childPartModel.name); 
						    	if(childPartCtrl != null){
						    		childPartCtrl.doEdit({});
						    	}
						    }
						},
						errorFunc:function(){
							//如果保存失败，那么递归重新设置子表为可编辑
						    var childPartModels = sheetCtrl.getChildPartModels(partCtrl.partModelName);
						    for(var i = 0;i<childPartModels.length;i++){
						    	var childPartModel = childPartModels[i];
						    	var childPartCtrl = sheetCtrl.partHash.get(childPartModel.name); 
						    	if(childPartCtrl != null){
						    		childPartCtrl.doEdit({});
						    	}
						    }
						},
						args : {requestParam:cmnPcr.jsonToStr({
							sheetName: sheetCtrl.sheetModel.name,
							docTypeName:encodeURIComponent(sheetCtrl.docTypeName),
							windowType: sheetCtrl.windowType,
							instanceId: sheetCtrl.instanceId,
							isRefreshAfterSave:sheetCtrl.isRefreshAfterSave,
							mainArgs: sheetCtrl.clientCacheData.mainArgs,
							lineArgs: sheetCtrl.clientCacheData.saveLineArgs,
							rowId2Ids: sheetCtrl.clientCacheData.rowId2Ids,
							otherRequestParam:param.otherRequestParam
						})}
					}; 
					partCtrl.ProcessServerAccess(requestParam); 		
				}	
				partCtrl.baseDelete=function(param){
					var requestParam ={serviceName : "documentNcpService",
							waitingBarParentId : this.containerId,
							funcName : "delete", 
							successFunc : function(obj){  
								partCtrl.setCtrlStatus(formStatusType.browse);
								partCtrl.processDeleteData(param);
								partCtrl.afterBaseDelete(param); 
								partCtrl.afterDoDelete(param); 
							},
							args : {requestParam:cmnPcr.jsonToStr({
								sheetName: that.sheetModel.name,
								docTypeName:encodeURIComponent(that.docTypeName),
								deleteRows:param.existRowIdValues,
								otherRequestParam:param.otherRequestParam
							})}
						};
					partCtrl.ProcessServerAccess(requestParam); 
				} 
			
				var otherExternalObject = {
					beforeDoEdit:function(param){ 
						if(that.windowType == "drive"){
							return true;
						} 
						else if(that.windowType == "create") {
							if(that.instance.isBegin){
								return true;
							}
							else {
								msgBox.alert({info:"不允许编辑已提交的单据"});
								return false;
							} 
						}
						else {
							return false;
						}
					},
					afterDoSave:function(param){
						var idValue = null; 
						if(param.insert.count()>0){ 
							//新建保存
							var row = param.insert.getRowByIndex(0);
							idValue = param.rowIdToIdValues[row.rowId];
						}
						else{
							//编辑保存
							var row = param.update.getRowByIndex(0);
							idValue = param.rowIdToIdValues[row.rowId];
						}
						if(param.instance != null){
							that.instance = param.instance;
						} 
						that.refreshOperateButtons();
						that.showStatus();

						if(initParam.refreshGridRow != null){
							initParam.refreshGridRow({idValue:idValue});
						}
					},
					beforeDoCancel:function(param){ 
						return true;
					},
					afterDoPage:function(param){
						if(param.isEdit){
							partCtrl.doEdit({});
						}						
						that.instance = param.instance;
						that.refreshOperateButtons();
						that.showStatus();
					},
					afterDoAdd:function(param){		
						that.instance = null;			
						that.refreshOperateButtons();
						that.showStatus();
					}
				}
				partCtrl.addExternalObject(otherExternalObject); 
			}			
		}
	}
	
	this.initOtherButtonEvent = function(){
		var mainCardCtrl = that.sheetCtrl.getMainCardCtrl();
		var ctrls = $("#" + that.sheetCtrl.containerId).find("a[name='backBtn']");
		if(ctrls.length>0){
			$(ctrls[0]).click(function(){ 
				if(initParam.backToGrid != null){
					if(mainCardCtrl.currentStatus == formStatusType.browse){
						initParam.backToGrid({});
					}
					else{
						mainCardCtrl.doCancel({});
						initParam.backToGrid({});
					}
				}
			}); 
		}		
		
		$("#" + this.submitBtnId).click(function(){
			that.submit();
		});		
		
		
		$("#" + this.driveBtnId).click(function(){
			that.drive();
		});		
		
		$("#" + this.getBackBtnId).click(function(){
			that.getBack();
		});
				
		$("#" + this.sendBackBtnId).click(function(){
			that.sendBack();
		});		
		
		$("#" + this.showLogBtnId).click(function(){
			that.showLog();
		});
		
		$("#" + this.showStatusDivId).click(function(){
			that.showDetailStatus();
		});
	}
	
	this.show = function(){
		this.initSheet();	 		
		this.initOtherButtonEvent();	 
	}
}

function NcpDocumentSheet(p){

	var that = this; 
	
	//基类
	this.base = NcpSheet;
	this.base(p);
	
	this.docTypeName = p.docTypeName;
	this.instanceId = p.instanceId;
	this.windowType = p.windowType;
	
	this.dealDocStatusCacheBeforeSave = function(){
	} 
	
	//用于扩展
	this.initExternalObject = function(partModel, dataViewCtrl){
		//新建记录时，允许获取默认值 
		dataViewCtrl.needTriggerServerAdd = true; 
	}
}