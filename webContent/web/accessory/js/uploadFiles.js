//上传文件
//重构 modified by ls 20220607
function initUploadFilesPage(p){
	var that = this;
	var uploadedFileIds = new Array();
	var maxFileSize = 1024 * 1024 * 50; 
	
	that.afterAllCompleteFunc = p.afterAllCompleteFunc;
	
	if(cmnPcr.checkHtml5()){
		var initParam = {
			onAddQueueItem: function(fileObj){
				
				$("#selectErrorDivId").css("display", "none"); 
				var needClearQueue = false;
				
				var namePostfix = fileObj.name.substr(fileObj.name.length - 4);
//				if(namePostfix != ".png" && namePostfix != ".gif" && namePostfix != ".jpg"){
//					$("#selectErrorDivId").css("display", "block");
//					$("#selectErrorDivId").text("注意：请选中文件");
//					needClearQueue = true;
//				}
//				else 
					if(fileObj.size > maxFileSize){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("注意：文件大小不能超过50M");
					needClearQueue = true;
				}
				if(needClearQueue){
					setTimeout(function(){
						$("#selectFilesBtnId").uploadifive("clearQueue");
					}, 100);
				}
			},
			onAllComplete: function(event, data){
				if(uploadedFileIds.length > 0){
					if(that.afterAllCompleteFunc != null){
						that.afterAllCompleteFunc(uploadedFileIds);
					}
				}
				return true;
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
		$("#selectFilesBtnId").uploadifive({ 
			'uploadScript': basePath + '/accessory/uploadFile?filterType=KGraphImage&filterValue=',//后台处理的请求 
			'buttonText':  "选择文件...",  
			'method': "post", 
			'queueID': "fileQueueDivId",
			'auto': false,
			'multi': true, 
			'fileSizeLimit': maxFileSize,
			'fileType': ["png", "gif", "jpg"], 
			'queueSizeLimit': 50,
			'width': 92,
			'height': 36,  
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
		
		$("#uploadFilesBtnDivId").click(function(){
			$("#selectFilesBtnId").uploadifive("upload"); 
			return false;
		});
	}
	else{	
		var initParam = {
			onSelect: function(event, queueId, fileObj){
				$("#selectErrorDivId").css("display", "none");
			
				if(fileObj.size > maxFileSize){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("注意：文件大小不能超过50M");
				}
			},
			onAllComplete: function(event, data){
				if(that.afterAllCompleteFunc != null){
					that.afterAllCompleteFunc(uploadedFileIds);
				}
				return true;
			},
			onComplete: function(event, queueId, fileObj, response, data){
				var responseObj = cmnPcr.strToJson(response);
				var accessoryId = responseObj[0].result.ids[0];
				uploadedFileIds.push(accessoryId);
			}
		};
		$("#selectFilesBtnId").uploadify({
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
		       'fileExt': "",
		       'fileDesc': "文件",
		
		       'simUploadLimit': 50,
		       'width': 92,
		       'height': 36, 
		       
		       'scriptData': { filterType: "", filterValue: ""},
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
		
		$("#uploadFilesBtnDivId").click(function(){ 
			if($("#selectFilesBtnId").uploadifySettings("queueSize") > 0){
				$("#selectFilesBtnId").uploadifyUpload();
			}
			else{
				msgBox.alert({info: "请点击\"浏览\"按钮, 选择文件"});
			}
			return false;
		});
	}
};

var ids = null;
var accessoryGrid = null;

//更换样式 modified by ls 202203
function refreshAccessoryTabName(){  
}

function addIdsAfterUploadComplete(newIds){
	for(var i = 0; i < newIds.length; i++){
		ids.push(newIds[i]);
	}
	window.parent.tempAccessoryIds = ids;
}

function removeIdAfterDelete(id){
	var tempIds = new Array();
	for(var i = 0; i < ids.length; i++){
		if(ids[i] != id){
			tempIds.push(ids[i]);
		}
	}
	ids = tempIds;
	window.parent.tempAccessoryIds = ids;
}

function getAccessoryFilterClause(){
	var inIdStrs = new Array();
	for(var i = 0; i < ids.length; i++){
		inIdStrs.push("'" + ids[i] + "'");
	}
	var inIdFullStr = ids.length == 0 ? "''" : cmnPcr.arrayToString(inIdStrs, ",");
	var whereClause = [{parttype:"clause", clause:"id in (" + inIdFullStr + ")"}];
	return whereClause;
}
 
var operateColumnName = "operateColumn";
		 
function getLinkHtml(idValue){
	var row = accessoryGrid.datatable.getRowByIdField(idValue, "id"); 
	var fileType = row.getValue("filetype");
	
	//删除
	var html = "<div style=\"position:relative;height:35px;width:100%;\"><a href=\"#\" target=\"blank\" style=\"position:absolute;top:10px;left:15px;\" onclick=\"return deleteAccessoryRow('" + idValue + "')\">删除</a>&nbsp;&nbsp;";
	//下载
	html += "<a href=\"#\" target=\"blank\" style=\"position:absolute;top:10px;left:55px;\" onclick=\"return downloadAccessory('" + idValue + "')\">下载</a>&nbsp;";
	//查看：目前仅限图片类型；
	if(fileType == "png" || fileType == "gif" || fileType == "jpg" || fileType == "jpeg"){
		var imgUrl = "../../accessory/getImage?id=" + idValue;
		html += "<a href=\"" + imgUrl + "\" target=\"blank\" style=\"position:absolute;top:10px;left:95px;\">查看</a>&nbsp;&nbsp;";
	}
	return html;
}

//下载附件 by liyh 20190617
function downloadAccessory(idValue){
	var row = accessoryGrid.datatable.getRowByIdField(idValue, "id");
	var downloadPageUrl = basePath + "/accessoryNcpService/downloadAccessory.action?accessoryId=" + idValue; 
	window.open(downloadPageUrl);
	return false;
}
 
function getCellContainerId(rowId){
	return operateColumnName + "_" + rowId;
}
 
function deleteAccessoryRow(idValue){
	var row = accessoryGrid.datatable.getRowByIdField(idValue, "id");
	accessoryGrid.selectRowInGrid(row.rowId);
	accessoryGrid.doDelete({});
	removeIdAfterDelete(idValue);
	refreshAccessoryTabName();
	return false;
}
 
function previewAccessory(idValue){
	var row = accessoryGrid.datatable.getRowByIdField(idValue, "id"); 
	alert("idValue: " +row.getValue("id"));
	return false;
}

//更改获取返回值的方式 modified by ls 202203
function getAccessoryIds(){
	var allRowsIdValues = new Array();
	for(var rowId in accessoryGrid.datatable.allRows()){
		var row = accessoryGrid.datatable.rows(rowId);
		allRowsIdValues.push(row.getValue("id"));
	}
	return allRowsIdValues;	
}

$(document).ready(function(){

	ids = window.parent.tempAccessoryIds; 
	
	refreshAccessoryTabName();
		
	initUploadFilesPage({
		afterAllCompleteFunc: function(newIds){
			addIdsAfterUploadComplete(newIds);
			refreshAccessoryTabName();
			accessoryGrid.sysWhere = getAccessoryFilterClause();
			accessoryGrid.doPage({ pageNumber:1 });
		}
	});

	//从模型中增加操作按钮列
	viewModels.d_Accessory.colModel.push({name:operateColumnName,
		label:"操作",
		width:130,
		hidden:false,
		sortable:false, 
		search:false,
		resizable:true,
		editable:false,
		canEdit:false,
		formatter:function(cellvalue, options, rowObject){
			var html = getLinkHtml(rowObject.id);
			var containerId = getCellContainerId(rowObject.id);
			return "<div id=\"" + containerId + "\" style=\"width:100%;height:100%;\">" + html + "</div>";
		}
	});
		
	var p = { 
		containerId:"fileListGridContainerId",   
		multiselect:false,  
		dataModel:dataModels.d_Accessory,
		onePageRowCount:1000,
		isRefreshAfterSave:false,
		viewModel:viewModels.d_Accessory,
		sysWhere: getAccessoryFilterClause()
	};
	accessoryGrid = new NcpGrid(p); 
	accessoryGrid.show();
	
	accessoryGrid.baseDelete = function(param){
		accessoryGrid.processDeleteData(param);
		accessoryGrid.afterBaseDelete(param);
		accessoryGrid.afterDoDelete(param);
		
	}
});  