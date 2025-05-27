//根据图元数量count（规则驱动）的值，实例化count个改图元，其中根据unitNum设置其位置和旋转角度 added by ls 202201
js3CommandProcessors["instantiateMultiUnits"] = {
	toStatus: "normal",	 
	icon: "/images/instantiateMultiUnits.png",
	run: function(p){
		p.commandJson.instantiate(p); 
	},
	instantiate: function(p){
		var editor = p.editor; 
		var object3D = editor.selectedUnitObject3D;
		if(object3D == null){
			msgBox.alert({info: "请选择图元"});
		}
		else{
			var unitSetting = object3D.unitData;
			var unitCount = unitSetting.count;
			if(unitCount > 1 && msgBox.confirm({info: "确定要实例化吗?"})){
				//循环实例化图元
				for(var i = 0; i < unitCount; i++){
		    		var newUnitSetting = editor.cloneUnitSetting(unitSetting);
					var refComponentInfo = editor.getRefComponentInfo(newUnitSetting.code, newUnitSetting.versionNum); 

					//更新countExp、count、positionExps和rotationExps
					newUnitSetting.countExp = null;
					newUnitSetting.count = 1;
					for(var posName in newUnitSetting.positionExps){
						var posExp = newUnitSetting.positionExps[posName];
						posExp.pim = posExp.pim.replace("unitNum", i);
						posExp.js = posExp.js.replace("unitNum", i);
					}
					for(var rotName in newUnitSetting.rotationExps){
						var rotExp = newUnitSetting.rotationExps[rotName];
						rotExp.pim = rotExp.pim.replace("unitNum", i);
						rotExp.js = rotExp.js.replace("unitNum", i);
					}
					
					//构造一个新的图元，放到模型中
					var unitComProcessor = editor.object3DCreator.createJs3UnitComponentProcessor(newUnitSetting.code, newUnitSetting.versionNum);
					var parentParameters = editor.getComponentParametersForEditExp();
			    	var idAndName = editor.getNewUnitIdAndName(refComponentInfo.name + "_1", refComponentInfo.name); 
			    	newUnitSetting.id = idAndName.id;
			    	newUnitSetting.name = idAndName.name; 
			    	
					unitComProcessor.init({
						editor: editor,
						unitId: newUnitSetting.id,
						unitName: newUnitSetting.name,
						mixType: newUnitSetting.mixType,
						
						//显示级别 added by ls 20230403
						viewLevel: newUnitSetting.always,
						
						useWorldPosition: newUnitSetting.useWorldPosition,
						position: newUnitSetting.position,
						rotation: newUnitSetting.rotation,
						componentInfo: refComponentInfo,
						valueParameters: newUnitSetting.parameters,
						positionExps: newUnitSetting.positionExps,
						rotationExps: newUnitSetting.rotationExps,
						parentParameters: parentParameters
					});

					unitComProcessor.buildComponent3DObject(newUnitSetting, parentParameters, editor.afterPasteBuildObject3D);
				}
				
				editor.removeUnitObject3D(object3D, true);
			}
			else{
				msgBox.alert({info: "数量必须大于1"});
			}
		}
	} 
};