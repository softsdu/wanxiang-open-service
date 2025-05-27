function CommonForm(){
	var thatForm = this;
	
	this.paramWin = null;
	
	this.parameters = null;
	
	this.parentParameters = null;

	//added by liyh 20230601
	this.valueParameters = null;

	this.undefinedCategoryName = "未定义分类";
	this.undefinedGroupName = "未定义分组";
	
	this.containerId = null;
	
	this.init = function(p){
		thatForm.containerId = p.containerId;
		thatForm.parentParameters = p.parentParameters;
		thatForm.parameters = p.parameters;
		thatForm.valueParameters = p.valueParameters;
		
		thatForm.initFormUIHtml(p.parameters);

		//显示组件图片 added by ls 20210826
		thatForm.initImage(p.imgId);
		
		var formUIParameters = thatForm.getFormUIParameters(p.parameters,p.valueParameters);
		if(p.valueParameters != null){
			for(var paramName in p.valueParameters){
				var param = p.valueParameters[paramName];
				var paramValue = param.value;
				
				//如果paramValue不是字符串，那么按照json处理 modified by ls 20220606
				if(typeof paramValue != "string"){
					paramValue = cmnPcr.jsonToStr(paramValue);
				}				
				
				var paramExpPim = param.exp == null ? "" : param.exp.pim;
				var paramExpJs = param.exp == null ? "" : param.exp.js;
				var paramExpPs = param.exp == null ? "" : param.exp.ps;
				var unitParam = formUIParameters.units[paramName]; 
				if(unitParam != null){
					unitParam.defaultValue = cmnPcr.objectToStr(paramValue, unitParam.valueType);
				}
				var unitExpParam = formUIParameters.units["exp_" + paramName]; 
				if(unitExpParam != null){
					unitExpParam.defaultValue = paramExpPim;
				}
				var unitJsParam = formUIParameters.units["js_" + paramName]; 
				if(unitJsParam != null){
					unitJsParam.defaultValue = paramExpJs;
				}
				var unitPsParam = formUIParameters.units["ps_" + paramName]; 
				if(unitPsParam != null){
					unitPsParam.defaultValue = paramExpPs;
				}
			}
		} 
		var paramWin = new NcpParamWin({
			containerId: p.containerId,
			paramWinModel: formUIParameters
		}); 
		paramWin.addExternalObject({
			beforeDoList: function(param){
				if(param.paramModel.list.rows.length == 0){

					// valuechange已更新
					// //对于定义了下拉值stdp:前缀的参数，每次下拉前重新获取引用的参数的值 added by liyh 20230601
					// if(thatForm.parameters[param.paramModel.name].listValues.startWith("stdp:")) {
					// 	refParamName = thatForm.parameters[param.paramModel.name].listValues.substr(5).split(",")[0];
					// 	var result = thatForm.paramWin.getParamResult();
					// 	if (result.verified) {
					// 		refParamValue = result.values[refParamName];
					// 		thatForm.paramWin.paramWinModel.units[param.paramModel.name].where = [{parttype:"field", field:"code", operator:"=", value:refParamValue}];
					// 	}
					// }

					//从后台获取下拉值
					return true;
				}
				else{
					//用户自定义了枚举值
					param.rows = param.paramModel.list.rows; 
					thatForm.paramWin.processListData(param);
					thatForm.paramWin.afterBaseList(param);
					thatForm.paramWin.afterDoList(param);
					return false;
				}
			},
			//定义弹出 added by ls 20220606
			beforeDoPop: function(param){
				switch(param.paramModel.inputHelpName){
					case js3ParameterType.point2D:
					case js3ParameterType.point3D:
					case js3ParameterType.polyline2D:
					case js3ParameterType.polyline3D:
					case js3ParameterType.line2D:
					case js3ParameterType.line3D: {
						//如果inputHelpName是point2D、point3D、line2D、line3D、polyline2D、polyline3D，
						//那么最小化窗口，把status转为placeLimit3DPoints或placeLimit2DPoints
						if(param.eventType == "click"){
							thatForm.selectLocation({
								locationType: param.paramModel.inputHelpName,
								paramName: param.paramModel.name
							});
						}
						else{
							var value = {points: param.value};
							thatForm.paramWin.doCtrlMethodByParamName(param.paramModel.name, "setValue", value);
							var ctrl = thatForm.paramWin.allParamCtrls.get(param.paramModel.name);
							thatForm.paramWin.unitValueChange(ctrl, value);
						}
						return false;
					}
					//path类型参数 added by ls 20230105
					case js3ParameterType.path2D:{
						thatForm.editPath2d({
							paramName: param.paramModel.name,
							paramValue: param.value.path
						});
						return false;
					}
					case js3ParameterType.path3D:{
						thatForm.editPath3d({
							paramName: param.paramModel.name,
							paramValue: param.value.path
						});
						return false;
					}
					case js3ParameterType.pathClosed2D:{
						thatForm.editPathClosed2d({
							paramName: param.paramModel.name,
							paramValue: param.value.path
						});
						return false;
					}
					case js3ParameterType.pathClosed3D:{
						thatForm.editPathClosed3d({
							paramName: param.paramModel.name,
							paramValue: param.value.path
						});
						return false;
					}
					default:{
						return true;
					}
				}
				return true;
			}
		});
		paramWin.valueChange = function(jq, value){
			thatForm.runAllExpPimsByParentParameters();

			//added by liyh 20230601
			thatForm.clearStdsListParam(jq,value);
		}
		paramWin.show();
			
		//对于paramType类型是point2D、point3D、line2D、line3D、polyline2D、polyline3D的，更改按钮的class added by ls 20220606
		for(var paramName in p.parameters){
			var parameter = p.parameters[paramName];	
			var paramName = parameter.name;
			switch(parameter.paramType){ 
				case js3ParameterType.point2D:
				case js3ParameterType.point3D:
				case js3ParameterType.polyline2D:
				case js3ParameterType.polyline3D:
				case js3ParameterType.line2D:
				case js3ParameterType.line3D:{
					$("#" + thatForm.containerId).find(".zlpDispUnitInput[name='" + paramName + "']").parent().parent().children(".zlpDispunitPop").addClass("zlpDispunitPopLocation");
					break;
				}
				//path类型参数 added by ls 20230105
				case js3ParameterType.path2D:
				case js3ParameterType.path3D:
				case js3ParameterType.pathClosed2D:
				case js3ParameterType.pathClosed3D:{
					$("#" + thatForm.containerId).find(".zlpDispUnitInput[name='" + paramName + "']").parent().parent().children(".zlpDispunitPop").addClass("zlpDispunitPopPath");
					break;
				}
			}
		}
		
		thatForm.paramWin = paramWin;
	}
	
	//选择位置 added by ls 20220606
	this.selectLocation = function(p){
		window.parent.unitComponentProcessor.selectLocation({
			locationType: p.locationType,
			paramName: p.paramName
		});
	};
	
	//编辑2d路径 added by ls 20230109
	this.editPath2d = function(p){
		window.parent.unitComponentProcessor.editPath2d({
			paramName: p.paramName,
			paramValue: p.paramValue
		});
	};
	this.editPathClosed2d = function(p){
		window.parent.unitComponentProcessor.editPathClosed2d({
			paramName: p.paramName,
			paramValue: p.paramValue
		});
	};
	
	//编辑3d路径 added by ls 20230109
	this.editPath3d = function(p){
		window.parent.unitComponentProcessor.editPath3d({
			paramName: p.paramName,
			paramValue: p.paramValue
		});
	};
	this.editPathClosed3d = function(p){
		window.parent.unitComponentProcessor.editPathClosed3d({
			paramName: p.paramName,
			paramValue: p.paramValue
		});
	};

	//增加组件图例 added by ls 20210826
	this.initImage = function(imgId){
		if(imgId != null && imgId.length > 0){
			var imgUrl = "../../../../../accessory/getImage?id=" + imgId.split(",")[0];
			$("#" + thatForm.containerId).find(".componentImg").attr("src", imgUrl);
		}
		else{
			$("#" + thatForm.containerId).find(".catTab[categoryName='img']").css({display: "none"});
			$("#" + thatForm.containerId).find(".catContent[categoryName='img']").css({display: "none"});
		}
	}
	
	//设置参数值 added by ls 20220606
	this.setParameterValue = function(p){
		thatForm.paramWin.doCtrlMethodByParamName(p.name, "setValue", p.value);
		var ctrl = thatForm.paramWin.allParamCtrls.get(p.name);
		thatForm.paramWin.unitValueChange(ctrl, p.value);
	}
	
	this.getParameters = function(){
		var result = thatForm.paramWin.getParamResult();
		if(result.verified){
			var parameters = {};
			for(var paramName in thatForm.parameters){

				parameters[paramName] = {
					value: result.values[paramName]
				};
				var expPim = result.values["exp_" + paramName].trim();
				var expJs = result.values["js_" + paramName].trim();
				var expPs = result.values["ps_" + paramName].trim();
				if(expPim.length > 0){
					parameters[paramName].exp = {
						pim: expPim,
						js: expJs,
						ps: expPs
					};
				}
			}
			if(thatForm.checkMinMaxValue(parameters)){
				return parameters;
			}
			else{
				return null;
			}
		}
		else{
			msgBox.alert({info: result.error});
			return null;
		}
	}
	
	this.checkMinMaxValue = function(resultParameters){
		var errors = new Array();
		for(var name in thatForm.parameters){
			var param = thatForm.parameters[name];
			var resultParam = resultParameters[name];
			var valueType = getValueTypeByParameterType(param.paramType);
			if(param.minValue != null && param.minValue.length > 0){
				var minValue = cmnPcr.strToObject(param.minValue, valueType);
				if(minValue > resultParam.value){
					errors.push("\"" + name + "\"不允许小于" + param.minValue + ".");
				}
			}
			if(param.maxValue != null && param.maxValue.length > 0){
				var maxValue = cmnPcr.strToObject(param.maxValue, valueType);
				if(maxValue < resultParam.value){
					errors.push("\"" + name + "\"不允许大于" + param.maxValue + ".");
				}
			}
		}
		if(errors.length > 0){
			msgBox.alert({info: cmnPcr.arrayToString(errors, "\r\n")});
			return false;
		}
		else{
			return true;
		}
	}
	
	//给参数排序 added by ls 20210824 
	this.getSortedCategories = function(parameters){
		var catList = new Array();
		for(var i = 0; i < js3PropertyCategories.length; i++){
			var catName = js3PropertyCategories[i].name;
			for(var paramName in parameters){
				var parameter = parameters[paramName];
				var categoryName = parameter.categoryName;
				if(catName == categoryName){ 
					catList.push(categoryName);
					break;
				}
			}
		}
		
		//判断是否存在未指定分类的参数
		var hasUndefinedCategoryName = false;
		for(var paramName in parameters){
			var parameter = parameters[paramName];
			var categoryName = parameter.categoryName;
			if(categoryName == null || categoryName.length == 0){ 
				hasUndefinedCategoryName = true;
				parameter.categoryName = null;
			}
		}
		if(hasUndefinedCategoryName){
			catList.push(null);
		}
		
		return catList;
	}
	
	//获取某分类里的参数（排序后的） added by ls 20210824 
	this.getSortedParameters = function(parameters, categoryName){
		var groupList = new Array();
		var groupToParameters = {};
		for(var paramName in parameters){
			var parameter = parameters[paramName];
			if(categoryName == parameter.categoryName){
				var groupName = parameter.groupName;
				if(groupToParameters[groupName] == null){
					var tempGroupList = new Array();
					var added = false;
					for(var j = 0; j < groupList.length; j++){
						var tempGroupName = groupList[j];
						if(!added && tempGroupName.localeCompare(groupName, "zh") > 0){
							tempGroupList.push(groupName);
							groupToParameters[groupName] = {
								groupName: groupName, 
								subParameters: []
							};
							added = true;
						}
						tempGroupList.push(tempGroupName);
					}
					if(!added){
						tempGroupList.push(groupName);
						groupToParameters[groupName] = {
							groupName: groupName, 
							subParameters: []
						};
					}
					groupList = tempGroupList;
				}	
			}
		}
		
		for(var pName in parameters){
			var parameter = parameters[pName];
			var paramName = cmnPcr.prefixInteger(parameter.indexInGroup, 4) + "_" + pName;
			if(categoryName == parameter.categoryName){
				var groupName = parameter.groupName;
				var subParameters = groupToParameters[groupName].subParameters;
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
				groupToParameters[groupName].subParameters = tempSubParameterList;		
			}
		}
		var nameSortedParameters = new Array();
		for(var i = 0; i < groupList.length; i++){
			var groupName = groupList[i];
			var subParameters = groupToParameters[groupName].subParameters;
			for(var j = 0; j < subParameters.length; j++){
				nameSortedParameters.push(subParameters[j]);
			}
		}
		return nameSortedParameters;
	}
	
	this.getCatParametersHtml = function(categoryName, parameters){
		var nameSortedParameters = thatForm.getSortedParameters(parameters, categoryName);
		if(categoryName == null){
			categoryName = thatForm.undefinedCategoryName;
		}
		
		var lastGroupName = null;
		var allParamHtml = "<div class=\"catContent\" categoryName=\"" + categoryName + "\"><table class=\"zlpCardMainTable\">";
		for(var i = 0; i < nameSortedParameters.length; i++){ 
			var parameter = nameSortedParameters[i];
			var paramName = parameter.name;
			var inputType = "text";

			switch(parameter.paramType){
				case js3ParameterType.string:
				case js3ParameterType.decimal:
				case js3ParameterType.date:
				case js3ParameterType.time:
				case js3ParameterType.material:

				//数组类型 added by liyh 20230606
				case js3ParameterType.array:

				case js3ParameterType.gltfFile:
				case js3ParameterType.binFile:
				case js3ParameterType.pathFile:

				//FBX文件 added by ls 20240112
				case js3ParameterType.fbxFile:

				//辅助点文件 added by ls 20230418
				case js3ParameterType.assistFile:
					
				//增加几种类型 added by ls 20220606
				case js3ParameterType.surfaceFile:
				case js3ParameterType.point2D:
				case js3ParameterType.point3D:
				case js3ParameterType.polyline2D:
				case js3ParameterType.polyline3D:

				//线类型 added by ls 20230613
				case js3ParameterType.line2D:
				case js3ParameterType.line3D:
					
				//path参数类型 added by ls 20230105
				case js3ParameterType.path2D:
				case js3ParameterType.path3D:
				case js3ParameterType.pathClosed2D:
				case js3ParameterType.pathClosed3D:{
					inputType = "text";
					break;
				}
				case js3ParameterType.boolean:{
					inputType = "checkbox";
					break;
				}
			}
			
			//新的分组
			if(parameter.groupName != lastGroupName){

				//增加设计(即被引用)时是否显示的判断和处理  added by liyh 20221102
				if(parameter.designVisible!=undefined && parameter.designVisible!=null && parameter.designVisible==false) {
					//如果参数不显示，则分组不做显示
				}
				else{
					var groupName = parameter.groupName == null || parameter.groupName.length == 0 ? thatForm.undefinedGroupName : cmnPcr.html_encode(parameter.groupName);
					var groupHtml = "<tr style=\"height:38px;\"><td colspan=\"4\" class=\"zlpDispUnitTitle parameterGroupTd\" style=\"\"><div class=\"parameterGroupSpan\">" + groupName +"</div></td></tr>";
					allParamHtml += groupHtml;
					lastGroupName = parameter.groupName;
				}

			}

			//modified by liyh 20221109
			// var paramHtml = "<tr style=\"height:38px;\">"
			var paramHtml = "<tr style=\"height:38px;"+(parameter.designVisible!=undefined && parameter.designVisible!=null && parameter.designVisible==false ? "display:none;" : "") +"\">"
				+ "<td class=\"zlpDispUnitTitle parameterNameTd\">" + cmnPcr.html_encode(paramName) + "</span></td>"
				//增加paramtype属性的值类型 用于绑定input事件   modified by yay 20230607
				+ "<td class=\"zlpDispUnitValue parameterValueTd\">"

				+ "<input type=\"" + inputType + "\" name=\"" + cmnPcr.html_encode(paramName) + "\" class=\"zlpDispUnitInput zlpDispUnitInputValue\" autocomplete=\"off\" style=\"width:265px;\" paramCtrl=\"true\" paramtype='"+ cmnPcr.html_encode(parameter.paramType)
				//paramType为array类型的标题名称 added by yay 20240103
				+ "' arrayDescription='"+cmnPcr.html_encode(parameter.arrayDescription)+"'></input>"

				+ "</td>"

				//如果参数不可编辑，那么不显示表达式  modified by ls 20210820
				+ "<td class=\"zlpDispUnitValue parameterExpTd\">"
				+ "<input type=\"" + inputType + "\" name=\"exp_" + cmnPcr.html_encode(paramName) + "\" placeholder=\"表达式\" class=\"zlpDispUnitInput zlpDispUnitInputExp\" autocomplete=\"off\" style=\"width:350px;" + (parameter.isEditable ? "" : "display:none;") + "\" paramCtrl=\"true\" />"
				+ "<input type=\"" + inputType + "\" name=\"js_" + cmnPcr.html_encode(paramName) + "\" placeholder=\"js表达式\" class=\"zlpDispUnitInput zlpDispUnitInputExpJs\" style=\"display:none;width:350px;\" autocomplete=\"off\" paramCtrl=\"true\" />"
				+ "<input type=\"" + inputType + "\" name=\"ps_" + cmnPcr.html_encode(paramName) + "\" placeholder=\"ps参数\" class=\"zlpDispUnitInput zlpDispUnitInputExpPs\" style=\"display:none;width:350px;\" autocomplete=\"off\" paramCtrl=\"true\" />"
				+ "</td>"
				//如果参数不可编辑，那么不显示表达式编辑按钮 modified by ls 20210820
				+ "<td class=\"zlpDispUnitValue parameterExpBtnTd\"><div class=\"parameterExpBtn\" style=\"" + (parameter.isEditable ? "" : "display:none;") + "\">...</div></td>"
				+ "</tr>"; 
			allParamHtml += paramHtml;
		}
		allParamHtml += "</table></div>"
		return allParamHtml;
	}
	
	this.getCatTabHtml = function(categoryName){
		if(categoryName == null){
			categoryName = thatForm.undefinedCategoryName;
		}
		var tabHtml = "<div class=\"catTab\" categoryName=\"" + categoryName + "\">" + cmnPcr.html_encode(categoryName) + "</div>";
		return tabHtml;
	}
	
	this.initFormUIHtml = function(parameters){		
		//构造Tab页 added by ls 20230731
		var catList = thatForm.getSortedCategories(parameters);
		
		//构造各Tab标题 modified by ls 20230731	
		var allCatTabHtml = "<div class=\"catTabContainer\">";
		if(catList.length > 0){
			for(var i = 0; i < catList.length; i++){
				var categoryName = catList[i];
				allCatTabHtml += thatForm.getCatTabHtml(categoryName);
			}
		}
		else{
			allCatTabHtml += "<div class=\"catTab\" categoryName=\"noneParameter\">无参数</div>";
		}
		
		//图例tab
		allCatTabHtml += "<div class=\"catTab\" categoryName=\"img\">示例图</div>";
		allCatTabHtml += "</div>";

		//构造各Tab对应的内容 modified by ls 20230801	
		var allCatContentHtml = "<div class=\"catContentContainer\">";
		if(catList.length > 0){
			for(var i = 0; i < catList.length; i++){
				var categoryName = catList[i];
				allCatContentHtml += thatForm.getCatParametersHtml(categoryName, parameters);
			}
		}
		else{
			allCatContentHtml += "<div class=\"catContent catNoneContent\" categoryName=\"noneParameter\">尚未定义任何参数.</div>";
		}
		
		//增加图例内容
		allCatContentHtml += "<div class=\"catContent\" categoryName=\"img\">"
			+ "<div class=\"componentImgDiv\"><img class=\"componentImg\" src=\"\" ></div>"
			+ "</div>";		
		allCatContentHtml += "</div>";
				
		//添加html
		$("#" + thatForm.containerId).find(".zlpCardMainContainer").append(allCatTabHtml + allCatContentHtml);
		
		//绑定事件
		$("#" + thatForm.containerId).find(".zlpCardMainTable .parameterExpBtn").click(function(){
			var expInputElement = $(this).parent().parent().find(".zlpDispUnitInputExp");
			var expParamName = $(expInputElement).attr("name");
			var valueInputElement = $(this).parent().parent().find(".zlpDispUnitInputValue");
			var paramName = $(valueInputElement).attr("name");
			var paramType = thatForm.parameters[paramName].paramType;
			var valueType = getValueTypeByParameterType(paramType);
			
			var userParameters = [];
			for(var i = 0; i < thatForm.parentParameters; i++){
				userParameters.push(thatForm.parentParameters)
			}
			
	    	var exp = $(expInputElement).val();
			var inputExpParams = {
				expText: exp, 
				needResultType: valueType,
				userParameters: thatForm.parentParameters,
				returnFunc:function(p){
					if(p.succeed){
						var expPim = p.expText.trim();
						thatForm.paramWin.doCtrlMethodByParamName(expParamName, "setValue", expPim); 
						thatForm.runAllExpPimsByParentParameters();
					}
				},
				runAt:expRunAt.js
			};
			var expEditor =new ExpressionEditor();
			expEditor.show(inputExpParams);
		});

		$("#" + thatForm.containerId).find(".zlpCardMainTable input[paramtype='material']").click(function(){
			var inputName=$(this).attr("name");//例如：材质
			 thatForm.showPopForParameterMaterial({"inputName":inputName});
		});
		/*参数名称为material的，就不要绑定材质选择方法了 deleted by ls 20240201
		$("#" + thatForm.containerId).find(".zlpCardMainTable input[name='material']").click(function(){
			thatForm.showPopForParameterMaterial({"inputName":"material"});
		});
		*/
		$("#" + thatForm.containerId).find(".zlpCardMainTable input[paramtype='array']").click(function(){
			var inputName=$(this).attr("name");//例如：维度
			thatForm.showPopForParameterArray({"inputName":inputName});
		});

		/*参数名称为array的，就不要绑定array录入方法了 deleted by ls 20240201
		$("#" + thatForm.containerId).find(".zlpCardMainTable input[name='array']").click(function(){
			thatForm.showPopForParameterArray({"inputName":"array"});
		});
	  	*/

		$("#" + thatForm.containerId).find(".catTab").click(function(){
			var categoryName = $(this).attr("categoryName");
			$("#" + thatForm.containerId).find(".catTab").removeClass("catTabActive");
			$(this).addClass("catTabActive");
			$("#" + thatForm.containerId).find(".catContent").removeClass("catContentActive");
			$("#" + thatForm.containerId).find(".catContent[categoryName='" + categoryName + "']").addClass("catContentActive");
		});
		$("#" + thatForm.containerId).find(".catTab")[0].click();
	}

	//参数值变更后，检查其他参数有没有定义 "stadp:" 下拉值并引用当前参数的，如果有清空 added by liyh 20230601
	this.clearStdsListParam = function (jq,value){

		var currentParamName = $(jq).attr("name");

		for(var paramName in thatForm.parameters) {
			var parameter = thatForm.parameters[paramName];
			if (parameter.listValues.startWith("stdp:")) {
				if (currentParamName == parameter.listValues.substr(5).split(",")[0]) {
					thatForm.paramWin.doCtrlMethodByParamName(parameter.name, "setValue", null);

					thatForm.paramWin.paramWinModel.units[paramName].where = [{parttype:"field", field:"code", operator:"=", value:value.name}];
				}
			}
		}
	}

    this.runAllExpPimsByParentParameters = function(){
    	var paramNameToExps = {};
    	var paramNameToValues = {};
		var errors = [];
		var newParameters = {};
		var resultValues = thatForm.paramWin.getParamResult();
		for(var paramName in thatForm.parameters){
			var param = thatForm.parameters[paramName];
			var value = resultValues.values[paramName];
			var valueType = param.valueType;
			var expPim = resultValues.values["exp_" + paramName].trim();
			if(expPim.length > 0){
				paramNameToExps[paramName] = {
					expression: encodeURIComponent(expPim),
					needResultType: valueType
				};
			}
		}
		var requestParam = {
			 paramNameToExps: paramNameToExps,
			 userParameters: thatForm.parentParameters,
			 runAt: expRunAt.js,
			 checkCyclicRef: false
		};
		serverAccess.request({
			serviceName:"expressionNcpService",
			funcName:"validateJsExps",
 			args:{
 				requestParam:cmnPcr.jsonToStr(requestParam)
			},
 			successFunc:function(obj){
				//错误提示窗口 修改为左下角textarea 展示 added by yay 20230628
				var textareaBottomInfoDom = $(window.parent.document.body).find("div[name='textareaBottomInfo']")[0];
				$(textareaBottomInfoDom).empty();
 				if(obj.result.validateErrors != null && obj.result.validateErrors.length > 0){
					//错误提示窗口 修改为左下角textarea 展示 added by yay 20230628
 					$(textareaBottomInfoDom).text(cmnPcr.arrayToString(obj.result.validateErrors, ". "));
 				}
 				else{
	 				var params = {};
	 				for(var i = 0; i < thatForm.parentParameters.length; i++){
	 					var parentParameter = thatForm.parentParameters[i];
	 					params[parentParameter.name] = parentParameter.value;
	 				}
	 				var jsCodes = obj.result.jsCodes;
	 				var pss = obj.result.pss;
 					for(var paramName in jsCodes){
 						if(jsCodes[paramName] != null){
 							var jsCode = decodeURIComponent(jsCodes[paramName]);;
 			 				var ps = "|" + cmnPcr.arrayToString(pss[paramName], "|") + "|";
			 				var runner = new ExpressionRunner();
			 				var resultValue = runner.run(params, jsCode);

			 				//解决弹出的自动赋值功能 modified by ls 20220810
			 				var param = thatForm.parameters[paramName];
			 				if(param.listValues.length > 0){
				 				thatForm.paramWin.doCtrlMethodByParamName(paramName, "setValue", {name: resultValue});
			 				}
			 				else{
			 					switch(param.paramType){
				 					case js3ParameterType.point2D:
				 					case js3ParameterType.point3D:
				 					case js3ParameterType.polyline2D:
				 					case js3ParameterType.polyline3D:
				 					case js3ParameterType.line2D:
				 					case js3ParameterType.line3D:{
						 				thatForm.paramWin.doCtrlMethodByParamName(paramName, "setValue", {points: resultValue});
				 						break;
				 					}
				 					//path参数类型 added by ls 20230105
				 					case js3ParameterType.path2D:
				 					case js3ParameterType.path3D:
				 					case js3ParameterType.pathClosed2D:
				 					case js3ParameterType.pathClosed3D:{
						 				thatForm.paramWin.doCtrlMethodByParamName(paramName, "setValue", {path: resultValue});
				 						break;
				 					}
				 					default:{

						 				thatForm.paramWin.doCtrlMethodByParamName(paramName, "setValue", resultValue);
				 						break;
				 					}
			 					}
			 				}
			 				thatForm.paramWin.doCtrlMethodByParamName("js_" + paramName, "setValue", jsCode);
			 				thatForm.paramWin.doCtrlMethodByParamName("ps_" + paramName, "setValue", ps);
 						}
 					}

					thatForm.runAllExpPimsByUnitParameters();
 				}
			}
 		});
    }

    this.runAllExpPimsByUnitParameters = function() {
		var paramNameToExps = {};
		var paramNameToValues = {};
		var userParameters = [];
		var errors = [];
		var newParameters = {};
		var resultValues = thatForm.paramWin.getParamResult();
		for (var paramName in thatForm.parameters) {
			var param = thatForm.parameters[paramName];
			var value = resultValues.values[paramName];
			var valueType = getValueTypeByParameterType(param.paramType);
			userParameters.push({
				name: paramName,
				value: value,
				valueType: valueType
			});
			var expPim = param.exp == null ? "" : param.exp.pim;
			if (expPim.length > 0) {
				paramNameToExps[paramName] = {
					expression: encodeURIComponent(expPim),
					needResultType: valueType
				};
			}
		}
		var requestParam = {
			paramNameToExps: paramNameToExps,
			userParameters: userParameters,
			runAt: expRunAt.js
		};
		serverAccess.request({
			serviceName: "expressionNcpService",
			funcName: "validateJsExps",
			args: {
				requestParam: cmnPcr.jsonToStr(requestParam)
			},
			successFunc: function (obj) {
				//错误提示窗口 修改为左下角textarea 展示 added by yay 20230628
				var textareaBottomInfoDom = $(window.parent.document.body).find("div[name='textareaBottomInfo']")[0];
				$(textareaBottomInfoDom).empty();
 				if(obj.result.validateErrors != null && obj.result.validateErrors.length > 0){
					//错误提示窗口 修改为左下角textarea 展示 added by yay 20230628
 					$(textareaBottomInfoDom).text(cmnPcr.arrayToString(obj.result.validateErrors, ". "));
 				}
 				else {
					var ps = {};
					for (var i = 0; i < userParameters.length; i++) {
						var userParameter = userParameters[i];
						ps[userParameter.name] = userParameter.value;
					}
					var jsCodes = obj.result.jsCodes;
					var sortedParamters = obj.result.sortedParamters;
					for (var i = 0; i < sortedParamters.length; i++) {
						var paramName = sortedParamters[i];
						if (jsCodes[paramName] != null) {
							try {
								var jsCode = decodeURIComponent(jsCodes[paramName]);
								var runner = new ExpressionRunner();
								var resultValue = runner.run(ps, jsCode,true);

								//解决弹出的自动赋值功能 modified by ls 20220810
								var param = thatForm.parameters[paramName];
								if (param.listValues.length > 0) {
									thatForm.paramWin.doCtrlMethodByParamName(paramName, "setValue", {name: resultValue});
								}
								else {
									switch (param.paramType) {
										case js3ParameterType.point2D:
										case js3ParameterType.point3D:
										case js3ParameterType.polyline2D:
										case js3ParameterType.polyline3D:
				 						case js3ParameterType.line2D:
				 						case js3ParameterType.line3D:{
											thatForm.paramWin.doCtrlMethodByParamName(paramName, "setValue", {points: resultValue});
											break;
										}
										//path参数类型 added by ls 20230105
										case js3ParameterType.path2D:
										case js3ParameterType.path3D:
										case js3ParameterType.pathClosed2D:
										case js3ParameterType.pathClosed3D: {
											thatForm.paramWin.doCtrlMethodByParamName(paramName, "setValue", {path: resultValue});
											break;
										}
										default: {
											thatForm.paramWin.doCtrlMethodByParamName(paramName, "setValue", resultValue);
											break;
										}
									}
								}
								ps[paramName] = resultValue;
							}
							catch(ex) {
								//错误提示窗口 修改为左下角textarea 展示 added by yay 20230628
			 					$(textareaBottomInfoDom).text(ex.toString());
							}
						}
					}
				}
			}
		});
	}

	this.getFormUIParameters = function(parameters,valueParameters){
		var uiParameters = {
			id: 0,
			name: "",
			units:{}
		}
		var paramIndex = 1;
		for(var paramName in parameters){
			var parameter = parameters[paramName];

			var unitParam = {
				id: paramIndex,
				name: paramName,
				label: paramName,
				decimalNum:"4",
				valueLength: 100,
				isMultiValue: false,
				isNullable: parameter.isNullable,
				isEditable: parameter.isEditable,
				defaultValue: parameter.defaultValue
			}
			switch(parameter.paramType){
				case js3ParameterType.string:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "text";
					break;
				}
				case js3ParameterType.decimal:{
					unitParam.valueType = valueType.decimal;
					unitParam.unitType = "decimal";
					break;
				}
				case js3ParameterType.boolean:{
					unitParam.valueType = valueType.boolean;
					unitParam.unitType = "text";
					break;
				}
				case js3ParameterType.date:{
					unitParam.valueType = valueType.date;
					unitParam.unitType = "date";
					break;
				}
				case js3ParameterType.time:{
					unitParam.valueType = valueType.time;
					unitParam.unitType = "time";
					break;
				}
				case js3ParameterType.material:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "text";
					break;
				}
				//数组类型 added by liyh 20230606
				case js3ParameterType.array:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "text";
					break;
				}
				case js3ParameterType.gltfFile:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "pop";
					unitParam.inputHelpType = "pop";
					unitParam.inputHelpName = "web/pop/view_gltfGrid.jsp";
					unitParam.maps = {"gltfFile": "name"};
					break;
				}
				//FBX文件 added by ls 20240112
				case js3ParameterType.fbxFile:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "pop";
					unitParam.inputHelpType = "pop";
					unitParam.inputHelpName = "web/pop/view_fbxGrid.jsp";
					unitParam.maps = {"fbxFile": "name"};
					break;
				}
				case js3ParameterType.binFile:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "pop";
					unitParam.inputHelpType = "pop";
					unitParam.inputHelpName = "web/pop/view_gltfBinGrid.jsp";
					unitParam.maps = {"binFile": "name"};
					break;
				}
				case js3ParameterType.pathFile:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "pop";
					unitParam.inputHelpType = "pop";
					unitParam.inputHelpName = "web/pop/view_pathGrid.jsp";
					unitParam.maps = {"pathFile": "code"};
					break;
				}
				case js3ParameterType.surfaceFile:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "pop";
					unitParam.inputHelpType = "pop";
					unitParam.inputHelpName = "web/pop/view_surfaceGrid.jsp";
					unitParam.maps = {"surfaceFile": "code"};
					break;
				}

				//辅助点文件 added by ls 20230418
				case js3ParameterType.assistFile:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "pop";
					unitParam.inputHelpType = "pop";
					unitParam.inputHelpName = "web/pop/view_gltfAssistGrid.jsp";
					unitParam.maps = {"assistFile": "name"};
					break;
				}

				//增加位置类型的参数 added by ls 20220606
				case js3ParameterType.point2D:
				case js3ParameterType.point3D:
				case js3ParameterType.polyline2D:
				case js3ParameterType.polyline3D:
				case js3ParameterType.line2D:
				case js3ParameterType.line3D:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "pop";
					unitParam.inputHelpType = "pop";
					unitParam.inputHelpName = parameter.paramType;
					var maps = {};
					maps[parameter.name] = "points";
					unitParam.maps = maps;
					break;
				}
				//path参数类型 added by ls 20230105
				case js3ParameterType.path2D:
				case js3ParameterType.path3D:
				case js3ParameterType.pathClosed2D:
				case js3ParameterType.pathClosed3D:{
					unitParam.valueType = valueType.string;
					unitParam.unitType = "pop";
					unitParam.inputHelpType = "pop";
					unitParam.inputHelpName = parameter.paramType;
					var maps = {};
					maps[parameter.name] = "path";
					unitParam.maps = maps;
					break;
				}
			}
			if(parameter.listValues.length > 0){
				//新增系统标准数据的下拉定义(listsp:parametername)及解析 added by liyh 20230529
				if(parameter.listValues.startWith("stdp:")){
					var listParameters = parameter.listValues.substr(5).split(",");
					unitParam.inputHelpType = "list";
					unitParam.unitType = "list";
					unitParam.inputHelpName = "listStandard";//系统内置标准专用下拉定义
					unitParam.maps = {};
					unitParam.maps[paramName] = "name";
					unitParam.where = [{parttype:"field", field:"code", operator:"=", value:valueParameters[listParameters[0]]? valueParameters[listParameters[0]].value:""}];
					unitParam.list = {
						name: "listStandard",
						columns:[
							{field: "name", valueType: unitParam.valueType, title: paramName, width:100, hidden:false}
						],
						rows:[
						]
					};
				}
				//新增系统标准数据的下拉定义(listStandard:StandardCode)及解析 added by liyh 20230529
				else if(parameter.listValues.startWith("std:")){
					var listParameters = parameter.listValues.substr(4).split(",");
					unitParam.inputHelpType = "list";
					unitParam.unitType = "list";
					unitParam.inputHelpName = "listStandard";//系统内置标准专用下拉定义
					unitParam.maps = {};
					unitParam.maps[paramName] = "name";
					unitParam.where = [{parttype:"field", field:"code", operator:"=", value:listParameters[0] }];
					unitParam.list = {
						name: "listStandard",
						columns:[
							{field: "name", valueType: unitParam.valueType, title: paramName, width:100, hidden:false}
						],
						rows:[
						]
					};
				}
				//支持下拉和弹出
				else if(parameter.listValues.startWith("list:")){
					var listParameters = parameter.listValues.substr(5).split(",");
					unitParam.inputHelpType = "list";
					unitParam.unitType = "list";
					unitParam.inputHelpName = listParameters[0];
					unitParam.maps = {};
					unitParam.maps[paramName] = listParameters[1];
					unitParam.list = {
			    		name: listParameters[0],
			    		columns:[
		    		         {field: listParameters[1], valueType: unitParam.valueType, title: paramName, width:100, hidden:false}
			    		],
			    		rows:[
			            ]
					};
				}
				else if(parameter.listValues.startWith("pop:")){
					var listParameters = parameter.listValues.substr(4).split(",");
					unitParam.inputHelpType = "pop";
					unitParam.unitType = "pop";
					unitParam.inputHelpName = listParameters[0];
					unitParam.maps = {};
					unitParam.maps[paramName] = listParameters[1];
				}
				else{
					var listValueArray = parameter.listValues.split(",");
					unitParam.inputHelpType = "list";
					unitParam.unitType = "list";
					unitParam.inputHelpName = paramName;
					unitParam.maps = {};
					unitParam.maps[paramName] = "name";
					unitParam.list = {
			    		name: paramName,
			    		columns:[
		    		         {field:"name", valueType: unitParam.valueType, title: paramName, width:100, hidden:false}
			    		],
			    		rows:[
			            ]
					};
					for(var i = 0; i < listValueArray.length; i++){
						var listValueStr = listValueArray[i];
						var listValue = cmnPcr.strToObject(listValueStr, unitParam.valueType);
						var row = {name: listValue};
						unitParam.list.rows.push(row);
					}
				}
			}
			uiParameters.units[paramName] = unitParam;

			var expParamName = "exp_" + paramName;
			var unitExpParam = {
				id: paramIndex + 1,
				name: expParamName,
				label: expParamName,
				decimalNum: "0",
				valueLength: 500,
				valueType: valueType.string,
				unitType: "text",
				isMultiValue: false,
				isNullable: true,
				isEditable: parameter.isEditable
			}
			uiParameters.units[expParamName] = unitExpParam;

			var jsParamName = "js_" + paramName;
			var unitJsParam = {
				id: paramIndex + 2,
				name: jsParamName,
				label: jsParamName,
				decimalNum: "0",
				valueLength: 500,
				valueType: valueType.string,
				unitType: "text",
				isMultiValue: false,
				isNullable: true,
				isEditable: parameter.isEditable
			}
			uiParameters.units[jsParamName] = unitJsParam;

			var psParamName = "ps_" + paramName;
			var unitPsParam = {
				id: paramIndex + 3,
				name: psParamName,
				label: psParamName,
				decimalNum: "0",
				valueLength: 500,
				valueType: valueType.string,
				unitType: "text",
				isMultiValue: false,
				isNullable: true,
				isEditable: parameter.isEditable
			}
			uiParameters.units[psParamName] = unitPsParam;

			paramIndex = paramIndex + 4;
		}
		return uiParameters;
	};

	//材料类型 pop页 added yay 20230425
	this.showPopForParameterMaterial=function (param){
		//弹出pop 和 pop 回写时间
		var popContainer = new PopupContainer( {
			width : 700 ,
			height : 460,
			top : 10,
			title: "选择材质"
		});

		popContainer.show();

		var popPageUrl = basePath + "/web/pop/pop_mtl_MaterialGrid.jsp";
		var frameId = cmnPcr.getRandomValue()+"_mtl_MaterialGird";
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
				var $el=$("#" + thatForm.containerId).find(".zlpCardMainTable input[name='"+param.inputName+"']");
				$el.focus();
				if(selectedObj){
					$el.val(selectedObj.code);
					thatForm.setParameterValue({name:param.inputName,value:selectedObj.code})
				}
				popContainer.close();
			},
			otherValues:[]
		};
		$("#" + frameId).attr("src", popPageUrl);

	}

	//维度数组 pop页 added yay 20230607
	this.showPopForParameterArray=function (param){
		//弹出pop 和 pop 回写时间
		var popContainer = new PopupContainer( {
			width : 560,
			height : 460,
			top : 10,
			title: "编辑"
		});

		popContainer.show();

		var popPageUrl = "../../../../pop/pop_xy_array.jsp";
		var frameId = cmnPcr.getRandomValue()+"_xy_array";
		var innerHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		$("#" + popContainer.containerId).html(innerHtml);

		var $defaultvalue=$("#" + thatForm.containerId).find(".zlpCardMainTable input[name='"+param.inputName+"']");

		window.popInitParam = {
			closeWin : function(resObj) {
				$defaultvalue.focus();
				if(resObj.val!=undefined&&resObj.val!=null){
					$defaultvalue.val(resObj.val);
					thatForm.setParameterValue({name:param.inputName,value:resObj.val})
				}
				popContainer.close();
			},
			otherValues:{
				val:$defaultvalue.val(),
				arrayDescription:$defaultvalue.attr("arrayDescription")
			}
		};
		$("#" + frameId).attr("src", popPageUrl);

	}
}
