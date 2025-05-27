//编辑楼层平面图 added by ls 20221123
js3CommandProcessors["floorPlan"] = {
	toStatus: "normal",	 
	editor: null,
	popWin: null,
	layoutInfo: null,
	run: function(p){
		var cmdJson = js3CommandProcessors["floorPlan"];
		cmdJson.editor = p.editor;

		//获取所有的墙、柱、门、窗，轴网等
		var layoutInfo = cmdJson.getLayoutInfo(cmdJson.editor);
		
		cmdJson.editFloorPlan({
			layoutInfo: layoutInfo,
			pageUrl: "../layout2d/layoutEditor.jsp"
		});
	},	
	getLayoutInfo: function(editor){
    	var componentInfo = editor.getLastComponentInfo(); 
		var layoutInfo = {
			axes: componentInfo.axes,
			attachDistance: componentInfo.attachDistance,
			camera: componentInfo.camera,
			controlSize: componentInfo.controlSize,
			size: componentInfo.size,
			placePointRadius: componentInfo.placePointRadius,
			gridSpace: componentInfo.gridSpace
		};
        return layoutInfo;
	},
	editFloorPlan: function(p){
		var popContainer = new PopupContainer({
            width: $(document.body).width() - 10,
			height: $(document.body).height() - 10,
			top: 5,
			title: "平面图(2D)"
		});
		popContainer.show();

		var inputId = cmnPcr.getRandomValue();
		var titleId = inputId + "_title";
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:35px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #DDDDDD;overflow:hidden;\" />"
		 	+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:35px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		$("#" + editorFrameId).attr("src", p.pageUrl);
		setTimeout(function(){
			var contentWindow = $("#" + editorFrameId)[0].contentWindow;
			contentWindow.layoutInfo = p.layoutInfo;
		}, 200);

		$("#" + okBtnId).click(function(p){
			var newValues = $("#" + editorFrameId)[0].contentWindow.getValues();
			$("#instanceInputId").val(newValues.instanceInfo);
			popContainer.close();
		});
		$("#" + cancelBtnId).click(function(){
			popContainer.close();
		});
	}
};