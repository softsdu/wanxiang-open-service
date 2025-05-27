//添加点标注 added by ls 20220606
js3CommandProcessors["pointTag"] = {
	toStatus: "normal",	
	componentCode: "9601-01",
	componentVersionNum: "1.0",
	icon: "/images/pointTag.png",
	run: function(p){ 
		var editor = p.editor;
		var commandProcessor = js3CommandProcessors["pointTag"];
		var valueParameters = {}; 
		var refComponentInfo = editor.getRefComponentInfo(commandProcessor.componentCode, commandProcessor.componentVersionNum);
		var unitComProcessor = editor.object3DCreator.createJs3UnitComponentProcessor(commandProcessor.componentCode, commandProcessor.componentVersionNum);
		var parentParameters = editor.getComponentParametersForEditExp();
		unitComProcessor.init({
			editor: editor, 
			unitId: null, 
			mixType: js3UnitMixType.none,
			
			//显示级别 added by ls 20230403
			viewLevel: js3ViewLevelType.always,
			
			useWorldPosition: true,
			position: {x: 0, y: 0, z: 0},
			positions: null,
			rotation: {x: 0, y: 0, z: 0},
			componentInfo: refComponentInfo,
			valueParameters: valueParameters,
			positionExps: {},
			rotationExps: {},
			parentParameters: parentParameters				
		});
		
		var refComponentParameterCount = 0;
		for(var paramName in refComponentInfo.parameters){
			refComponentParameterCount++;
		}
		
		if(refComponentParameterCount == 0){
			unitComProcessor.afterGetNewParameters({});
		}
		else{			
			unitComProcessor.showForm({
				formWidth: js3RefComponentParameterEditFormSetting.formWidth,
				formHeight: js3RefComponentParameterEditFormSetting.formHeight,
				title: refComponentInfo.name + " (" + refComponentInfo.code + ", " + refComponentInfo.versionNum + ")",
				pageUrl: js3RefComponentParameterEditFormSetting.pageUrl, 
				imgId:commandProcessor.imgId == null ? "" : commandProcessor.imgId
			});
		}
	} 
};