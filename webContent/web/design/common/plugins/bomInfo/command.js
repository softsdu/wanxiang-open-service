js3CommandProcessors["bomInfo"] = {
	toStatus: "normal",	 
	icon: "/images/showEBOM.png",
	run: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson; 
		thatCommandJson.showCalcCarbonWindow(p); 
	},
	showCalcCarbonWindow: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;
		var popContainer = new PopupContainer( {
			width : 960,
			height :720,
			top : 10,
			title: "BOM信息",
			canFullScreen:true//可全屏 added by liyh 20230704
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
		 	+ "<div id=\"" + statusDivId + "\" style=\"position:relative;width:100%;height:100%;border:1px solid #EEEEEE;line-height:24px;padding-top: 0px;text-align:center;font-size:16px;\" >"
            + "<iframe width = \"100%\" src=\"\" height = \"100%\" id=\"" + resultFrameId + "\" >"
		 	+ "</iframe>"
		 	+ "</div>" 
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:35px;bottom:20px;font-size:11px;text-align:right;\">"
		 	// + "<input type=\"button\" id=\"" + okBtnId +"\" value=\"关 闭\" class=\"commonBtn\" />"
			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);  
		// {"gbCode":"显示分级测试","apiKey":"9Dg22AAZWuoYCjJ/GuNe2Q==", "versionNum":"1.0"}
		//更改引用页地址 modified by ls 20230920
        $("#" + resultFrameId).attr("src","../common/plugins/bomInfo/bomView.html?code="+cmnPcr.html_encode(thatCE.componentInfo.code)
			+"&versionNum="+cmnPcr.html_encode(thatCE.componentInfo.versionNum)
            +"&componentName="+cmnPcr.html_encode(thatCE.componentInfo.name));
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