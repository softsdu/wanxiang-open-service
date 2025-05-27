//ZlpNcpGrid
function ZlpNcpGrid(p) {

	var that = this; 
	 
	this.nameFieldName = p.nameFieldName; 

	this.guestExportMaxRowCount = 500;
	this.userExportMaxRowCount = 5000;
	
	this.getExportMaxRowCount = function(){
		var maxRowCount = 0;
		for(var i = 0; i < userInfo.roles.length; i++){
			var roleCode = userInfo.roles[i];
			switch(roleCode){
				case "guest":{
					maxRowCount = that.guestExportMaxRowCount > maxRowCount ? that.guestExportMaxRowCount : maxRowCount;
					break;
				}
				case "user":{
					maxRowCount = that.userExportMaxRowCount > maxRowCount ? that.userExportMaxRowCount : maxRowCount;
					break;
				}
			}
		}
		return maxRowCount;
	}
	
	this.confirmMaxRowCount = function(selectRowIds){
		var maxRowCount = that.getExportMaxRowCount();
		if((selectRowIds == null || selectRowIds.length == 0) && (maxRowCount < that.totalRowCount)){
			return msgBox.confirm({info: "最多导出 " + maxRowCount + " 条数据. 如果有更多需求, 请与管理员联系. 请问确定导出吗?"});
		}
		else{
			return msgBox.confirm({info: "确定要导出吗?"});
		}
	}
	
	//基类
	this.base = NcpGrid;
	this.base(p);    


	this.setGridOtherParam = function(initParam) {
		initParam.ondblClickRow = function(rowid, iRow, iCol, e){    
			var row = that.datatable.rows(rowid);
			var idValue = row.getValue(that.dataModel.idFieldName); 
			var title = row.getValue(that.nameFieldName); 
			that.showDetailPage({
				idValue: idValue,
				title: title
			});
		}
	}

	//注册其他控件操作方法
	this.regOtherOperateCtrls = function(){
		this.regOperateCtrl("a", "complexQuery", "complexQueryBtn", "click", function() {
			if (that.getWinBtnStatus()["complexQuery"][that.currentStatus]) {
				that.complexQuery();
			}
			return false;
		});
		
		var searchBtnCtrl = $("#" + that.containerId + " .zlpToolbarQueryBtn");
		if(searchBtnCtrl.length != 0){
			$(searchBtnCtrl[0]).click(function(){
				that.where = null;
			    that.doPage({ pageNumber : 1 });
			    return false;
			});
		}
		
		var searchInputCtrl = $("#" + that.containerId + " .zlpToolbarQueryInputText");
		if(searchInputCtrl.length != 0){
			$(searchInputCtrl[0]).keydown(function(event){
				if (event.keyCode == 13) {
					that.where = null;
				    that.doPage({ pageNumber : 1 });
				}
			});
		}
		
		//导出按钮
		$("#" + that.containerId + " .zlpToolbarContainer").find("a[name='exportBtn']").click(function(){ 
			var selectRowIds = that.getSelectedRowIds(); 
			if(that.confirmMaxRowCount(selectRowIds)){						
				var allIds = new Array();
				if(selectRowIds != null){
					for(var i = 0; i < selectRowIds.length; i++){
						var selectRowId = selectRowIds[i];
						var idValue = that.datatable.rows(selectRowId).getValue(that.dataModel.idFieldName); 
						allIds.push(idValue);
					}
				}
				
				var param = {};
				var fuzzyWhere = that.getFuzzyWhereParam();
				if(fuzzyWhere != null){
					if(param.where == null){
						param.where = [fuzzyWhere];
					} 
					else{
						param.where.push(fuzzyWhere);
					}
				} 
				
				var allIdStr = cmnPcr.arrayToString(allIds, ";");
				var viewName = that.viewModel.name;
				that.exportDataFile({
					url: basePath + "/biji/getDataFile",
					data:{
						viewName: viewName,
						ids: allIdStr,
						where : encodeURIComponent( cmnPcr.jsonToStr(param.where == undefined ? (that.where == undefined ? [] : that.where) : param.where)),
						sysWhere : encodeURIComponent(cmnPcr.jsonToStr(that.sysWhere == undefined ? [] : that.sysWhere))
					}
				});
			} 
			return false;
		});		
		
		//查看详情按钮
		$("#" + that.containerId + " .zlpToolbarContainer").find("a[name='detailBtn']").click(function(){ 
			var selRowId = $(that.gridCtrl).jqGrid("getGridParam", "selrow");
			if(selRowId != undefined){
				var row = that.datatable.rows(selRowId);
				var idValue = row.getValue(that.dataModel.idFieldName); 
				var title = row.getValue(that.nameFieldName); 
				that.showDetailPage({
					idValue: idValue,
					title: title
				});
			}
			else{
				msgBox.alert({info:"请先选中记录, 或者鼠标双击该条记录."});
			}
			return false;
		}); 
	} 
	
	this.exportDataFile = function(options){
	    var config = $.extend(true, { method: 'post' }, options);
	    var $iframe = $('<iframe id="down-file-iframe" />');
	    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
	    $form.attr('action', config.url);
	    for (var key in config.data) {
	        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
	    }
	    $iframe.append($form);
	    $(document.body).append($iframe);
	    $form[0].submit();
	    $iframe.remove();
	}
	
	this.showDetailPage = function(p){
    	var infoType = supportiveSearchTypes[that.viewModel.name];
		var pageName = "detailPage_" + infoType.code + "_" + p.idValue;
		var pageFullUrl = "../" + infoType.category + "/" + infoType.code + "_Card.jsp?k=" + p.idValue;
		var pageTitle = infoType.name + ": " + p.title;
		window.parent.iocClient.mainPageTab().showPage(pageName, pageTitle, pageFullUrl, true);
	}
}