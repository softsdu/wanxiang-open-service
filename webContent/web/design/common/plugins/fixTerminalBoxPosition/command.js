import HitDetection from "common/js/js3HitDetection.js";

//线盒避让
js3CommandProcessors["fixTerminalBoxPosition"] = {
	toStatus: "normal",	 
	icon: "/images/fixTerminalBoxPosition.png",
	editor: null,
	run: function(p){
		js3CommandProcessors["fixTerminalBoxPosition"].editor = p.editor;
		p.commandJson.fixPosition(p); 
	},
	fixPosition: function(p){
		var editor = p.editor; 
		var thatCommandJson = p.commandJson;
		var mainObject3D = editor.selectedUnitObject3D;
		if(mainObject3D == null){
			msgBox.alert({info: "请选择线盒"});
		}
		else{			
			var unitSetting = mainObject3D.unitData; 
			if(unitSetting){
				if(!unitSetting.code.startWith(js3SysCatAndCom.architecture.terminalBoxCategoryCodePre)){
					msgBox.alert({info: "请选择线盒"});
				}
				else{
					var steelBarObject3Ds = new Array();
			        for(var i = 0; i < editor.scene.children.length; i++){
			        	var object3D = editor.scene.children[i];
			        	if(object3D.unitData != null){ 
			        		if(object3D.unitData.code.startWith(js3SysCatAndCom.architecture.steelBarCategoryCodePre)){
			        			steelBarObject3Ds.push(object3D);
			        		} 
			        	}
			        }

					var wallObject3Ds = new Array();
			        for(var i = 0; i < editor.scene.children.length; i++){
			        	var object3D = editor.scene.children[i];
			        	if(object3D.unitData != null){ 
			        		if(object3D.unitData.code.startWith(js3SysCatAndCom.architecture.wallCategoryCodePre)){
			        			wallObject3Ds.push(object3D);
			        		} 
			        	}
			        }
			        
			        if(steelBarObject3Ds.length == 0){
			        	msgBox.alert({info: "模型中没有钢筋"});
			        }
			        else{
			        	
			        	var hitDetection = new HitDetection();
			        	var hitSteelbarObject3Ds = hitDetection.processHitDetection({
			        		fixNum: 4,
				        	mainObject3D: mainObject3D,
				        	object3Ds: steelBarObject3Ds
			        	});
			        	if(hitSteelbarObject3Ds.length == 0){
							msgBox.alert({info: "没有发现碰撞"});
			        	}
			        	else{

				        	var hitWallObject3Ds = hitDetection.processHitDetection({
				        		fixNum: 4,
					        	mainObject3D: mainObject3D,
					        	object3Ds: wallObject3Ds
				        	});
			        		if(hitWallObject3Ds.length == 0){
								msgBox.alert({info: "线盒不属于任何墙"});
			        		}
			        		else if(hitWallObject3Ds.length > 1){
								msgBox.alert({info: "线盒不能同时属于两面墙"});
			        		}
			        		else{
								//msgBox.alert({info: "线盒与" + hitObject3Ds.length + "根钢筋发生碰撞"});
				        		thatCommandJson.showFixWindow({
				        			editor: editor,
				        			commandJson: thatCommandJson,
				        			mainObject3D: mainObject3D,
				        			wallObject3D: hitWallObject3Ds[0],
				        			steelbarObject3Ds: hitSteelbarObject3Ds
				        		});
				        	}
			        	}
			        }
				}
			}
			else{
				msgBox.alert({info: "数量必须大于1"});
			}
		}
	},
	showFixWindow: function(p){ 
		var thatCommandJson = p.commandJson;
		var popContainer = new PopupContainer( {
			width: 500,
			height: 360,
			top: 50,
			title: "线盒碰撞躲避设置"
		});
		
		popContainer.show(); 
		var inputId = cmnPcr.getRandomValue(); 
		var titleId = inputId + "_title";  
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:10px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"    
		 	+ "</iframe>"  
		 	+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);  
		$("#" + editorFrameId).attr("src", "../common/plugins/fixTerminalBoxPosition/comUnitTree.jsp");
		
		var steelbarObject3DIds = new Array();
		for(var i = 0; i < p.steelbarObject3Ds.length; i++){
			steelbarObject3DIds.push(p.steelbarObject3Ds[i].unitData.id);
		}
		
		window.design3DPluginFixTerminalBoxPosition = {
			editor: p.editor,
			boxObject3DId: p.mainObject3D.unitData.id,
			wallObject3DId: p.wallObject3D.unitData.id,
			steelbarObject3DIds: steelbarObject3DIds	
		};
	} 
};