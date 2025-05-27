function NcpTreeCard(initParam){
	
	var that = this;
	
	this.isEdit = initParam.isEdit;	
	this.rowId = initParam.rowId;
	this.treeModel = initParam.treeModel;
	this.parentIdValue = initParam.parentIdValue == undefined ? "" : initParam.parentIdValue.toString();
	this.parentRowId = initParam.parentRowId;
	this.containerId = initParam.containerId;
	this.closeWin = initParam.closeWin;
	
	this.cardCtrl = null;
	this.init = function (){
		var card = null;
		if(initParam.isEdit){
			var p = { 
				containerId:initParam.containerId,
				idValue:initParam.idValue,	
				totalRowCount:1,
				where:[],
				orderby:[],
				dataModel:initParam.dataModel,
				isRefreshAfterSave:false,
				needTriggerServerAdd: initParam.needTriggerServerAdd,
				viewModel:initParam.viewModel
			};
			card = new NcpCard(p);  
			
			var externalObject = {  
				afterDoPage:function(param){  
					that.cardCtrl.doEdit({});
				},
				beforeDoCancel:function(param){
					that.closeWin({
						succeed:false
					});
					return false;
				}
			};
			card.addExternalObject(externalObject);
						
		}
		else{ 
			var p = { 
				containerId:initParam.containerId,
				totalRowCount:0,
				where:[],
				orderby:[],
				dataModel:initParam.dataModel, 
				isRefreshAfterSave:false,
				needTriggerServerAdd: initParam.needTriggerServerAdd,
				viewModel:initParam.viewModel,
				isShowData:false
			};
			card = new NcpCard(p); 
	
			var externalObject = {  
				beforeDoSave:function(param){ 
					var row = param.insert.getRowByIndex(0);
					if(!that.isEdit){
						row.setValue(that.treeModel.parentPointerField, that.parentIdValue);
						row.setValue(that.treeModel.isLeafField, true);
					}
				    return true;
				},
				beforeDoCancel:function(param){
					that.closeWin({
						succeed:false
					});
					return false;
				}
			};
			card.addExternalObject(externalObject);
		}

		card.baseSave = function(param){
			var requestParam ={serviceName : "treeNcpService",
					waitingBarParentId : that.containerId,
					funcName : "save", 
					successFunc : function(obj){
						var dt = card.getDataTableFromBackInfo(obj.result.table == undefined ? null : obj.result.table.rows,
								 obj.result.idValueToRowIds);   
						param.table = dt;
						
						var editedIdValue = null; 
						for(var idValue in obj.result.idValueToRowIds){
							editedIdValue = idValue;
						} 
						
						card.setCtrlStatus(formStatusType.browse);
						//card.afterBaseSave(param); 
						//card.afterDoSave(param); 
						that.closeWin({
							succeed:true,
							rowId:that.rowId,
							parentIdValue:that.parentIdValue,
							parentRowId:that.parentRowId,
							idValue:editedIdValue
						});
					},
					args : {requestParam:cmnPcr.jsonToStr({
						treeName: that.treeModel.name,
						dataName: card.dataModel.name,
						parentIdValue:that.parentIdValue,
						isRefreshAfterSave:false,
						update:card.getDatatableHash(param.update),
						insert:card.getDatatableHash(param.insert),
						otherRequestParam:param.otherRequestParam 
					})}
				}; 
			card.ProcessServerAccess(requestParam); 		
		};
		this.cardCtrl = card;
	};
	this.show = function(){
		if(initParam.isEdit){
			this.cardCtrl.show();
		}
		else{
			this.cardCtrl.show();
			this.cardCtrl.doAdd({});
		}
	};
	this.init();
}