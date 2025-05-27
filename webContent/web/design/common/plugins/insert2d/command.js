js3CommandProcessors["insert2d"] = {
	toStatus: "normal",
	icon: "/images/insert2d.png",
	editor: null,
	run: function(p){ 
		p.commandJson.editor = p.editor;
		p.commandJson.showComponentListDialog(p, { 
			afterFunc: function(p){
				js3CommandProcessors["insert2d"].editor.runAddUnitCommondWithoutPosition(p);
			}
		}); 
	},
	showComponentListDialog: function(p, params){
		var popContainer = new PopupContainer( {
			width : 933,
			height : 700,
			top : 50,
			title: "选择图元"
		});
		
		popContainer.show();
		window.popInitParam = {
			closeWin: function(p){ 	
				var componentCode = null;
				var componentVersionNum = null;
				
				//增加组件图例  added by liyh 20210825
				var componentImgId = null;
				
				if(p.selectedRows != null){
					for(var rowId in p.selectedRows){
						var row = p.selectedRows[rowId];
						componentCode = row.code;
						componentVersionNum = row.versionnum;
						componentImgId = row.imgid;
					}
				}
				if(componentCode != null){
					params.afterFunc({
						code: componentCode,
						versionNum: componentVersionNum,
						imgId: componentImgId
					});
				}
				popContainer.close();
			} 
		};
	
		var frameId = cmnPcr.getRandomValue();  
		var buttonContainerId = frameId + "_buttonContainer";
		var okBtnId = frameId + "_ok";
		var cancelBtnId = frameId + "_cancel";
		var pageUrl = basePath + "/web/pop/view_mdl_Component2d.jsp";

		//增加判断  支持adim_request.jsp跳转后  弹出图元页面 嵌套adim的页面
		var AdimSysInfo =null;
		var AdimSysInfoStr = sessionStorage.getItem('AdimSysInfo');
		if (AdimSysInfoStr != null) {
			AdimSysInfo=JSON.parse(AdimSysInfoStr);
			var param="?";
			if(AdimSysInfo.tenantId){
				param+="tenantId="+AdimSysInfo.tenantId;
			}
			if(AdimSysInfo.type){
				param+="&type="+AdimSysInfo.type;
			}
			// pageUrl='http://192.168.60.75:9080/design/component/select?tenantId='+otherSysInfo.tenantId;
			pageUrl=AdimSysInfo.baseUrl+'/design/component/select'+param;
		}


		var innerHtml = "<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:0px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + frameId + "\" src=\"" + pageUrl + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"/>"
		 	+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml); 
	}
};