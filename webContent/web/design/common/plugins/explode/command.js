import * as THREE from "three";
//分解  added by ls 20220606
js3CommandProcessors["explode"] = {
	toStatus: "normal",	 
	icon: "/images/explode.png",
	editor: null,
	explodingUnitData: null,
	explodeTaskInfo:{
		total: 0,
		processed: 0
	},
	afterBuiltExplodeObjectFunc: null,
	run: function(p){
		let commandProcessor = js3CommandProcessors["explode"];
		let object3D = p.editor.selectedUnitObject3D;
		if(object3D == null){
			msgBox.alert({info: "请选择图元"});
		}
		else {
			p.commandJson.explode({
				editor: p.editor,
				unitId: object3D.unitData.id,
				needConfirm: true
			});
		}
	},
	//分解
	explode: function(p){
		let commandProcessor = js3CommandProcessors["explode"];
		commandProcessor.editor = p.editor;
		commandProcessor.afterExplodeObjectFunc = p.afterExplodeObjectFunc;
		let object3D = commandProcessor.editor.getObject3DByUnitId(p.unitId);
		commandProcessor.explodingUnitData = object3D.unitData;
		if(!p.needConfirm || msgBox.confirm({info: "确定要执行分解操作吗?"})){
			commandProcessor.getInstanceParameters(object3D.unitData);
			//editor.removeUnitObject3D(object3D, true);
		}
	},
	//调用服务器端获取内部各个构件实例化后的参数	
	getInstanceParameters: function(unitSetting){
		let commandProcessor = js3CommandProcessors["explode"];
		let editor = commandProcessor.editor;
		
		//预处理parameter的表达式  modified by ls 20230313
		let unitParameters = {};
		for(let paramName in unitSetting.parameters){
			unitParameters[paramName] = {
				value: unitSetting.parameters[paramName].value
			};
		}

		let requestParam = {
			code: unitSetting.code,
			versionNum: unitSetting.versionNum,
			parentParameters: [],
			parameters: unitParameters,
			detailLevel: editor.object3DCreator.detailLevel,
			
			//显示级别 added by ls 20230403
			viewLevel: editor.object3DCreator.viewLevel
		};
		
		serverAccess.request({
			serviceName:"geometry3DNcpService",
			funcName:"getInstanceParametersByCode",  
		    args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj) {
				let commandProcessor = js3CommandProcessors["explode"];
				let instParam = obj.result.parameters;
				//根据返回的参数，逐一场景分组和构件
				commandProcessor.createChildObject3Ds({
					editor: commandProcessor.editor,
					commandJson: commandProcessor,
					instParam: instParam
				});
			},
			failFunc: function(obj) { 
				msgBox.error({title:"提示", info: obj.message});				 
			}
		});
	},
	
	//根据内部和外部构件的信息，计算分解后的位置信息
	//获取是否使用世界坐标的参数 modified by ls 20220810
	getChildObject3DPosition: function(innerPosition, object3DEuler, outerPosition, outerMin, outerMax, useWorldPosition){
		if(useWorldPosition){
			return innerPosition;
		}
		else{
			let innerPosToCenter = {
			   x: innerPosition[0] - (outerMax[0] + outerMin[0]) / 2,
			   y: innerPosition[1] - (outerMax[1] + outerMin[1]) / 2,
			   z: innerPosition[2] - (outerMax[2] + outerMin[2]) / 2
			}

			let vec = new THREE.Vector3(innerPosToCenter.x, innerPosToCenter.y, innerPosToCenter.z);
			let outerVec = vec.applyEuler(object3DEuler);
			
			return [
		        outerPosition[0] + outerVec.x,
		        outerPosition[1] + outerVec.y,
		        outerPosition[2] + outerVec.z
	        ];
		}
	},
	
	//根据内部和外部的构件信息，计算分解后的旋转角度信息
	//获取是否使用世界坐标的参数 modified by ls 20220810
	getChildObject3DRotation: function(innerRotation, outerRotation, useWorldPosition){
		if(useWorldPosition){
			return innerRotation;
		}
		else{
			let outerEuler = new THREE.Euler();
			outerEuler.x = outerRotation[0];
			outerEuler.y = outerRotation[1];
			outerEuler.z = outerRotation[2];
			let innerEuler = new THREE.Euler();
			innerEuler.x = innerRotation[0];
			innerEuler.y = innerRotation[1];
			innerEuler.z = innerRotation[2];
			let outerQuaternion = new THREE.Quaternion();
			outerQuaternion.setFromEuler(outerEuler)
			let innerQuaternion = new THREE.Quaternion();
			innerQuaternion.setFromEuler(innerEuler)

			let euler = new THREE.Euler();
			euler.setFromQuaternion(outerQuaternion.multiply(innerQuaternion));
			
			return [
				euler.x,
				euler.y,
				euler.z,
	        ];
		}
	},
	
	//获取创建构件需要的参数
	getCreateParameters: function(parameters){
		let createParameters = {};
		for(let i = 0; i < parameters.length; i++){
			let parameter = parameters[i];
			createParameters[parameter.name] = {
				value: parameter.value
			};
		}
		return createParameters;
	},
	
	//逐一创建构件
	createChildObject3Ds: function(p){
		let commandProcessor = js3CommandProcessors["explode"];
		let editor = p.editor;
		let useWorldPosition = commandProcessor.explodingUnitData.useWorldPosition;
		let object3D = editor.getObject3DByUnitId(commandProcessor.explodingUnitData.id);
		let parentUnitIdPath = (object3D.unitData.otherInfo == null || object3D.unitData.otherInfo.unitIdPath == null ? "" : object3D.unitData.otherInfo.unitIdPath) + object3D.unitData.id;

		let namePrefix = editor.getNewNamePrefix(object3D.unitData.name);
		let instParam = p.instParam;
		let unitSettings = [];
		let object3DMin = instParam.min;
		let object3DMax = instParam.max;
		let object3DPosition = [object3D.position.x, object3D.position.y, object3D.position.z];
		let object3DRotation = [object3D.rotation.x, object3D.rotation.y, object3D.rotation.z];
		let allNewGroupHash = {};
		for(let i = 0; i < instParam.children.length; i++){
			let childInstParam = instParam.children[i];
			if(childInstParam.code != null){
				//获取是否使用世界坐标的参数 added by ls 20220810
				let position = p.commandJson.getChildObject3DPosition(childInstParam.position, object3D.rotation, object3DPosition, object3DMin, object3DMax, useWorldPosition);
				let rotation = p.commandJson.getChildObject3DRotation(childInstParam.rotation, object3DRotation, useWorldPosition);
				let parameters = p.commandJson.getCreateParameters(childInstParam.parameters);
				
				//分组
				let groupName = namePrefix + "_" + childInstParam.groupName;
				if(allNewGroupHash[groupName] == null){
					allNewGroupHash[groupName] = {
						id: editor.getGuid(),
						name: groupName,
						isNew: true							
					};
				}
				let groupId = allNewGroupHash[groupName].id;
				
				//构造实例化参数
				let unitSetting = {
					name: namePrefix + "_" + childInstParam.name,
					
					//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
					id: editor.getGuid(),
					
					code: childInstParam.code, 
					versionNum: childInstParam.versionNum,
					mixType: js3UnitMixType.none,
					viewLevel: editor.object3DCreator.viewLevel,
					useWorldPosition: childInstParam.useWorldPosition,
					position: position,
					rotation: rotation,
					count: 1,
					materials: null,
					parameters: parameters,
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: groupId,
						unitIdPath: parentUnitIdPath + "," + childInstParam.unitId,
						needSelect: false
					}
				};
				unitSettings.push(unitSetting);
			}
			else if(childInstParam.children != null){
				//这是规则驱动出来的，下一级实例化
				for(let j = 0; j < childInstParam.children.length; j++){
					let childSubInstParam = childInstParam.children[j];
					//获取是否使用世界坐标的参数 added by ls 20220810
					let position = p.commandJson.getChildObject3DPosition(childSubInstParam.position, object3D.rotation, object3DPosition, object3DMin, object3DMax, useWorldPosition);
					let rotation = p.commandJson.getChildObject3DRotation(childSubInstParam.rotation, object3DRotation, useWorldPosition);
					let parameters = p.commandJson.getCreateParameters(childSubInstParam.parameters);

					//分组
					let groupName = namePrefix + "_" + childSubInstParam.groupName;
					if(allNewGroupHash[groupName] == null){
						allNewGroupHash[groupName] = {
							id: editor.getGuid(),
							name: groupName,
							isNew: true							
						};
					}
					let groupId = allNewGroupHash[groupName].id;

					//构造实例化参数
					let unitSetting = {
						name: namePrefix + "_" + childInstParam.name + "_" + childSubInstParam.name,
						
						//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
						id: editor.getGuid(),
						
						code: childSubInstParam.code, 
						versionNum: childSubInstParam.versionNum,
						mixType: js3UnitMixType.none,
						viewLevel: editor.object3DCreator.viewLevel,
						useWorldPosition: childSubInstParam.useWorldPosition,
						position: position,
						rotation: rotation,
						count: 1,
						materials: null,
						parameters: parameters,
						positionExps: {},
						rotationExps: {},
						uvs: null,
						otherInfo:{
							groupId: groupId,
							unitIdPath: parentUnitIdPath + "," + childSubInstParam.unitId,
							needSelect: false
						}
					};
					unitSettings.push(unitSetting);
				}
			}
			else{
				msgBox.alert({info: "构件内部使用了布尔运算, 无法分解"});
				return;
			}
		}
		
		//删除原有构件
		editor.removeUnitObject3D(object3D, true);
		
		//添加新的分组
		for(let groupName in allNewGroupHash){
			let newGroup = allNewGroupHash[groupName];
			editor.addNewGroup(newGroup);
		}
		
		//添加分解后的构件
		commandProcessor.explodeTaskInfo.total = unitSettings.length;
		commandProcessor.explodeTaskInfo.processed = 0;
		editor.createNewObject3DsByUser(unitSettings, function(unit3DInfo){
			let commandProcessor = js3CommandProcessors["explode"];
			commandProcessor.explodeTaskInfo.processed++;
			if(commandProcessor.afterExplodeObjectFunc != null) {
				commandProcessor.afterExplodeObjectFunc({
					unit3DInfo,
					allCompleted: commandProcessor.explodeTaskInfo.total === commandProcessor.explodeTaskInfo.processed
				});
			}
		});
	}
};