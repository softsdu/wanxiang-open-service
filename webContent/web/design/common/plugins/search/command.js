js3CommandProcessors["search"] = {
	toStatus: "normal",
	icon: "/images/search.png",
	lastKeyword: "",
	foundIndex: 0,
	unitNameIds: null,
	searchContainer: null,
	editor: null,
	run: function(p){ 
		js3CommandProcessors["search"].editor = p.editor;
		p.commandJson.search(p);
	},
	search: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;
		if(thatCommandJson.searchContainer == null){
			var popContainer = new PopupContainer( {
				width : 400,
				height :145,
				top : 10,
				title: "查找",
				canClose: false
			});
			
			popContainer.show(); 
			var inputId = cmnPcr.getRandomValue(); 
			var titleId = inputId + "_title";  
			var buttonContainerId = inputId + "_buttonContainer";
			var okBtnId = inputId + "_ok";
			var cancelBtnId = inputId + "_cancel";
			var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:0px;text-align:center;\">"
			 	+ "<div style=\"position:relative;width:100%;height:40px;border:1px solid #EEEEEE;line-height:24px;padding-top:0px;text-align:center;\" >"
	            + "<input name=\"keywordInput\" style=\"position:relative;width:100%;height:100%;border-width:0px;font-size:15px;color:#111111;\" value=\"\"/>"
			 	+ "</div>" 
			 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:relative;width:100%;height:40px;padding-top:5px;text-align:right;\">"
			 	+ "<span name=\"resultSpan\" style=\"position:absolute;top:0px;left:0px;height:100%;width:200px;z-index:-1;padding-top:10px;text-align:left;\">&nbsp;</span>"
			 	+ "<input name=\"okBtn\"  type=\"button\" id=\"" + okBtnId +"\" value=\"查 找\" class=\"commonBtn\" />"
			 	+ "<input name=\"cancelBtn\" type=\"button\" id=\"" + cancelBtnId +"\" value=\"关 闭\" class=\"commonBtn\" />"
				+ "</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			js3CommandProcessors["search"].searchContainer = popContainer;
	        $("#" + okBtnId).click(function(){
	        	let keyword = $("#" + js3CommandProcessors["search"].searchContainer.containerId).find("input[name='keywordInput']").val().trim().toLowerCase();
	        	if(keyword.length == 0){
	        		msgBox.alert({info: "请输入关键词"});
	        	}
	        	else{
	        		js3CommandProcessors["search"].searchByKeyword(keyword);
	        	}
			});  
	        $("#" + cancelBtnId).click(function(){
	        	js3CommandProcessors["search"].searchContainer.hide();
			});  
	        $("#" + js3CommandProcessors["search"].searchContainer.containerId).keydown(function(ev){
	    		switch(ev.keyCode){
		    		case 13:{
		    			$("#" + js3CommandProcessors["search"].searchContainer.containerId).find("input[name='okBtn']").click();
		    			return false;
		    		}
		    		case 27:{
		    			$("#" + js3CommandProcessors["search"].searchContainer.containerId).find("input[name='cancelBtn']").click();
		    			return false;
		    		}
		    		default:{
		    			return true;
		    		}
	    		}
	        });
		}
		else{
			js3CommandProcessors["search"].searchContainer.show();
		}
		js3CommandProcessors["search"].updateUnitNameIds();
		$("#" + js3CommandProcessors["search"].searchContainer.containerId).find("input[name='keywordInput']").focus();
	},
	updateUnitNameIds: function(){
		let commandJson = js3CommandProcessors["search"];
		let unitNameIds = [];
		let allGroups = commandJson.editor.componentInfo.groups;
		for(let i = 0; i < allGroups.length; i++){
			var group = allGroups[i];
			var unitIds = group.units;
			for(var j = 0; j < unitIds.length; j++){
				var unitId = unitIds[j];
				var unit = commandJson.editor.componentInfo.units[unitId];
				unitNameIds.push({
					id: unitId,
					name: unit.name.toLowerCase()
				});
			}
		}
		js3CommandProcessors["search"].unitNameIds = unitNameIds;
		js3CommandProcessors["search"].foundIndex = -1;
		$("#" + commandJson.searchContainer.containerId).find("span[name='resultSpan']").text("请输入关键词.");
	},
	searchByKeyword: function(keyword){
		let commandJson = js3CommandProcessors["search"];
		if(keyword != commandJson.lastKeyword){
			commandJson.lastKeyword = keyword;
			commandJson.foundIndex = -1;
		}
		var matchIndexes = [];
		for(let i = 0; i < commandJson.unitNameIds.length; i++){
			var unitNameId = commandJson.unitNameIds[i];
			if(unitNameId.name.indexOf(keyword) > -1){
				matchIndexes.push(i);
			}
		}
		if(matchIndexes.length == 0){
			$("#" + commandJson.searchContainer.containerId).find("span[name='resultSpan']").text("未找到匹配项.");
		}
		else{
			if(commandJson.foundIndex ==  matchIndexes.length - 1){
				commandJson.foundIndex = 0;
			}
			else{
				commandJson.foundIndex = commandJson.foundIndex + 1;
			}
			var unitId = commandJson.unitNameIds[matchIndexes[commandJson.foundIndex]].id;
    		var object3D = commandJson.editor.getObject3DByUnitId(unitId);
			commandJson.editor.selectUnitObject(object3D);
			commandJson.editor.setCenterObject(object3D); 
			commandJson.editor.setLeftSide("leftSingleSelect", "groupUnitList", true);
			$("#" + commandJson.searchContainer.containerId).find("span[name='resultSpan']").text("已匹配到 " + (commandJson.foundIndex + 1) + "/" + matchIndexes.length +" 项.");
		}
	}
};