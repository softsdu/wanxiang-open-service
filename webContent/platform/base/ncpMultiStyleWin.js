function NcpMultiStyleWin(p){
	/*
	 1.窗口打开后初始化为grid状态，去掉save、cancel按钮
	 2.点击添加按钮后，切换到sheet/card方式，，隐藏grid方式下的toolbar和gridctrl的容器控件，并将“返回列表”按钮对应的处理传给内嵌窗口
	 3.点击编辑按钮，先判断当前是否选中行，
	 	如果已经选中行，那么切换到sheet/card方式，，隐藏grid方式下的toolbar和gridctrl的容器控件，并将“返回列表”按钮对应的处理传给内嵌窗口，
	 	如果没有选中行，那么提示选中一行
	 4.sheet/card方式时，保存当前编辑的行后，如果为编辑，那么只刷新grid方式的这一行，如果是新增，那么再grid方式里刷新增加一行
	 5.sheet/card方式时，打开窗户时，构造“返回列表”后面的name标示内容（view定义的时候，增加指定name标示字段属性），保存当前编辑的行后，刷新顶部的“返回列表”后面的name标示内容
	 6.去掉sheet/card方式下的删除按钮，导航按钮，查询按钮等
	 7.允许在sheet/card方式下连续添加记录，每次添加完成后，都在grid方式下刷新增加一行，
	 	调用grid方式的dopage获取单行，dopage的参数增加idValue、isNew属性，afterbasepage时处理得到的数据
	 8.点击“返回列表”后，切换回grid状态
	 */
	 
	var that = this;
	
	this.dataModel = p.dataModel;

	this.viewModel = p.viewModel;
	
	this.sheetModel = p.sheetModel;
	
	this.containerId = p.containerId;
	
	this.gridStyleCtrl = null;
	
	this.iframeId = null;
	
	this.detailPageParam = null;
	
	//是否支持双击编辑
	this.isDoubleClickEdit = p.isDoubleClickEdit == undefined ? true : p.isDoubleClickEdit;
	
	//是否显示行中的详情按钮
	this.hasRowBtnDetail = p.hasRowBtnDetail == null ? false : p.hasRowBtnDetail;
 	
	this.show = function(){
		this.initGridStyleCtrl();	  
	};
	
	//初始化grid方式控件
	this.initGridStyleCtrl = function(){
		p.colModel = p.viewModel.colModel;
		var gridStyleCtrl = new NcpGrid(p); 
		gridStyleCtrl.setGridOtherParam = function(initParam){
			if(that.isDoubleClickEdit){
				initParam.ondblClickRow = function(rowid, iRow, iCol, e){   
					var idValue = gridStyleCtrl.datatable.rows(rowid).getValue(gridStyleCtrl.dataModel.idFieldName); 
					that.showDetailInfo({idValue:idValue}); 
				}
			}
		};
		gridStyleCtrl.show();
		this.gridStyleCtrl = gridStyleCtrl;
		this.initGridStyleEvent(gridStyleCtrl);
	};

	//初始化嵌入的窗口
	this.initDetailPage = function(param){
		var iframeId = cmnPcr.getRandomValue();
		this.iframeId = iframeId;
		var initParam =  { 
				dataModel:that.dataModel,
				isRefreshAfterSave:p.isRefreshAfterSave, 
				viewModel:that.viewModel,
				sheetModel:that.sheetModel
			};
		initParam.isNew = param.isNew;
		initParam.isEdit = param.isEdit;
		initParam.idValue = param.idValue;
		
		//card方式保存后刷新grid方式下的行，这里存在新建保存和修改保存两种情况
		initParam.refreshGridRow = function(p){
			var oldSysWhere = that.gridStyleCtrl.sysWhere;
			that.gridStyleCtrl.sysWhere = [{parttype:"field", field:that.gridStyleCtrl.dataModel.idFieldName, operator:"=", value: p.idValue.toString() }];
			that.gridStyleCtrl.doPage({pageNumber:1, 
				onePageRowCount:1, 
				idValue:p.idValue, 
				isRefreshOneLine:true}); 
			that.gridStyleCtrl.sysWhere = oldSysWhere;
		};

		initParam.backToGrid = function(p){
			$("#" + iframeId).css("display", "none");
			//显示grid方式下的控件
			var gridChildren = $("#" + that.containerId).children();
			for(var i=0;i<gridChildren.length;i++){
				var gridChildrenId = $(gridChildren[i]).attr("id");
				if(typeof(gridChildrenId)==="undefined"){
					$(gridChildren[i]).css("display","block");
				}else if(gridChildrenId != that.iframeId && gridChildrenId.indexOf("ncp") == -1){
					$(gridChildren[i]).css("display","block");
				}
			}
			that.gridStyleCtrl.fulfill();
		} 		
		//解决sheet窗口由Card窗口返回至Grid窗口后，上传附件等部分窗口显示异常的问题  end   
		
		that.detailPageParam = initParam;
		window.multiStyleWinInitParam = initParam; 
		var iframeHtml = "<iframe id=\"" + iframeId + "\" style=\"width:100%;height:100%;display:none;\" frameborder=\"0\"/>";  
		$("#" + that.containerId).append(iframeHtml);
		$("#" + iframeId).attr("src", p.detailPageUrl);
		this.ShowDetailPage();
	};
	
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
	};
	
	//显示详细信息
	this.showDetailInfo = function(param){	
		if(that.iframeId == null){
			this.initDetailPage(param);
		}
		else{
			if(param.isNew){
				that.detailPageParam.doAdd({});
			}
			else if(param.isEdit){
				that.detailPageParam.doEdit({idValue:param.idValue});
			}
			else{
				that.detailPageParam.doShow({idValue:param.idValue});
			}
			this.ShowDetailPage();
		}
	};
	
	this.initGridStyleEvent = function(gridStyleCtrl){
		if(that.sheetModel != null){ 

			//查看详情按钮
			$("#" + that.containerId + " .zlpToolbarContainer").find("a[name='detailBtn']").click(function(){ 
				var selRowId = $(gridStyleCtrl.gridCtrl).jqGrid("getGridParam", "selrow");
				if(selRowId != undefined){
					var idValue = gridStyleCtrl.datatable.rows(selRowId).getValue(gridStyleCtrl.dataModel.idFieldName); 
					that.showDetailInfo({isEdit:false, idValue:idValue});
				}
				else{
					msgBox.alert({info:"请先选中记录, 或者鼠标双击该条记录."});
				}
			});
			
			//导出按钮
			$("#" + that.containerId + " .zlpToolbarContainer").find("a[name='exportBtn']").click(function(){ 
				var selectRowIds = gridStyleCtrl.getSelectedRowIds();
				if(selectRowIds.length  == 0){
					msgBox.alert({info:"请先选中要导出的记录."});
				} 
				else{
					if(msgBox.confirm({info: "确定要导出吗?"})){						
						var allIds = new Array();
						for(var i = 0; i < selectRowIds.length; i++){
							var selectRowId = selectRowIds[i];
							var idValue = gridStyleCtrl.datatable.rows(selectRowId).getValue(gridStyleCtrl.dataModel.idFieldName); 
							allIds.push(idValue);
						}
						var allIdStr = cmnPcr.arrayToString(allIds, ";");
						var viewName = gridStyleCtrl.viewModel.name;
						that.exportDataFile({
							url: basePath + "/biji/getDataFile",
							data:{
								viewName: viewName,
								ids: allIdStr
							}
						});
					}
				}
			});			
			
			gridStyleCtrl.baseDelete=function(param){
				var requestParam ={serviceName : "sheetNcpService",
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
							deleteRows:param.existRowIdValues,
							otherRequestParam:param.otherRequestParam
						})}
						};
				var serverAccess = new ServerAccess();
				serverAccess.request(requestParam); 
			} 
		}
	
		gridStyleCtrl.afterBasePage = function(param){ 
			if(param.isRefreshOneLine){
			    var rowId = gridStyleCtrl.datatable.getRowIdByIdField(param.idValue, gridStyleCtrl.dataModel.idFieldName);
			    if(rowId == null){
			    	//card方式下刚刚保存了新增记录
			    	var row = param.datatable.getRowByIdField(param.idValue, gridStyleCtrl.dataModel.idFieldName);
			    	rowId = row.rowId;
			    	gridStyleCtrl.datatable.addRow(rowId, row);
					$(gridStyleCtrl.gridCtrl).jqGrid("addRowData",rowId, row.allCells());
					gridStyleCtrl.initRowSelectContrl(rowId);
					gridStyleCtrl.initRowOperateContrl(rowId);
					gridStyleCtrl.totalRowCount = gridStyleCtrl.totalRowCount + 1;
					gridStyleCtrl.refreshPaginationCtrl();
			    }
			    else{
			    	//card方式下刚刚保存了已有记录
			    	var row = param.datatable.getRowByIdField(param.idValue, gridStyleCtrl.dataModel.idFieldName);
			    	row.rowId = rowId;
			    	gridStyleCtrl.datatable.replaceRow(rowId, row);
					$(gridStyleCtrl.gridCtrl).jqGrid("setRowData",rowId, row.allCells()); 
					gridStyleCtrl.refreshPaginationCtrl();			    	
			    }				
			}
			else{
				$(gridStyleCtrl.gridCtrl).jqGrid("clearGridData",true);
				
				gridStyleCtrl.datatable = param.datatable;
				 
				for(var rowId in param.datatable.allRows()){  
					$(gridStyleCtrl.gridCtrl).jqGrid("addRowData",rowId,param.datatable.rows(rowId).allCells());
					gridStyleCtrl.initRowSelectContrl(rowId);
					gridStyleCtrl.initRowOperateContrl(rowId);
				}
				
				gridStyleCtrl.totalRowCount = param.totalRowCount;
				gridStyleCtrl.pageNumber = param.pageNumber;
				gridStyleCtrl.refreshPaginationCtrl();
			}
		};
		var externalObject = {
			beforeDoAdd:function(param){  
				that.showDetailInfo({isNew:true}); 
				return false;
			},
			beforeDoEdit:function(param){ 
				var selRowId = $(gridStyleCtrl.gridCtrl).jqGrid("getGridParam", "selrow");
				if(selRowId != undefined){
					var idValue = gridStyleCtrl.datatable.rows(selRowId).getValue(gridStyleCtrl.dataModel.idFieldName); 
					that.showDetailInfo({isEdit:true, idValue:idValue});
				}
				else{
					msgBox.alert({info:"请先选中记录."});
				}
			    return false;
			},
			initOtherRowOperateHtml: function(param){
				var rowId = param.rowId;
				var rowDetailBtnId = rowId + "_ncpRowOperate_detail"; 
				var html = (that.hasRowBtnDetail ? ("<a class='ncpRowOperateBtn detailBtn' rowId='" + rowId + "' id='" + rowDetailBtnId + "' title=\"查看详情\">详情</a>") : "");
				return html;
			},
			bindOtherRowOperateEvent: function(param){
				var rowId = param.rowId;
				var rowDetailBtnId = rowId + "_ncpRowOperate_detail"; 
				$("#" + rowDetailBtnId).click(function(){
					var rowId = $(this).attr("rowId");
					gridStyleCtrl.selectRowInGrid(rowId)
					var currentRow = gridStyleCtrl.getCurrentRow();
					if(currentRow != null && currentRow.rowId == rowId){
						var idValue = gridStyleCtrl.datatable.rows(rowId).getValue(gridStyleCtrl.dataModel.idFieldName); 
						that.showDetailInfo({idValue:idValue}); 
					}
				});
			}
		};
		that.gridStyleCtrl.addExternalObject(externalObject); 
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
}

