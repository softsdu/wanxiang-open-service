function NcpParamWin(p){
	
	var that = this;
	
	//容器id
	this.containerId = p.containerId;  
	
	//数据模型，调用时赋值，具体模型是由服务器端自动生成的，注意和
	this.paramWinModel = p.paramWinModel;
	
	//所有外部程序声明
	this.externalObjects = new Array();
	
	//所有编辑控件
	this.allParamCtrls = new Hashtable();
	
	//添加外部程序声明
	this.addExternalObject = function(externalObj){
		/*外部程序方法包括
			beforeDoList
			afterDoList
			beforeDoPop
			afterDoPop
		 */
		if(externalObj != null){
			this.externalObjects.push(externalObj);
			externalObj.owner = this;
		}
	}
	
	//执行外部程序
	this.doExternalFunction = function(functionName, param){
		for(var i = 0;i< this.externalObjects.length;i++){
			var externalObj = this.externalObjects[i];
			var func = externalObj[functionName];
			if(func != null){
				func(param);
			}
		}
	}
	
	//执行外部程序，判断是否可以继续执行
	this.doExternalFunctionContinue = function(functionName, param){
		for(var i = 0;i< this.externalObjects.length;i++){
			var externalObj = this.externalObjects[i];
			var func = externalObj[functionName];
			if(func != null){
				if(!func(param)){
					return false;
				}
			}
		}
		return true;
	}
	
	//调用服务器端
	this.ProcessServerAccess = function(requestParam){
		var serverAccess = new ServerAccess();
		serverAccess.request(requestParam); 
	} 
	
	//下拉
	this.baseList= function(param){
		var requestParam ={serviceName : "paramWinNcpService",
				waitingBarParentId : null,
				funcName : "getList", 
				successFunc : function(obj){ 
					param.rows = that.getListRowsFromBackInfo(obj.result.table.rows, param.paramModel.list.columns); 
					that.processListData(param);
					that.afterBaseList(param); 
					that.afterDoList(param); 
				},
				args : {requestParam:cmnPcr.jsonToStr({
					paramWinName: that.paramWinModel.name,
					listName: param.listName,
					where: param.where == undefined ? [] : param.where,
					orderby: param.orderby== undefined ? [] : param.orderby,
					otherRequestParam:param.otherRequestParam
				})}
				};
		this.ProcessServerAccess(requestParam); 
	}		
	this.processListData = function(param){
		this.doExternalFunctionContinue("processListData", param);
	}
	this.beforeBaseList = function(param){
		if(param.value != undefined && param.value != null && param.value != ""){
			param.where = [{parttype:"field", field:param.paramModel.name, operator:"like", value:(param.value + "%") }];
		}
		return true; 
	}
	this.afterBaseList = function(param){
		//显示下拉
	    var ctrl = this.allParamCtrls.get(param.paramModel.name);
	    $(ctrl).listDispunit("showList",param.rows);
	} 
	this.beforeDoList = function(param){ 
		return this.doExternalFunctionContinue("beforeDoList", param); 
	}	
	this.afterDoList = function(param){
		this.doExternalFunction("afterDoList", param); 
	}
	this.doList = function(param){
		if(this.beforeBaseList(param) && this.beforeDoList(param)){
			this.baseList(param); 
		}
	}
	
	this.getPopContainer = function(param){
		var queryIndex = param.paramModel.inputHelpName.indexOf("?");
		var queryString = queryIndex < 0 ? "" : param.paramModel.inputHelpName.substr(queryIndex + 1);
		var args = cmnPcr.getQueryArgsFromString(queryString);
		var width = args.w == null ? 800 : parseInt(args.w);
		var height = args.h == null ? 500 : parseInt(args.h);
		var top = args.t == null ? 50 : parseInt(args.t);
		
		var popContainer = new PopupContainer({
			width: width,
			height: height,
			top: top,
			title: param.paramModel.label + " - 选择窗口"
		});
		return popContainer;
	}
	
	//pop和list的区别就是，pop是模仿模态，弹出选择返回后，才调用after的方法们，list是下拉获取下拉列表的值后就执行after方法们
	this.basePop = function(param){
		var popContainer = this.getPopContainer(param);
		popContainer.show();
		var initParam = {
			closeWin : function(p){ 
				param.selectedRows = null;
				if(p.selectedRows != undefined){
					param.selectedRows = {};
					for(var rowId in p.selectedRows){
						var row = {};
						var selectedRow = p.selectedRows[rowId];
						for(var destFieldName in param.paramModel.maps){
							var sourceFieldName = param.paramModel.maps[destFieldName];
							row[sourceFieldName] = selectedRow[sourceFieldName];
						}	
						if(param.paramModel.isMultiValue){
							param.selectedRows[rowId] = row;
						}
						else{
							param.selectedRows = row;
							break;
						}
					}
				}
				
				popContainer.close(); 
				that.afterBasePop(param);
				that.afterDoPop(param);
				if(param.selectedRows != undefined){
					param.changeValueFunc(param.selectedRows);
				}
			},
			value:param.value,
			isMultiValue:param.paramModel.isMultiValue,
			showField : param.paramModel.maps[param.paramModel.name],
			paramField : param.paramModel.name
		}
		window.popInitParam = initParam; 
		
		
		//var popNames = param.paramModel.inputHelpName.split(".");
		//var popPageUrl = "../pop/" + popNames[0] + "_" + popNames[1] + ".jsp";
		var popPageUrl =basePath + "/" + param.paramModel.inputHelpName;
		
		 
		var frameId = cmnPcr.getRandomValue();
		var iFrameHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		$("#" + popContainer.containerId).html(iFrameHtml);
		$("#" + frameId).attr("src", popPageUrl);	
	}
	
	this.processPopData = function(param){
		this.doExternalFunctionContinue("processPopData", param);
	}
	this.beforeBasePop = function(param){ return true; }
	this.afterBasePop = function(param){ } 
	this.beforeDoPop = function(param){
		return this.doExternalFunctionContinue("beforeDoPop", param); 
	}	
	this.afterDoPop = function(param){
		this.doExternalFunction("afterDoPop", param); 
	}
	this.doPop = function(param){
		if(this.beforeBasePop(param) && this.beforeDoPop(param)){
			this.basePop(param); 
		}
	}  
	
	//从返回值中获取下拉的数据
	this.getListRowsFromBackInfo = function(allServerRows, columns){ 
		var rows = new Array();
		for(var i=0;i<allServerRows.length;i++){
			var serverRow = allServerRows[i];
			var row = {};
			 for(var j=0;j<columns.length;j++){
				var column = columns[j];
				var valueType = column.valueType;
				var tempValue = serverRow[column.field];
				tempValue = cmnPcr.replace(tempValue, "\\\\\"", "\"");
				tempValue = cmnPcr.replace(tempValue, "\\\\r", "\r");
				tempValue = cmnPcr.replace(tempValue, "\\\\n", "\n");
				var value = cmnPcr.strToObject(tempValue, valueType);
				row[column.field] = value; 
			 } 
			 rows.push(row);
		}
		//增加空本行
		rows.push({});
		return rows;
	}
	
	this.createDispunit = function(name, unitType, ctrl, paramModel, options, style){
		$(ctrl).attr("fieldName", paramModel.name);
		options.fieldName = paramModel.name;
		switch(unitType){
			case "text":
				//param 
				return $(ctrl).textDispunit({options:options, style:style});
			case "textarea":
				//param 
				return $(ctrl).textareaDispunit({options:options,style:style});
			case "decimal":
				//param包含isComma、decimalNum
				return $(ctrl).decimalDispunit({groupSeparator:(paramModel.isComma ? "," : ""), precision:paramModel.decimalNum, options:options, style:style});
			case "date":
				return $(ctrl).dateDispunit({options:options,style:style});
			case "time":
				return $(ctrl).timeDispunit({options:options,style:style});
			case "checkbox":
				//param包含，以后扩展是否允许三态
				return $(ctrl).checkboxDispunit({options:options,style:style});
			case "list":
				//param包含container、idField、textField、columns、getListFunc、changeFunc、options(扩展属性,在NcpView中，包含了rowId)
				return $(ctrl).listDispunit({
					idField:null,
					textField:paramModel.maps[paramModel.name],
					columns:[paramModel.list.columns],
					getListFunc:function(p) {
						that.doList({
							listName: paramModel.list.name,
							value: p.value,

							//增加eventType的传递
							eventType: p.eventType,

							//增加where的传递
							where: paramModel.where ? paramModel.where : null,

							paramModel: paramModel
						});
					},
					options:options,
					style:style}); 
			case "pop":
				return  $(ctrl).popDispunit({
							idField:null,
							textField:paramModel.maps[paramModel.name], 
							options:options,
							showPopFunc: function(p){ 
								that.doPop({
									value: p.value, 
									
									//增加eventType的传递 added by ls 20220606
									eventType: p.eventType,
									
									paramModel: paramModel,
									changeValueFunc: p.changeValueFunc
								}); 
							},
							style:style}); 
			case "popMulti":
				return  $(ctrl).popMultiDispunit({
							idField:null,
							textField:paramModel.maps[paramModel.name], 
							options:options,
							showPopFunc: function(p){ 
								that.doPop({
									value: p.value, 
									
									//增加eventType的传递 added by ls 20220606
									eventType: p.eventType,
									
									paramModel: paramModel,
									changeValueFunc: p.changeValueFunc}); 
							},
							style:style}); 
			default:
				return this.createCustomDispunit(name, dispunitType, ctrl, fieldModel, options, style); 
		}
	}
	
	this.createCustomDispunit = function(name, dispunitType, ctrl, fieldModel, options, style){
		return null;
	} 
	
	//初始化
	this.initWin = function(p){  
		for(var paramName in p.paramWinModel.units){
			
			var paramModel = p.paramWinModel.units[paramName];
			   
			var ctrls = $("#" + this.containerId).find("input[paramCtrl='true'][name='" + paramModel.name + "']");
			if(ctrls.length > 0){
				this.initParamUnitCtrl(ctrls[0], paramModel);
			}
			 
			var ctrls = $("#" + this.containerId).find("textarea[paramCtrl='true'][name='" + paramModel.name + "']");
			if(ctrls.length > 0){
				this.initParamUnitCtrl(ctrls[0], paramModel);
			}
		}
	}
	
	//初始化某个录入控件
	this.initParamUnitCtrl = function(ctrl, paramModel){ 
		var style = {}; 
		var options = {changeFunc:this.unitValueChange, fieldName:paramModel.name};
		this.createDispunit(paramModel.name, paramModel.unitType, ctrl, paramModel, options, style);
		this.doCtrlCoreMethod(ctrl, paramModel.unitType, paramModel.name, "setReadonly", false);
		this.allParamCtrls.add(paramModel.name, ctrl);		
	} 
	
	this.doCtrlCoreMethod = function(ctrl, dispunitType, fieldName, methodName, value){ 
		switch(dispunitType){
			case "text":
				return $(ctrl).textDispunit(methodName, value);
			case "textarea":
				return $(ctrl).textareaDispunit(methodName, value); 
			case "decimal":
				return $(ctrl).decimalDispunit(methodName, value); 
			case "date":
				return $(ctrl).dateDispunit(methodName, value); 
			case "time": 
				return $(ctrl).timeDispunit(methodName, value); 
			case "checkbox": 
				return $(ctrl).checkboxDispunit(methodName, value); 
			case "list": 
				return $(ctrl).listDispunit(methodName, value); 
			case "pop": 
				return $(ctrl).popDispunit(methodName, value); 
			case "popMulti": 
				return $(ctrl).popMultiDispunit(methodName, value); 
			default:
				return null;
		}
	}
	
	this.unitValueChange = function(jq, newValue){
		that.valueChange(jq, newValue);
		that.doExternalFunctionContinue("onUnitValueChange", {jq: jq, newValue: newValue}); 
	}
	
	//显示域值改变时调用此函数，(用于扩展)
	this.valueChange = function(jq, newValue){
		//alert($(jq).attr("id") + " " + $(jq).attr("fieldName") + " " + newValue);
	}
	 
	this.doCtrlMethod = function(paramModel, methodName, value){ 
		var unitType = paramModel.unitType;
		var ctrl = this.allParamCtrls.get(paramModel.name);	 
		return this.doCtrlCoreMethod(ctrl, unitType, paramModel.name, methodName, value);
	}
	
	this.doCtrlMethodByParamName = function(paramName, methodName, value){
		var paramModel = this.paramWinModel.units[paramName];
		this.doCtrlMethod(paramModel, methodName, value);
	}
	
	this.getDefaultValue = function(paramModel){
		if(paramModel.defaultValue != ""){
			return cmnPcr.strToObject(paramModel.defaultValue, paramModel.valueType);
		}
		else{
			return null;
		}
	}
	
	this.initDefaultValues = function(){		
		for(var paramName in  this.allParamCtrls.allKeys()){
			var paramModel = this.paramWinModel.units[paramName];
			if(paramModel.maps == null){
				var value = this.getDefaultValue(paramModel);
				this.doCtrlMethod(paramModel, "setValue", value);	
			}
			else if(paramModel.inputHelpType == "pop" && paramModel.isMultiValue){
				this.doCtrlMethod(paramModel, "setValue", {});	
			}
			else{
				var value = {}; 
				for(var destParam in paramModel.maps){
					var listField = paramModel.maps[destParam];
					var destParamModel = this.paramWinModel.units[destParam];
					value[listField] = this.getDefaultValue(destParamModel);
				} 
				this.doCtrlMethod(paramModel, "setValue", value);	
			} 
		}
	}
	
	this.initEditables = function(){		
		for(var paramName in  this.allParamCtrls.allKeys()){
			var paramModel = this.paramWinModel.units[paramName];
			if(!paramModel.isEditable){ 
				this.doCtrlMethod(paramModel, "setReadonly", true);	
			} 
		}
	}
	
	this.setParamValues = function(values){
		for(var paramName in values){
			var value = values[paramName];
			this.doCtrlMethodByParamName(paramName, "setValue", value);
		}
	}
	
	this.getParamValues = function(){
		var values = {};
		for(var paramName in  this.allParamCtrls.allKeys()){
			var paramModel = this.paramWinModel.units[paramName];
			var value = this.doCtrlMethod(paramModel, "getValue");

			if(paramModel.maps == null){
				values[paramName] = value;
			}
			else if(paramModel.inputHelpType == "pop" && paramModel.isMultiValue){
				for(var destParam in paramModel.maps){
					var listField = paramModel.maps[destParam]; 
					values[destParam] = new Array();
				} 
				
				for(var rowId in value){
					var row = value[rowId];
					for(var destParam in paramModel.maps){
						var listField = paramModel.maps[destParam]; 
						values[destParam].push(row[listField]);
					} 
				}
			}
			else{
				for(var destParam in paramModel.maps){
					var listField = paramModel.maps[destParam]; 
					values[destParam] = value[listField];
				} 
			}
		}
		return values;
	}
	
	//获取参数录入结果
	this.getParamResult = function(){
		var values = this.getParamValues();
		var errors = new Array();
		for(var paramName in values){
			var paramModel = this.paramWinModel.units[paramName]; 
			if(!paramModel.isNullable){
				var isNullValue = false;
				var value = values[paramName];
				switch(paramModel.valueType){
					case valueType.string:
						isNullValue = value == "" || value == null;
						break;
					default:
						isNullValue = value == null;
						break;							
				}
				if(isNullValue){
					errors.push("请输入\"" + paramModel.label + "\"的值");
				}
			}
		}
		return {values: values,  
			error: cmnPcr.arrayToString(errors, "; ") + ".", 
			verified:(errors.length == 0)};
	}
	
	this.show = function(){
		this.initWin(p);
		
		this.initDefaultValues();
		this.initEditables();
	}
}