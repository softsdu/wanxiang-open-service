function NcpSheet(p){
	
	var that = this;
	
	//容器id
	this.containerId = p.containerId;  
	
	//表单模型
	this.sheetModel = p.sheetModel;
	
	//保存后刷新数据
	this.isRefreshAfterSave = p.isRefreshAfterSave;
	
	this.hideOperateColumn = p.hideOperateColumn;
	
	//获取表头部分模型
	this.getMainPartModel = function(){
		for(var pName in this.sheetModel.parts){
			var partModel = this.sheetModel.parts[pName];
			if(partModel.parentPartName == ""){
				return partModel;
			}
		}
	};
	
	//获取sheet模型的下级组成部门
	this.getChildPartModels = function(partName){
		var parts = [];
		for(var pName in this.sheetModel.parts){
			var part = this.sheetModel.parts[pName];
			if(part.parentPartName == partName){
				parts.push(part);
			}
		}
		return parts;
	};
	
	this.getViewModel = function(partModel){
		return viewModels[partModel.view];
	};
	
	this.getDataModel = function(partModel){
		return dataModels[viewModels[partModel.view].dataName];
	};
	
	//所有组成部分实例化后控件
	this.partHash = new Hashtable();
	
	//获取表头控件
	this.getMainCardCtrl = function(){
		return this.partHash.get(this.getMainPartModel().name);
	};
	
	//获取其它组成部分控件
	this.getPartCardCtrl = function(partName){
		return this.partHash.get(partName);
	};
	
	//用于扩展
	this.initExternalObject = function(partModel, dataViewCtrl){
		
	};
		
	this.initLayout = function(p){  
		var mainPartModel = this.getMainPartModel();
		var cardParam = { 
				containerId: p.containerId,
				idValue: p.idValue,	
				totalRowCount: p.totalRowCount,
				where: p.where,
				orderby: p.orderby,
				dataModel: this.getDataModel(mainPartModel), 
				isRefreshAfterSave: true,
				viewModel: this.getViewModel(mainPartModel),
				isShowData: p.isShowData == undefined ? true : p.isShowData
		};
		var mainCard = new NcpCard(cardParam);
		this.initMainPartEvents(mainPartModel, mainCard);
		mainCard.partModelName = mainPartModel.name;	
		this.partHash.add(mainPartModel.name, mainCard);
		this.initMiddleChildParts(mainPartModel, mainCard);
		this.initExternalObject(mainPartModel, mainCard);
		
		//增加needTriggerServerAdd,为true时触发后端onadd函数
		mainCard.needTriggerServerAdd = p.needTriggerServerAdd;
		
		mainCard.show();  
		
		that.autoSetSize();		
		
		that.initDetailTabbarEvent();
	};
	
	this.initDetailTabbarEvent = function(){
		$("#" + that.containerId + " .zlpCardDetailContainer .zlpCardDetailTabbar li a").click(function(){
			var linkElements = $("#" + that.containerId + " .zlpCardDetailContainer li a");
			var linkIndex = -1;
			for(var i = 0; i < linkElements.length; i++){
				var linkElement = linkElements[i];
				$(linkElement).parent().removeClass("active");
				if(linkElement == this){
					$(linkElement).parent().addClass("active");
					linkIndex = i;
				}
			}
			var detailContainers = $("#" + that.containerId + " .zlpCardDetailGridContainer");
			if(detailContainers.length >= 0 && detailContainers.length > linkIndex){
				for(var i = 0; i < detailContainers.length; i++){
					var detailContainer = detailContainers[i];
					$(detailContainer).removeClass("zlpCardDetailGridContainerActive");
					if(i == linkIndex){
						$(detailContainer).addClass("zlpCardDetailGridContainerActive");
						var sheetPart = $(detailContainer).attr("sheetPart");
						if(sheetPart != null && sheetPart.length > 0){
							var partGridCtrl = that.getPartCardCtrl(sheetPart);
							partGridCtrl.fulfill();
						}
					}
				}
			}
			else{
				msgBox.alert({info: "子表tabbar个数存在问题"});
			}
		});
	}
	
	//自动设置表头明细高度
	this.autoSetSize = function(){
		var mainTableHeight = $("#" + that.containerId + " .zlpCardMainTable").height() + 10; 
		$("#" + that.containerId + " .zlpCardMainContainer").height(mainTableHeight);
		$("#" + that.containerId + " .zlpCardDetailContainer").css({top: mainTableHeight + "px"});		
	}
	
	
	//获取表单组成部分对应的容器id
	this.getPartContainerId = function(partName){
		var tempCtrls = $("#" + this.containerId).find("div[sheetPart='" + partName + "']");
		if(tempCtrls.length == 0){
			return null;
		}
		else{
			var containerCtrl = tempCtrls[0];
			var id = $(containerCtrl).attr("id");
			if(id == undefined){
			    id = cmnPcr.getRandomValue();
			    $(containerCtrl).attr("id", id);
			}
			return id;
		}
	};

	//初始化表单组成部分控件
	this.initMiddleChildParts = function(parentPartModel, parentPart){
		var childPartModels = this.getChildPartModels(parentPartModel.name);
		for(var i = 0;i<childPartModels.length;i++){
			var partModel = childPartModels[i];			
			var partContainerId = this.getPartContainerId(partModel.name);	
			if(partContainerId != null){
				var gridParam = { 
					containerId:partContainerId,   
					multiselect:true,  
					dataModel:this.getDataModel(partModel), 
					onePageRowCount:1000, //子表最多显示1000行，超过1000行自定义排序会出错
					isRefreshAfterSave:true,
					viewModel:this.getViewModel(partModel),
					isShowData:false,
					columnLocalSort:true,
					hideOperateColumn: that.hideOperateColumn
				};
				var gridPart = new NcpGrid(gridParam); 
				this.initMiddlePartEvents(partModel, gridPart);
				gridPart.partModelName = partModel.name;
				this.partHash.add(partModel.name, gridPart);
				this.initLastChildParts(partModel, gridPart);
				this.initExternalObject(partModel, gridPart);
				gridPart.show();  
			}
		}
	};

	//初始化表单组成部分控件
	this.initLastChildParts = function(parentPartModel, parentPart){
		var childPartModels = this.getChildPartModels(parentPartModel.name);
		for(var i = 0;i<childPartModels.length;i++){
			var partModel = childPartModels[i];			
			var partContainerId = this.getPartContainerId(partModel.name);				
			var gridParam = { 
				containerId:partContainerId,   
				multiselect:true,  
				dataModel:this.getDataModel(partModel), 
				onePageRowCount:1000, //子表最多显示1000行，超过1000行自定义排序会出错
				isRefreshAfterSave:true,
				viewModel:this.getViewModel(partModel),
				isShowData:false,
				columnLocalSort:true,
				hideOperateColumn: that.hideOperateColumn
			};
			var gridPart = new NcpGrid(gridParam); 
			this.initLastPartEvents(partModel, gridPart);
			gridPart.partModelName = partModel.name;
			this.partHash.add(partModel.name, gridPart); 
			this.initExternalObject(partModel, gridPart);
			gridPart.show();  
		}
	};

	//客户端缓存的未更新到服务器端的数据
	/* 
	 mainArgs:{
	 	update:obj,
	 	insert:obj
	 },
 	 lineArgs:{
 	 	"p1":{
 	 		"r1":{
		 		update:obj,
		 		insert:obj,
		 		deleteRows:obj
	 		}
 	 	},
 	 	"p2":{
 	 		"r1":{
		 		update:obj,
		 		insert:obj,
		 		deleteRows:obj
	 		}
 	 	} 
 	 	"p3":{
 	 		"r2":{
		 		update:obj,
		 		insert:obj,
		 		deleteRows:obj 
	 		}
 	 		"r3":{
		 		update:obj,
		 		insert:obj,
		 		deleteRows:obj 	 		
 	 		}
 	 	}
 	 },
 	 lineTables:{
 	 	"p3":{
 	 		"r1":datatable,
 	 		"r2":datatable
 	 	}
 	 },
 	 rowId2Ids:{
 	 	"r1":111,
 	 	"r2":null
 	 } 
	*/

	this.initClientCacheData = function(){
		var cacheData = {mainArgs:{}, lineArgs:{}, lineTables:{}};
		for(var pName in this.sheetModel.parts){
			var partModel = this.sheetModel.parts[pName];
			if(partModel.parentPartName != ""){
				cacheData.lineArgs[partModel.name] = {};
				cacheData.lineTables[partModel.name] = {};
			}
		}
		return cacheData;
	};
	
	this.clientCacheData = this.initClientCacheData();
 	
	this.getLineCachePartArgs = function(partCtrl){
		var cachePartData = that.clientCacheData.lineArgs[partCtrl.partModelName][partCtrl.parentRowId];
		if(cachePartData == undefined){
			cachePartData = {update:null, insert:null, deleteRows:{}};
			that.clientCacheData.lineArgs[partCtrl.partModelName][partCtrl.parentRowId] = cachePartData;
		}
		return cachePartData;
	};
	
	this.getLineCachePartTable = function(partCtrl){
	    var rowTables = that.clientCacheData.lineTables[partCtrl.partModelName]; 
		var cachePartTable = rowTables[partCtrl.parentRowId];		
		return cachePartTable; 
	};
	
	this.setLineCachePartTable = function(partCtrl, cachePartTable){ 
		var rowTables = that.clientCacheData.lineTables[partCtrl.partModelName];   
		rowTables[partCtrl.parentRowId] = cachePartTable;  
	};
	
	//保存前处理缓存数据
	this.dealCacheBeforeSave = function(){
		var rowId2Ids = {};
		var saveLineArgs = {};
		this.clientCacheData.rowId2Ids = rowId2Ids;
		this.clientCacheData.saveLineArgs = saveLineArgs;
		var lineArgs = this.clientCacheData.lineArgs;
		var lineTables = this.clientCacheData.lineTables;

	    var mainPartModel = this.getMainPartModel();
		var mainPartCtrl = this.partHash.get(mainPartModel.name);
		var mainRow = mainPartCtrl.datatable.getRowByIndex(0);
		var mainIdValue = mainRow.getValue(mainPartCtrl.dataModel.idFieldName);
		rowId2Ids[mainRow.rowId] = mainIdValue == undefined ? "" : mainIdValue.toString();
		
	    var middlePartModels = this.getChildPartModels(mainPartModel.name);
	    for(var i=0;i<middlePartModels.length;i++){
	    	var middlePartModel = middlePartModels[i];
	    	var middlePartCtrl = this.partHash.get(middlePartModel.name);
	    	if(middlePartCtrl != null){
		    	var middleLineTable = lineTables[middlePartModel.name][mainRow.rowId];
		    	
		    	var mLineArgs = lineArgs[middlePartModel.name];
		    	var mSaveLineArgs = {};
		    	saveLineArgs[middlePartModel.name] = mSaveLineArgs; 
		    	for(var rowId in mLineArgs){	    		
		    		mSaveLineArgs[rowId] = {
	    				update:middlePartCtrl.getDatatableHash(mLineArgs[rowId].update),
	    				insert:middlePartCtrl.getDatatableHash(mLineArgs[rowId].insert),
	    				deleteRows:mLineArgs[rowId].deleteRows
		    		};	    		
		    	}
		    	
		    	var lastPartModels = this.getChildPartModels(middlePartModel.name);
		    	for(var j=0;j<lastPartModels.length;j++){	    		
		    		var lastPartModel = lastPartModels[j];
			    	var lastPartCtrl = this.partHash.get(lastPartModel.name);
			    	if(lastPartCtrl != null){
			    		var partLineArgs = lineArgs[lastPartModel.name];
			    		var dealedPartArgs = {};
			    	    for(var parentRowId in partLineArgs){	    	    	
			    	    	//如果此行已经在父表中删除，那么就不用保存此行记录的下级数据了。
			    	    	if(middleLineTable.contains(parentRowId)){
			    	    		dealedPartArgs[parentRowId] = {
			    	    				update:lastPartCtrl.getDatatableHash(partLineArgs[parentRowId].update),
			    	    				insert:lastPartCtrl.getDatatableHash(partLineArgs[parentRowId].insert),
			    	    				deleteRows:partLineArgs[parentRowId].deleteRows	    	    				
			    	    		};
		
				    	    	if(rowId2Ids[parentRowId] == undefined){
				    	    		var middleIdValue = middleLineTable.rows(parentRowId).getValue(middlePartCtrl.dataModel.idFieldName);
				    	    		rowId2Ids[parentRowId] = middleIdValue == undefined ? "" : middleIdValue.toString();
				    	    	}
			    	    	}
			    	    }
			    	    saveLineArgs[lastPartModel.name] = dealedPartArgs;
			    	}
		    	}
		    }
	    }
	};
	
	//获取主表记录Id字段值
	this.getMainCardIdFieldValue = function(){	
	    var mainPartModel = this.getMainPartModel();
		var mainPartCtrl = this.partHash.get(mainPartModel.name);
		if(mainPartCtrl.datatable.count() == 0){
			return null;
		}
		else {
			var mainRow = mainPartCtrl.datatable.getRowByIndex(0);
			var mainIdValue = mainRow.getValue(mainPartCtrl.dataModel.idFieldName);
			return mainIdValue;
		}
	};
	
	//用于扩展，初始化其他事件处理
	this.initOtherEvent = function(partModel, partCtrl, externalObject){
		
	};
		
	this.initMainPartEvents = function(partModel, partCtrl){ 
		partCtrl.baseSave = function(param){
			
			//清理一下cache里的数据，里面包含一些cancel掉的数据使用insert和update里的数据与lineTables里的数据逐行做对比，看看是否存在
			that.dealCacheBeforeSave();
			
			//2.服务器端:递归删除子表记录
			//3.服务器端:递归添加保存数据，注意新建记录在保存前先获取父表id值放在子表记录的json里，即parentid统一在服务器端处理，而不是在客户端处理，保存记录、删除记录统一用view的实体类实现
			
			var requestParam ={serviceName : "sheetNcpService",
				waitingBarParentId : this.containerId,
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
					
					partCtrl.setCtrlStatus(formStatusType.browse);
					partCtrl.processSaveData(param);
					partCtrl.afterBaseSave(param); 
					partCtrl.afterDoSave(param); 
				},
				failFunc:function(obj){
					msgBox.alert({title:"提示",info:obj.message});	
					//如果保存失败，那么递归重新设置子表为可编辑
				    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
				    for(var i = 0;i<childPartModels.length;i++){
				    	var childPartModel = childPartModels[i];
				    	var childPartCtrl = that.partHash.get(childPartModel.name); 
				    	if(childPartCtrl != null){
				    		childPartCtrl.doEdit({});
				    	}
				    }
				},
				errorFunc:function(){
					//如果保存失败，那么递归重新设置子表为可编辑
				    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
				    for(var i = 0;i<childPartModels.length;i++){
				    	var childPartModel = childPartModels[i];
				    	var childPartCtrl = that.partHash.get(childPartModel.name); 
				    	if(childPartCtrl != null){
				    		childPartCtrl.doEdit({});
				    	}
				    }
				},
				args : {requestParam:cmnPcr.jsonToStr({
					sheetName: that.sheetModel.name,
					isRefreshAfterSave:this.isRefreshAfterSave,
					mainArgs:that.clientCacheData.mainArgs,
					lineArgs:that.clientCacheData.saveLineArgs,
					rowId2Ids:that.clientCacheData.rowId2Ids,
					otherRequestParam:param.otherRequestParam
				})}
			}; 
			var serverAccess = new ServerAccess();
			serverAccess.request(requestParam); 		
		};
		partCtrl.baseDelete=function(param){
			var requestParam ={serviceName : "sheetNcpService",
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
						deleteRows:param.existRowIdValues,
						otherRequestParam:param.otherRequestParam
					})}
					};
			var serverAccess = new ServerAccess();
			serverAccess.request(requestParam); 
		};
		
		var externalObject = { 
			afterRowSelect: function(rowId){
				that.clientCacheData = that.initClientCacheData();
				var idValue = (rowId == undefined ? null: partCtrl.datatable.rows(rowId).getValue(partCtrl.dataModel.idFieldName));
				//肯定是在非编辑状态下换行，那么直接刷新子表就可以了
			    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name);  
			    	if(childPartCtrl != null){
			    		childPartCtrl.doPage({ pageNumber:1, 
			    			parentRowId:rowId,
			    			isNewRow:idValue == null,
			    			where:[{parttype:"field", field:childPartModel.parentPointerField, operator:"=", value:(idValue == null? "" : idValue.toString()) }],
			    			status:partCtrl.currentStatus});
			    	}
			    }
			},
			beforeDoSave:function(param){
				//将父表数据保存在clientCacheData里，并递归执行子表的保存
				that.clientCacheData.mainArgs.update = partCtrl.getDatatableHash(param.update);
				that.clientCacheData.mainArgs.insert = partCtrl.getDatatableHash(param.insert);
			    var childPartModels = that.getChildPartModels(partCtrl.partModelName); 
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name); 
			    	if(childPartCtrl != null){
			    		if(!childPartCtrl.doSave({})){
			    			return false;
			    		}
			    	}
			    }
			    return true;
			},
			afterDoSave:function(param){
				//清除clientCacheData里的数据
				//改变子表的编辑状态（递归保存的时候，已经设置了子表为浏览状态）
				//that.clientCacheData = that.initClientCacheData();
				//重新选中行
				var row = partCtrl.datatable.getRowByIndex(0);					
				partCtrl.afterRowSelect(row == null ? undefined : row.rowId);				
			},
			afterDoCancel:function(param){		
				var row = partCtrl.datatable.getRowByIndex(0);					
				partCtrl.afterRowSelect(row == null ? undefined : row.rowId);	
			},
			beforeDoCancel:function(param){
				//递归取消子表的编辑
			    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name); 
			    	if(childPartCtrl != null){
			    		childPartCtrl.doCancel({isShowConfirm:false});
			    	}
			    }
			    return true;
			},
			beforeDoDelete:function(param){
				//递归取消子表的编辑
			    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name); 
			    	if(childPartCtrl != null){
			    		childPartCtrl.doCancel({isShowConfirm:false});
			    	}
			    }
			    return true;
			},
			afterDoEdit:function(param){
				//递归设置子表为可编辑
			    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name); 
			    	if(childPartCtrl != null){
			    		childPartCtrl.doEdit({});
			    	}
			    }
			} 
		};
		partCtrl.addExternalObject(externalObject);
		that.initOtherEvent(partModel, partCtrl, externalObject);
	};
	this.initMiddlePartEvents = function(partModel, partCtrl){
		partCtrl.baseDelete = function(param){ 
			var lineCachePartArgs = that.getLineCachePartArgs(partCtrl);
			for(var rowId in param.existRowIdValues){
				lineCachePartArgs.deleteRows[rowId] = param.existRowIdValues[rowId];
			}  
			partCtrl.processDeleteData(param);
			partCtrl.afterBaseDelete(param); 
			partCtrl.afterDoDelete(param); 
		};
		
		partCtrl.baseSave = function(param){
			var lineCachePartArgs = that.getLineCachePartArgs(partCtrl);
			lineCachePartArgs.update = param.update;
			lineCachePartArgs.insert = param.insert;
			partCtrl.setCtrlStatus(formStatusType.browse);
		};
		
		partCtrl.basePage = function(param){
			//如果父表是新建记录，那么返回为无记录的datatable;
			//如果父表记录为编辑记录，那么不可能调用dopage，所以不用考虑这种情况；
			//否则从服务器端获取数据,并将取来的数据放在clientCacheData中
			partCtrl.parentRowId = param.parentRowId;
			if(param.parentRowId == undefined){
				param.datatable = new DataTable();
				param.sumRow = null; 
				param.totalRowCount = 0;
				partCtrl.setCtrlStatus(formStatusType.browse);
				partCtrl.processPageData(param);
				partCtrl.afterBasePage(param); 
				partCtrl.afterDoPage(param); 
				
			}
			else if(param.isNewRow){
				param.datatable = new DataTable();
				param.sumRow = null;// that.getSumRow(obj);  
				that.setLineCachePartTable(partCtrl, param.datatable);
				param.totalRowCount = 0;
				partCtrl.setCtrlStatus(formStatusType.browse);
				partCtrl.processPageData(param);
				partCtrl.afterBasePage(param); 
				partCtrl.afterDoPage(param); 
			}
			else{
				var lineCachePartArgs = that.getLineCachePartArgs(partCtrl);
				var lineCachePartTable = that.getLineCachePartTable(partCtrl);
				if(lineCachePartTable == undefined){
					var requestParam ={serviceName : "dataNcpService",
						waitingBarParentId : this.containerId,
						funcName : "select", 
						successFunc : function(obj){ 
							param.datatable = partCtrl.getDataTableFromBackInfo(obj.result.table.rows);  
							param.sumRow = null;// that.getSumRow(obj);  
							that.setLineCachePartTable(partCtrl, param.datatable),
							param.totalRowCount = obj.result.rowCount;
							partCtrl.setCtrlStatus(formStatusType.browse);
							partCtrl.processPageData(param);
							partCtrl.afterBasePage(param); 
							partCtrl.afterDoPage(param); 
						},
						args : {requestParam:cmnPcr.jsonToStr({
							dataName: partCtrl.dataModel.name,
							getDataType:"page",
							//fromIndex:-1,
							currentPage:1,
							//onePageRowCount:-1,
							pageSize:-1,
							isGetSum:partCtrl.isGetSum,
							isGetCount:partCtrl.isGetCount,
							where:param.where,
							orderby:partCtrl.orderby,
							otherRequestParam:param.otherRequestParam
						})}
					};

					var serverAccess = new ServerAccess();
					serverAccess.request(requestParam); 		
				}
				else{
					param.datatable = lineCachePartTable;  
					param.sumRow = null;// that.getSumRow(obj);  
					param.totalRowCount = param.datatable.count();
					partCtrl.setCtrlStatus(formStatusType.browse);
					partCtrl.processPageData(param);
					partCtrl.afterBasePage(param); 
					partCtrl.afterDoPage(param); 
				}
			}
		};
				
		var externalObject = { 
			afterRowSelect: function(rowId){
				//如果子表为编辑状态，那么首先要保存子表，然后再获取当前行对应的子表数据，并将rowid赋值给子表属性parentRowId 
			    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name);
			    	if(childPartCtrl != null){
				    	if(childPartCtrl.parentRowId != undefined && childPartCtrl.parentRowId != rowId){ 
					    	childPartCtrl.doSave({});			    		
				    	}
				    	else{
				    		childPartCtrl.doCancel({});
				    	}
			    	}
			    }
				var idValue =(rowId == undefined ? null: partCtrl.datatable.rows(rowId).getValue(partCtrl.dataModel.idFieldName));
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name); 
			    	if(childPartCtrl != null){
				    	childPartCtrl.doPage({ pageNumber:1, 
				    		parentRowId:rowId,
			    			isNewRow:idValue == null,
			    			where:[{parttype:"field", field:childPartModel.parentPointerField, operator:"=", value:(idValue == null? "" : idValue.toString()) }],
			    			status:partCtrl.currentStatus}); 
			    	}
			    }			    
			},
			beforeDoAdd:function(param){
				var mainPartCtrl = that.partHash.get(that.getMainPartModel().name);
				mainPartCtrl.doEdit({});
				return mainPartCtrl.currentStatus == formStatusType.edit;
			},
			beforeDoDelete:function(param){
				var mainPartCtrl = that.partHash.get(that.getMainPartModel().name);
				mainPartCtrl.doEdit({});
				return mainPartCtrl.currentStatus == formStatusType.edit;
			},
			afterDoDelete: function(param){
				//删除后选择第一条记录(这么处理吧：不选择任何记录)
				//取消子表的编辑状态
				//获取当前选中行是否被删除了，如果rowId为空，那么是被删除了
				var rowId = $(partCtrl.gridCtrl).jqGrid("getGridParam", "selrow");
			    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name);
			    	if(childPartCtrl != null){
				    	if(childPartCtrl.parentRowId != undefined && childPartCtrl.parentRowId != rowId){ 
				    		childPartCtrl.doCancel({isShowConfirm:false});			    		
				    	}
			    	}
			    } 
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name); 
			    	if(childPartCtrl != null){
				    	childPartCtrl.doPage({ pageNumber:1, 
				    		parentRowId:undefined, 
				    		where:[]}); 
			    	}
			    }		
			},
			afterDoPage:function(param){
				//翻页后，选择第一条记录(这么处理吧：不选择任何记录)
				//根据父表记录状态设置本表状态 
				//if(param.status == formStatusType.edit){
				var mainPartCtrl = that.partHash.get(that.getMainPartModel().name);
				if(mainPartCtrl.currentStatus == formStatusType.edit){
					partCtrl.doEdit({});
				}
				partCtrl.afterRowSelect(undefined);
			},
			afterDoEdit:function(param){ 
				//递归设置子表为可编辑(没有必要) 
			    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name);
			    	//如果此级窗口的子表对应的上级记录不为空，那么设置子表为编辑状态
			    	if(childPartCtrl.parentRowId != undefined){
			    		childPartCtrl.doEdit({});
			    	}
			    } 
			},
			beforeDoSave:function(param){
				//将父表数据保存在clientCacheData里，并递归执行子表的保存
			    var childPartModels = that.getChildPartModels(partCtrl.partModelName);
			    for(var i = 0;i<childPartModels.length;i++){
			    	var childPartModel = childPartModels[i];
			    	var childPartCtrl = that.partHash.get(childPartModel.name); 
			    	if(childPartCtrl != null){
			    		childPartCtrl.doSave({});
			    	}
			    }
			    return true;
			}
		};
		partCtrl.addExternalObject(externalObject);
		that.initOtherEvent(partModel, partCtrl, externalObject);
	};
	this.initLastPartEvents = function(partModel, partCtrl){ 

		partCtrl.baseDelete = function(param){ 
			var lineCachePartArgs = that.getLineCachePartArgs(partCtrl);
			for(var rowId in param.existRowIdValues){
				lineCachePartArgs.deleteRows[rowId] = param.existRowIdValues[rowId];
			}  
			//partCtrl.processDeleteParam(param);
			partCtrl.afterBaseDelete(param); 
			partCtrl.afterDoDelete(param); 
		};

		
		partCtrl.baseSave = function(param){
			var lineCachePartArgs = that.getLineCachePartArgs(partCtrl);
			lineCachePartArgs.update = param.update;
			lineCachePartArgs.insert = param.insert;		
			partCtrl.setCtrlStatus(formStatusType.browse); 			 			
		};
		
		partCtrl.basePage = function(param){ 
			//如果父表是新建记录，那么返回为无记录的datatable;
			//如果父表记录为编辑记录，那么不可能调用dopage，所以不用考虑这种情况；
			//否则从服务器端获取数据,并将取来的数据放在clientCacheData中
			partCtrl.parentRowId = param.parentRowId;
			if(param.parentRowId == undefined){
				param.datatable = new DataTable();
				param.sumRow = null; 
				param.totalRowCount = 0;
				partCtrl.setCtrlStatus(formStatusType.browse);
				partCtrl.processPageData(param);
				partCtrl.afterBasePage(param); 
				partCtrl.afterDoPage(param); 
				
			}
			else if(param.isNewRow){
				var lineCachePartTable = that.getLineCachePartTable(partCtrl);
				if(lineCachePartTable == undefined){
					lineCachePartTable = new DataTable();
				}
				param.datatable = lineCachePartTable;
				that.setLineCachePartTable(partCtrl, param.datatable);
				param.sumRow = null;// that.getSumRow(obj);  
				param.totalRowCount = lineCachePartTable.count();
				partCtrl.setCtrlStatus(formStatusType.browse);
				partCtrl.processPageData(param);
				partCtrl.afterBasePage(param); 
				partCtrl.afterDoPage(param); 
			}
			else{ 
				var lineCachePartTable = that.getLineCachePartTable(partCtrl);
				if(lineCachePartTable == undefined){
					var requestParam ={serviceName : "dataNcpService",
						waitingBarParentId : this.containerId,
						funcName : "select", 
						successFunc : function(obj){ 
							param.datatable = partCtrl.getDataTableFromBackInfo(obj.result.table.rows);  
							param.sumRow = null;// that.getSumRow(obj);  
							that.setLineCachePartTable(partCtrl, param.datatable),
							param.totalRowCount = obj.result.rowCount;
							partCtrl.setCtrlStatus(formStatusType.browse);
							partCtrl.processPageData(param);
							partCtrl.afterBasePage(param); 
							partCtrl.afterDoPage(param); 
						},
						args : {requestParam:cmnPcr.jsonToStr({
							dataName: partCtrl.dataModel.name,
							getDataType:"page",
							//fromIndex:-1,
							currentPage:1,
							//onePageRowCount:-1,
							pageSize:-1,
							isGetSum:partCtrl.isGetSum,
							isGetCount:partCtrl.isGetCount,
							where:param.where,
							orderby:partCtrl.orderby,
							otherRequestParam:param.otherRequestParam
						})}
					};
					
					var serverAccess = new ServerAccess();
					serverAccess.request(requestParam); 		
				}
				else{
					param.datatable = lineCachePartTable;  
					param.sumRow = null;// that.getSumRow(obj);  
					param.totalRowCount = param.datatable.count();
					partCtrl.setCtrlStatus(formStatusType.browse);
					partCtrl.processPageData(param);
					partCtrl.afterBasePage(param); 
					partCtrl.afterDoPage(param); 
				}
			}
		};
		
		var externalObject = { 
			beforeDoAdd:function(param){
				if(partCtrl.parentRowId != undefined){
					var mainPartCtrl = that.partHash.get(that.getMainPartModel().name);
					mainPartCtrl.doEdit({});
					return mainPartCtrl.currentStatus == formStatusType.edit;
				}
				else{
					return false;
				}
			},
			beforeDoDelete:function(param){
				var mainPartCtrl = that.partHash.get(that.getMainPartModel().name);
				mainPartCtrl.doEdit({});
				return mainPartCtrl.currentStatus == formStatusType.edit;
			},
			afterDoPage:function(param){ 
				//翻页后，选择第一条记录(这么处理吧：不选择任何记录)
				//根据父表记录状态设置本表状态 
				if(param.status == formStatusType.edit){
					partCtrl.doEdit({});
				}
				
				var lineCachePartArgs = that.getLineCachePartArgs(partCtrl);
				if(lineCachePartArgs.update != null){
					for(var rowId in lineCachePartArgs.update.allRows()){
						var copyRow = partCtrl.datatable.rows(rowId).copy();
						var updateRow = lineCachePartArgs.update.rows(rowId);
				        for (var fieldName in updateRow.allCells()) {
				            copyRow.setValue(fieldName, updateRow.items(fieldName));
				        }
				        partCtrl.editRowInGrid(copyRow); 
					}
				}
				if(lineCachePartArgs.insert != null){
					for(var rowId in lineCachePartArgs.insert.allRows()){
						var copyRow = partCtrl.datatable.rows(rowId).copy();
						var insertRow = lineCachePartArgs.insert.rows(rowId);
				        for (var fieldName in insertRow.allCells()) {
				            copyRow.setValue(fieldName, insertRow.items(fieldName));
				        }
				        partCtrl.editRowInGrid(copyRow); 
					}
				} 
			}
		};
		partCtrl.addExternalObject(externalObject);
		that.initOtherEvent(partModel, partCtrl, externalObject);
	};
	
	//显示
	this.show = function(){ 
		this.initLayout(p);
	}
}