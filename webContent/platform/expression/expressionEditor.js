//调用表达式编辑器
function ExpressionEditor(){
	this.show = function(inputParams){
		var popContainer = new PopupContainer( {
			width : 700,
			height : 460,
			top : 10,
			title: "编辑表达式"
		});
		popContainer.show();
		var inputExpParams = {
			returnFunc : function(p) {
				popContainer.close(); 
				if(inputParams.returnFunc != null){
					inputParams.returnFunc(p);
				}
			},
			expText:inputParams.expText,
			userParameters:inputParams.userParameters,
			runAt:inputParams.runAt,
			needResultType:inputParams.needResultType			
		};
		window.inputExpParams = inputExpParams;
 
		var popPageUrl = basePath + "/web/expression/editExpression.jsp";

		var frameId = cmnPcr.getRandomValue();
		var iFrameHtml = "<iframe id=\""
				+ frameId
				+ "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		$("#" + popContainer.containerId).html(iFrameHtml);
		$("#" + frameId).attr("src", popPageUrl);
	}
}