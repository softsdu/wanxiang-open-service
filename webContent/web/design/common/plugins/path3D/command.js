//编辑path3d added by ls 20230112
js3CommandProcessors["path3d"] = {
	toStatus: "normal",	
	editor: null,
	intervalId: null,
	paramName: null,
	paramValue: null,
	unitComponentProcessor: null,
	run: function(p){
		var thatCommandJson = js3CommandProcessors["path3d"];
		thatCommandJson.editor = p.editor; 
		thatCommandJson.paramName = p.paramName,
		thatCommandJson.paramValue = p.paramValue,
		thatCommandJson.unitComponentProcessor = p.unitComponentProcessor; 

		p.commandJson = thatCommandJson;
		thatCommandJson.showLayoutPath3dWindow(p); 
	},
	showLayoutPath3dWindow: function(p){ 
		var thatCommandJson = p.commandJson;
		var popContainer = new PopupContainer( {
			width: 1200,
			height: 700,
			top: 20,
			title: "编辑3D"
		});
		
		popContainer.show(); 
		var inputId = cmnPcr.getRandomValue(); 
		var titleId = inputId + "_title";  
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"    
		 	+ "</iframe>"  
		 	+ "</div>" 
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);  

		js3CommandProcessors["path3d"].intervalId = setInterval(function(){
			var contentWindow = $("#" + editorFrameId)[0].contentWindow;
			if(contentWindow != null){
				var thatCommandJson = js3CommandProcessors["path3d"];
				var layoutPaht3dInfo = thatCommandJson.paramValue == null || thatCommandJson.paramValue.length == 0 ? {} : cmnPcr.strToJson(thatCommandJson.paramValue);
				contentWindow.layoutInfo = layoutPaht3dInfo;
				window.clearInterval(thatCommandJson.intervalId);
			}
		},50)
		
		$("#" + editorFrameId).attr("src", "../layoutPath3d/layoutPath3dEditor.jsp");
		$("#" + okBtnId).click(function(){
			var contentWindow = $("#" + editorFrameId)[0].contentWindow;
			var layoutInfo = contentWindow.getResultLayoutInfo();
			var layoutInfoStr = null;
			var isValidatedValue = false;
			if(layoutInfo.paths.length == 0){
				//没有定义路径
				layoutInfoStr = "";
				isValidatedValue = true;
			}
			else if(layoutInfo.paths.length > 1){
				msgBox.alert({info: "只允许定义一条路径."});
			}
			else{
				layoutInfoStr = cmnPcr.jsonToStr(layoutInfo);
				isValidatedValue = true;
			}
			if(isValidatedValue){
				popContainer.close();
				var thatCommandJson = js3CommandProcessors["path3d"];
				var paramName = thatCommandJson.paramName;
				var unitComponentProcessor = thatCommandJson.unitComponentProcessor; 
				unitComponentProcessor.afterEditPath3d({
					paramName: paramName,
					paramValue: layoutInfoStr
				});
			}
		});
		$("#" + cancelBtnId).click(function(){   
			popContainer.close();
		}); 
	} 
};