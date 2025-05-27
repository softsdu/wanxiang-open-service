//登录方法  codeTb,pwdTb,saveChb,autoChb，containerDiv
function login(p){
 
	var code =	$("#"+p.codeTb).val();
	var pwd = $("#"+p.pwdTb).val();
	var fromUrl = p.fromUrl;
	
	if(code == "" || pwd == ""){
		msgBox.warning({title:"提示",info:"请输入用户名和密码."});
		return;
	}
	 
	serverAccess.request({
		serviceName:"userNcpService",
		funcName:"login",
	    args:{requestParam:cmnPcr.jsonToStr({code:code,password:pwd})}, 
		successFunc:function(obj){
			if(fromUrl != null){
				location.href = fromUrl;
			}
			else{
				location.href = basePath + "/web/user/index.html";
			}
		},
		failFunc:function(obj){
			//msgBox.error({title:"提示",info:obj.message});
			msgBox.error({title:"提示",info:obj.detailMessage});

			//G.Msg.showWarning(obj.message);
		},
		waitingBarParentId:p.containerDiv
	});
}

function saveSessionCookie(cSessionId){ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24 * 3); //72小时
    //正式环境中，需要设置domain，实现session跨域共享
    setCookie("cSessionId", cSessionId, exp.toGMTString(), "/zlp");
	//document.cookie = "cSessionId=" + cSessionId + ";" + exp.toGMTString();  
}

$(document).ready(function(){ 
	
	//增加登录后跳转功能 added by ls 20210225
	var requestArgs = cmnPcr.getQueryStringArgs();
	var fromUrl = requestArgs["fromurl"];

	$("#userCodeText").focus();
	
	$("#userCodeText").keydown(function(){
		if(event.keyCode==13){
			$("#loginBtn").click();
		}
	});
	
	$("#userPasswordText").keydown(function(){
		if(event.keyCode==13){
			$("#loginBtn").click();
		}
	});
	
	$("#regBtn").click(function(){
		msgBox.alert({info: "暂不可公开注册，请联系管理员."});
		return false;
	});
	
	$("#helpDocBtn").click(function(){
		msgBox.alert({info: "正在建设..."});
		return false;
	});
	
	$("#contactBtn").click(function(){
		msgBox.alert({info: "请联系管理员."});
		return false;
	});
		
	$("#loginBtn").click(function(){
		login({
			codeTb:"userCodeText",
			pwdTb:"userPasswordText",
			saveChb:"",
			autoChb:"",
			containerDiv:"innerDiv",
			loginBtn:"loginBtn",
			fromUrl: fromUrl
		});
	});
});

//对cookie的操作 modified by ls 20210225
function setCookie(name,value,iDay) {
	cmnPcr.setCookie(name, value, iDay);
}

function getCookie(name) {
	return cmnPcr.getCookie(name);
}

function removeCookie(name) {
	cmnPcr.removeCookie(name);
}

function rememberUser()
{
	var nRember=document.getElementById('remember');
	if(nRember.checked==true){
		var nUser=document.getElementById('userCodeText');
		var nPass=document.getElementById('userPasswordText');
		setCookie('user',nUser.value,7);
		setCookie('pass',nPass.value,7);
	}else{
		removeCookie('user');
		removeCookie('pass');
	}
}

window.onload=function(){
	var oRember=document.getElementById('remember');
	var oUser=getCookie('user');
	var oPass=getCookie('pass');
	if(oUser != null && oPass != null ){
		//设置userCodeText的值为oUser
		document.getElementById('userCodeText').value=oUser;
		//设置userPasswordText为oPass
		document.getElementById('userPasswordText').value=oPass;
		//设置remember的值为true
		oRember.checked=true;
	}else{
		oRember.checked=false;
	}
};