function NcpMultiStyleSheetWin(p){
	var that = this;
	this.sheetCtrl = null;
	this.initSheet = function(){
		p.isShowData = false;
		p.fromIndex = 0;
		p.onePageRowCount = 1;
		//p.where = [{parttype:"clause", clause:"1<>1"}];
		var sheet = new NcpSheet(p); 
		
		this.initSheetEvent(sheet);
		
		sheet.show();	
		
		var mainCardCtrl = sheet.getMainCardCtrl();
		
		//为以后执行操作提供方法
		p.doAdd = function(addParam){
			mainCardCtrl.doAdd({});
		};
		p.doEdit = function(editParam){
			mainCardCtrl.sysWhere = [{parttype:"field", field:mainCardCtrl.dataModel.idFieldName, operator:"=", value: editParam.idValue.toString() }];
			mainCardCtrl.doPage({isEdit:true,
				pageNumber:1 }); 
		};
		p.doShow = function(showParam){
			mainCardCtrl.sysWhere = [{parttype:"field", field:mainCardCtrl.dataModel.idFieldName, operator:"=", value: showParam.idValue.toString() }];
			mainCardCtrl.doPage({isEdit:false,
				pageNumber:1 }); 
		};

		//MultiStyleSheetWin绑定其他事件 add by ls 20191012
		this.initOtherEvent(sheet);

		//第一次打开窗口，执行操作
		if(p.isNew){
			p.doAdd(p);
		}
		else if(p.isEdit){
			p.doEdit(p);
		}
		else{
			p.doShow(p);
		} 
		this.sheetCtrl = sheet;
	};
	
	//MultiStyleSheetWin绑定其他事件 add by ls 20191012
	this.initOtherEvent = function(sheetCtrl){
		
	}
	
	this.initSheetEvent = function(sheetCtrl){
		sheetCtrl.initOtherEvent = function(partModel, partCtrl, externalObject){
			if(sheetCtrl.getMainPartModel() == partModel){
				var otherExternalObject = {
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
						if(p.refreshGridRow != null){
							p.refreshGridRow({idValue:idValue});
						}
					},
					beforeDoCancel:function(param){
						setTimeout(function(){
							if(p.backToGrid != null){
								p.backToGrid({});
							}							
						},200);
						return true;
					},
					afterDoPage:function(param){
						if(param.isEdit){
							partCtrl.doEdit({});
						}
					}
				};
				partCtrl.addExternalObject(otherExternalObject);
			}
		}
	};
	
	this.initOtherButtonEvent = function(){
		var mainCardCtrl = that.sheetCtrl.getMainCardCtrl();
		var ctrls = $("#" + that.sheetCtrl.containerId).find("a[name='backBtn']");
		if(ctrls.length>0){
			$(ctrls[0]).click(function(){ 
				if(p.backToGrid != null){
					if(mainCardCtrl.currentStatus == formStatusType.browse){
						p.backToGrid({});
					}
					else{
						mainCardCtrl.doCancel({});
					}
				}
			}); 
		}
	};
	
	this.show = function(){
		this.initSheet();	
		
		this.initOtherButtonEvent();	 
	}
}

