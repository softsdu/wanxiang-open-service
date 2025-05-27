//登录方法  codeTb,pwdTb,saveChb,autoChb，containerDiv
function showLicense(p){  
	serverAccess.request({
		serviceName:"licenseNcpService",
		funcName:"getLicenseInfo",
	    args:{requestParam:cmnPcr.jsonToStr({})}, 
		successFunc:function(obj){
			$("#currentSysInfoId").text(decodeURIComponent(obj.result.currentSysInfo));
			$("#licenseSysInfoId").text(decodeURIComponent(obj.result.licenseSysInfo));
			$("#licenseTypeId").text(decodeURIComponent(obj.result.licenseType));
			$("#licenseSNId").text(decodeURIComponent(obj.result.licenseSN));
		},
		failFunc:function(obj){
			msgBox.error({title:"提示",info:obj.message});
		},
		waitingBarParentId:p.containerDiv
	});
}

$(document).ready(function(){
	showLicense({}); 
}); 