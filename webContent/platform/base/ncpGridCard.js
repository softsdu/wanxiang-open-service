function NcpGridCard(initParam) {

	var that = this;

	this.isEdit = initParam.isEdit;
	this.rowId = initParam.rowId;
	this.parentRowId = initParam.parentRowId;
	this.containerId = initParam.containerId;
	this.closeWin = initParam.closeWin;

	this.cardCtrl = null;
	this.init = function() {
		var card = null;
		if (initParam.isEdit) {
			var p = {
				containerId : initParam.containerId,
				idValue : initParam.idValue,
				totalRowCount : 1,
				where : [],
				orderby : [],
				dataModel : initParam.dataModel,
				isRefreshAfterSave : false,
				viewModel : initParam.viewModel
			};
			card = new NcpCard(p);

			var externalObject = {
				afterDoPage : function(param) {
					that.cardCtrl.doEdit( {});
				},
				beforeDoSave : function(param) {
					param.succeed = true;
					that.closeWin(param);
					return false;
				},
				beforeDoCancel : function(param) {
					param.succeed = false;
					that.closeWin(param);
					return false;
				},
				processPageData : function(param) {
					for ( var rowId in param.datatable.allRows()) {
						var tempRow = param.datatable.rows(rowId).copy();
						param.datatable.addRow(initParam.rowId, tempRow);
						param.datatable.remove(rowId);
					}
				}
			};
			card.addExternalObject(externalObject);
		} else {
			var p = {
				containerId : initParam.containerId,
				totalRowCount : 0,
				where : [],
				orderby : [],
				dataModel : initParam.dataModel,
				isRefreshAfterSave : false,
				viewModel : initParam.viewModel,
				isShowData : false
			};
			card = new NcpCard(p);
			
			var externalObject = {
				beforeDoSave : function(param) {
					param.succeed = true;
					that.closeWin(param);
					return false;
				},
				beforeDoCancel : function(param) {
					param.succeed = false;
					that.closeWin(param);
					return false;
				},
				processAddData : function(param) {
					for ( var rowId in param.newRowsTable.allRows()) {
						var tempRow = param.newRowsTable.rows(rowId).copy();
						param.newRowsTable.addRow(initParam.rowId, tempRow);
						param.newRowsTable.remove(rowId);
					}
				}
			};
			card.addExternalObject(externalObject);
		}

		this.cardCtrl = card;
	};
	this.show = function() {
		if (initParam.isEdit) {
			this.cardCtrl.show();
			//this.cardCtrl.doEdit( {});
		} else {
			this.cardCtrl.show();
			this.cardCtrl.doAdd( {});
		}
	};
	this.init();
}