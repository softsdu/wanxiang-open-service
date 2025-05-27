js3CommandProcessors["deployElement"] = {
	toStatus: "normal",	 
	run: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;
		if(thatCE.selectedUnitObject3D == null){
			msgBox.alert({info: "请先选中部署区域."});
		}
		else{
			//弹出参数框		
			thatCommandJson.showDeployParameterWindow(p);
		}
	},
	showDeployParameterWindow: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;
		var popContainer = new PopupContainer( {
			width : 800 ,
			height :500,
			top : 50,
			title: "部署设置"
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
		$("#" + editorFrameId).attr("src", "./plugins/deployElement/deployElement.jsp");
		$("#" + okBtnId).click(function(){
			var parameters = $("#" + editorFrameId)[0].contentWindow.getParameters();
			if(parameters != null){
				var componentCode = parameters.componentCode;
				var versionNum = parameters.versionNum;
				var imgId = parameters.imgId;
	
				var deployPoints = thatCommandJson.getDeployPoints({
					parameters: parameters,
					editor: thatCE,
					commandJson: thatCommandJson
				});
				
				if(deployPoints.length == 0){
					msgBox.alert({info: "只可部署0个组件, 请重新设置参数."});
				}
				else{
					if(msgBox.confirm({info: "可部署个" + deployPoints.length + "组件, 确认部署吗?"})){
						var commandJson = {
							toStatus: "placeLimit3DPoints",		
							pointCount: 1,
							componentCode: componentCode,
							componentVersionNum: versionNum, 
							imgId: imgId
						};							
				    	var componentKey = componentCode + "_" + versionNum;
				    	var refComponentInfo = thatCE.componentInfo.refComponents[componentKey]; 
				    	if(refComponentInfo == null){
				    		thatCE.loadRefComponentBeforeCreateNewUnits(commandJson, deployPoints);    	
				    	}
				    	else{
				    		thatCE.runCommandByPointsMulti(deployPoints, commandJson); 
				    	}	
						popContainer.close();
					}
				}	    	
			}
		});
		$("#" + cancelBtnId).click(function(){   
			popContainer.close();
		}); 
	},		
	getDeployPoints: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;
		var parameters = p.parameters;
    	var deployRaycaster = new THREE.Raycaster();
    	deployRaycaster.linePrecision = 3; 
		var direction = new THREE.Vector3(0, -1, 0);
		var districtObject3D = thatCE.selectedUnitObject3D;
        var box = new THREE.Box3().setFromObject(districtObject3D, true);
        var x = box.min.x + parameters.startX;
        var y = box.max.y + parameters.startY;
        var z = box.min.z + parameters.startZ; 
        var allPoints = new Array();
        for(var x = box.min.x + parameters.startX; x <= box.max.x; x = x + parameters.spaceX){
            for(var z = box.min.z + parameters.startZ; z <= box.max.z; z = z + parameters.spaceZ){
        		var position = {x: x, y: y, z: z};
        		deployRaycaster.set(position, direction);
                var intersects = deployRaycaster.intersectObjects([districtObject3D], true);
                var gotDistrictObject3D = false;
            	for(var i = 0; i < intersects.length; i++){
                	var intersect = intersects[i];
                	if(thatCE.getUnitObject(intersect.object) == districtObject3D){
                		gotDistrictObject3D = true;
                		break;
                	}
            	}
            	if(gotDistrictObject3D) {
            		allPoints.push(position);
                }        
            }
        }
        return allPoints;
	}	 
};