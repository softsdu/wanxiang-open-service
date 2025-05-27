js3CommandProcessors["setting"] = {
	toStatus: "normal",	
	icon: "/images/setting.png",
	editor: null,
	run: function(p){
		js3CommandProcessors["setting"].editor = p.editor; 
		//弹出参数框		
		p.commandJson.showSettingWindow(p); 
	},
	showSettingWindow: function(p){ 
		var thatCommandJson = p.commandJson;
		var popContainer = new PopupContainer( {
			width : 400,
			height :360,
			top : 50,
			title: "环境变量设置"
		});
		
		popContainer.show(); 
		var inputId = cmnPcr.getRandomValue(); 
		var titleId = inputId + "_title";  
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"    
		 	+ "</iframe>"  
		 	+ "</div>" 
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);  
		window.design3DPluginSettingInfo = {
			detailLevel: p.editor.object3DCreator.detailLevel,
			viewLevel: p.editor.object3DCreator.viewLevel,			
			gridVisible: p.editor.gridVisible,
			resBoxVisible: p.editor.object3DCreator.resourceBoxEdgeMaterial.visible,

			//是否显示材质渲染效果 added by ls 20240207
			materialRenderEffect: p.editor.object3DCreator.materialRenderEffect,
			
			hasShadow: p.editor.hasShadow,
			backgroundColor: p.editor.backgroundColor
		};
		$("#" + editorFrameId).attr("src", "../common/plugins/setting/setting.jsp");
		$("#" + okBtnId).click(function() {
			var parameters = $("#" + editorFrameId)[0].contentWindow.getParameters();
			if (parameters != null) {
				popContainer.close();

				//增加显示级别，重新实现rebuild逻辑 added by ls 20230403
				var needRebuild3Ds = false;				
				var editor = js3CommandProcessors["setting"].editor;
				var detailLevel = parameters.detailLevel;
				if (editor.object3DCreator.detailLevel != detailLevel) {
					editor.object3DCreator.detailLevel = detailLevel;
					needRebuild3Ds = true;
				}
				var viewLevel = parameters.viewLevel;
				if (editor.object3DCreator.viewLevel != viewLevel) {
					editor.object3DCreator.viewLevel = viewLevel;
					needRebuild3Ds = true;
				}
				if(needRebuild3Ds){
					editor.rebuildAllUnitObject3Ds();
				}

				//外部资源外框 added by ls 20230830
				var resBoxVisible = parameters.resBoxVisible;
				if (editor.object3DCreator.resourceBoxEdgeMaterial.visible != resBoxVisible) {
					editor.object3DCreator.resourceBoxEdgeMaterial.visible = resBoxVisible;
				}

				//材质渲染效果 added by ls 20240207
				var materialRenderEffect = parameters.materialRenderEffect;
				if (editor.object3DCreator.materialRenderEffect !== materialRenderEffect) {
					editor.object3DCreator.setMaterialRenderEffect(materialRenderEffect);
				}

				//是否显示网格
				var gridVisible = parameters.gridVisible;
				if (editor.gridVisible != gridVisible) {
					editor.gridVisible = gridVisible;
					editor.rebuildGridVisible(editor.componentInfo);
				}

				// //是否显示阴影
				// var hasShadow = parameters.hasShadow;
				// if (editor.hasShadow != hasShadow) {
				// 	editor.hasShadow = hasShadow;
				// 	editor.rebuildShadow();
				// }

				//背景色颜色
				var backgroundColor = parameters.backgroundColor;
				if (editor.backgroundColor != backgroundColor) {
					editor.backgroundColor = backgroundColor;
					editor.rebuildRenderBackGroudColor();
				}

			}
		});
		$("#" + cancelBtnId).click(function(){   
			popContainer.close();
		}); 
	} 
};