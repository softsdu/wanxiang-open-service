function HelperForm(){
	var thatForm = this;
	
	this.functionList = null;
	
	this.helperFunctionList = null;
	
	this.containerId = null;
	
	this.init = function(p){
		thatForm.containerId = p.containerId;
		thatForm.functionList = p.functionList;
		thatForm.helperFunctionList = p.helperFunctionList;
		thatForm.initFunctionView(p.helperFunctionList, p.functionList);

		$("#" + thatForm.containerId).find(".tabItem").click(function(ev){
			var groupName = $(this).attr("groupName");
			$("#" + thatForm.containerId).find(".tabItem").removeClass("tabItemActive");
			$(this).addClass("tabItemActive");
			var allSubTabItems = $("#" + thatForm.containerId).find(".subTabItem");
			for(var i = 0; i < allSubTabItems.length; i++){
				var subTabItem = allSubTabItems[i];
				if(groupName.length == 0 || $(subTabItem).attr("groupName") == groupName){
					$(subTabItem).removeClass("subTabItemHidden");
				}
				else{
					$(subTabItem).addClass("subTabItemHidden");
				}
			}
		});
		$("#" + thatForm.containerId).find(".subTabItem").click(function(ev){
			//设置父窗口的命令行内容
			var cmd = $(this).find(".subTabTitle").text();
			window.parent.js3CommandProcessors["bimFunctionHelper"].setCmdText({cmd: cmd});			
		});
		$("#" + thatForm.containerId).find(".subTabItem").mouseover(function(ev){
			var groupName = $(this).attr("groupName");
			var functionName = $(this).attr("functionName");
			var functionInfo = thatForm.helperFunctionList[groupName][functionName].info;
			var html = "<table class=\"detailTable\">"
			+ "<tr class=\"detailItem\"><td class=\"detailItemTitle\">名称:</td><td class=\"detailItemValue\">" + cmnPcr.html_encode(functionInfo.name) + "</td></tr>"
			+ "<tr class=\"detailItem\"><td class=\"detailItemTitle\">描述:</td><td class=\"detailItemValue\">" + cmnPcr.html_encode(functionInfo.description) + "</td></tr>";
			if(functionInfo.settings.length == 1){
				html += "<tr class=\"detailItem\"><td class=\"detailItemTitle\">方式:</td><td class=\"detailItemValue\">" + thatForm.getFunctionParameterHtml(functionInfo.settings[0]) + "</td></tr>"
			}
			else {
				for(var i = 0; i < functionInfo.settings.length; i++){
					var functionSetting = functionInfo.settings[i];
					html += "<tr class=\"detailItem\"><td class=\"detailItemTitle\">方式" + (i + 1) + ":</td><td class=\"detailItemValue\">"  
					+ thatForm.getFunctionParameterHtml(functionSetting) 
					+ "</td></tr>"
				}
			}
			html += "</table>";
			$("#" + thatForm.containerId).find(".detailContainer").html(html);
		});
	}  
	
	this.getFunctionParameterHtml = function(functionSetting){
		var html = "<span class=\"detailItemSubTitle\">返回-</span>" + functionSetting.description + "<br/>";
		if(functionSetting.parameters.length == 0){
			html = "(无参数)"
		}
		else{
			for(var i = 0; i < functionSetting.parameters.length; i++){
				var param = functionSetting.parameters[i];
				html += ( "<span class=\"detailItemSubTitle\">参数" + (i + 1) + "-</span>" + param.valueTypeDes + ", " +  cmnPcr.html_encode(param.description) + "<br/>");
			}
		}
		return html;
	}
	
	this.initFunctionView = function(helperFunctionList, functionList){
		thatForm.addTabItem("", "所有", true);
		for(var groupName in helperFunctionList){
			var list = helperFunctionList[groupName];
			thatForm.addTabItem(groupName, groupName, false);
		}

		for(var groupName in helperFunctionList){
			var list = helperFunctionList[groupName];
			for(var functionName in list){
				var func = list[functionName];
				var functionInfo = thatForm.getFunctionInfo(functionName, functionList);
				if(functionInfo == null){
					throw "函数" + functionName + "没有定义, functionList里不存在此函数"
				}
				else{
					func.info = functionInfo;
					thatForm.addSubTabItem(functionName, func.exp, functionInfo.description, groupName);
				}
			}
		}
		
	}
	this.getFunctionInfo = function(functionName, functionList){
		for(var categoryName in functionList){
			var funcList = functionList[categoryName];
			for(var funcName in funcList){
				if(functionName == funcName){
					return funcList[funcName];
				}
			}
		}
		return null;
	}
	
	this.addTabItem = function(groupName, groupTitle, isActive){
		var html = "<div class=\"tabItem" + (isActive ? " tabItemActive" : "") + "\" groupName=\"" + groupName + "\"><div class=\"tabTitle\"></div></div>";
		var tabContainer = $("#" + thatForm.containerId).find(".tabContainer")[0];
		$(tabContainer).append(html);
		$(tabContainer).find(".tabItem[groupName='" + groupName + "'] .tabTitle").text(groupTitle);
	}
	
	this.addSubTabItem = function(functionName, functionExp, functionDescription, groupName){
		var html = "<div class=\"subTabItem\" groupName=\"" + groupName + "\" functionName=\"" + functionName + "\"><div class=\"subTabTitle\"></div><div class=\"subTabDescription\"></div></div>";
		var tabContainer = $("#" + thatForm.containerId).find(".subTabContainer")[0];
		$(tabContainer).append(html);
		var subTabItem = $(tabContainer).find(".subTabItem[functionName='" + functionName + "']")[0];
		$(subTabItem).find(".subTabTitle").text(functionExp);
		$(subTabItem).find(".subTabDescription").text(functionDescription);
	}
	
}
