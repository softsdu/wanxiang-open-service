var mdlFunction = { 
	add: function(keyName, position, rotation, afterAddFunc){ 
		core.getInsertComponentFileByKey({
			keyName: keyName,
			afterFunc: function(componentInfo, message){
				if(componentInfo == null){
					core.showCmdInfos([message]);
				}
				else{
					var axisPosition = {
						x: position.x / core.valueMultiply,
						y: position.z / core.valueMultiply,
						z: position.y / core.valueMultiply
					};
					
					var axisRotation = null;
					if(rotation == null){
						axisRotation = [
							-core.pi / 2,
							0,
							0
						];
					} 
					else{
						axisRotation = [
							core.pi * rotation.x / 180 - core.pi / 2,
							core.pi * rotation.y / 180,
							core.pi * rotation.z / 180
						];
					}
			    	core.addNewComponent(componentInfo, componentInfo.name + "_1", axisPosition, axisRotation, function(componentId){
			    		var object3D = core.getObject3DByComponentId(componentId);
			    		core.showCmdInfos(["成功创建构件: " + object3D.modelData.name]);
			    		if(afterAddFunc != null){
				    		afterAddFunc(componentId);
			    		}
			    	});  
				}
			}
		});
		return null;
	},
	addArray: function(keyName, startPosition, endPosition, rotation, spanDistance, afterAddFunc){ 
		core.getInsertComponentFileByKey({
			keyName: keyName,
			afterFunc: function(componentInfo, message){
				if(componentInfo == null){
					core.showCmdInfos([message]);
				}
				else{
					var axisStartPosition = {
							x: startPosition.x / core.valueMultiply,
							y: startPosition.z / core.valueMultiply,
							z: startPosition.y / core.valueMultiply
						};
					var axisEndPosition = {
							x: endPosition.x / core.valueMultiply,
							y: endPosition.z / core.valueMultiply,
							z: endPosition.y / core.valueMultiply
						};
					
					var axisRotation = null;
					if(rotation == null){
						axisRotation = [
							-core.pi / 2,
							0,
							0
						];
					} 
					else{
						axisRotation = [
							core.pi * rotation.x / 180 - core.pi / 2,
							core.pi * rotation.y / 180,
							core.pi * rotation.z / 180
						];
					}
					var axisSpanDistance = spanDistance == null ? 0 : spanDistance / core.valueMultiply;
			    	core.addNewComponents(componentInfo, axisStartPosition, axisEndPosition, axisRotation, axisSpanDistance, function(componentIds){
			    		var componentNames = [];
			    		for(var i = 0; i < componentIds.length; i++){
			    			var componentId = componentIds[i];
				    		var object3D = core.getObject3DByComponentId(componentId);
			    			componentNames.push(object3D.modelData.name);
			    		}
			    		core.showCmdInfos(["成功创建构件(" + componentNames.length + "): " + cmnPcr.jsonToStr(componentNames)]);
			    		if(afterAddFunc != null){
				    		afterAddFunc(componentIds);
			    		}
			    	});  
				}
			}
		});
		return null;
	},
	point: function(x, y, z){
		return {
			x: x,
			y: y,
			z: z == null ? 0 : z
		}
	},
	rotation: function(x, y, z){
		return {
			x: x,
			y: y,
			z: z
		}
	},
	rotationZ: function(z){
		return {
			x: 0,
			y: 0,
			z: z
		}
	},
	select: function(componentName){
		core.selectModelObjectByName(componentName);
	},
	getPointCenter:function(componentName){
		var object3D = null;
		if(componentName != null){
			object3D = core.getObject3DByUnitName(componentName);
			if(object3D == null){
				throw new Error("没有名为'" + componentName + "'的构件");
			}
		}
		else{
			object3D = core.selectedComponentObject3D;
			if(object3D == null){
				throw new Error("没有被选中的构件");
			}
		} 
		var otherValues = core.getOtherPropertyValues(object3D);
		var retultValues = {
			X: core.getDisplayValueStr(otherValues.centerX),
			Y: core.getDisplayValueStr(otherValues.centerZ),
			Z: core.getDisplayValueStr(otherValues.centerY)
		};
		return retultValues;
	},
	getRotation:function(componentName){
		var object3D = null;
		if(componentName != null){
			object3D = core.getObject3DByUnitName(componentName);
			if(object3D == null){
				throw new Error("没有名为'" + componentName + "'的构件");
			}
		}
		else{
			object3D = core.selectedComponentObject3D;
			if(object3D == null){
				throw new Error("没有被选中的构件");
			}
		} 
		
		var rotation = object3D.rotation;  
		var retultValues = {
			X: core.getRotationValueStr(rotation.x+ core.pi / 2, 3),
			Y: core.getRotationValueStr(rotation.y, 3),
			Z: core.getRotationValueStr(rotation.z, 3)
		};
		return retultValues;
	},
	getSize:function(componentName){
		var object3D = null;
		if(componentName != null){
			object3D = core.getObject3DByUnitName(componentName);
			if(object3D == null){
				throw new Error("没有名为'" + componentName + "'的构件");
			}
		}
		else{
			object3D = core.selectedComponentObject3D;
			if(object3D == null){
				throw new Error("没有被选中的构件");
			}
		} 
		var otherValues = core.getOtherPropertyValues(object3D);
		var retultValues = {
			X: core.getDisplayValueStr(otherValues.lenX),
			Y: core.getDisplayValueStr(otherValues.lenZ),
			Z: core.getDisplayValueStr(otherValues.lenY)
		};
		return retultValues;
	},
	getPointMin:function(componentName){
		var object3D = null;
		if(componentName != null){
			object3D = core.getObject3DByUnitName(componentName);
			if(object3D == null){
				throw new Error("没有名为'" + componentName + "'的构件");
			}
		}
		else{
			object3D = core.selectedComponentObject3D;
			if(object3D == null){
				throw new Error("没有被选中的构件");
			}
		} 
		var otherValues = core.getOtherPropertyValues(object3D);
		var retultValues = {
			X: core.getDisplayValueStr(otherValues.minX),
			Y: core.getDisplayValueStr(otherValues.minZ),
			Z: core.getDisplayValueStr(otherValues.minY)
		};
		return retultValues;
	},
	getPointMax:function(componentName){
		var object3D = null;
		if(componentName != null){
			object3D = core.getObject3DByUnitName(componentName);
			if(object3D == null){
				throw new Error("没有名为'" + componentName + "'的构件");
			}
		}
		else{
			object3D = core.selectedComponentObject3D;
			if(object3D == null){
				throw new Error("没有被选中的构件");
			}
		} 
		var otherValues = core.getOtherPropertyValues(object3D);
		var retultValues = {
			X: core.getDisplayValueStr(otherValues.maxX),
			Y: core.getDisplayValueStr(otherValues.maxZ),
			Z: core.getDisplayValueStr(otherValues.maxY)
		};
		return retultValues;
	},
	move: function(point){
		var object3D = core.selectedComponentObject3D;
		if(object3D == null){
			throw new Error("没有被选中的构件");
		}
		else{
			var otherValues = core.getOtherPropertyValues(object3D);
			var newPos = [
				point.x / core.valueMultiply,
				point.z / core.valueMultiply + otherValues.lenY / 2,
				point.y / core.valueMultiply
			];
	       	object3D.position.set(newPos[0], newPos[1], newPos[2]); 
	       	core.transformControl.attach(object3D);
	       	core.refreshComponentPropertyValues(object3D);
		}
	},
	rotate: function(rot){
		var object3D = core.selectedComponentObject3D;
		if(object3D == null){
			throw new Error("没有被选中的构件");
		}
		else{ 
			var newRot = [ 
				core.pi * rot.x / 180 - core.pi / 2,
				core.pi * rot.y / 180,
				core.pi * rot.z / 180
			];			
	       	object3D.rotation.set(newRot[0], newRot[1], newRot[2]); 
	       	core.transformControl.attach(object3D);
	       	core.refreshComponentPropertyValues(object3D);
		}
	},
	remove: function(){
		var object3D = core.selectedComponentObject3D;
		if(object3D == null){
			throw new Error("没有被选中的构件");
		}
		else{ 
			core.removeObject3D(object3D);
		}
	},
	removeAll: function(){
   	 	var mainScene = core.getMainScene();  
   	 	var allComponentInfos = []; 
   	 	var allObject3Ds = [];
   	 	for(var i = 0; i < mainScene.children.length; i++){
   	 		var childObj = mainScene.children[i];
   	 		if(childObj.type == "Object3D" && childObj.modelData != null){
   	 			allObject3Ds.push(childObj);
   	 		}
   	 	} 
   	 	if(allObject3Ds.length > 0 && msgBox.confirm({info: "确定删除所有构件吗?"})){
   	   	 	for(var i = 0; i < allObject3Ds.length; i++){
   	   	 		var object3D = allObject3Ds[i];
   				core.removeObject3D(object3D, true);
   	   	 	} 
   	 	}
	},
	clear: function(){
		core.clearCmdLog();
		return null;
	}	
}  