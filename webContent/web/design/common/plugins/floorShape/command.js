js3CommandProcessors["floorShape"] = {
	toStatus: "normal",	 
	editor: null,
	run: function(p){
		js3CommandProcessors["floorShape"].editor = p.editor; 
		var thatCommandJson = p.commandJson;
		var unitObject3D = p.editor.selectedUnitObject3D;
		if(unitObject3D != null && unitObject3D.unitData.code.startWith("101019")){ //101019是房间类型的组件
			var polygonStr = thatCommandJson.getRoomPolygon(p);
			p.polygonStr = polygonStr;
			thatCommandJson.showFloorShapeWindow(p);
		}
		else{
			msgBox.alert({info: "请先选中房间区域."});
		}
	},
	showFloorShapeWindow: function(p){ 
		var thatCommandJson = p.commandJson;
		var popContainer = new PopupContainer( {
			width : 800 ,
			height :600,
			top : 50,
			title: "地板设置"
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
		window.floorShapeInfo = {
			points: p.editor.getAllPointCtrlInfoArray()
		};
		$("#" + editorFrameId).attr("src", "./plugins/floorShape/floorShape.jsp");
		$("#" + okBtnId).click(function(){
			var parameters = $("#" + editorFrameId)[0].contentWindow.getParameters();
			if(parameters != null){
				var componentCode = parameters.componentCode;
				if(!componentCode.startWith("101017")){
					//选中的组件不是地板
					msgBox.alert({info: "请选择正确的地板款式"});
				}
				else{
					var editor = js3CommandProcessors["floorShape"].editor;

			        var box = new THREE.Box3().setFromObject(editor.selectedUnitObject3D, true); 
			        var polygon = editor.selectedUnitObject3D.unitData.parameters["polygon"].value;
					var requestParam = {
						shapeType:"floor", 
						detailLevel: editor.object3DCreator.detailLevel,
						//增加显示级别 added by ls 20230403
						viewLevel: editor.object3DCreator.viewLevel,
						parameter:{
							polygon: polygon,
							componentCode: componentCode,
							versionNum: parameters.versionNum,
							startPoint: parameters.startPointValue,
							layoutType: parameters.layoutType,
							directionType: parameters.directionType,
							bottomYValue: js3CommonFunction.m2mm(box.min.y),
							ignoreDistance: parameters.ignoreDistance
						}
					};

					serverAccess.request({
						serviceName:"flatShapeNcpService",
						funcName:"generateShape",  
					    args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
						successFunc: function(obj) { 
							var editor = js3CommandProcessors["floorShape"].editor;
							js3CommandProcessors["floorShape"].addNewObject3DsToScene(obj.result.shapeResult, editor);
							popContainer.close();
						},
						failFunc: function(obj) { 
							msgBox.error({title:"提示", info: obj.message}); 
						}
					});
				} 
			}
		});
		$("#" + cancelBtnId).click(function(){   
			popContainer.close();
		}); 
	},		
	getRoomPolygon: function(p){ 
		var thatCommandJson = p.commandJson; 
		var roomObject3D = p.editor.selectedUnitObject3D;
		var polygonStr = roomObject3D.unitData.parameters["polygon"]; 
		return polygonStr;
	},
	addNewObject3DsToScene: function(shapeResult, editor){
		var refComponentJsons = shapeResult.refComponents;
		for(var i = 0; i < refComponentJsons.length; i++){
			var refComponentJson = refComponentJsons[i];
			editor.addRefComponentToEditor(refComponentJson);
		}		
		
		var offKey2CacheObj = {};
		for(var offKey in shapeResult.offs){
			var offJson = shapeResult.offs[offKey];

			var refComponentInfo = editor.getRefComponentInfo(offJson.property.code, offJson.property.versionNum); 
			
			var object3D = editor.object3DCreator.offToObject3D(offJson.geo);
			editor.object3DCreator.moveToCenter(object3D);
	    	offKey2CacheObj[offKey] = {
				object3D: object3D,
				refComponentInfo: refComponentInfo,
				parameters: offJson.property.parameters
			};
		}
		 
		for(var i = 0; i < shapeResult.units.length; i++){
			var unitJson = shapeResult.units[i];
			var offCacheObj = offKey2CacheObj[unitJson.offKey];
			var refComponentInfo = offCacheObj.refComponentInfo;
			  
	    	var idAndName = editor.getNewUnitIdAndName(refComponentInfo.name + "_" + (i + 1), refComponentInfo.name); 

 	    	var parameters = {};
	    	for(var j = 0; j < offCacheObj.parameters.length; j++){
	    		var param = offCacheObj.parameters[j];
	    		parameters[param.name] ={
	    			value: param.value
	    		};
	    	}
	    	
	    	var unitSetting = {
					id: idAndName.id,
					name: idAndName.name,
					code: refComponentInfo.code, 
					versionNum: refComponentInfo.versionNum,
					mixType: js3UnitMixType.none,
					
					//显示级别 added by ls 202030403
					viewLevel: jjs3ViewLevelType.always,
					
					useWorldPosition: false,
					position: unitJson.position,
					rotation: unitJson.rotation,
					count: 1,
					countExp: null,
					materials: [],
					parameters: parameters,
					positionExps: {},
					uvs: null
	    	};

			editor.addNewUnitObject3DByUser({
				object3D: js3CommonFunction.cloneObject3D(offCacheObj.object3D),
				unitSetting: unitSetting
			});
		}
	}
};