function EditExpression(){
	
	var that = this;
	
	//传递过来的表达式
	this.expText = null;
	
	//自定义参数
	this.userParameters = null;
	
	//返回时调用的表达式
	this.returnFunc = null;
	
	//运行位置
	this.runAt = null;
	
	//需要的返回值类型
	this.needResultType = null;
	
	//显示初始状态的表达式
	this.showExpression = function(){
		$("#expressionInputId").val(that.expText);
	}
	
	//显示函数列表、参数列表
	this.showFunctionParameterListList = function(){
		var treeData = new Array();
		
		if(that.userParameters != null && that.userParameters.length != 0){
			//参数可以分组 modified by ls 20221110
			var userParameterRootNode = {
				id:"ncpParmaterRoot",
				name: "所有参数",
				text:"",
				nodes:new Array()
			};
			var allParamRootNodes = {
				"ncpParmaterRoot": userParameterRootNode
			};
			for(var i=0;i< that.userParameters.length;i++){
				var param = that.userParameters[i];
				var rootNode = userParameterRootNode;
				if(param.group != null){
					if(allParamRootNodes[param.group] == null){
						allParamRootNodes[param.group] = {
							id: param.group,
							name: param.group,
							text: "",
							nodes:new Array(),
							state: {
								expanded: false
							}
						};
					}
					rootNode = allParamRootNodes[param.group];
				}
				rootNode.nodes.push({
					id: "parameter_"+param.name, 
					text: param.name,
					//text:param.name+" "+ param.description,
					name: param.name,
					attributes: {type:"userParameter",
						addExp: param.name,
						description: "参数: "+ param.name + ", " +  param.valueType + (param.description == null ? "" : (", " + param.description))
					}	 
				});
			}		
			
			for(var groupName in allParamRootNodes){
				var rootNode = allParamRootNodes[groupName];
				rootNode.text = rootNode.name + "(" + rootNode.nodes.length + ")";
				treeData.push(rootNode);
			}
		}
		 
		var funcRootNode = {
				id:"ncpFunctionRoot",
				text:"所有函数",
				nodes:new Array()};
		for(var categoryName in expFunctions){
			var funcList = expFunctions[categoryName]; 
			var categoryNode = {
				id:"category_"+categoryName,
				text:categoryName,
				attributes:{type:"category"},
				nodes:new Array()
			}
			for(var funcName in funcList){
				var func = funcList[funcName];
				var description = "函数: " + func.name+", "+func.description+".<br/>";
				var funcNode = {
					id:"function_"+funcName,
					text:funcName,  
					//text:funcName+" "+func.description, 
					attributes:{type:"function",
						addExp:funcName + "()",
						description:description
					}							
				}
				
				for(var i=0;i<func.settings.length;i++){
					var funcSetting =  func.settings[i];
					funcNode.attributes.description = funcNode.attributes.description + (i+1) +": 返回"+ funcSetting.valueTypeDes +"&nbsp;" + funcSetting.description +"&nbsp;参数为";
					if(funcSetting.parameters.length == 0){
						funcNode.attributes.description += "无";
					}
					else{
						for(var j=0;j<funcSetting.parameters.length;j++){
							var p = funcSetting.parameters[j];
							funcNode.attributes.description += "<br/>";
							funcNode.attributes.description = funcNode.attributes.description + "&nbsp;&nbsp;&nbsp;&nbsp;" + (i +  1) + "." + (j + 1) + p.valueTypeDes +"&nbsp;"+p.name+"&nbsp;" + p.description;
						}
					}
					funcNode.attributes.description += "<br/>";
				}
				funcNode.attributes.description += "<br/>";
				
				categoryNode.nodes.push(funcNode);
			}
			if(categoryNode.nodes.length != 0){
				funcRootNode.nodes.push(categoryNode);
				categoryNode.text = categoryNode.text + " (" + categoryNode.nodes.length + ")";
			}
		}
		treeData.push(funcRootNode);
		
		$("#funcTreeDivId").treeview({
			data:treeData,
			selectable: true,
			color: "#444444",
			backColor: "#FFFFFF",
			selectedColor: "#000000",
			searchResultBackColor: "#f2f2f2",
			selectedBackColor: "#f9f9f9",
			showBorder:false,
			onNodeDblClick:function(event, node){ 
				var attributes = node.attributes;
				if(attributes!=null){
					if(attributes.type == "userParameter"){
						that.addTextToExpression(attributes.addExp, 0); 
					} 
					else if(attributes.type == "function"){
						that.addTextToExpression(attributes.addExp, -1); 
					} 
				}
			},
			onNodeSelected:function(event, node){
				var attributes = node.attributes;
				if(attributes!=null){ 
					that.showDetailInfo(attributes.description);  
				}
				else{
					that.showDetailInfo(node.text);  
				}
			}
		});
	}	 
	
	//显示函数、参数的详细描述信息
	this.showDetailInfo = function(description){
		$("#detailInfoDivId").html(description);
	} 
	
	//显示表达式验证结果
	this.showValidateInfo = function(validateResult){
		var resultStr = "";
		resultStr += (validateResult.succeed ? "验证通过!" : "验证未通过!");
		resultStr += (" (" + cmnPcr.datetimeToStr(new Date(), "HH:mm:ss") + ") ");
		resultStr += "</br>";
		if(validateResult.validateErrors.length != 0){
			for(var i=0;i<validateResult.validateErrors.length;i++){
				var eStr = validateResult.validateErrors[i];
				resultStr += ((i+1) +": " + eStr +"</br>");
			}
		}		
		$("#validateResultDivId").html(resultStr);
	} 
	
	//验证 
	this.validateExpression = function(){ 	 				
		 var exp = encodeURIComponent(cmnPcr.trim( $("#expressionInputId").val()));
		 if(exp.length == 0){
			 msgBox.alert({info:"请输入表达式"});
		 }
		 else{	
		 	var userParams = new Array();
		 	if(that.userParameters != null){
		 		for(var i = 0; i < that.userParameters.length; i++){
		 			var up = that.userParameters[i];
		 			userParams.push({
		 				name: encodeURIComponent(up.name),
		 				valueType: up.valueType,
		 				valueTypeDes: encodeURIComponent(up.valueTypeDes),
		 				description: encodeURIComponent(up.description)	 				
		 			});
		 		}
		 	}
		 	
			 var requestParam = {expression:exp, 
					 userParameters:userParams, 
					 runAt:that.runAt,
					 needResultType:(that.needResultType == null ? "" : that.needResultType)
					 }; 
	 		 serverAccess.request({
	 			 serviceName:"expressionNcpService", 
	 			 funcName:"validateJsExp",
	 			 args:{
	 				 requestParam:cmnPcr.jsonToStr(requestParam)
				 },  
	 			 successFunc:function(obj){  
				 	that.showValidateInfo(obj.result);
				 }
	 		 }); 
		}
	}
	
	//添加关键字到表达式
	this.addKeywordToExpression = function(){
		var keywordBtns = $("#keyWordDivId").find(".expSymbolBtn");
		for(var i=0;i<keywordBtns.length;i++){
			var btn = keywordBtns[i];
			$(btn).click(function(){
				//添加关键字到表达式
			    var str = $(this).text();
			    that.addTextToExpression(str, 0);
			});
		}
	} 
	
	//添加字符串到表达式
	this.addTextToExpression = function(str, swiftIndex){  
	    var tc = document.getElementById("expressionInputId");  
	    var tclen = tc.value.length;    
	    var newSelectionStart = tc.selectionStart + str.length + swiftIndex;
	    var oldSelectionStart = tc.selectionStart;
	    var oldSelectionEnd = tc.selectionEnd;
	    tc.value = tc.value.substr(0,oldSelectionStart)+str+tc.value.substring(oldSelectionEnd,tclen);  
	    tc.selectionStart = newSelectionStart;
	    tc.selectionEnd = newSelectionStart; 
	    tc.focus();	
	} 
	
	//选中函数节点
	this.selectFunctionNode = function(id){ 
		$("#funcTreeDivId").treeview("search", [id]);  
	} 
	
	//将\tab替换为\n added ls 20231213
	this.replaceTab2N = function(expText){
		return expText.replace(/\t/g, "\n");
	}	

	
	//将\n替换为\tab added ls 20231213
	this.replaceN2Tab = function(expText){
		return expText.replace(/\n/g, "\t");
	}	

	this.init = function(inputParams){ 
		that.expText = that.replaceTab2N(inputParams.expText);
		that.userParameters = inputParams.userParameters;
		that.returnFunc = inputParams.returnFunc;
		that.runAt = inputParams.runAt;
		that.needResultType = inputParams.needResultType;
		
		//显示初始状态的表达式
		that.showExpression();
		
		//显示函数列表
		that.showFunctionParameterListList(); 
		
		that.addKeywordToExpression();
		
		$("#validateButtonId").click(function(){
			that.validateExpression();
		});
	
		$("#okButtonId").click(function(){
			var expText = cmnPcr.trim($("#expressionInputId").val());
			if(that.returnFunc != null){
				that.returnFunc({
					succeed:true,
					expText: that.replaceN2Tab(expText)
				});
			}
		});
		$("#cancelButtonId").click(function(){ 
			if(that.returnFunc != null){
				that.returnFunc({
					succeed: false
				});
			}
		});
	
		var findedIndex = -1;
		var lastFindStr = "";
		$("#findId").keydown(function(event){
			switch(event.keyCode) {
				case 13: {
					var index = -1;
					var findStr = $("#findId").val();
					if(findStr != lastFindStr){
						findedIndex = -1;
						lastFindStr = findStr;
					}
					if(findStr.length!=0){
						for(var categoryName in expFunctions){ 
							var funcList = expFunctions[categoryName];
							for(var funcName in funcList){
								var func = funcList[funcName];
								index++;
								if(index > findedIndex){
									if(funcName.indexOf(findStr) != -1 || func.description.indexOf(findStr) != -1){
										findedIndex = index;
										that.selectFunctionNode(funcName);
										return;
									}
									for(var i=0;i<func.settings.length;i++){
										var funcSetting =  func.settings[i];
										if(funcSetting.description.indexOf(findStr) != -1){
	 										findedIndex = index;
	 										that.selectFunctionNode(funcName);
											return;
										}
									}	 										
								}
							}
						}
					}
					findedIndex=-1;
					msgBox.alert({info:"未查找到更多相关函数!"});
				}
				break;
			}
		});	
	}
}