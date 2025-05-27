js3CommandProcessors["calcCarbon"] = { 
	toStatus: "normal",	 
	icon: "/images/calcCarbon.png",
	run: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson; 
		thatCommandJson.showCalcCarbonWindow(p); 
	},
	showCalcCarbonWindow: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;
		var popContainer = new PopupContainer( {
			width : 700,
			height :500,
			top : 100,
			title: "指标统计"
		});
		
		popContainer.show(); 
		var inputId = cmnPcr.getRandomValue(); 
		var titleId = inputId + "_title";  
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var statusDivId = inputId + "_div";
        var resultFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:35px;font-size:11px;text-align:center;\">"
		 	+ "<div id=\"" + statusDivId + "\" style=\"position:relative;width:100%;height:100%;border:1px solid #505050;line-height:24px;padding-top: 0px;text-align:center;font-size:16px;\" >"
            + "<iframe style=\"border-width:0;\"  width = \"100%\" src=\"\" height = \"100%\" id=\"" + resultFrameId + "\" >"
		 	+ "</iframe>"
		 	+ "</div>" 
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:35px;bottom:20px;font-size:11px;text-align:right;\">"
		 	// + "<input type=\"button\" id=\"" + okBtnId +"\" value=\"关 闭\" class=\"commonBtn\" />"
			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);  
		// $("#" + statusDivId).text("在此处增加碳排放计算界面");
        $("#" + resultFrameId).attr("src","../common/plugins/calcCarbon/index.html?componentCode="+cmnPcr.html_encode(thatCE.componentInfo.code)
			+"&versionNum="+cmnPcr.html_encode(thatCE.componentInfo.versionNum)
            +"&componentName="+cmnPcr.html_encode(thatCE.componentInfo.name));//9号楼一层平面（东户）//仁恒项目模型
        $("#" + okBtnId).click(function(){
			popContainer.close();
		});  
		p.statusDivId = statusDivId; 
			
		thatCommandJson.processCalcCarbon(p);		
	},		
	processCalcCarbon: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;  
		var statusDivId = p.statusDivId;  
	}  
};