/*
containerId   card 容器
*/

//NcpGrid
function NcpViewCard(p) {
	var that = this;

	this.serviceName = "dataNcpService";

	//容器id
	this.containerId = p.containerId;
	//数据模型，调用时赋值，具体模型是由服务器端自动生成的，注意和
	this.dataModel=p.dataModel;
	//展示模型
	this.viewModel = p.viewModel;
	//显示的定义，注意dataModel是数据模型定义
	this.colModel = p.viewModel.colModel;
	//Card方式显示域定义
	this.dispUnitModel = p.viewModel.dispUnitModel;
	this.onePageRowCount = p.onePageRowCount == undefined ? 20 : p.onePageRowCount;
	//每页可以显示多少行的选择 added by ls 20210914
	this.pageRowCountList = p.pageRowCountList == undefined ? [20, 50, 100] : p.pageRowCountList;
	//数据集
	this.datatable = null;
	//当前窗口状态
	this.currentStatus = null;
	//过滤条件
	this.where = p.where == undefined ? [] : p.where;
	//系统过滤条件
	this.sysWhere = p.sysWhere == undefined ? [] : p.sysWhere;
	//排序条件
	this.orderby = p.orderby == undefined ? [] : p.orderby;
	//是否取合计
	this.isGetSum = false;
	//是否取记录数
	this.isGetCount = p.isGetCount == undefined ? true : p.isGetCount;

	//导航控件
	this.paginationCtrl = null;

	//新增控件字段
	this.cardDivTitleField= p.cardDivTitleField == undefined ? "" : p.cardDivTitleField;;
	this.cardTitleField= p.cardTitleField == undefined ? this.cardDivTitleField : p.cardTitleField;;
	this.cardImgField= p.cardImgField == undefined ? "": p.cardImgField;;


	//翻页导航所用参数
	// this.totalCount = 0;
	// this.pageNumber = 1;
	// this.pageSize=20;
	// this.records=[];

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


	//注册其他控件操作方法
	this.regOtherOperateCtrls = function(){

		var searchBtnCtrl = $("#" + this.containerId + " .zlpToolbarQueryBtn");
		if(searchBtnCtrl.length != 0){
			$(searchBtnCtrl[0]).click(function(){
				that.where = null;
				that.doPage({ pageNumber : 1 });
				return false;
			});
		}

		var searchInputCtrl = $("#" + this.containerId + " .zlpToolbarQueryInputText");
		if(searchInputCtrl.length != 0){
			$(searchInputCtrl[0]).keydown(function(event){
				if (event.keyCode == 13) {
					that.where = null;
					that.doPage({ pageNumber : 1 });
				}
			});
		}
	}
	//初始化按钮们的事件
	this.regOperateCtrls = function() {

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

				var rowId = idValueToRowIds != undefined && idValueToRowIds[idValue] != undefined ? idValueToRowIds[idValue] : cmnPcr.getRandomValue();
				row.rowId = rowId;
				dt.addRow(rowId, row);
			}
		}
		return dt;
	}
	//刷新导航栏
	this.refreshPaginationCtrl = function() {
		var pageCount = Math.ceil(that.totalRowCount / that.onePageRowCount);
		var linkNums = new Array();
		if(pageCount <= 5){
			for(var i = 1; i <= pageCount; i++){
				linkNums.push(i);
			}
		}
		else{
			for(var i = 1; i <= pageCount; i++){
				if(i == 1){
					linkNums.push(i);
				}
				else if(i == 2 && that.pageNumber <= 4){
					linkNums.push(i);
				}
				else if(i == pageCount - 1 && pageCount - that.pageNumber <= 3){
					linkNums.push(i);
				}
				else if(Math.abs(that.pageNumber - i) <= 1){
					linkNums.push(i);
				}
				else if(i == pageCount){
					linkNums.push(i);
				}
			}
		}

		var paginationHtml = "";
		for(var i = 0; i < linkNums.length; i++){
			var linkNum = linkNums[i];
			if(i == 1){
				if(linkNum - linkNums[0] > 1){
					paginationHtml += "<li class=\"disabled\"><a href=\"#\">...</a></li>";
				}
			}
			if(i == linkNums.length - 1 && i > 0){
				if(linkNum - linkNums[linkNums.length - 2] > 1){
					paginationHtml += "<li class=\"disabled\"><a href=\"#\">...</a></li>";
				}
			}
			paginationHtml += ("<li" + (that.pageNumber == linkNum ? " class=\"active\"" : "") + "><a href=\"#\" class=\"pageBtn\" pageNum=\"" + linkNum + "\">" + linkNum + "</a></li>");
		}
		paginationHtml += ("<li class=\"disabled\"><span>共" + that.totalRowCount + "条<span></li>");
		$("#" + that.containerId + " .zlpNavUl").html(paginationHtml);
		$("#" + that.containerId + " .pageBtn").click(function(){
			var pageNum = $(this).attr("pageNum");
			that.doPage({pageNumber: parseInt(pageNum)});
		});
	}

	//调用服务器端
	this.ProcessServerAccess = function(requestParam) {
		var serverAccess = new ServerAccess();
		serverAccess.request(requestParam);
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

		var requestParam = {
			serviceName : this.serviceName,
			waitingBarParentId : this.containerId,
			funcName : "select",
			successFunc : function(obj) {
				param.datatable = that.getDataTableFromBackInfo(obj.result.table.rows);
				param.sumRow = null;// that.getSumRow(obj);
				param.totalRowCount = obj.result.rowCount;

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
		param.currentPage = param.pageNumber;
		return true;
	}
	//将数据显示在界面中
	this.afterBasePage = function(param) {
		that.datatable = param.datatable;
		that.initCardListHtml(param);

		that.totalRowCount = param.totalRowCount;
		that.pageNumber = param.pageNumber;
		//
		that.refreshPaginationCtrl();
	}
	this.beforeDoPage = function(param) {
		return this.doExternalFunctionContinue("beforeDoPage", param);
	}
	this.afterDoPage = function(param) {
		this.doExternalFunction("afterDoPage", param);
	}
	this.doPage = function(param) {
		if (this.beforeBasePage(param) && this.beforeDoPage(param)) {
			this.basePage(param);
		}
	}
	//当选中某行数据时
	this.afterRowSelect = function(rowId) {
		this.doExternalFunction("afterRowSelect", rowId);
	}

	this.formatCardDivTitle=function (row){
		var html="";
		if(row&&that.cardDivTitleField){
			html=row.getValue(that.cardDivTitleField);
		}
		return html;
	}
	this.formatCardImgSrc=function (row){
		var src=basePath+"/images/common/southeast3.jpg";
		if(row&&that.cardImgField&&row.getValue(that.cardImgField)) {
			src = basePath + "/cms/getCMSImage?id=" + row.getValue(that.cardImgField);
		}
		return src;
	}
	this.formatCardTitle=function (row){
		var html="";
		if(row&&that.cardTitleField){
			html=row.getValue(that.cardTitleField);
		}
		return html;
	}
	this.bindCardEvent=function (param){
		this.gridDiv = $("#" + this.containerId).find("div[name='gridDiv']")[0];

		for (var rowId in this.datatable.allRows()) {

			$(this.gridDiv).find("div[id='"+rowId+"']").click(function (e){
				var selectId= $(this).attr('id');
				setTimeout(function (){
					that.afterRowSelect(selectId);
				},300)
			})
			// $("#" +that.containerId+" div[id='"+rowId+"']").dblclick(function (){
			// 	that.afterRowSelect(rowId);
			// })
		}
	}
	this.initCardListHtml=function (param){
		this.gridDiv = $("#" + this.containerId).find("div[name='gridDiv']")[0];
		var html="";

		for (var rowId in this.datatable.allRows()) {
			var row=this.datatable.rows(rowId);
			var cardDivTitle=this.formatCardDivTitle(row);
			var cardImgSrc=this.formatCardImgSrc(row);
			var cardTitle=this.formatCardTitle(row);

			var oneHtml=" <div id='"+rowId+"' style=\"width: 127px; box-sizing: border-box; margin: 5px; position: relative;\"> " +
				"   <div class=\"box-content\" ><span class='el-tooltiptext'>"+cardDivTitle+"</span>" +
				"   <div class=\"el-card box-card is-always-shadow\" >" +
				"   <div class=\"el-card__body\" style=\"padding: 0px; height: 100%;\"> " +
				"   <div class=\"el-image\" style=\"width: 100%; height: 100%; position: relative;\"> " +
				"		<img src=\""+cardImgSrc+"\" class=\"el-image__inner\" style=\"object-fit: cover;\">" +
				// "   <div class=\"el-image__error\">加载失败</div>\n" +
				// "    <img src=\""+basePath+"/images/common/southeast3.jpg\" class=\"el-image__inner\" style=\"object-fit: cover;\">" +
				"   </div> " +
				"   <div class=\"title\">"+cardTitle+"</div>" +
				"   </div> " +
				"   </div> " +
				"   </div> " +
				" </div>";
			html+=oneHtml;
		}
		//如果为空 默认显示没有数据
		if(html===""){
			html="<div class=\"el-table__empty-block\" style=\"width: 100%; height: 100%;\"><span class=\"el-table__empty-text\">暂无数据</span></div>";
		}
		$(this.gridDiv).html(html);
		this.bindCardEvent(param);
	};
	this.initGridTable=function (p){
		//初始化页面
		// that.initCardListHtml();

	}
	//初始化每页显示的条数下拉 added by ls 20210914
	this.initPageRowCountList = function(){
		var pageRowCountSelectCtrls = $("#" + that.containerId).find(".zlpNavPageRowCountSelect");
		if(pageRowCountSelectCtrls.length > 0){
			var pageRowCountSelectCtrl = pageRowCountSelectCtrls[0];
			var allOptionHtml = "";
			for(var i = 0; i < that.pageRowCountList.length; i++){
				var pageRowCount = that.pageRowCountList[i];
				allOptionHtml += ("<option value=\"" + pageRowCount + "\">" + pageRowCount + "条/页</option>");
			}
			$(pageRowCountSelectCtrl).html(allOptionHtml);
			$(pageRowCountSelectCtrl).change(function(){
				var pageRowCount = parseInt($(this).val());
				that.onePageRowCount = pageRowCount;
				that.doPage( {
					pageNumber : 1
				});
			});
		}
	}

	//显示
	this.show = function() {
		//为控件绑定功能，并使控件受状态控制
		this.regOperateCtrls();

		//初始化页面
		this.initGridTable(p);

		//显示可选的每页条数
		this.initPageRowCountList();

		//加载第一页数据
		this.doPage( {
			pageNumber : 1
		});
	}

}