function NcpMultiStyleCardWin(p){
	var that = this;
	this.cardCtrl = null;
	this.initCard = function(){
		p.isShowData = false; 
		p.fromIndex = 0;
		p.onePageRowCount = 1;
		//p.where = [{parttype:"clause", clause:"1<>1"}];
		var card = new NcpCard(p); 		
		this.initCardEvent(card);
		
		card.show();	 
		
		//为以后执行操作提供方法
		p.doAdd = function(addParam){
			card.doAdd({});
		};
		p.doEdit = function(editParam){
			card.sysWhere = [{parttype:"field", field:card.dataModel.idFieldName, operator:"=", value: editParam.idValue.toString() }];
			card.doPage({isEdit:true,
				pageNumber:1 }); 
		};
		p.doShow = function(showParam){
			card.sysWhere = [{parttype:"field", field:card.dataModel.idFieldName, operator:"=", value: showParam.idValue.toString() }]; 
			card.doPage({isEdit:false,
				pageNumber:1 }); 
		};

		//MultiStyleSheetWin绑定其他事件 add by ls 20191012
		this.initOtherEvent(card);
		
		//第一次打开窗口，执行操作
		if(p.isNew){
			p.doAdd(p);
		}
		else if(p.isEdit){
			p.doEdit(p);
		}
		else{
			p.doShow(p);
		}
		this.cardCtrl = card;
	};
	 
	//MultiStyleCardWin绑定其他事件 add by ls 20191012
	this.initOtherEvent = function(cardCtrl){
		
	}
	
	this.initCardEvent = function(cardCtrl){ 
		var externalObject = {
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
				if(p.refreshGridRow != null){
					p.refreshGridRow({idValue:idValue});
				}
			},
			beforeDoCancel:function(param){
				setTimeout(function(){
					if(p.backToGrid != null){
						p.backToGrid({});
					}							
				},200);
				return true;
			},
			afterDoPage:function(param){
				if(param.isEdit){
					cardCtrl.doEdit({});
				}
			}
		};
		cardCtrl.addExternalObject(externalObject);
	};

	
	this.initOtherButtonEvent = function(){ 
		var ctrls = $("#" + that.cardCtrl.containerId).find("a[name='backBtn']");
		if(ctrls.length>0){
			$(ctrls[0]).click(function(){ 
				if(p.backToGrid != null){
					if(that.cardCtrl.currentStatus == formStatusType.browse){
						p.backToGrid({});
					}
					else{
						that.cardCtrl.doCancel({});
					}
				}
			}); 
		}
	};
	
	this.show = function(){
		this.initCard();
		
		this.initOtherButtonEvent();
	}
}