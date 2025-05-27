function initValidateImagePage(){
	
	
	var args = cmnPcr.getQueryStringArgs();
	var accessoryIds = args["aids"];
	if(accessoryIds == null){
		msgBox.alert({info: "网页地址错误"});
	}
	else{
		var requestParam = {accessoryIds: accessoryIds};
		serverAccess.request({
			serviceName:"/resImageNcpService",
			funcName:"importImage", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){ 
				var statusStr = "成功! 已完成导入."; 
				showImportedLog(statusStr); 
			},
			failFunc:function(obj){ 
				showImportedLog(cmnPcr.jsonToStr(obj));
			}
		});
	}
}; 
function showImportedLog(statusStr){  
	$(".processStatusDiv").html(statusStr);
}

$(document).ready(function(){
	initValidateImagePage();
});