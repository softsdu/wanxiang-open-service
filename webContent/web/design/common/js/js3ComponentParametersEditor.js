function JS3ComponentParametersEditor(){
	var thatComParamEditor = this;
	this.containerId = null;
	this.categoryId = null;
	this.detailLevel = null;
	this.parameters = null;
	this.sortedRunExpParameters = [];
	this.parameterIdToParamWin = {};
	
	this.init = function(p){ 
		thatComParamEditor.containerId = p.containerId;
		thatComParamEditor.categoryId = p.categoryId;
		thatComParamEditor.parameters = p.parameters;
		thatComParamEditor.sortedRunExpParameters = p.sortedRunExpParameters;
		thatComParamEditor.detailLevel = p.detailLevel;
		thatComParamEditor.initHtml(p.parameters);
		thatComParamEditor.refreshStatus();
	} 
	
	this.getCategoryParameters = function(categoryId){
		var requestParam = {
			 categoryId: categoryId 
		}; 
 		serverAccess.request({
 			serviceName:"mdlComponentNcpService", 
 			funcName:"getCategoryProperties",
 			args:{
 				requestParam:cmnPcr.jsonToStr(requestParam)
			},  
 			successFunc:function(obj){  				 
 				if(obj.result.properties.length == 0){
 					msgBox.alert({info: "尚未为其类型定义属性"});
 				}
 				else{
 					var allProperties = new Array();
 					for(var i = 0; i < obj.result.properties.length; i++){
 						var propertyJson = obj.result.properties[i];
 						allProperties.push({
 							name: decodeURIComponent(propertyJson.name),
 							paramType: propertyJson.paramType,
 							isNullable: propertyJson.isNullable,
 							isEditable: propertyJson.isEditable,
 							isGeo: propertyJson.isGeo,
 							defaultValue: decodeURIComponent(propertyJson.defaultValue),
 							minimumValue: decodeURIComponent(propertyJson.minimumValue),
 							maximumValue: decodeURIComponent(propertyJson.maximumValue),
 							exp: decodeURIComponent(propertyJson.exp),
 							listValues: decodeURIComponent(propertyJson.listValues),
							//新增对应的统计指标 added by liyh 20211125
                            statisticIndex: decodeURIComponent(propertyJson.statisticIndex),
                            statisticIndexType: decodeURIComponent(propertyJson.statisticIndexType),
							//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
							orderNumber: decodeURIComponent(propertyJson.orderNumber),
							designVisible: decodeURIComponent(propertyJson.designVisible),

							//构件参数分类 added by ls 20230731
							categoryName: decodeURIComponent(propertyJson.categoryName),
							
							//组内序号 added by ls 20230804
							indexInGroup: propertyJson.indexInGroup,	
 							
 							groupName: decodeURIComponent(propertyJson.groupName),
							//paramType为array类型的标题名称 added by yay 20240103
							arrayDescription: decodeURIComponent(propertyJson.arrayDescription),
 						});
					}
 					thatComParamEditor.resetByCategoryProperties(allProperties);
 				}
 			}
 		});   
	}
	
	//使用类型的属性来重新设置参数
	this.resetByCategoryProperties = function(allProperties){
		var allExistParameters = thatComParamEditor.getExistParameters();
		var needAddProperties = new Array();
		var existPropertyNameStr = "";
		var needAddPropertyNameStr = "";
		for(var i = 0; i < allProperties.length; i++){
			var property = allProperties[i];
			var paramName = property.name;
			var parameter = allExistParameters[paramName];
			if(parameter == null){
				needAddProperties.push(property);
				needAddPropertyNameStr += (needAddPropertyNameStr.length == 0 ? paramName : ("、" + paramName));
			}
			else{
				existPropertyNameStr += (existPropertyNameStr.length == 0 ? paramName : ("、" + paramName));
			}
		}
		if(needAddProperties.length == 0){
			var message = "所有参数都已存在, 无需添加任何参数.";
			msgBox.alert({info: message});
		}
		else{
			var message = "需要添加" + needAddProperties.length + "个属性，包括：" + needAddPropertyNameStr + ". " + (existPropertyNameStr.length == 0 ? "" : ("\r\n另外, 属性'" + existPropertyNameStr + "'已经存在，无需重复添加. ")) + "\r\n\r\n确认执行添加操作吗?";
			if(msgBox.confirm({info: message})){
				for(var i = 0; i < needAddProperties.length; i++){
					var property = needAddProperties[i];
					var newParameter = {
						id: cmnPcr.createGuid(),
						name: property.name,
						paramType: property.paramType,
						isNullable: property.isNullable,
						isEditable: property.isEditable,
						isGeo: property.isGeo,
						defaultValue: property.defaultValue,
						minValue: property.minimumValue,
						maxValue: property.maximumValue,
						listValues: property.listValues,
						exp: property.exp == null || property.exp.length == 0 ? null : {pim: property.exp},
                        //新增对应的统计指标 added by liyh 20211125
                        statisticIndex: property.statisticIndex,
                        statisticIndexType: property.statisticIndexType,
						//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
						orderNumber:property.orderNumber,
						designVisible:property.designVisible,
						
						//构件参数分类 added by ls 20230731
						categoryName: property.categoryName,	
						
						//组内序号  added by ls 20230804
						indexInGroup: property.indexInGroup,	
						
						groupName: property.groupName,
						//paramType为array类型的标题名称 added by yay 20240103
						arrayDescription: property.arrayDescription,
					};
					thatComParamEditor.createParameterItem(newParameter);	
				}
				var middleContainer = $("#" + thatComParamEditor.containerId).find(".componentParametersEditMiddle")[0];
				thatComParamEditor.refreshStatus();
				middleContainer.scrollTop = middleContainer.scrollHeight;
			}
		}
		
	}
	
	//获取已经存在的参数
	this.getExistParameters = function(){
		var editItems = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem"); 
		var allParameters = {};
		for(var i = 0; i < editItems.length; i++){
			var editItem = editItems[i];
			var parameterId = $(editItem).attr("parameterId");
			if(parameterId != null){
				var paramWin = thatComParamEditor.parameterIdToParamWin[parameterId];
				var resultValues = paramWin.getParamResult();
				var paramName = resultValues.values.name.trim();
				var paramType = resultValues.values.paramtype;
				var defaultValue = resultValues.values.defaultvalue.trim();
				var minValue = resultValues.values.minvalue.trim();
				var maxValue = resultValues.values.maxvalue.trim();
				var listValuesStr = resultValues.values.listvalues.trim();
				var isNullable = resultValues.values.isnullable;
				var isEditable = resultValues.values.iseditable;
				var isGeo = resultValues.values.isgeo;
				var expPim = resultValues.values.exppim.trim(); 
				
				//构件参数分类 added by ls 20230731
				var categoryName = resultValues.values.categoryname;
				
				//组内序号 added by ls 20230804
				var indexInGroup = resultValues.values.indexingroup;
				
				var groupName = resultValues.values.groupname;
                //新增对应的统计指标 added by liyh 20211125
                var statisticIndex = resultValues.values.statisticIndex;
                var statisticIndexType = resultValues.values.statisticIndexType;
				//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
				var orderNumber = resultValues.values.orderNumber;
				var designVisible = resultValues.values.designVisible;
				//paramType为array类型的标题名称 added by yay 20240103
				var arrayDescription = resultValues.values.arrayDescription.trim();

				allParameters[paramName] = {
					name: paramName,
					paramType: paramType,
					isNullable: isNullable,
					isEditable: isEditable,
					isGeo: isGeo,
					defaultValue: defaultValue,
					minValue: minValue,
					maxValue: maxValue,
					exp: expPim,
					listValues: listValuesStr,
                    //新增对应的统计指标 added by liyh 20211125
                	statisticIndex:statisticIndex,
                    statisticIndexType:statisticIndexType,
					//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
					orderNumber:orderNumber,
					designVisible:designVisible,

					//构件参数分类 added by ls 20230731
					categoryName: categoryName,

					//组内序号 added by ls 20230804
					indexInGroup: indexInGroup,
					
					groupName: groupName,
					//paramType为array类型的标题名称 added by yay 20240103
					arrayDescription:arrayDescription
				};
			}
		}
		return allParameters;
	}
	
	this.getParameters = function(){
		var editItems = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem");
		var errors = [];	
		var newParameters = {};
		for(var i = 0; i < editItems.length; i++){
			var editItem = editItems[i];
			var parameterId = $(editItem).attr("parameterId");
			if(parameterId != null){
				var paramWin = thatComParamEditor.parameterIdToParamWin[parameterId];
				var resultValues = paramWin.getParamResult();
				var paramName = resultValues.values.name.trim();
				if(paramName.length == 0){
					errors.push("参数名不可为空.");
				}
				else{
					//参数是否重名
					var hasSameName = false;
					for(var tempName in newParameters){
						if(tempName == paramName){
							hasSameName = true;
							break;
						}
					}
					if(hasSameName){
						errors.push("存在重名的参数 '" + paramName + "'.");
					}
					else{
						//参数配置是否合法
						var paramType = resultValues.values.paramtype;
						var defaultValue = resultValues.values.defaultvalue.trim();
						var listValuesStr = resultValues.values.listvalues.trim();
						var isNullable = resultValues.values.isnullable;
						var isEditable = resultValues.values.iseditable;
						var isGeo = resultValues.values.isgeo;
						var expPim = resultValues.values.exppim.trim();
						var expJs = resultValues.values.expjs;
						var expPs = resultValues.values.expps;

						//新增对应的统计指标 added by liyh 20211125
                        var statisticIndex = resultValues.values.statisticindex? resultValues.values.statisticindex:"";
                        var statisticIndexType = resultValues.values.statisticindextype;

						//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
						var orderNumber = resultValues.values.orderNumber? resultValues.values.orderNumber:"";
						var designVisible = resultValues.values.designVisible;

						//构件参数分类 added by ls 20230731
						var categoryName = resultValues.values.categoryname;

						//组内序号 added by ls 20230804
						var indexInGroup = resultValues.values.indexingroup;

						var groupName = resultValues.values.groupname;
						var minValue = resultValues.values.minvalue.trim();
						var maxValue = resultValues.values.maxvalue.trim();
						//paramType为array类型的标题名称 added by yay 20240103
						var arrayDescription = resultValues.values.arrayDescription.trim();

						if(paramType.length == 0){
							errors.push("'" + paramName + "' 的值类型不可为空.");
						}
						else{
							if(!thatComParamEditor.checkValueType(defaultValue, paramType)){
								errors.push("'" + paramName + "' 的值错误.");
							}
							if(!thatComParamEditor.checkValueType(minValue, paramType)){
								errors.push("'" + paramName + "' 的最小值错误.");
							}
							if(!thatComParamEditor.checkValueType(maxValue, paramType)){
								errors.push("'" + paramName + "' 的最大值错误.");
							}

							//如果设置了对应统计指标，参数类型必须与指标类型一致 added by liyh 20211125
                            if(statisticIndexType&&statisticIndexType!=paramType){
                                errors.push("'" + paramName + "' 的值类型与对应统计指标类型不一致.");
                            }

                            if(listValuesStr.length > 0){
								var listValueArray = listValuesStr.split(",");
								for(var j = 0; j < listValueArray.length; j++){
									var listValue = listValueArray[j].trim();
									if(!thatComParamEditor.checkValueType(listValue, paramType)){
										errors.push("'" + paramName + "' 的可选值错误.");
									}
								}
							}
						}
						newParameters[paramName] = {
							id: parameterId, 
							name: paramName,
							paramType: paramType,
							isNullable: isNullable,
							isEditable: isEditable,
							isGeo: isGeo,
							defaultValue: defaultValue,
							minValue: minValue,
							maxValue: maxValue,
							listValues: listValuesStr,

							//构件参数分类 added by ls 20230731
							categoryName: categoryName,

							//组内序号 added by ls 20230804
							indexInGroup: indexInGroup,
														
							groupName: groupName,

							//新增对应的统计指标 added by liyh 20211125
                            statisticIndex:statisticIndex,
                            statisticIndexType:statisticIndexType,

							//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
							orderNumber:orderNumber,
							designVisible:designVisible,
							//paramType为array类型的标题名称 added by yay 20240103
							arrayDescription:arrayDescription,
							exp: expPim.length == 0 ? null : {
								pim: expPim,
								js: expJs,
								ps: expPs
							},

						};
					}
				}
			}
		}
		
		var sortedRunExpParameters = thatComParamEditor.sortedRunExpParameters;
		var newSortedRunExpParameters = new Array();
		if(sortedRunExpParameters == null){
			newSortedRunExpParameters = new Array();
			for(var i = 0; i < editItems.length; i++){
				var editItem = editItems[i];
				var parameterId = $(editItem).attr("parameterId");
				if(parameterId != null){
					var paramWin = thatComParamEditor.parameterIdToParamWin[parameterId];
					var resultValues = paramWin.getParamResult();
					var paramName = resultValues.values.name.trim(); 
					newSortedRunExpParameters.push(paramName);
				}
			}
		}
		else{
			for(var i = 0; i < sortedRunExpParameters.length; i++){
				var sortedRunExpParameter = sortedRunExpParameters[i]; 
				if(newParameters[sortedRunExpParameter] != null){ 
					newSortedRunExpParameters.push(sortedRunExpParameter);
				}
			}
		}
		return {
			parameters: newParameters,
			sortedRunExpParameters: newSortedRunExpParameters,
			errors: errors
		}
	}

    this.getComponentExpEditParameters = function(){
    	var parameters = []; 
		var editItems = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem");
		var errors = [];	
		var newParameters = {};		
		for(var i = 0; i < editItems.length; i++){
			var editItem = editItems[i];
			var parameterId = $(editItem).attr("parameterId");
			if(parameterId != null){
				var paramWin = thatComParamEditor.parameterIdToParamWin[parameterId];
				var resultValues = paramWin.getParamResult();
				var paramName = resultValues.values.name.trim();
				if(paramName.length != 0){ 
					//参数是否重名
					var hasSameName = false;
					for(var tempName in newParameters){
						if(tempName == paramName){
							hasSameName = true;
							break;
						}
					}
					if(!hasSameName){ 
						//参数配置是否合法
						var paramType = resultValues.values.paramtype;
						var defaultValue = resultValues.values.defaultvalue.trim();
						var listValuesStr = resultValues.values.listvalues.trim();
						var expPim = resultValues.values.exppim.trim();
						var isNullable = resultValues.values.isnullable;
						var isEditable = resultValues.values.iseditable;
						var isGeo = resultValues.values.isgeo;

						//构件参数分类 added by ls 20230731
						var categoryName = resultValues.values.categoryname;

						//组内序号 added by ls 20230804
						var indexInGroup = resultValues.values.indexingroup;
						
						var groupName = resultValues.values.groupname;

						//新增对应的统计指标 added by liyh 20211125
                        var statisticIndex = resultValues.values.statisticIndex;
                        var statisticIndexType = resultValues.values.statisticIndexType;

						//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
						var orderNumber = resultValues.values.orderNumber;
						var designVisible = resultValues.values.designVisible;
						//paramType为array类型的标题名称 added by yay 20240103
						var arrayDescription = resultValues.values.arrayDescription;

						if(paramType.length != 0){ 
							if(thatComParamEditor.checkValueType(defaultValue, paramType)){  
						    	var valueTypeName = getValueTypeByParameterType(paramType);
								var value = cmnPcr.strToObject(defaultValue, valueTypeName);
								parameters.push({
									name: paramName,
									valueType: valueTypeName,
									value: value
								});
							}
						} 
					}
				}
			}
		}
		
    	//增加detailLevel参数
    	parameters.push({
    		name: "detailLevel",
    		valueType: valueType.decimal,
    		value: thatComParamEditor.detailLevel
    	}); 
		return parameters;
    }
    
    this.onParameterExpChange = function(parameterId, exppim){
    	var paramTypeInputElement = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameterId + "'] .zlpDispUnitInput[fieldname='paramtype']")[0];
    	var paramType = $(paramTypeInputElement).val();
    	var valueType = getValueTypeByParameterType(paramType);
		thatComParamEditor.runExpPim({
			exp: exppim,
			needResultType: valueType,
			afterGetRunResultFunc: function(p){
	    		if(p.errors != null){
	    			msgBox.alert(function(){
	    				info: cmnPcr.arrayToString(p.errors)
	    			});
	    		}
	    		else{
	    			var defaultValueStr = cmnPcr.objectToStr(p.value, valueType);
					var paramWin = thatComParamEditor.parameterIdToParamWin[parameterId];
					paramWin.doCtrlMethodByParamName("defaultvalue", "setValue", defaultValueStr); 
					paramWin.doCtrlMethodByParamName("expjs", "setValue", p.jsCode); 
					paramWin.doCtrlMethodByParamName("expps", "setValue", p.ps); 
					thatComParamEditor.onParameterDefaultValueChange(parameterId, defaultValueStr);
	    		}
	    	}
		});
    }
    
    this.onParameterDefaultValueChange = function(parameterId, defaultValue){ 
    	thatComParamEditor.runAllExpPims();
    }

    this.editParameterExp = function(parameterId){
    	var paramTypeInputElement = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameterId + "'] .zlpDispUnitInput[fieldname='paramtype']")[0];
    	var paramType = $(paramTypeInputElement).val();
    	var valueType = getValueTypeByParameterType(paramType);
    	var expInputElement = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameterId + "'] .zlpDispUnitInput[fieldname='exppim']")[0];
    	var defaultValueInputElement = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameterId + "'] .zlpDispUnitInput[fieldname='defaultvalue']")[0];
    	var exp = $(expInputElement).val();
		var inputExpParams = {
			expText: exp, 
			needResultType: valueType,	
			userParameters: thatComParamEditor.getComponentExpEditParameters(),
			returnFunc: function(p){
				if(p.succeed){  
					var paramWin = thatComParamEditor.parameterIdToParamWin[parameterId];
					paramWin.doCtrlMethodByParamName("exppim", "setValue", p.expText); 
					var expPim = p.expText.trim();
					if(expPim.length > 0){
						thatComParamEditor.onParameterExpChange(parameterId, expPim);
					}
					else{
						paramWin.doCtrlMethodByParamName("expjs", "setValue", ""); 
						paramWin.doCtrlMethodByParamName("expps", "setValue", ""); 
					}
				}
			},
			runAt:expRunAt.js
		};
		var expEditor =new ExpressionEditor();
		expEditor.show(inputExpParams);
    }
    
    this.runAllExpPims = function(){
    	var paramNameToExps = {};
    	var paramNameToValues = {};
    	var userParameters = [];
		var editItems = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem");
		var errors = [];	
		var newParameters = {};		
		for(var i = 0; i < editItems.length; i++){
			var editItem = editItems[i];
			var parameterId = $(editItem).attr("parameterId");
			if(parameterId != null){
				var paramWin = thatComParamEditor.parameterIdToParamWin[parameterId];
				var resultValues = paramWin.getParamResult();
				var paramName = resultValues.values.name.trim();
				if(paramName.length == 0){
					errors.push("参数名不可为空.");
				}
				else{
					//参数是否重名
					var hasSameName = false;
					for(var tempName in newParameters){
						if(tempName == paramName){
							hasSameName = true;
							break;
						}
					}
					if(hasSameName){
						errors.push("存在重名的参数 '" + paramName + "'.");
					}
					else{
						//参数配置是否合法
						var paramType = resultValues.values.paramtype;
						var defaultValue = resultValues.values.defaultvalue.trim(); 
						var expPim = resultValues.values.exppim.trim();
						var value = null;
						var valueTypeName = null;
						if(paramType.length == 0){
							errors.push("'" + paramName + "' 的值类型不可为空.");
						}
						else{
							if(!thatComParamEditor.checkValueType(defaultValue, paramType)){
								errors.push("'" + paramName + "' 的值错误.");
							} 
							else{
						    	var valueTypeName = getValueTypeByParameterType(paramType);
								var value = cmnPcr.strToObject(defaultValue, valueTypeName);

								userParameters.push({
									name: paramName,
									valueType: valueTypeName,
									value: value
								});
								if(expPim != null && expPim.length > 0){
									paramNameToExps[paramName] = { 
										expression: encodeURIComponent(expPim),   
										needResultType: valueTypeName 
									};
								}
							}
						}
					}
				}
			}
		} 
		if(errors.length > 0){
			msgBox.alert({info: cmnPcr.arrayToString(errors, "\r\n")});
		}
		else{
			 
	    	//增加detailLevel参数
			userParameters.push({
	    		name: "detailLevel",
	    		valueType: valueType.decimal,
	    		value: thatComParamEditor.detailLevel
	    	}); 
			
			 var requestParam = {
				 paramNameToExps: paramNameToExps, 
				 userParameters: userParameters, 
				 runAt: expRunAt.js 
			 }; 
	 		 serverAccess.request({
	 			 serviceName:"expressionNcpService", 
	 			 funcName:"validateJsExps",
	 			 args:{
	 				 requestParam:cmnPcr.jsonToStr(requestParam)
				 },  
	 			 successFunc:function(obj){ 			
	 				 if(obj.result.validateErrors != null && obj.result.validateErrors.length > 0){
	 					msgBox.alert({info: cmnPcr.arrayToString(obj.result.validateErrors, "\r\n")});
	 				 }
	 				 else{
		 				 var ps = {};
		 				 for(var i = 0; i < userParameters.length; i++){
		 					 var userParameter = userParameters[i];
		 					 ps[userParameter.name] = userParameter.value;
		 				 }
		 				 var jsCodes = obj.result.jsCodes;
	 					 var sortedParamters = obj.result.sortedParamters;
	 					 
	 					 thatComParamEditor.sortedRunExpParameters = sortedParamters;
	 					 
	 					 for(var i = 0; i < sortedParamters.length; i++){
	 						 var paramName = sortedParamters[i];
	 						 if(jsCodes[paramName] != null){
		 						 var jsCode = decodeURIComponent(jsCodes[paramName]);
				 				 var runner = new ExpressionRunner();
				 				 var resultValue = runner.run(ps, jsCode);
				 				 ps[paramName] = resultValue;
				 				 var valueType = paramNameToExps[paramName].needResultType;
				 				 var resultValueStr = cmnPcr.objectToStr(resultValue, valueType);
				 				 var paramWin = thatComParamEditor.getParamWinByName(paramName);
				 				 paramWin.doCtrlMethodByParamName("defaultvalue", "setValue", resultValueStr);	
	 						 }
	 					 } 
	 				 }
				 }
	 		 });  
		}
    }
    
    this.getParamWinByName = function(paramName){
    	var items = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem");
    	for(var i = 0; i < items.length; i++){
    		var item = items[i];
    		var name = $(item).find(".zlpDispUnitInput[fieldname='name']").val();
    		if(name == paramName){
    			var parameterId = $(item).attr("parameterId");
    			var paramWin = thatComParamEditor.parameterIdToParamWin[parameterId];
			 	return paramWin;
    		}
    	}
    	return null;
    }
    
    this.runExpPim = function(p){
    	var exp = p.exp;
    	var needResultType = p.needResultType;
    	var afterGetRunResultFunc = p.afterGetRunResultFunc;
    	var userParameters = thatComParamEditor.getComponentExpEditParameters();
    	if(exp == null || exp.trim().length == 0){
    		afterGetRunResultFunc({
    			exp: null,
    			jsText: null,
    			value: null
    		});
    	}
		 var requestParam = {
			 expression: encodeURIComponent(exp), 
			 userParameters: userParameters, 
			 runAt: expRunAt.js,
			 needResultType: needResultType
		 }; 
 		 serverAccess.request({
 			 serviceName:"expressionNcpService", 
 			 funcName:"validateJsExp",
 			 args:{
 				 requestParam:cmnPcr.jsonToStr(requestParam)
			 },  
 			 successFunc:function(obj){ 			
 				 if(obj.result.validateErrors.length > 0){
	 				 afterGetRunResultFunc({
	 					 exp: exp,
	 					 jsCode: null,
	 					 ps: null,
	 					 value: null,
	 					 errors: obj.validateErrors
	 				 });
 				 }
 				 else{
	 				 var runner = new ExpressionRunner();
	 				 var params = {};
	 				 for(var i = 0; i < userParameters.length; i++){
	 					 var userParameter = userParameters[i];
	 					params[userParameter.name] = userParameter.value;
	 				 }
	 				 var jsCode = decodeURIComponent(obj.result.jsCode);
	 				 var ps = "|" + cmnPcr.arrayToString(obj.result.usedParameters, "|") + "|";
	 				 var resultValue = runner.run(params, jsCode);
	 				 afterGetRunResultFunc({
	 					 exp: exp,
	 					 jsCode: jsCode,
	 					 ps: ps,
	 					 value: resultValue
	 				 });
 				 }
			 }
 		 });  
    }    
	
	this.checkValueType = function(value, paramType){
		if(value.length > 0){
			switch(paramType){
				case js3ParameterType.boolean: 	
					if(!cmnPcr.isBoolean(value)){
						return false;
					}								
					break;
				case js3ParameterType.decimal:
					if(!cmnPcr.isDecimal(value)){
						return false;
					}
					break;
				case js3ParameterType.date:
					if(!cmnPcr.isDateOnly(value)){
						return false;
					}
					break;
				case js3ParameterType.time:
					if(!cmnPcr.isDateTime(value)){
						return false;
					}
					break;
				case js3ParameterType.string:
				case js3ParameterType.material:

				//数组类型 added by liyh 20230606
				case js3ParameterType.array:

				case js3ParameterType.gltfFile:
				case js3ParameterType.binFile:
				case js3ParameterType.pathFile:
				case js3ParameterType.surfaceFile:

				//FBX文件 added by ls 20240112
				case js3ParameterType.fbxFile:

				//辅助点文件 added by ls 20230418
				case js3ParameterType.assistFile:
				//增加参数类型 added by ls 20220607					
				case js3ParameterType.point2D:
				case js3ParameterType.point3D:
				case js3ParameterType.polyline2D:
				case js3ParameterType.polyline3D:
				//线参数类型 added by ls 20230613
				case js3ParameterType.line2D:
				case js3ParameterType.line3D:
				//增加path参数类型 added by ls 20230208
				case js3ParameterType.path2D:
				case js3ParameterType.path3D:
				case js3ParameterType.pathClosed2D:
				case js3ParameterType.pathClosed3D:
				default:
					break;
			}
		}
		return true;
	}
	
	//更改参数定义窗口的布局  modified by ls 20210823
	this.initHtml = function(parameters){
		var html = "<div class=\"componentParametersEditHeader\">"
			+ "<table class=\"componentParametersEditHeaderItemContainer\">"
			+ "<tr class=\"componentParametersEditItem\">"
			+ "<td class=\"componentParametersEditItemTitleName\">参数名</td>"
			+ "<td class=\"componentParametersEditItemTitleValueType\">值类型</td>"
			+ "<td class=\"componentParametersEditItemTitleIsNullable\">可为空</td>"
			+ "<td class=\"componentParametersEditItemTitleIsEditable\">可编辑</td>"
			+ "<td class=\"componentParametersEditItemTitleIsGeo\">几何相关</td>"
			+ "<td class=\"componentParametersEditItemTitleDefaultValue\">值</td>"
			+ "<td class=\"componentParametersEditItemTitleExpPim\">表达式</td>"
			+ "<td class=\"componentParametersEditItemTitleListValues\">可选值</td>"
			+ "<td class=\"componentParametersEditItemTitleMinValue\">最小值</td>"
			+ "<td class=\"componentParametersEditItemTitleMaxValue\">最大值</td>"
			
			//参数分类 added by ls 20230731
			+ "<td class=\"componentParametersEditItemTitleCategoryName\">分类</td>"
			
			+ "<td class=\"componentParametersEditItemTitleGroupName\">分组</td>"

			//组内序号 added by ls 20230804
			+ "<td class=\"componentParametersEditItemTitleIndexInGroup\">组内序号</td>"

			//新增统计指标 added by liyh 20211125
            + "<td class=\"componentParametersEditItemTitleStatisticIndex\">统计指标</td>"
            + "<td class=\"componentParametersEditItemTitleStatisticIndexType\">统计指标类型</td>"

		    //增加排序和 设计（被引用）时是否显示 added by liyh 20221024
			// + "<td class=\"componentParametersEditItemTitleOrderNumber\">排序</td>" //此排序功能，做完后发现用不到（目前先按分组名称排序，同组再按参数名称排序），故屏蔽排序 by liyh 20221104
			+ "<td class=\"componentParametersEditItemTitleDesignVisible\">是否显示</td>"

			//删除参数列 added by ls 20230731
			+ "<td class=\"componentParametersEditItemTitleDelete\">&nbsp;</td>"
			//paramType为array类型的标题名称 added by yay 20240103
			+ "<td style='display: none' class='componentParametersEditItemTitleArrayDescription' ></td>"

			+ "<td>&nbsp;</td>"
			+ "</tr>"
			+ "</table>"
			+ "</div>"
			+ "<div class=\"componentParametersEditMiddle\">"
			+ "<table class=\"componentParametersEditItemContainer\">"  
			+ "</table>"
			+ "</div>"
			+ "<div class=\"componentParametersEditFooter\">"
			+ "<div class=\"componentParametersEditAddParameter\" title=\"添加参数\"></div>"
			+ "<div class=\"componentParametersEditAddParameters\" title=\"根据类型初始化参数\"></div>"
			+ "<span class=\"componentParametersEditStatus\"></span>" 
			+ "</div>";	
		$("#" + thatComParamEditor.containerId).html(html);
		
		var nameSortedParameters = thatComParamEditor.sortParametersByName(parameters);
		
		for(var i = 0; i < nameSortedParameters.length; i++){
			var parameter = nameSortedParameters[i];
			thatComParamEditor.createParameterItem(parameter);
		}
		
		$("#" + thatComParamEditor.containerId).find(".componentParametersEditAddParameter").click(function(){
			var newParameter = thatComParamEditor.createNewParameter();
			thatComParamEditor.createParameterItem(newParameter);	
			var middleContainer = $("#" + thatComParamEditor.containerId).find(".componentParametersEditMiddle")[0];
			thatComParamEditor.refreshStatus();
			middleContainer.scrollTop = middleContainer.scrollHeight;
		});	
		
		$("#" + thatComParamEditor.containerId).find(".componentParametersEditAddParameters").click(function(){
			thatComParamEditor.getCategoryParameters(thatComParamEditor.categoryId);
		});		
	}
	
	//给参数排序，显示顺序
	this.sortParametersByName = function(parameters){
		var categoryGroupList = new Array();
		//按照categoryName+groupName+name排序
		var categoryGroupToParameters = {};
		for(var paramName in parameters){
			var parameter = parameters[paramName];
			var categoryName = parameter.categoryName;
			var groupName = parameter.groupName;
			var categoryGroupName = categoryName + "_" + groupName;
			if(categoryGroupToParameters[categoryGroupName] == null){
				var tempCategoryGroupList = new Array();
				var added = false;
				for(var j = 0; j < categoryGroupList.length; j++){
					var tempCategoryGroupName = categoryGroupList[j];
					if(!added && tempCategoryGroupName.localeCompare(categoryGroupName, "zh") > 0){
						tempCategoryGroupList.push(categoryGroupName);
						categoryGroupToParameters[categoryGroupName] = {
							categoryGroupName: categoryGroupName,
							categoryName: categoryName,
							groupName: groupName,
							subParameters: []
						};
						added = true;
					}
					tempCategoryGroupList.push(tempCategoryGroupName);
				}
				if(!added){
					tempCategoryGroupList.push(categoryGroupName);
					categoryGroupToParameters[categoryGroupName] = {
						categoryGroupName: categoryGroupName,
						categoryName: categoryName,
						groupName: groupName, 
						subParameters: []
					};
				}
				categoryGroupList = tempCategoryGroupList;
			}			
		}
		
		for(var pName in parameters){
			var parameter = parameters[pName]; 
			var paramName = cmnPcr.prefixInteger(parameter.indexInGroup, 4) + "_" + pName;
			var categoryName = parameter.categoryName;
			var groupName = parameter.groupName;
			var categoryGroupName = categoryName + "_" + groupName;
			var subParameters = categoryGroupToParameters[categoryGroupName].subParameters;
			var added = false;
			var tempSubParameterList = new Array();
			for(var j = 0; j < subParameters.length; j++){
				var subParameter = subParameters[j];
				var subParamName = cmnPcr.prefixInteger(subParameter.indexInGroup, 4) + "_" + subParameter.name;
				if(!added && subParamName.localeCompare(paramName, "zh") > 0){ 
					tempSubParameterList.push(parameter);
					added = true;
				}
				tempSubParameterList.push(subParameter);
			}
			if(!added){
				tempSubParameterList.push(parameter);
			}
			categoryGroupToParameters[categoryGroupName].subParameters = tempSubParameterList;			
		}
		var nameSortedParameters = new Array();
		for(var i = 0; i < categoryGroupList.length; i++){
			var categoryGroupName = categoryGroupList[i];
			var subParameters = categoryGroupToParameters[categoryGroupName].subParameters;
			for(var j = 0; j < subParameters.length; j++){
				nameSortedParameters.push(subParameters[j]);
			}
		}
		return nameSortedParameters;
	}
	
	this.createNewParameter = function(){
		var parameter = {
			id: cmnPcr.createGuid(),
			name: thatComParamEditor.getNewParameterName(),
			//参数定义默认值由string改为decimal modified by liyh 20221101
			//paramType: js3ParameterType.string,
			paramType: js3ParameterType.decimal,
			isNullable: false,
			isEditable: true,
			isGeo: true,
			defaultValue: "",
			listValues: "",

			//新增对应的统计指标 added by liyh 20211125
            statisticIndex:"",
            statisticIndexType:"",

			//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
			orderNumber:"",
			designVisible:true,

			groupName: "",

			//构件参数分类，默认为空 added by ls 20230815
			categoryName: "",

			//组内序号，默认为1 added by ls 20230815
			indexInGroup: 1,
			//paramType为array类型的标题名称 added by yay 20240103
			arrayDescription: "",
		};
		return parameter;
	}
	
	this.getNewParameterName = function(){
		var nameInputs = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem .zlpDispUnitInput[name='name']");
		var names = [];
		for(var i = 0; i < nameInputs.length; i++){
			var name = $(nameInputs[i]).val();
			names.push(name);
		}
		
		var paramIndex = 1;
		var namePrefix = "参数_";
		var newName = namePrefix + paramIndex;
		while(1 == 1){
			var hasSameName = false;
			for(var i = 0; i < names.length; i++){
				var name = names[i];
				if(name == newName){
					hasSameName = true;
					break;
				}
			}
			if(hasSameName){
				paramIndex++;
				newName = namePrefix + paramIndex;
			}
			else{
				break;
			}
		}
		return newName;
	}
	
	this.createParameterItem = function(parameter){
		var parameterItemId = "ParameterItem_" + parameter.id;
		var html = "<tr class=\"componentParametersEditItem\" id=\"" + parameterItemId + "\" parameterId=\"" + parameter.id + "\">" 
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleName\"><input type=\"text\" autocomplete=\"off\" name=\"name\" class=\"zlpDispUnitInput\" style=\"width:100px;\" paramCtrl=\"true\"></input></td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleValueType\"><input type=\"text\" autocomplete=\"off\" name=\"paramtype\" class=\"zlpDispUnitInput\" style=\"width:85px;\" paramCtrl=\"true\"></input></td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleIsNullable\"><input type=\"checkbox\" autocomplete=\"off\" name=\"isnullable\" class=\"zlpDispUnitInput\" style=\"width:50px;\" paramCtrl=\"true\"></input></td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleIsEditable\"><input type=\"checkbox\" autocomplete=\"off\" name=\"iseditable\" class=\"zlpDispUnitInput\" style=\"width:50px;\" paramCtrl=\"true\"></input></td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleIsGeo\"><input type=\"checkbox\" autocomplete=\"off\" name=\"isgeo\" class=\"zlpDispUnitInput\" style=\"width:50px;\" paramCtrl=\"true\"></input></td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleDefaultValue\"><input type=\"text\" autocomplete=\"off\" name=\"defaultvalue\" class=\"zlpDispUnitInput\" style=\"width:80px;\" paramCtrl=\"true\"></input></td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleExpPim\">"
			+ "<input type=\"text\" autocomplete=\"off\" name=\"exppim\" class=\"zlpDispUnitInput\" style=\"width:90px;\" paramCtrl=\"true\"></input>"
			+ "<div class=\"componentParametersEditExpBtn\">...</div>"
			+ "<input type=\"text\" autocomplete=\"off\" name=\"expjs\" class=\"zlpDispUnitInput\" style=\"width:120px;display:none\" paramCtrl=\"true\"></input>"
			+ "<input type=\"text\" autocomplete=\"off\" name=\"expps\" class=\"zlpDispUnitInput\" style=\"width:120px;display:none\" paramCtrl=\"true\"></input>"
			+ "</td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleListValues\"><input type=\"text\" autocomplete=\"off\" name=\"listvalues\" class=\"zlpDispUnitInput\" style=\"width:90px;\" paramCtrl=\"true\"></input></td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleMinValue\"><input type=\"text\" autocomplete=\"off\" name=\"minvalue\" class=\"zlpDispUnitInput\" style=\"width:45px;\" paramCtrl=\"true\"></input></td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleMaxValue\"><input type=\"text\" autocomplete=\"off\" name=\"maxvalue\" class=\"zlpDispUnitInput\" style=\"width:45px;\" paramCtrl=\"true\"></input></td>"

			//参数分类 added by ls 20230726
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleCategoryName\"><input type=\"text\" autocomplete=\"off\" name=\"categoryname\" class=\"zlpDispUnitInput\" style=\"width:75px;\" paramCtrl=\"true\"></input></td>"

			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleGroupName\"><input type=\"text\" autocomplete=\"off\" name=\"groupname\" class=\"zlpDispUnitInput\" style=\"width:75px;\" paramCtrl=\"true\"></input></td>"

			//组内序号 added by ls 20230804
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleIndexInGroup\"><input type=\"text\" autocomplete=\"off\" name=\"indexingroup\" class=\"zlpDispUnitInput\" style=\"width:55px;\" paramCtrl=\"true\"></input></td>"

			//新增对应的统计指标 added by liyh 20211125
            + "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleStatisticIndex\"><input type=\"text\" autocomplete=\"off\" name=\"statisticindex\" class=\"zlpDispUnitInput\" style=\"width:90px;\" paramCtrl=\"true\"></input></td>"
            + "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleStatisticIndexType\"><input type=\"text\" autocomplete=\"off\" name=\"statisticindextype\" class=\"zlpDispUnitInput\" style=\"width:75px;\" paramCtrl=\"true\"></input></td>"
			//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
			// + "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleOrderNumber\"><input type=\"text\" autocomplete=\"off\" name=\"orderNumber\" class=\"zlpDispUnitInput\" style=\"width:90px;\" paramCtrl=\"true\"></input></td>"
			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleDesignVisible\"><input type=\"checkbox\" autocomplete=\"off\" name=\"designVisible\" class=\"zlpDispUnitInput\" style=\"width:50px;\" paramCtrl=\"true\"></input></td>"

			+ "<td class=\"componentParametersEditItemTd componentParametersEditItemTitleDelete\"><div class=\"componentParametersEditItemDeleteBtn\"></div></td>"
			//paramType为array类型的标题名称 added by yay 20240103
			+ "<td style='display: none' class=\"componentParametersEditItemTd componentParametersEditItemTitleArrayDescription\"><input type=\"text\" autocomplete=\"off\" name=\"arrayDescription\" class=\"zlpDispUnitInput\" style=\"width:55px;\" paramCtrl=\"true\"></input></td>"

			+ "<td>&nbsp;</td>"
			+ "</tr>"	
		$("#" + thatComParamEditor.containerId).find(".componentParametersEditItemContainer").append(html); 
		
		var parameterConfigItemUIParameters = thatComParamEditor.getItemUIParameters(parameter);  
		parameterConfigItemUIParameters.units["name"].defaultValue = parameter.name;
		parameterConfigItemUIParameters.units["paramtype"].defaultValue = parameter.paramType;
		parameterConfigItemUIParameters.units["isnullable"].defaultValue = cmnPcr.objectToStr(parameter.isNullable, valueType.boolean);
		parameterConfigItemUIParameters.units["iseditable"].defaultValue =  cmnPcr.objectToStr(parameter.isEditable, valueType.boolean);
		parameterConfigItemUIParameters.units["isgeo"].defaultValue =  cmnPcr.objectToStr(parameter.isGeo == null ? true : parameter.isGeo, valueType.boolean);
		parameterConfigItemUIParameters.units["defaultvalue"].defaultValue = parameter.defaultValue;
		parameterConfigItemUIParameters.units["exppim"].defaultValue = parameter.exp == null ? "" : parameter.exp.pim;
		parameterConfigItemUIParameters.units["listvalues"].defaultValue = parameter.listValues;

		//参数分类 added by ls 20230726
		parameterConfigItemUIParameters.units["categoryname"].defaultValue = parameter.categoryName;

		//组内序号 added by ls 20230804
		parameterConfigItemUIParameters.units["indexingroup"].defaultValue = parameter.indexInGroup + "";
		
		parameterConfigItemUIParameters.units["groupname"].defaultValue = parameter.groupName;
		
		//新增对应的统计指标 added by liyh 20211125
        parameterConfigItemUIParameters.units["statisticindex"].defaultValue = parameter.statisticIndex;
        parameterConfigItemUIParameters.units["statisticindextype"].defaultValue = parameter.statisticIndexType;
		//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
		parameterConfigItemUIParameters.units["orderNumber"].defaultValue = parameter.orderNumber;
		parameterConfigItemUIParameters.units["designVisible"].defaultValue = cmnPcr.objectToStr(parameter.designVisible == null ? true : parameter.designVisible, valueType.boolean);
		//paramType为array类型的标题名称 added by yay 20240103
		parameterConfigItemUIParameters.units["arrayDescription"].defaultValue = parameter.arrayDescription;

		var paramWin = new NcpParamWin({
			containerId: parameterItemId,
			paramWinModel: parameterConfigItemUIParameters
		}); 
		paramWin.addExternalObject({
			beforeDoList: function(param){

				//只处理特定名称的参数，并且特定参数执行后返回false不再继续执行  modified by liyh 20211125
                // param.rows = param.paramModel.list.rows;
                // paramWin.processListData(param);
                // paramWin.afterBaseList(param);
                // paramWin.afterDoList(param);

				if(param.listName=="paramType"){
                    param.rows = param.paramModel.list.rows;
                    paramWin.processListData(param);
                    paramWin.afterBaseList(param);
                    paramWin.afterDoList(param);
                    return false;
				}
				return true;
			}
		});
		paramWin.valueChange = function(inputElement, newValue){
			var fieldName = $(inputElement).attr("fieldName");
			var parameterId = $(inputElement).parent().parent().parent().attr("parameterId");
			if(fieldName == "exppim"){
				var expPim = newValue.trim();
				if(expPim.length > 0){
					thatComParamEditor.onParameterExpChange(parameterId, expPim);
				}
				else{
					paramWin.doCtrlMethodByParamName("expjs", "setValue", ""); 
					paramWin.doCtrlMethodByParamName("expps", "setValue", ""); 
				}
			}
			else if(fieldName == "defaultvalue"){
                thatComParamEditor.onParameterDefaultValueChange(parameterId, newValue);
            }
            //新增对应的统计指标 added by liyh 20211125
            else if(fieldName == "statisticindex"){
                paramWin.doCtrlMethodByParamName("statisticindextype", "setValue",newValue.paramtype);
            }
		}
		paramWin.show(); 
		thatComParamEditor.parameterIdToParamWin[parameter.id] = paramWin;

		$("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameter.id + "'] .componentParametersEditExpBtn").click(function(){
			var parameterId = $(this).parent().parent().attr("parameterId");
			thatComParamEditor.editParameterExp(parameterId);
		});

		$("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameter.id + "'] .componentParametersEditItemDeleteBtn").click(function(){
			if(msgBox.confirm({info: "确认要删除此参数吗?"})){
				var parameterId = $(this).parent().parent().attr("parameterId");
				$("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameter.id + "']").remove();
				thatComParamEditor.refreshStatus();
			}
		});

		$("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameter.id + "'] input[name='defaultvalue']").click(function(){
			//如果是材质类型 弹出辅助窗口
			var paramtypeValue=$("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameter.id + "'] input[name='paramtype']").val();
			if(paramtypeValue==='material'){
				//定义弹窗 和返回值
				thatComParamEditor.showPopForParameterMaterial(parameter);
			}else if(paramtypeValue==='array'){
				thatComParamEditor.showPopForParameterArray(parameter);
			}
		});
	}
	
	this.refreshStatus = function(){
		var parameterCount = $("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId]").length; 
		$("#" + thatComParamEditor.containerId).find(".componentParametersEditStatus").text("已定义了 " + parameterCount + " 个参数");
	}
	
	this.getItemUIParameters = function(parameterValues){
		var params = {
			id:1,
			name:"",
			units:{
				"id":{
					id:0,
					name:"id",
					label:"id",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:40,
					isMultiValue:false,
					isNullable:false,
					unitType:"text",
					isEditable: false,
					defaultValue: parameterValues.id
			    },
				"name":{
					id:1,
					name:"name",
					label:"参数名",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:40,
					isMultiValue:false,
					isNullable:false,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.name
			    },
			    "paramtype":{
			    	id:2,
			    	name:"paramtype",
			    	label:"值类型",
			    	valueType:valueType.string,
			    	inputHelpType:"list",
			    	inputHelpName:"paramType",
			    	decimalNum:"0",
			    	valueLength:100,
			    	isMultiValue:false,
			    	isNullable:false,
			    	unitType:"list",
			    	maps:{"paramtype": "name"},
			    	list:{
			    		name:"paramType",
			    		columns:[
		    		         {field:"name", valueType: valueType.string, title:"类型", width:100, hidden:false}
			    		],
			    		
			    		//改为统一定义系统支持的参数类型下拉行 modified by ls 20210823
			    		rows: js3ParameterTypeListRows
			    	},
					isEditable: true,
					defaultValue: parameterValues.paramType
			    },
				//新增对应的“统计指标” added by liyh 20211125
                "statisticindex":{
                    id:13,
                    name:"statisticindex",
                    label:"统计指标",
                    valueType:valueType.string,
                    inputHelpType:"list",
                    inputHelpName:"mdl.statisticindex",
                    decimalNum:"0",
                    valueLength:100,
                    isMultiValue:false,
                    isNullable:true,
                    unitType:"list",
                    maps:{"statisticindex": "name","statisticindextype": "paramtype"},
                    list:{
                        name:"mdl.statisticindex",
                        columns:[
                            {field:"name", valueType: valueType.string, title:"指标", width:100, hidden:false},
                            {field:"paramtype", valueType: valueType.string, title:"指标类型", width:0, hidden:true}
                        ]
                    },
                    isEditable: true,
                    defaultValue: parameterValues.statisticIndex
                },
				//新增"对应统计指标类型" added by liyh 20211125
                "statisticindextype":{
                    id:14,
                    name:"statisticindextype",
                    label:"统计指标类型",
                    valueType:valueType.string,
                    inputHelpType:"",
                    inputHelpName:"",
                    decimalNum:"0",
                    valueLength:100,
                    isMultiValue:false,
                    isNullable:true,
                    unitType:"text",
                    isEditable: false,
                    defaultValue: parameterValues.statisticIndexType
                },
				//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
				"orderNumber":{
					id:15,
					name:"orderNumber",
					label:"排序",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:100,
					isMultiValue:false,
					isNullable:true,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.orderNumber
				},
				//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
				"designVisible":{
					id:16,
					name:"designVisible",
					label:"设计时是否显示",
					valueType:valueType.boolean,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"checkbox",
					isEditable: true,
					defaultValue: cmnPcr.objectToStr(parameterValues.designVisible, valueType.boolean)
				},
				"isnullable":{
					id:3,
					name:"isnullable",
					label:"可为空",
					valueType:valueType.boolean,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"checkbox",
					isEditable: true,
					defaultValue: cmnPcr.objectToStr(parameterValues.isNullable, valueType.boolean)
			    },
				"iseditable":{
					id:4,
					name:"iseditable",
					label:"可编辑",
					valueType:valueType.boolean,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"checkbox",
					isEditable: true,
					defaultValue: cmnPcr.objectToStr(parameterValues.isEditable, valueType.boolean)
			    },
				"isgeo":{
					id:4,
					name:"isgeo",
					label:"几何相关",
					valueType:valueType.boolean,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"checkbox",
					isEditable: true,
					defaultValue: cmnPcr.objectToStr(parameterValues.isGeo, valueType.boolean)
			    },
			    "defaultvalue":{
					id:5,
					name:"defaultvalue",
					label:"值",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:100,
					isMultiValue:false,
					isNullable:false,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.defaultValue
			    },
			    "exppim":{
					id:6,
					name:"exppim",
					label:"表达式",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:500,
					isMultiValue:false,
					isNullable:false,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.exp == null ? "" : parameterValues.exp.pim
			    },
			    "expjs":{
					id:7,
					name:"expjs",
					label:"js表达式",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:500,
					isMultiValue:false,
					isNullable:false,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.exp == null ? "" : parameterValues.exp.js
			    },
			    "expps":{
					id:8,
					name:"expps",
					label:"ps参数",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:500,
					isMultiValue:false,
					isNullable:false,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.exp == null ? "" : parameterValues.exp.ps
			    },
			    "listvalues":{
					id:9,
					name:"listvalues",
					label:"可编辑",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:255,
					isMultiValue:false,
					isNullable:false,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.listValues
			    },
			    
			    //参数类型 added by ls 20230727
			    "categoryname":{
					id:10,
					name:"categoryname",
					label:"分组",
			    	valueType:valueType.string,
			    	inputHelpType:"list",
			    	inputHelpName:"categoryname",
			    	decimalNum:"0",
			    	valueLength:100,
			    	isMultiValue:false,
			    	isNullable:false,
			    	unitType:"list",
			    	maps:{"categoryname": "name"},
			    	list:{
                        name:"mdl.propertyCategory",
			    		columns:[
		    		         {field:"name", valueType: valueType.string, title:"类型", width:100, hidden:false}
			    		],
			    	},
					isEditable: true,
					defaultValue: parameterValues.categoryName
			    },

			  //组内序号 added by ls 20230804
			    "indexingroup":{
					id:10,
					name:"indexingroup",
					label:"组内序号",
			    	valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
			    	decimalNum:"0",
			    	valueLength:4,
			    	isMultiValue:false,
			    	isNullable:false,
			    	unitType:"decimal",
					isEditable: true,
					defaultValue: parameterValues.indexInGroup + ""
			    },
			    
			    "groupname":{
					id:111,
					name:"groupname",
					label:"分组",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:255,
					isMultiValue:false,
					isNullable:false,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.groupName
			    },
			    "minvalue":{
					id:11,
					name:"minvalue",
					label:"最小值",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:100,
					isMultiValue:false,
					isNullable:true,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.minValue
			    },
			    "maxvalue":{
					id:12,
					name:"maxvalue",
					label:"最大值",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:100,
					isMultiValue:false,
					isNullable:true,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.maxValue
			    },
				//paramType为array类型的标题名称 added by yay 20240103
				"arrayDescription":{
					id:13,
					name:"arrayDescription",
					label:"阵列描述",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:100,
					isMultiValue:false,
					isNullable:false,
					unitType:"text",
					isEditable: true,
					defaultValue: parameterValues.arrayDescription
				}
			}
		};
		return params;
	}

	//材料类型 pop页 added yay 20230425
	this.showPopForParameterMaterial=function (parameter){
		//弹出pop 和 pop 回写时间
		var popContainer = new PopupContainer( {
			width: 900,
			height: 600,
			top: 50,
			title: "选择材质"
		});

		popContainer.show();

		var popPageUrl = "../../pop/pop_mtl_MaterialGridNew.jsp";
		var frameId = cmnPcr.getRandomValue();
		var innerHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		$("#" + popContainer.containerId).html(innerHtml);

		window.popInitParam = {
			closeWin : function(p) {
				var selectedObj = null;
				//单选
				if(p.selectedRows != null){
					for(var rowId in p.selectedRows){
						selectedObj = p.selectedRows[rowId];
					}
				}
				var $el=$("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameter.id + "'] input[name='defaultvalue']")
				$el.focus();
				if(selectedObj){
					parameter.material=selectedObj.code;
					$el.val(parameter.material);
					thatComParamEditor.runAllExpPims()
				}
				popContainer.close();
			},
			otherValues:[]
		};
		$("#" + frameId).attr("src", popPageUrl);

	}
	//维度数组 pop页 added yay 20230607
	this.showPopForParameterArray=function (parameter){
		//弹出pop 和 pop 回写时间
		var popContainer = new PopupContainer( {
			width : 560,
			height : 460,
			top : 50,
			title: "编辑"
		});

		popContainer.show();

		var popPageUrl = "../../pop/pop_xy_array.jsp";
		var frameId = cmnPcr.getRandomValue();
		var innerHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		$("#" + popContainer.containerId).html(innerHtml);

		var $defaultvalue=$("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameter.id + "'] input[name='defaultvalue']")
		var $arrayDescription=$("#" + thatComParamEditor.containerId).find(".componentParametersEditItem[parameterId='" + parameter.id + "'] input[name='arrayDescription']")

		window.popInitParam = {
			closeWin : function(resObj) {
				$defaultvalue.focus();
				if(resObj.val!=undefined&&resObj.val!=null){
					parameter.array=resObj.val;
					$defaultvalue.val(resObj.val);
					thatComParamEditor.runAllExpPims()
				}
				if(resObj.arrayDescription!=undefined&&resObj.arrayDescription!=null){
					parameter.arrayDescription=resObj.arrayDescription;
					$arrayDescription.val(resObj.arrayDescription);
				}
				popContainer.close();
			},
			otherValues:{
				val:$defaultvalue.val(),
				arrayDescription:$arrayDescription.val(),
				showType:"create",
			}
		};
		$("#" + frameId).attr("src", popPageUrl);

	}

}