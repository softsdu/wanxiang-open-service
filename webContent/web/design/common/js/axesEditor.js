function AxesEditor(){
	var thatAxesEditor = this;  
	this.containerId = null; 
	this.sourceParameters = null; 
	
	this.init = function(p){ 
		thatAxesEditor.containerId = p.containerId;  
		thatAxesEditor.sourceParameters = p.parameters;
		thatAxesEditor.initHtml(p.parameters); 
		thatAxesEditor.initPropertiesEvent();
	}
	
	this.initPropertiesEvent = function(){
		$("#" + thatAxesEditor.containerId).find(".axesValue").change(function(){
    		var newValue = $(this).val().trim();
    		if(!thatAxesEditor.checkAxesValue(newValue)){
    			var oldValue = $(this).attr("sourceValue");
    			$(this).val(oldValue);
    		} 
    		else{
    			$(this).attr("sourceValue", newValue);
    			var axesName = $(this).parent().parent().attr("name");
    			thatAxesEditor.calcSumValue(axesName);
    		}
		});

		$("#editAxisInfoBtn").click(function(){
			thatAxesEditor.showPopForAxisInfoEdit(thatAxesEditor.getParameters());
		});
	}

	this.showPopForAxisInfoEdit=function (parameter){
		var popContainer = new PopupContainer( {
			width : 560,
			height : 360,
			top : 10,
			title: "编辑"
		});

		popContainer.show();

		var popPageUrl = "../../pop/pop_axisInfoEdit.jsp";
		var frameId = cmnPcr.getRandomValue();
		var innerHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		$("#" + popContainer.containerId).html(innerHtml);

		var leftParamStr = parameter.left;
		var topParamStr = parameter.top;
		var verticalParamStr = parameter.vertical;
		var leftParamNumber = leftParamStr ? leftParamStr.split(",").length : 0;
		var topParamNumber = topParamStr ? topParamStr.split(",").length : 0;
		var verticalParamNumber = verticalParamStr ? verticalParamStr.split(",").length : 0;

		//增加特殊处理，去除第一个数据项  added by liyh 20230721
		if(leftParamNumber > 0){
			leftParamStr = leftParamStr.substr(leftParamStr.indexOf(",") + 1);
			leftParamNumber = leftParamNumber - 1;
		}
		if(topParamNumber > 0){
			topParamStr = topParamStr.substr(topParamStr.indexOf(",") + 1);
			topParamNumber = topParamNumber-1;
		}
		if(verticalParamNumber > 0){
			verticalParamStr = verticalParamStr.substr(verticalParamStr.indexOf(",") + 1);
			verticalParamNumber = verticalParamNumber - 1;
		}
		var currrentAxisValueStr = leftParamStr + ";" + topParamStr + ";" + verticalParamStr;
		
		//列，固定3列，分别对应 左右、前后、竖直3个方向
		var x = 3;
		//行,初始默认3行
		var y = 3;
		
		if(y < leftParamNumber) {
			y = leftParamNumber;
		}
		if(y < topParamNumber) {
			y = topParamNumber;
		}
		if(y < verticalParamNumber) {
			y = verticalParamNumber;
		}

		window.popInitParam = {
			closeWin: function(val) {
				if(val != undefined && val != null){
					parameter.array = val;
					if(val){
						let valueArray = val.split(";");
						thatAxesEditor.sourceParameters.left = valueArray[0];
						thatAxesEditor.sourceParameters.right = valueArray[0];
						thatAxesEditor.sourceParameters.top = valueArray[1];
						thatAxesEditor.sourceParameters.bottom = valueArray[1];
						thatAxesEditor.sourceParameters.vertical = valueArray[2];
					}
					else{
						thatAxesEditor.sourceParameters.left = "";
						thatAxesEditor.sourceParameters.right = "";
						thatAxesEditor.sourceParameters.top = "";
						thatAxesEditor.sourceParameters.bottom = "";
						thatAxesEditor.sourceParameters.vertical = "";
					}
					thatAxesEditor.initHtml(thatAxesEditor.sourceParameters);
				}
				popContainer.close();
			},
			otherValues: {val:currrentAxisValueStr,x:x,y:y}
		};
		$("#" + frameId).attr("src", popPageUrl);

	}
	
	this.calcSumValue = function(axesName){
		var axesValue = $("#" + thatAxesEditor.containerId + " .propertyList[name='" + axesName + "'] .axesValue").val();
		var sumValue = 0;
		
		//解决合计值返回为NaN的问题 modified by ls 20221026
		var partValues = axesValue != null && axesValue.trim().length > 0 ? axesValue.trim().split(",") : null;
		if(partValues != null){
			for(var i = 0; i < partValues.length; i++){
				var partValue = partValues[i].trim();
				var pvs = partValue.split(":");
				var mark = "";
				var distance = null;
				if(pvs.length == 1){
					distance = cmnPcr.strToDecimal(pvs[0].trim());
				}
				else if(pvs.length == 2){
					mark = pvs[0].trim();
					distance = cmnPcr.strToDecimal(pvs[1].trim());
				}
				if(distance != null){
					sumValue += distance;
				}
			} 
		}
		$("#" + thatAxesEditor.containerId + " .propertyList[name='" + axesName + "'] .sumValue").text(sumValue);
	}
	
	this.checkAxesValue = function(value){
		if(value.length == 0){
			return true;
		}
		else{
			var partValues = value.split(",");
			for(var i = 0; i < partValues.length; i++){
				var partValue = partValues[i].trim();
				//判断是否输入的是数值 modified by ls 20221028
				var pvs = partValue.split(":");
				var distance = null;
				if(pvs.length == 0 || pvs.length > 3){ 
					return false;
				}
				else if(pvs.length == 1){
					if(!cmnPcr.isDecimal(pvs[0].trim())){
						return false;
					}
				}
				else if(pvs.length == 2){
					if(!cmnPcr.isDecimal(pvs[1].trim())){
						return false;
					}
				} 
			}
			return true;
		}
	}

	//判断定义是否合法，主要是判断是否出现了距离不同，轴号相同的情况 added by ls 20221028
	this.checkAxesNames = function(axesLists){
		var nameToZeros = [];
		var axesValueArray = [axesLists.left, axesLists.right, axesLists.top, axesLists.bottom];
		for(var i = 0; i < axesValueArray.length; i++){
			var axesValue = axesValueArray[i];
			var partValues = axesValue.split(",");
			var distanceToZero = 0;
			for(var j = 0; j < partValues.length; j++){
				var partValue = partValues[j].trim();
				var pvs = partValue.split(":");
				var distance = 0;
				var mark = "";
				if(pvs.length == 1){
					distance = cmnPcr.strToDecimal(pvs[0].trim());
				}
				else if(pvs.length == 2){
					mark = pvs[0].trim();
					distance = cmnPcr.strToDecimal(pvs[1].trim());
				}
				distanceToZero += distance;
				if(mark.length > 0){
					var values = nameToZeros[mark];
					if(values == null){
						values = [];
						nameToZeros[mark] = values;
					}
					var hasValue = false;
					for(var k = 0; k < values.length; k++){
						if(distanceToZero == values[k]){
							hasValue = true;
						}
					}
					if(!hasValue){
						values.push(distanceToZero);
					}
				}
			}
		}
		
		var errorInfo = [];
		for(var name in nameToZeros){
			values = nameToZeros[name];
			if(values.length > 1){
				errorInfo.push("轴号'" + name + "'的刻度不唯一.");
			}
		}
		if(errorInfo.length > 0){
			msgBox.alert({info: cmnPcr.arrayToString(errorInfo, "\r\n")});
			return false;
		}
		else{
			return true;
		}
	}
	
	this.getParameters = function(){		
		var newParameters = { 
			left: $("#" + thatAxesEditor.containerId + " .propertyList[name='leftAxes'] .axesValue").val().trim(),
			right: $("#" + thatAxesEditor.containerId + " .propertyList[name='rightAxes'] .axesValue").val().trim(),
			top: $("#" + thatAxesEditor.containerId + " .propertyList[name='topAxes'] .axesValue").val().trim(),
			bottom: $("#" + thatAxesEditor.containerId + " .propertyList[name='bottomAxes'] .axesValue").val().trim(),
			//增加竖直方向轴网 added by ls 20230208
			vertical: $("#" + thatAxesEditor.containerId + " .propertyList[name='verticalAxes'] .axesValue").val().trim()				
		};  
		
		//判断定义是否合法，主要是判断是否出现了距离不同，轴号相同的情况 added by ls 20221028
		if(thatAxesEditor.checkAxesNames(newParameters)){
			return newParameters;
		}
		else{
			return null;
		}
	} 

	this.initHtml = function(parameters){
		var container = $("#" + thatAxesEditor.containerId)[0]; 
		$(container).find(".propertyList[name='leftAxes'] .axesValue").attr("sourceValue", parameters.left == null ? "" : parameters.left); 
		$(container).find(".propertyList[name='leftAxes'] .axesValue").val(parameters.left == null ? "" : parameters.left); 
		thatAxesEditor.calcSumValue("leftAxes");
		
		$(container).find(".propertyList[name='rightAxes'] .axesValue").attr("sourceValue", parameters.right == null ? "" : parameters.right); 
		$(container).find(".propertyList[name='rightAxes'] .axesValue").val(parameters.right == null ? "" : parameters.right); 
		thatAxesEditor.calcSumValue("rightAxes");
		
		$(container).find(".propertyList[name='topAxes'] .axesValue").attr("sourceValue", parameters.top == null ? "" : parameters.top); 
		$(container).find(".propertyList[name='topAxes'] .axesValue").val(parameters.top == null ? "" : parameters.top); 
		thatAxesEditor.calcSumValue("topAxes");
		
		$(container).find(".propertyList[name='bottomAxes'] .axesValue").attr("sourceValue", parameters.bottom == null ? "" : parameters.bottom); 
		$(container).find(".propertyList[name='bottomAxes'] .axesValue").val(parameters.bottom == null ? "" : parameters.bottom);  
		thatAxesEditor.calcSumValue("bottomAxes");
		
		//增加竖直方向轴网 added by ls 20230208
		$(container).find(".propertyList[name='verticalAxes'] .axesValue").attr("sourceValue", parameters.vertical == null ? "" : parameters.vertical); 
		$(container).find(".propertyList[name='verticalAxes'] .axesValue").val(parameters.vertical == null ? "" : parameters.vertical);  
		thatAxesEditor.calcSumValue("verticalAxes");
	}


}
