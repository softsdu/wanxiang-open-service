function NcpTree(p){
	
	var that = this;
	
	//容器id
	this.containerId = p.containerId;  
	
	//默认打开第一个根节点
	this.isExpandRoot = p.isExpandRoot;

	//编辑窗口地址
	this.editPageUrl = p.editPageUrl;
	
	//表单模型
	this.treeModel = p.treeModel;

	//编辑窗口大小
	this.editWinHeight = p.editWinHeight;
	this.editWinWidth = p.editWinWidth;
	
	this.getViewModel = function(){
		return viewModels[this.treeModel.view];
	};
	
	this.getDataModel = function(){
		return dataModels[this.getViewModel().dataName];
	};
	
	//tree树
	this.treeGridCtrl = null;
	this.initLayout = function(p){
		
		//绑定-新建下级-按钮事件
		var ctrls = $("#" + p.containerId).find("a[name='addchildBtn']");
		if(ctrls.length>0){
			$(ctrls[0]).bind("click", function(){
				var selRowId = $(that.treeGridCtrl.gridCtrl).jqGrid("getGridParam", "selrow");
				if(selRowId != undefined){
					var row = that.treeGridCtrl.datatable.rows(selRowId);
					that.treeGridCtrl.doAdd({parentRow:row});
				}
				else{
					msgBox.alert({info:"请先选中上级记录."});
				}
			});
		}
		
		var gridParam = { 
			containerId:p.containerId, 
			where:[],
			orderby:(this.treeModel.sortField == "" ?[]:[{name:this.treeModel.sortField,direction:"asc"}]),
			dataModel:this.getDataModel(), 
			isRefreshAfterSave:false,
			viewModel:this.getViewModel(),
			isShowData:true,
			multiselect:(p.multiselect == undefined ? false : p.multiselect),
			hideOperateColumn: p.hideOperateColumn == undefined ? true : p.hideOperateColumn,
			sysWhere: p.sysWhere
		};
		this.treeGridCtrl = new NcpGrid(gridParam);	
		this.initEvents(this.treeGridCtrl); 
	};
	
	this.showNextLevelData = function(p){ 
		if(!p.parentRow.getValue("ncphasgetnextlevel")){ 
			this.treeGridCtrl.doPage(p);
		}
	};
	
	this.addRowToGrid = function(parentRow, row){
		var treeLevel = parentRow == undefined ? 0 : parentRow.getValue("ncptreelevel") + 1;
		var parentRowId = parentRow == undefined ? null : parentRow.getValue("ncptreerowid");  
		row.setValue("ncptreelevel", treeLevel);
		row.setValue("ncptreeexpanded", false);
		row.setValue("ncptreeparentrowid", parentRowId);
		row.setValue("ncptreerowid", row.rowId);
		row.setValue("ncphasgetnextlevel", false);
		$(that.treeGridCtrl.gridCtrl).jqGrid("addChildNode", 
				row.getValue("ncptreerowid"),
				row.getValue("ncptreeparentrowid"),
				row.allCells());
		that.treeGridCtrl.initRowSelectContrl(row.rowId);
	    var treeClickObj = $(that.treeGridCtrl.gridCtrl).find("tr[id='"+row.rowId+"']").find(".treeclick")[0];
	    $(treeClickObj).click(function(){
	    	var rowId = $(this).parent().parent().parent().attr("id");
	    	var row = that.treeGridCtrl.datatable.rows(rowId);	    	
	    	that.showNextLevelData({parentRow:row});
	    }); 
		if(parentRow !=null ) {
			parentRow.setValue("ncphasgetnextlevel", true);
		}
	};
	
	//刷新当行，更新显示其是否为叶节点
	this.refreshOneRow = function(rowId){
		if(rowId != undefined){
			var row = this.treeGridCtrl.datatable.rows(rowId);
			row.setValue(that.treeModel.isLeafField,!this.hasChild(rowId));
			$(that.treeGridCtrl.gridCtrl).jqGrid("setTreeRow", row.getValue("ncptreerowid"), row.allCells());  		
		}
	};
	
	//是否包含子节点
	this.hasChild = function(parentRowId){
		var parentRow = that.treeGridCtrl.datatable.rows(parentRowId);
		var parentIdValue = parentRow.getValue(that.treeGridCtrl.dataModel.idFieldName);
		var allRowIds = that.treeGridCtrl.datatable.allRows(); 
		for(var rowId in allRowIds){
			var row = that.treeGridCtrl.datatable.rows(rowId);
			if(row.getValue(that.treeModel.parentPointerField) == parentIdValue){
				return true;
			}
		} 
		return false;
	};
	
	//是否已经展开
	this.checkIsExpand = function(parentRowId){
		var parentRow = that.treeGridCtrl.datatable.rows(parentRowId);
		var parentIdValue = parentRow.getValue(that.treeGridCtrl.dataModel.idFieldName);
		var allRowIds = that.treeGridCtrl.datatable.allRows(); 
		for(var rowId in allRowIds){
			var row = that.treeGridCtrl.datatable.rows(rowId);
			if(row.getValue(that.treeModel.parentPointerField) == parentIdValue){
				var rowRecord = $(that.treeGridCtrl.gridCtrl).jqGrid("getRowData",rowId);  
				return $(that.treeGridCtrl.gridCtrl).jqGrid("isVisibleNode", rowRecord);
			}
		} 
		return true;
	};
	
	this.setGridOtherParam = function(initParam){
		
	};
	
	this.initEvents = function(treeGridCtrl){  
		treeGridCtrl.setGridOtherParam = function(initParam){
			that.setGridOtherParam(initParam);
            initParam.datastr = {"response":[]};
            initParam.datatype = "jsonstring";
            initParam.treeGrid = true;
            initParam.treeGridModel = "adjacency";
            initParam.ExpandColumn = that.treeModel.labelField;
            initParam.jsonReader = {repeatitems: false,root: "response"};
			initParam.treeReader = {
                 id_field: "ncptreerowid",
                 level_field: "ncptreelevel",
                 parent_id_field: "ncptreeparentrowid",
                 leaf_field: that.treeModel.isLeafField,
                 expanded_field: "ncptreeexpanded"
             };
		};
		
		treeGridCtrl.baseDelete=function(param){
			var requestParam ={serviceName : "treeNcpService",
				waitingBarParentId : that.containerId,
				funcName : "delete", 
				successFunc : function(obj){  
					treeGridCtrl.setCtrlStatus(formStatusType.browse);
					treeGridCtrl.processDeleteData(param); 
					treeGridCtrl.afterBaseDelete(param); 
					treeGridCtrl.afterDoDelete(param); 
				},
				args : {requestParam:cmnPcr.jsonToStr({
					treeName: that.treeModel.name,
					dataName: treeGridCtrl.dataModel.name,
					deleteRows:param.existRowIdValues,
					otherRequestParam:param.otherRequestParam
				})}
				};
			var serverAccess = new ServerAccess();
			serverAccess.request(requestParam); 
		};
		treeGridCtrl.afterBaseDelete = function(param){
			var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
			var allNeedDelRowIds = [];
			
			//被删除节点的父节点
			var parentRowIds = [];
			
			//递归获取本地数据层需要删除的记录
			var getNeedDelRows = function(parentIdValue, allNeedDelRowIds){
				var allRowIds = treeGridCtrl.datatable.allRows();
				var needDelIds = [];
				for(var rowId in allRowIds){
					var row = treeGridCtrl.datatable.rows(rowId);
					if(row.getValue(that.treeModel.parentPointerField) == parentIdValue){
						needDelIds.push(row.getValue(treeGridCtrl.dataModel.idFieldName));
						allNeedDelRowIds.push(allNeedDelRowIds);
					}
				}
				for(var i=0;i<needDelIds.length;i++){
					getNeedDelRows(needDelIds[i], allNeedDelRowIds);
				}
			};
			
			for(var i = 0; i < param.existRowIds.length; i++) {
				var existRowId = param.existRowIds[i];
				if($(treeGridCtrl.gridCtrl).jqGrid("getInd", existRowId)){
					$(treeGridCtrl.gridCtrl).jqGrid("delTreeNode",existRowId);
					parentRowIds.push(treeGridCtrl.datatable.rows(existRowId).getValue("ncptreeparentrowid"));
				}
				
				allNeedDelRowIds.push(existRowId);
				var idValue = treeGridCtrl.datatable.rows(existRowId).getValue(treeGridCtrl.dataModel.idFieldName);
				getNeedDelRows(idValue, allNeedDelRowIds);
				
				if(selRowId == existRowId){
					this.afterRowSelect(undefined);
				}
			}
			for(var i=0;i<allNeedDelRowIds.length;i++){
				var rowId = allNeedDelRowIds[i];
				treeGridCtrl.datatable.remove(rowId);
			}
			
			//刷新父节点状态
			for(var i=0;i<parentRowIds.length;i++){
				that.refreshOneRow(parentRowIds[i]);
			}
		};

		treeGridCtrl.basePage = function(param){
			
			var requestParam ={serviceName : "dataNcpService",
				waitingBarParentId : this.containerId,
				funcName : "select", 
				successFunc : function(obj){
					param.datatable = treeGridCtrl.getDataTableFromBackInfo(obj.result.table.rows);  
					param.sumRow = null;// that.getSumRow(obj);   
					param.totalRowCount = obj.result.rowCount;
					treeGridCtrl.setCtrlStatus(formStatusType.browse);
					treeGridCtrl.processPageData(param);
					treeGridCtrl.afterBasePage(param); 
					treeGridCtrl.afterDoPage(param); 
				},
				args : {requestParam:cmnPcr.jsonToStr({
					dataName: that.getDataModel().name,
					getDataType:"page",
					//fromIndex:-1,
					currentPage:1,
					//onePageRowCount:-1,
					pageSize:-1,
					isGetSum:false,
					isGetCount:false,
					where:param.where,
					sysWhere:treeGridCtrl.sysWhere,
					orderby:param.orderby,
					otherRequestParam:param.otherRequestParam
				})}
			};

			var serverAccess = new ServerAccess();
			serverAccess.request(requestParam); 		
		};

		treeGridCtrl.beforeBaseDelete = function(param){   
			var rowIds = treeGridCtrl.getSelectedRowIds();
			if(rowIds.length == 0) {
				msgBox.alert({info:"请选择要删除的记录. 其下级记录将一起删除!"});
				return false;
			}
			else{
				param.existRowIdValues = {};
				param.existRowIds = [];
				param.newRowIds = [];
				
				//只有已存在的记录，不会出现新建记录
				for(var i=0;i<rowIds.length;i++){
					var rowId = rowIds[i];
					var row = treeGridCtrl.datatable.rows(rowId);  
					param.existRowIds.push(rowId);
					param.existRowIdValues[rowId] = row.getValue(treeGridCtrl.dataModel.idFieldName);
				}
				return msgBox.confirm({info:"确定要删除选中数据吗?" + (rowIds.length > 1 ? "\r\n共 " + rowIds.length + " 条记录. " : ". ")+" 其下级记录将一起删除!"}); 
			}
		};
		

		treeGridCtrl.afterBasePage = function(param){	
			if(param.parentRow != null && param.expand && (param.isExpandRoot|| !that.checkIsExpand(param.parentRow.rowId))){
				var rowRecord = $(treeGridCtrl.gridCtrl).jqGrid("getRowData",param.parentRow.rowId);  
				var treeClickObj = $(that.treeGridCtrl.gridCtrl).find("tr[id='"+param.parentRow.rowId+"']").find(".treeclick")[0];
				$(treeClickObj).click();
			} 
			
			if(treeGridCtrl.datatable == null){
				treeGridCtrl.datatable = param.datatable; 
				for(var rowId in param.datatable.allRows()){  
					var row = treeGridCtrl.datatable.rows(rowId);
					that.addRowToGrid(param.parentRow, row);
				}
			}
			else{ 
				for(var rowId in param.datatable.allRows()){
					var row = param.datatable.rows(rowId); 
					var idValue = row.getValue(treeGridCtrl.dataModel.idFieldName);
				    var oldRowId = treeGridCtrl.datatable.getRowIdByIdField(idValue, treeGridCtrl.dataModel.idFieldName);
					if(oldRowId != null){
					    var oldRow = treeGridCtrl.datatable.rows(oldRowId);
						for(var fieldName in row.allCells()){
							oldRow.setValue(fieldName, row.getValue(fieldName));
						}  
						$(that.treeGridCtrl.gridCtrl).jqGrid("setTreeRow", oldRow.getValue("ncptreerowid"), oldRow.allCells());  
					}
					else{
						treeGridCtrl.datatable.addRow(rowId, row); 
						that.addRowToGrid(param.parentRow, row);
					}
				}
			}
		};
		
		var showEditPage = function(initParam){
			window.treeCardInitParam = initParam; 
			initParam.closeWin = function(p){
				if(p.succeed){
					if(p.rowId == undefined){
						//新建
						var parentRow = null;
						if(p.parentRowId != undefined){
							parentRow = that.treeGridCtrl.datatable.rows(p.parentRowId);
						}
				    	that.treeGridCtrl.doPage({parentRow:parentRow,expand:true});
					}
					else{
						//编辑
				    	that.treeGridCtrl.doPage({idValue:p.idValue});
					}
				}
				popContainer.close();
			};

			var popContainer = new PopupContainer({
				title: "编辑详情",
				width: that.editWinWidth,
				height: that.editWinHeight,
				top: 100});
			popContainer.show(); 
			var frameId = cmnPcr.getRandomValue();
			var iFrameHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
			$("#" + popContainer.containerId).html(iFrameHtml);
			$("#" + frameId).attr("src", that.editPageUrl);
		};
		
		var externalObject = {
			beforeDoPage:function(param){
				if(param.idValue != undefined){
					//刷新单行
					param.where = [{parttype:"field", field:that.treeGridCtrl.dataModel.idFieldName, operator:"=", value: param.idValue}];
				}
				else if(param.parentRow == undefined){
					//获取到根节点记录
					param.where = [{parttype:"field", field:that.treeModel.parentPointerField, operator:"is", value: ""}];
				}
				else{
					//获取某个节点的子节点
					var parentIdValue = param.parentRow.getValue(that.treeGridCtrl.dataModel.idFieldName);
					param.where = [{parttype:"field", field:that.treeModel.parentPointerField, operator:"=", value: parentIdValue.toString()}];
				}
				param.orderby=[{name:that.treeModel.sortField, direction:"asc"}];
				return true;
			}, 
			afterDoPage:function(param){
				if(that.isExpandRoot){
					if(param.idValue == undefined && param.parentRow == undefined){
						//根节点
						if(that.treeGridCtrl.datatable.count() != 0){
							var row = that.treeGridCtrl.datatable.getRowByIndex(0);
							that.treeGridCtrl.doPage({parentRow:row, expand:true,isExpandRoot:true});
						}
					}
				}
			},
			beforeDoAdd:function(param){ 
				var parentIdValue = param.parentRow == undefined ? null : param.parentRow.getValue(treeGridCtrl.dataModel.idFieldName);
				var parentRowId = param.parentRow == undefined ? null : param.parentRow.rowId;
				var initParam =  {
					parentRowId:parentRowId,
					parentIdValue:parentIdValue,
					isEdit:false,
					dataModel:that.getDataModel(),
					viewModel:that.getViewModel(),
					treeModel:that.treeModel
				};
				showEditPage(initParam); 
				return false;
			},
			beforeDoEdit:function(param){ 
				var selRowId = $(treeGridCtrl.gridCtrl).jqGrid("getGridParam", "selrow");
				if(selRowId != undefined){
					var idValue = treeGridCtrl.datatable.rows(selRowId).getValue(treeGridCtrl.dataModel.idFieldName);
					var initParam =  {
						rowId:selRowId,
						idValue:idValue,
						isEdit:true,
						dataModel:that.getDataModel(),
						viewModel:that.getViewModel(),
						treeModel:that.treeModel
					};
					showEditPage(initParam);
				}
				else{
					msgBox.alert({info:"请先选中记录."});
				}
			    return false;
			}
		};
		treeGridCtrl.addExternalObject(externalObject);
	};
	
	
	this.initLayout(p);
	
	//显示
	this.show = function(){ 
		this.treeGridCtrl.show();   
	}
}