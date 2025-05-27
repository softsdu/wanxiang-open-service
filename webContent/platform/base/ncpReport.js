//NcpReport
function NcpReport(p){
	
	var that = this;
	
	//容器id
	this.containerId = p.containerId;  
	
	//报表模型
	//reportModel.paramWinModel
	//reportModel.pageName
	this.reportModel = p.reportModel;
	
	//参数录入窗口对象
	this.paramWin = null;
	
	this.initParamWin = function(){
		if(that.reportModel.paramWinName != ""){
			var paramWinContainers = $("#" + that.containerId).find("div[name='paramWinDiv']");
			if(paramWinContainers.length != 0){
				var paramWinContainer = paramWinContainers[0];
				var paramWinContainerId = $(paramWinContainer).attr("id"); 
				if(paramWinContainerId == undefined){
					paramWinContainerId = cmnPcr.getRandomValue();
					$(paramWinContainer).attr("id", paramWinContainerId);
				}
				 
				var paramWin = new NcpParamWin({
					containerId:paramWinContainerId,
					paramWinModel:paramWinModels[that.reportModel.paramWinName]
				}); 
				paramWin.show();
				this.paramWin = paramWin;
			}
		}
	};
	
	//初始化按钮事件
	this.initBtnEvent = function(){
		var showReportBtns = $("#" + that.containerId).find("input[name='showReportBtn']");
		if(showReportBtns.length != 0){
			var showReportBtn = showReportBtns[0];
			$(showReportBtn).click(function(){
				that.showReportResult();
			});
		}
	};
	
	//显示报表结果
	this.showReportResult = function(){
		if(that.paramWin == null){
			this.showReportPage(null);
		}
		else{
			var result = that.paramWin.getParamResult();
			if(result.verified){
				this.showReportPage(result.values);
			}
			else{
				msgBox.alert({info:result.error});
			}
		}
	};
	
	//显示报表结果页面
	this.showReportPage = function(paramValues){
		var valueStrObjects = {};
		var valueTypes = {};
		if(paramValues != null){
			for(var paramName in paramValues){
				var paramModel = that.reportModel.paramWinModel.units[paramName];
				valueTypes[paramName] = paramModel.valueType;
				var value = paramValues[paramName];
				if(paramModel.isMultiValue){
					var strArray = [];
					if(value != null){
						for(var i=0;i<value.length;i++){
							strArray.push(cmnPcr.objectToStr(value[i], paramModel.valueType));
						}
					}
					valueStrObjects[paramName] = strArray;
				}
				else{
					valueStrObjects[paramName] = cmnPcr.objectToStr(value,paramModel.valueType);
				}
			}
		}
		var requestParamStr = cmnPcr.jsonToStr({values:valueStrObjects, types:valueTypes});
		msgBox.alert({info:requestParamStr});		
	};
	
	//显示
	this.show = function(){
		
		this.initParamWin();
		
		this.initBtnEvent();
		
		if(this.reportModel.isAuto){
			this.showReportResult();
		}
	}
}