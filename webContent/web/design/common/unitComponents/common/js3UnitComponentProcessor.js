function JS3UnitComponentProcessor(){
	var thatUnitComponent = this;
	
	this.componentInfo = null; 
	this.editor = null;
	this.points = null;
	this.unitId = null;
	this.unitName = null;
	this.mixType = null;
	this.useWorldPosition = null;
	this.position = null;
	this.rotation = null;
	this.count = null;
	this.countExp = null;
	this.valueParameters = null;
	this.positionExps = null;
	this.rotationExps = null;
	this.parentParameters = null;
	this.uvs = null;
	
	//弹出窗口 added by ls 20220606
	this.popForm = null;
	//iframe的id added by ls 20220606
	this.editorFrameId = null;
 	
	this.checkCodeVersion = function(componentCode, componentVersionNum){
		if(componentCode == thatUnitComponent.componentCode && componentVersionNum == thatUnitComponent.componentVersionNum){
			return true;
		}
		else{
			return false;
		}
	}
    
    this.afterGetNewParameters = function(newValueParameters){
    	var unitSetting = {
    		code: thatUnitComponent.componentInfo.code,
    		versionNum: thatUnitComponent.componentInfo.versionNum,
    		mixType: thatUnitComponent.mixType,
    		useWorldPosition: thatUnitComponent.useWorldPosition,
			position: [thatUnitComponent.position.x, thatUnitComponent.position.y, thatUnitComponent.position.z],
			rotation: [thatUnitComponent.rotation.x, thatUnitComponent.rotation.y, thatUnitComponent.rotation.z],
			count: thatUnitComponent.count,
			countExp: thatUnitComponent.countExp,
			uvs: thatUnitComponent.uvs,
			parameters: newValueParameters,
			positionExps: thatUnitComponent.positionExps,
			rotationExps: thatUnitComponent.rotationExps
    	};
    	
    	//告诉造型服务，这是已存在的unit added by ls 20230801
    	if(thatUnitComponent.unitId != null){
    		unitSetting.id = thatUnitComponent.unitId;
    	}
			
		thatUnitComponent.buildComponent3DObject(unitSetting, thatUnitComponent.parentParameters, thatUnitComponent.afterBuildComponent3DObject);
    }
    
    this.afterBuildComponent3DObject = function(unit3DInfo){
    	if(thatUnitComponent.unitId == null){
    		thatUnitComponent.editor.addNewUnitByObject3D(unit3DInfo.object3D, unit3DInfo.unitSetting, thatUnitComponent.componentInfo, null, true);
    	}
    	else{
    		unit3DInfo.unitSetting.id = thatUnitComponent.unitId;
    		unit3DInfo.unitSetting.name = thatUnitComponent.unitName;
    		thatUnitComponent.editor.refreshUnitByObject3D(unit3DInfo.object3D, unit3DInfo.unitSetting);
    	}
    }
    
    this.buildComponent3DObject = function(unitSetting, valueParameters, afterBuildFunc){
		thatUnitComponent.editor.createObject3D(unitSetting, valueParameters, afterBuildFunc);    	 
    }
    
    this.publishUnitFile = function(publishId, unitSetting, valueParameters, afterPublishUnitFileFunc){
		thatUnitComponent.editor.publishUnitFile(publishId, unitSetting, valueParameters, afterPublishUnitFileFunc);
    }
    
    this.mm2m = function(mm){
    	return mm / 1000;
    } 
	
	this.showForm = function(p){ 
		thatUnitComponent.baseShowForm(p);
	}
	
	this.init = function(p){
    	thatUnitComponent.editor = p.editor;
    	thatUnitComponent.points = p.points;
    	thatUnitComponent.componentInfo = p.componentInfo; 
    	thatUnitComponent.position = p.position;
    	thatUnitComponent.rotation = p.rotation;
    	thatUnitComponent.count = p.count;
    	thatUnitComponent.countExp = p.countExp;
    	thatUnitComponent.unitId = p.unitId; 
    	thatUnitComponent.unitName = p.unitName;
    	thatUnitComponent.mixType = p.mixType;
    	thatUnitComponent.useWorldPosition = p.useWorldPosition;
    	thatUnitComponent.valueParameters = p.valueParameters;
    	thatUnitComponent.positionExps = p.positionExps;
    	thatUnitComponent.rotationExps = p.rotationExps;
    	thatUnitComponent.parentParameters = p.parentParameters; 
    	thatUnitComponent.uvs = p.uvs; 
	}
	
    this.baseShowForm = function(p){    	
		var popContainer = new PopupContainer( {
			width : p.formWidth,
			height : p.formHeight,
			top : 20,
			title: p.title
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
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:40px;bottom:0px;font-size:11px;text-align:right;\">"
			//错误提示窗口 修改为左下角textarea 展示 added by yay 20230628
			+ "<div name='textareaBottomInfo' style=\"position:absolute;text-align:left;font-size:14px;color:red;left:5px;top:5px;bottom:0px;right:200px;overflow-y:auto;\"></div> "
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		var parameterStr = cmnPcr.jsonToStr(thatUnitComponent.componentInfo.parameters);
		var valueParameterStr = cmnPcr.jsonToStr(thatUnitComponent.valueParameters);
		var parentParameterStr = cmnPcr.jsonToStr(thatUnitComponent.parentParameters); 
		
		//增加组件图例 added by liyh 20210825
		//参数过长，改变传递参数的方式 modified by ls 20210902
		var popUnitParameters = {
			parameters: parameterStr,
			valueParameters: valueParameterStr,
			parentParameters: parentParameterStr,
			imgId: p.imgId == null ? "" : p.imgId,
			detailLevel: thatUnitComponent.editor.object3DCreator.detailLevel,
			
			//显示级别 added by ls 20230403
			viewLevel: thatUnitComponent.editor.object3DCreator.viewLevel
		};
		window.popUnitParameters = popUnitParameters;
		
		//设置window的componentEditor为当前editor，方便子窗口调用 added by ls 20220606
		window.unitComponentProcessor = thatUnitComponent;
		
		//记录弹出的窗口 added by ls 20220606
		thatUnitComponent.popForm = popContainer;		
		thatUnitComponent.editorFrameId = editorFrameId;

		$("#" + editorFrameId).attr("src", p.pageUrl);
		
		$("#" + okBtnId).click(function(){  
			var newValueParameters = $("#" + editorFrameId)[0].contentWindow.getParameters();
			if(newValueParameters != null){   
				thatUnitComponent.afterGetNewParameters(newValueParameters);
				thatUnitComponent.editor.setStatus(js3CoreEditorStatus.normal);
				
				//关闭弹出的窗口 added by ls 20220606
				thatUnitComponent.popForm.close();  
			} 
		});
		$("#" + cancelBtnId).click(function(){  
			thatUnitComponent.editor.setStatus(js3CoreEditorStatus.normal);
			
			//关闭弹出的窗口 added by ls 20220606
			thatUnitComponent.popForm.close(); 
		});
	} 

    //选择位置坐标 added by ls 20220607
	this.selectLocation = function(p){
		thatUnitComponent.popForm.hide();
		thatUnitComponent.editor.setSelectLocationStatus({
			locationType: p.locationType,
			paramName: p.paramName,
			unitComponentProcessor: thatUnitComponent
		});						
	}
	
	//编辑2d路径 added by ls 20230109
	this.editPath2d = function(p){
		js3CommandProcessors["path2d"].run({
			eidtor: thatUnitComponent.editor,
			paramName: p.paramName,
			paramValue: p.paramValue,
			unitComponentProcessor: thatUnitComponent
		});
	}
	this.editPathClosed2d = function(p){
		js3CommandProcessors["pathClosed2d"].run({
			eidtor: thatUnitComponent.editor,
			paramName: p.paramName,
			paramValue: p.paramValue,
			unitComponentProcessor: thatUnitComponent
		});
	}
	
	//编辑3d路径 added by ls 20230109
	this.editPath3d = function(p){
		js3CommandProcessors["path3d"].run({
			eidtor: thatUnitComponent.editor,
			paramName: p.paramName,
			paramValue: p.paramValue,
			unitComponentProcessor: thatUnitComponent
		});
	}
	this.editPathClosed3d = function(p){
		js3CommandProcessors["pathClosed3d"].run({
			eidtor: thatUnitComponent.editor,
			paramName: p.paramName,
			paramValue: p.paramValue,
			unitComponentProcessor: thatUnitComponent
		});
	}

	//编辑2d路径后 added by ls 20230109
	this.afterEditPath2d = function(p){
		$("#" + thatUnitComponent.editorFrameId)[0].contentWindow.setParameterValue({
			name: p.paramName,
			value: {path: p.paramValue}
		});
	}
	this.afterEditPathClosed2d = function(p){
		$("#" + thatUnitComponent.editorFrameId)[0].contentWindow.setParameterValue({
			name: p.paramName,
			value: {path: p.paramValue}
		});
	}

	//编辑3d路径后 added by ls 20230109
	this.afterEditPath3d = function(p){
		$("#" + thatUnitComponent.editorFrameId)[0].contentWindow.setParameterValue({
			name: p.paramName,
			value: {path: p.paramValue}
		});
	}
	this.afterEditPathClosed3d = function(p){
		$("#" + thatUnitComponent.editorFrameId)[0].contentWindow.setParameterValue({
			name: p.paramName,
			value: {path: p.paramValue}
		});
	}
	
	//取消选择坐标 added by ls 20220606
	this.cancelSelectLocation = function(){
		thatUnitComponent.popForm.show();
	}

    //选择位置坐标后 added by ls 20220606
	this.afterSelectLocation = function(p){
		thatUnitComponent.popForm.show();
		var paramValue = "";
		switch(p.locationType){
			case js3ParameterType.point2D:  {
				var point = p.points[0];
				paramValue = cmnPcr.toFixed(js3CommonFunction.m2mm(point.x), 2) + "," + cmnPcr.toFixed(js3CommonFunction.m2mm(point.z), 2);
				break;
			}
			case js3ParameterType.point3D:{
				var point = p.points[0];
				paramValue = cmnPcr.toFixed(js3CommonFunction.m2mm(point.x), 2) + "," + cmnPcr.toFixed(js3CommonFunction.m2mm(point.y), 2) + "," + cmnPcr.toFixed(js3CommonFunction.m2mm(point.z), 2);
				break;
			} 
			case js3ParameterType.line2D: {
				var len = p.points.length < 2 ? p.points.length : 2;
				for(var i = 0; i < len; i++){
					if(paramValue.length != 0){
						paramValue += ";";
					} 
					var point = p.points[i];
					paramValue += cmnPcr.toFixed(js3CommonFunction.m2mm(point.x), 2) + "," + cmnPcr.toFixed(js3CommonFunction.m2mm(point.z), 2);					
				}
				break;
			}
			case js3ParameterType.line3D:{
				var len = p.points.length < 2 ? p.points.length : 2;
				for(var i = 0; i < len; i++){
					if(paramValue.length != 0){
						paramValue += ";";
					} 
					var point = p.points[i];
					paramValue += cmnPcr.toFixed(js3CommonFunction.m2mm(point.x), 2) + "," + cmnPcr.toFixed(js3CommonFunction.m2mm(point.y), 2) + "," + cmnPcr.toFixed(js3CommonFunction.m2mm(point.z), 2);					
				}
				break;
			}
			case js3ParameterType.polyline2D: {
				for(var i = 0; i < p.points.length; i++){
					if(paramValue.length != 0){
						paramValue += ";";
					} 
					var point = p.points[i];
					paramValue += cmnPcr.toFixed(js3CommonFunction.m2mm(point.x), 2) + "," + cmnPcr.toFixed(js3CommonFunction.m2mm(point.z), 2);					
				}
				break;
			}
			case js3ParameterType.polyline3D:{
				for(var i = 0; i < p.points.length; i++){
					if(paramValue.length != 0){
						paramValue += ";";
					} 
					var point = p.points[i];
					paramValue += cmnPcr.toFixed(js3CommonFunction.m2mm(point.x), 2) + "," + cmnPcr.toFixed(js3CommonFunction.m2mm(point.y), 2) + "," + cmnPcr.toFixed(js3CommonFunction.m2mm(point.z), 2);					
				}
				break;
			}
			
		} 
		$("#" + thatUnitComponent.editorFrameId)[0].contentWindow.setParameterValue({
			name: p.paramName,
			value: {points: paramValue}
		});
	}
}