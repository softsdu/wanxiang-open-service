//登录方法  codeTb,pwdTb,saveChb,autoChb，containerDiv
function generateLicenseSN(p){  
	
	var requestObj = {
		sysInfo:encodeURIComponent($("#sysInfoId").val()),
		licenseType:encodeURIComponent($("#licenseTypeId").val()),
		publicKey:encodeURIComponent($("#publicKeyId").val())
	};
	
	serverAccess.request({
		serviceName:"licenseNcpService",
		funcName:"generateSN",
	    args:{requestParam:cmnPcr.jsonToStr(requestObj)}, 
		successFunc:function(obj){ 
			$("#licenseSNId").text(decodeURIComponent(obj.result.licenseSN)); 
		},
		failFunc:function(obj){
			msgBox.error({title:"提示",info:obj.message});
		},
		waitingBarParentId:p.containerDiv
	});
}

$(document).ready(function(){
	$("#generateLicenseSNId").click(function(){
		generateLicenseSN({}); 
	});
}); 