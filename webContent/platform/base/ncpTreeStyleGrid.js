function NcpTreeStyleGrid(p){
	
	var that = this;
	
	//标题字段
	that.labelField = p.labelField;
	
	//树节点的父记录id字段
	this.parentTreeIdField = p.parentTreeIdField;
	
	//树节点id字段
	this.treeIdField = p.treeIdField;
	
	//容器id
	this.containerId = p.containerId; 
	
	//数据模型
	this.dataModel = p.dataModel;
	
	//表单模型
	this.colModel = p.colModel;  
	
	//tree树
	this.treeStyleGridCtrl = null;
		
	this.initLayout = function(p){				
		var gridParam = { 
			containerId:p.containerId, 
			where:p.where,
			orderby:p.orderby,
			dataModel:p.dataModel,
			isRefreshAfterSave:p.isRefreshAfterSave,
			viewModel:p.viewModel,
			isShowData:true
		};
		this.treeStyleGridCtrl = new NcpGrid(gridParam);	
		this.initEvents(this.treeStyleGridCtrl); 
		this.treeStyleGridCtrl.show();   
	};
	
	this.addRowToGrid = function(parentRow, row){
		var treeLevel = parentRow == undefined ? 0 : parentRow.getValue("ncptreelevel") + 1;
		var parentRowId = parentRow == undefined ? null : parentRow.getValue("ncptreerowid");  
		row.setValue("ncptreelevel", treeLevel);
		row.setValue("ncptreeexpanded", false);
		row.setValue("ncptreeparentrowid", parentRowId);
		row.setValue("ncptreerowid", row.rowId);
		row.setValue("ncphasgetnextlevel", false);
		$(that.treeStyleGridCtrl.gridCtrl).jqGrid("addChildNode", 
				row.getValue("ncptreerowid"),
				row.getValue("ncptreeparentrowid"),
				row.allCells());
		that.treeStyleGridCtrl.initRowSelectContrl(row.rowId);
		if(parentRow !=null ) {
			parentRow.setValue("ncphasgetnextlevel", true);
		}
	};
	   
	this.initEvents = function(treeStyleGridCtrl){  
		treeStyleGridCtrl.setGridOtherParam = function(initParam){
            initParam.datastr = {"response":[]};
            initParam.datatype = "jsonstring";
            initParam.treeGrid = true;
            initParam.treeGridModel = "adjacency";
            initParam.ExpandColumn = that.labelField;
            initParam.jsonReader = {repeatitems: false,root: "response"};
			initParam.treeReader = {
                 id_field: "ncptreerowid",
                 level_field: "ncptreelevel",
                 parent_id_field: "ncptreeparentrowid",
                 leaf_field: "ncptreeisleaf",
                 expanded_field: "ncptreeexpanded"
             };
		};

		//如果是树形节点列、ncpRowSelect列，那么不用初始化其编辑控件
		treeStyleGridCtrl.isInitEditCtrl = function(cModel){
			return cModel.name != "ncpRowSelect" && cModel.name != that.labelField;
		};
		
		treeStyleGridCtrl.basePage = function(param){ 
			var requestParam ={serviceName : "dataNcpService",
				waitingBarParentId : that.containerId,
				funcName : "select", 
				successFunc : function(obj){
					param.datatable = treeStyleGridCtrl.getDataTableFromBackInfo(obj.result.table.rows);  
					param.sumRow = null;// that.getSumRow(obj);   
					param.totalRowCount = obj.result.rowCount;
					treeStyleGridCtrl.setCtrlStatus(formStatusType.browse);
					treeStyleGridCtrl.processPageData(param);
					treeStyleGridCtrl.afterBasePage(param); 
					treeStyleGridCtrl.afterDoPage(param); 
				},
				args : {requestParam:cmnPcr.jsonToStr({
					dataName: treeStyleGridCtrl.dataModel.name,
					getDataType:"page",
					//fromIndex:-1,
					currentPage:1,
					//onePageRowCount:-1,
					pageSize:-1,
					isGetSum:false,
					isGetCount:false,
					where:param.where == undefined ? (treeStyleGridCtrl.where == undefined ? [] : treeStyleGridCtrl.where): param.where,
					orderby:treeStyleGridCtrl.orderby == undefined ? [] : treeStyleGridCtrl.orderby,
					otherRequestParam:param.otherRequestParam
				})}
			};

			var serverAccess = new ServerAccess();
			serverAccess.request(requestParam); 		
		};
 
		treeStyleGridCtrl.afterBasePage = function(param){ 
			//将记录显示在树形结构里
			treeStyleGridCtrl.datatable = param.datatable;
			$(treeStyleGridCtrl.gridCtrl).jqGrid("clearGridData", true);
			that.addChildRowsToGrid(null, param.datatable); 
		}		  
	};
	
	this.addChildRowsToGrid = function(parentRow, datatable){
		var rows = this.getChildRows(parentRow, datatable);
		if(rows.length > 0){
			for(var i=0;i<rows.length;i++){
				var row = rows[i];
				this.addRowToGrid(parentRow, row);
				//datatable.remove(row.rowId);
			}
			for(var i=0;i<rows.length;i++){
				var row = rows[i];
				this.addChildRowsToGrid(row, datatable);
			}
		}		
	};
	
	this.getChildRows = function(parentRow, datatable){
		var treeIdValue = parentRow == null ? null : parentRow.getValue(that.treeIdField);
		var rows = [];
		for(var rowId in datatable.allRows()){
			var row = datatable.rows(rowId);
			if(row.getValue(that.parentTreeIdField) == treeIdValue){
				rows.push(row);
			}
		}
		return rows;
	};
	
	
	
	//显示
	this.show = function(){ 
		this.initLayout(p);
	}
}