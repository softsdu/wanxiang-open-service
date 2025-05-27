js3CommandProcessors["preview"] = {
	toStatus: "normal",	
	icon: "/images/preview.png",
	run: function(p){
		p.commandJson.preview(p);
	},
	preview: function(p){
    	var lastComponentInfo = p.editor.getLastComponentInfo(); 
		var popContainer = new PopupContainer( {
			width : 1000 ,
			height : 800,
			top : 20,
			title: "预览"
		});
		
		popContainer.show(); 
		var inputId = cmnPcr.getRandomValue(); 
		var titleId = inputId + "_title";  
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:0px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;overflow:auto;\" >"    
		 	+ "</iframe>"  
		 	+ "</div>" 
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		
		//增加环境设置相关的参数传递 modified by ls 20230607
		window.componentPreviewParams = {
			componentInfo: lastComponentInfo,
			settings:{
				viewLevel: p.editor.object3DCreator.viewLevel,				
				detailLevel: p.editor.object3DCreator.detailLevel,
				backgroundColor: p.editor.backgroundColor
			}
		};
		$("#" + editorFrameId).attr("src", p.editor.previewPageUrl);
	}
};