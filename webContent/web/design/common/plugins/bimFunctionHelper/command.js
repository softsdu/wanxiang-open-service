js3CommandProcessors["bimFunctionHelper"] = {
	toStatus: "normal",
	eidtor: null,
	popContainer: null,
	run: function(p){
		js3CommandProcessors["bimFunctionHelper"].editor = p.editor;
		p.commandJson.showHelper(p); 
	},
	showHelper: function(p){ 
		var thatCommandJson = p.commandJson;
		var popContainer = new PopupContainer( {
			//加大窗口宽度 modified by ls 20221206
			width : 1000,
			height :500,

			//更高窗口位置 modified by ls 20221206
			top : 150,
			title: "函数帮助"
		});
		
		popContainer.show();
		var inputId = cmnPcr.getRandomValue(); 
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:3px;right:3px;top:0px;bottom:3px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
		 	+ "</iframe>"  
		 	+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		$("#" + editorFrameId).attr("src", "../common/plugins/bimFunctionHelper/helper.jsp");  

		js3CommandProcessors["bimFunctionHelper"].popContainer = popContainer;
	},
	setCmdText: function(p){
		js3CommandProcessors["bimFunctionHelper"].editor.setCmdText(p.cmd);
		js3CommandProcessors["bimFunctionHelper"].popContainer.hide();
	}
};