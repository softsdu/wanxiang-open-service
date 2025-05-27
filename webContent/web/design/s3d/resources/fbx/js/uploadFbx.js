function initUploadFbxPage(){
	const that = this;
	var uploadedFileIds = [];
	var maxFileSize = 1024 * 1024 * 500;
	
	if(cmnPcr.checkHtml5()){
		var initParam = {
			onAddQueueItem: function(fileObj){
				
				$("#selectErrorDivId").css("display", "none"); 
				var needClearQueue = false;
				var dotIndex = fileObj.name.lastIndexOf(".");
				var namePostfix = fileObj.name.substr(dotIndex).toLowerCase();
				if(namePostfix !== ".fbx" && namePostfix !== ".png" && namePostfix !== ".jpg"  && namePostfix !== ".jpeg" && namePostfix !== ".assist"){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("注意：请选中fbx相关文件(*.fbx;*.png;*.jpg;*.jpeg;*.assist;)");
					needClearQueue = true;
				}
				else if(fileObj.size > maxFileSize){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("注意：文件大小不能超过500M");
					needClearQueue = true;
				}
				if(needClearQueue){
					setTimeout(function(){
						$("#selectFileBtnId").uploadifive("clearQueue");
					}, 100);
				}
			},
			onAllComplete: function(event, data){
				if(uploadedFileIds.length > 0){
					var idStr = cmnPcr.arrayToString(uploadedFileIds, "_");

					//idStr可能太长，使用父窗口存储
					window.parent.uploadFbxInfo = {ids: idStr};

					window.location = "validateFbx.jsp?fbx=" + encodeURIComponent(fbxFileName) + "&assist=" + encodeURIComponent(assistFileName) + "&aids=" + idStr;
				}
			},
			onComplete: function(fileObj, data){
				var responseObj = cmnPcr.strToJson(data);
				var accessoryId = responseObj[0].result.ids[0];
				uploadedFileIds.push(accessoryId);
			},
			onUpload: function(filesToUpload){
				uploadedFileIds = [];
				if(filesToUpload === 0){
					msgBox.alert({info: "请点击\"选择文件...\"按钮"});
					return false;
				} 
				else{
					return true;					
				}
			}
		};
		$("#selectFileBtnId").uploadifive({ 
			'uploadScript': basePath + '/accessory/uploadFile?filterType=fbx&filterValue=',//后台处理的请求 
			'buttonText':  "选择文件...",  
			'method': "post", 
			'queueID': "fileQueueDivId",
			'auto': false,
			'multi': true, 
			'fileSizeLimit': maxFileSize,
			'fileType': ["fbx", "png", "jpg", "jpeg", "assist"],
			'queueSizeLimit': 500,
			'width': 92,
			'height': 23,  
			'onUploadComplete': function(fileObj, data) {
				if(initParam.onComplete != undefined){
					return initParam.onComplete(fileObj, data);
				}
				else{
					return true;
				}
			}, 
	        'onQueueComplete' : function(uploads) {
				if(initParam.onAllComplete != undefined){
					return initParam.onAllComplete(uploads);
				}
				else{
					return true;
	    	   	}
	        },
			'onAddQueueItem': function(file) { 
				if(initParam.onAddQueueItem != undefined){
					return initParam.onAddQueueItem(file);
				}
				else{
					return true;
	    	   	}
			},
			'onUpload': function(filesToUpload){
				if(initParam.onUpload != undefined){
					return initParam.onUpload(filesToUpload);
				}
				else{
					return true;
	    	   	}
			}
		});
		
		$("#uploadFileBtnDivId").click(function(){
			//上传前，增加fbx文件个数的检测 modifed by ls 20230824
			var fbxCount = getFileCount(".fbx");
			var assistCount = getFileCount(".assist");
			if(fbxCount === 0){
				msgBox.alert({info: "必须包含一个fbx文件"});
			}
			else if(fbxCount > 1){
				msgBox.alert({info: "不能选择多个fbx文件"});
			}
			else if(assistCount > 1){
				msgBox.alert({info: "不能选择多个assist文件"});
			}
			else{
				fbxFileName = getFileName(".fbx");
				assistFileName = getFileName(".assist");				
				$("#selectFileBtnId").uploadifive("upload"); 
			} 
			return false;
		});
	}
	else{
		msgBox.alert({info: "不支持HTML5, 无法执行导入."});
	}
};

//选中的文件个数，根据后缀统计 added by ls 20230824
function getFileCount(postfix){
	var fileNameSpans = $(".uploadifive-queue-item").find(".filename");
	var fbxCount = 0;
	for(var i = 0; i < fileNameSpans.length; i++){
		var fileNameSpan = fileNameSpans[i];
		var fileName = $(fileNameSpan).text().toLowerCase();
		if(fileName.endsWith(postfix)){
			fbxCount++;
		}
	}
	return fbxCount;
}

//选中的文件名，根据后缀获取 added by ls 20230824
function getFileName(postfix){
	let fileNameSpans = $(".uploadifive-queue-item").find(".filename");
	for(let i = 0; i < fileNameSpans.length; i++){
		let fileNameSpan = fileNameSpans[i];
		let fileName = $(fileNameSpan).text().toLowerCase();
		if(fileName.endsWith(postfix)){
			return fileName;
		}
	}
	return "";
}
function getFileNames(postfix){
	let fileNameSpans = $(".uploadifive-queue-item").find(".filename");
	let fileNames = [];
	for(let i = 0; i < fileNameSpans.length; i++){
		let fileNameSpan = fileNameSpans[i];
		let fileName = $(fileNameSpan).text().toLowerCase();
		if(fileName.endsWith(postfix)){
			fileNames.push(fileName);
		}
	}
	return fileNames;
}

//选中的文件名
var fbxFileName = "";
var assistFileName = "";

$(document).ready(function(){
	initUploadFbxPage();
});