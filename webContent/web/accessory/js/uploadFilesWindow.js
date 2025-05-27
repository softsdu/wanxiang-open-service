//上传窗口
//重构 modified by ls 20220607
function UploadFilesWindow(){
	var thatUploadWin = this;  
	//显示
	this.show = function(p){
		var idStr = p.idStr;
		var ids = null;
		if(idStr == null || idStr.length == 0){
			ids = new Array();
		}
		else{
			ids = idStr.split(",");
		}
		window.tempAccessoryIds = ids;
		thatUploadWin.showPageDialog({
			idValue: p.idValue,
			tableName: p.tableName,
			fieldName: p.fieldName,
			title: "附件",
			width : p.width == null ? 800 : p.width ,
			height : p.height == null ? 500 : p.height,
			type: "innerPage",
			pageUrl: p.pageUrl,
			okFunction: function(result){
				var ids = window.tempAccessoryIds;				 
				var idStr = cmnPcr.arrayToString(ids, ",");
				p.afterOKFunction(idStr);
				result.closeWin();
			}
		});
	}  
	
	//上传且确定后，更新业务表 modified by ls 202203
	this.updateTableFileIds = function(tableName, fieldName, idValue, fileIds, succeedFunction){
		 var requestParam = {
			 idValue: idValue, 
			 tableName: tableName, 
			 fieldName: fieldName,
			 fileIds: cmnPcr.arrayToString(fileIds, ",") 
		 }; 
		 serverAccess.request({
			 serviceName:"accessoryNcpService", 
			 funcName:"saveAccessoryIdStrToDB",
			 args:{
				 requestParam:cmnPcr.jsonToStr(requestParam)
			 },  
			 successFunc:function(obj){  
				 succeedFunction();
			 }
		 }); 
	}

	this.showPageDialog = function(p){ 
		var popContainer = new PopupContainer( {
			width : p.width,
			height : p.height,
			top : 50,
			title: p.title
		});
		
		popContainer.show();

		var frameId = cmnPcr.getRandomValue();
		var titleId = frameId + "_title";
		var textId = frameId + "_text";
		var buttonContainerId = frameId + "_buttonContainer";
		var okBtnId = frameId + "_ok";
		var cancelBtnId = frameId + "_cancel";
		var innerHtml = "<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + frameId + "\" src=\"" + p.pageUrl + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\">"
			+ "</iframe>"
		 	+ "</div>" 
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;text-align:right;\"><input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:80px;height:28px;margin-top:5px;\" />&nbsp;&nbsp;<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:80px;height:28px;margin-top:10px;margin-right:10px;\" /></div>";
		$("#" + popContainer.containerId).html(innerHtml);
		$("#" + titleId).text(p.title); 
		$("#" + okBtnId).click(function(){  
			//更改获取返回值的方式 modified by ls 202203
			var ids = $("#" + frameId)[0].contentWindow.getAccessoryIds();	
			thatUploadWin.updateTableFileIds(p.tableName, p.fieldName, p.idValue, ids, function(){
				p.okFunction({ 
					closeWin : function(){
						popContainer.close();
					}
				}); 	
			});
				
		});
		$("#" + cancelBtnId).click(function(){ 
			var succeed = p.cancelFunction == null || p.cancelFunction({text : text});
			if(succeed){
				popContainer.close();
			}					
		});
	}
}