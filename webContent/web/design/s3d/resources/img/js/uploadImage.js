function initUploadImagePage(){
	var that = this;
	var uploadedFileIds = new Array();
	var maxFileSize = 1024 * 1024 * 20;
	
	if(cmnPcr.checkHtml5()){
		var initParam = {
			onAddQueueItem: function(fileObj){
				
				$("#selectErrorDivId").css("display", "none"); 
				var needClearQueue = false;
				
				var namePostfix = fileObj.name.substr(fileObj.name.length - 4).toLowerCase();
				if(namePostfix != ".png" && namePostfix != ".jpg"){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("注意：请选中Image文件(*.png;*.jpg)");
					needClearQueue = true;
				}
				else if(fileObj.size > maxFileSize){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("注意：文件大小不能超过20M");
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
					window.location = "validateImage.jsp?aids=" + idStr;
				}
			},
			onComplete: function(fileObj, data){
				var responseObj = cmnPcr.strToJson(data);
				var accessoryId = responseObj[0].result.ids[0];
				uploadedFileIds.push(accessoryId);
			},
			onUpload: function(filesToUpload){
				uploadedFileIds = new Array();
				if(filesToUpload == 0){ 
					msgBox.alert({info: "请点击\"选择文件...\"按钮"});
					return false;
				} 
				else{
					return true;					
				}
			}
		};
		$("#selectFileBtnId").uploadifive({ 
			'uploadScript': basePath + '/accessory/uploadFile?filterType=Image&filterValue=',//后台处理的请求 
			'buttonText':  "选择文件...",  
			'method': "post", 
			'queueID': "fileQueueDivId",
			'auto': false,
			'multi': true, 
			'fileSizeLimit': maxFileSize,
			'fileType': ["png", "jpg"],
			'queueSizeLimit': 10,
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
			$("#selectFileBtnId").uploadifive("upload"); 
			return false;
		});
	}
	else{	
		var initParam = {
			onSelect: function(event, queueId, fileObj){
				$("#selectErrorDivId").css("display", "none");
			
				if(fileObj.size > maxFileSize){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("注意：文件大小不能超过20M");
				}
			},
			onAllComplete: function(event, data){
				if(uploadedFileIds.length > 0){
					var idStr = cmnPcr.arrayToString(uploadedFileIds, "_");
					window.location = "validateImage.jsp?aids=" + idStr;		
				}
			},
			onComplete: function(event, queueId, fileObj, response, data){
				var responseObj = cmnPcr.strToJson(response);
				var accessoryId = responseObj[0].result.ids[0];
				uploadedFileIds.push(accessoryId);
			}
		};
		$("#selectFileBtnId").uploadify({
		       'uploader': uploadify + "/uploadify.swf",
		       'script': basePath + '/accessory/uploadFile',//后台处理的请求
		       'cancelImg': uploadify + "/cancel.png",
		       'buttonImg':  uploadify + "/browse.png",  
		       'method': "get",
		       'rollover': false,
		       'queueID': "fileQueueDivId",
		       'auto': false,
		       'multi': true,
		       //修改文件大小的限制  
		       'sizeLimit': maxFileSize,
		
		       //增加了文件类型的限制 modified by ls 20120905
		       'fileExt': "*.png;*.jpg;",
		       'fileDesc': "Image文件",
		
		       'simUploadLimit': 10,
		       'width': 92,
		       'height': 23, 
		       
		       'scriptData': { filterType: "Image", filterValue: ""},
		       'onError': function(event, queueID, fileObj) { 
		    	   	if(initParam.onError != undefined){
		    	   		return initParam.onError(event, queueID, fileObj);
		    	   	}
		    	   	else{
		           		return true;
		    	   	}
		       },
		       'onComplete': function(event, queueId, fileObj, response, data) {
		    	   	if(initParam.onComplete != undefined){
		    	   		return initParam.onComplete(event, queueId, fileObj, response, data);
		    	   	}
		    	   	else{
		           		return true;
		    	   	}
		       },
		       'onAllComplete': function(event, data) { 
		    	   	if(initParam.onAllComplete != undefined){
		    	   		return initParam.onAllComplete(event, data);
		    	   	}
		    	   	else{
		           		return true;
		    	   	}
		       },
		       'onSelect': function(event, queueId, fileObj) { 
		    	   	if(initParam.onSelect != undefined){
		    	   		return initParam.onSelect(event, queueId, fileObj);
		    	   	}
		    	   	else{
		           		return true;
		    	   	}
		       },
		       'onProgress ':function(event, queueId, fileObj, data){
		    	   	if(initParam.onProgress != undefined){
		    	   		return initParam.onProgress(event, queueId, fileObj, data);
		    	   	}
		    	   	else{
		           		return true;
		    	   	}
		       },
		       'onOpen':function(event, queueId, fileObj){
		    	   	if(initParam.onProgress != undefined){
		    	   		return initParam.onProgress(event, queueId, fileObj, data);
		    	   	}
		    	   	else{
		           		return true;
		    	   	}
		       }
		});
		
		$("#uploadFileBtnDivId").click(function(){ 
			if($("#selectFileBtnId").uploadifySettings("queueSize") > 0){
				$("#selectFileBtnId").uploadifyUpload();
			}
			else{
				msgBox.alert({info: "请点击\"浏览\"按钮, 选择Image文件"});
			}
			return false;
		});
	}
}; 

$(document).ready(function(){
	initUploadImagePage();
});