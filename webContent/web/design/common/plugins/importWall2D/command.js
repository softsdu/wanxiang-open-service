import * as THREE from "three";

//导入2D户型json added by ls 20231031
js3CommandProcessors["importWall2D"] = {
	toStatus: "normal",
	icon: "/images/importWall2D.png",
	editor: null,
	
	//wall2DJson
	wall2DJson: null,
	
	//doorInfos
	doorUnit2Info: {},
	
	//winowInfos
	windowUnit2Info: {},
	
	//interiorWallInfos
	interiorWallUnit2Info: {},
	
	//默认值
	defaultValues:{
		wall: {
			code:"001010",
			versionNum: "1.0",
			material: "混凝土色",
			groupNamePrefix: "墙"
		},
		pillar: {
			code:"001011",
			versionNum: "1.0",
			material: "混凝土色",
			groupNamePrefix: "柱"
		},
		door: {
			code:"001012",
			versionNum: "1.0",
			groupNamePrefix: "门"
		},
		window: {
			code:"001013",
			versionNum: "1.0",
			groupNamePrefix: "窗"
		},
		interiorWall: {
			code:"001014",
			versionNum: "1.0",
			groupNamePrefix: "立面",
			thickness: 0.2 //毫米，很薄
		},
		floor: {
			code:"001050",
			versionNum: "1.0",
			groupNamePrefix: "地面"
		},
	},
	
	//初始化
	init: function(p){
		let cmdProcessor = js3CommandProcessors["importWall2D"];
		cmdProcessor.editor = p.editor;
		cmdProcessor.editor.bindEvent("afterAddUnitObject3DToScene", function(p){
			let cmdProcessor = js3CommandProcessors["importWall2D"];
			let object3D = p.object3D;
			
			if(object3D.unitData.otherInfo != null && object3D.unitData.otherInfo.is2DTo3D){
				//更新door的位置和旋转角度
				if(object3D.unitData.code == cmdProcessor.defaultValues.door.code){ 
					var doorInfo = cmdProcessor.doorUnit2Info[object3D.unitData.id];
	
					var reverseWallRotationEuler = new THREE.Euler(0, doorInfo.rotation[1], 0);
					var vector = new THREE.Vector3(
							(object3D.assistPoints[0].x + object3D.assistPoints[1].x) / 2,
							(object3D.assistPoints[0].y + object3D.assistPoints[1].y) / 2,
							(object3D.assistPoints[0].z + object3D.assistPoints[1].z) / 2);
					var point = vector.applyEuler(reverseWallRotationEuler);
						 
			        var box = new THREE.Box3().setFromObject(object3D, true);  
					
					var newCenterPoint = {
						x: doorInfo.position[0] - point.x,
						y: (box.max.y - box.min.y) / 2 + js3CommonFunction.mm2m(cmdProcessor.cm2mm(cmdProcessor.data2cm(doorInfo.info.high, doorInfo.scale))),
						z: doorInfo.position[2] - point.z
					}
					object3D.unitData.position = [newCenterPoint.x, newCenterPoint.y, newCenterPoint.z];
					object3D.unitData.rotation = doorInfo.rotation;
					cmdProcessor.editor.setObject3DRotation(object3D, object3D.unitData, false);
					cmdProcessor.editor.setObject3DPosition(object3D, object3D.unitData, false);
				} 
				//更新window的位置和旋转角度
				if(object3D.unitData.code == cmdProcessor.defaultValues.window.code){ 
					var windowInfo = cmdProcessor.windowUnit2Info[object3D.unitData.id];					 
			        var box = new THREE.Box3().setFromObject(object3D, true);  				
					var newCenterPoint = {
						x: windowInfo.position[0],
						y: (box.max.y - box.min.y) / 2 + js3CommonFunction.mm2m(cmdProcessor.cm2mm(cmdProcessor.data2cm(windowInfo.info.high, windowInfo.scale))),
						z: windowInfo.position[2]
					}
					object3D.unitData.position = [newCenterPoint.x, newCenterPoint.y, newCenterPoint.z];
					object3D.unitData.rotation = windowInfo.rotation;
					cmdProcessor.editor.setObject3DRotation(object3D, object3D.unitData, false);
					cmdProcessor.editor.setObject3DPosition(object3D, object3D.unitData, false);
				} 
				//更新interiorWall的位置和旋转角度
				if(object3D.unitData.code == cmdProcessor.defaultValues.interiorWall.code){ 
					var interiorWallInfo = cmdProcessor.interiorWallUnit2Info[object3D.unitData.id];
					object3D.unitData.position = interiorWallInfo.position;
					object3D.unitData.rotation = interiorWallInfo.rotation;
					cmdProcessor.editor.setObject3DRotation(object3D, object3D.unitData, false);
					cmdProcessor.editor.setObject3DPosition(object3D, object3D.unitData, false);
				} 
			}
		});
	},
	
	//执行工具栏按钮
	run: function(p){ 
		p.commandJson.showWall2DListDialog(p, { 
			afterFunc: function(p){
				js3CommandProcessors["importWall2D"].getWall2DJson(p);
			}
		}); 
	},
	
	//弹出选择2D户型的窗口
	showWall2DListDialog: function(p, params){
		var popContainer = new PopupContainer( {
			width : 700,
			height : 500,
			top : 50,
			title: "选择2D户型"
		});
		
		popContainer.show();
		window.popInitParam = {
			closeWin: function(p){ 	
				var wall2DName = null;
				var wall2DId = null; 
				
				if(p.selectedRows != null){
					for(var rowId in p.selectedRows){
						var row = p.selectedRows[rowId];
						wall2DName = row.name;
						wall2DId = row.id;
					}
				}
				if(wall2DId != null){
					params.afterFunc({
						id: wall2DId,
						name: wall2DName
					});
				}
				popContainer.close();
			} 
		};
	
		var frameId = cmnPcr.getRandomValue();  
		var buttonContainerId = frameId + "_buttonContainer";
		var okBtnId = frameId + "_ok";
		var cancelBtnId = frameId + "_cancel";
		var pageUrl = basePath + "/web/design/common/plugins/importWall2D/res_Wall2DList.jsp";
		var innerHtml = "<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:0px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + frameId + "\" src=\"" + pageUrl + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"/>"
		 	+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml); 
	},
	
	//获取json内容
	getWall2DJson: function(p){
		var wall2DJsonFileUrl = basePath + "/resource/getWall2DJson?id=" + p.id; 
		$.ajax({
			url: wall2DJsonFileUrl, 
			method: "get", 
			dataType: "json", 
			success:function(data){ 
				let cmdProcessor = js3CommandProcessors["importWall2D"];
				cmdProcessor.afterGotWall2DJson(data); 
			},
			error: function(error){
				msgBox.error({info: error});
			}
		}); 
	},
	
	//构造所有的构件
	afterGotWall2DJson: function(json){
		let cmdProcessor = js3CommandProcessors["importWall2D"];
		cmdProcessor.wall2DJson = json;
		let shiftValues = cmdProcessor.getShiftValues({json: json});
		let fullHeight = cmdProcessor.getFullHeight({json: json});
		let wall2Holes = cmdProcessor.getWallHoles({json: json});
		let interiorWall2Holes = cmdProcessor.getInteriorWallHoles({json: json});
		let scale = json.scene.scale;
		let allUnitSettings = [];
		let allGroups = [];
		cmdProcessor.initWallUnitSettings({
			editor: cmdProcessor.editor,
			scale: scale,
			allUnitSettings: allUnitSettings,
			allGroups: allGroups,
			json: json,
			shiftValues: shiftValues,
			wall2Holes: wall2Holes
		});
		cmdProcessor.initPillarUnitSettings({
			editor: cmdProcessor.editor,
			scale: scale,
			allUnitSettings: allUnitSettings,
			allGroups: allGroups,
			json: json,
			shiftValues: shiftValues,
			fullHeight: fullHeight
		});
		cmdProcessor.initDoorUnitSettings({
			editor: cmdProcessor.editor,
			scale: scale,
			allUnitSettings: allUnitSettings,
			allGroups: allGroups,
			json: json,
			shiftValues: shiftValues,
			wall2Holes: wall2Holes
		});
		cmdProcessor.initWindowUnitSettings({
			editor: cmdProcessor.editor,
			scale: scale,
			allUnitSettings: allUnitSettings,
			allGroups: allGroups,
			json: json,
			shiftValues: shiftValues,
			wall2Holes: wall2Holes
		});
		cmdProcessor.initInteriorWallUnitSettings({
			editor: cmdProcessor.editor,
			scale: scale,
			allUnitSettings: allUnitSettings,
			allGroups: allGroups,
			json: json,
			shiftValues: shiftValues,
			interiorWall2Holes: interiorWall2Holes
		});
		cmdProcessor.initFloorUnitSettings({
			editor: cmdProcessor.editor,
			scale: scale,
			allUnitSettings: allUnitSettings,
			allGroups: allGroups,
			json: json,
			shiftValues: shiftValues
		});
		for(let i = 0; i < allGroups.length; i++){
			let groupInfo = allGroups[i];
			cmdProcessor.editor.addNewGroup(groupInfo); 
		}
		cmdProcessor.editor.createNewObject3DsByUser(allUnitSettings);		
	},
	
	//厘米转毫米
	cm2mm: function(v){
		return v * 10;
	},
	
	//获取整体移动的距离（坐标系切换需要）
	getShiftValues: function(p){ 
		let allWallInfos = p.json.wall;
		if(allWallInfos.length > 0){
			//整体移动个距离
			var fullMinX = Infinity;
			var fullMaxY = -Infinity;
			for(let i = 0; i < allWallInfos.length; i++){
				var wallInfo = allWallInfos[i];
				for(let j = 0; j < wallInfo.polygon.length; j++){
					var p = wallInfo.polygon[j];
					if(p.x < fullMinX){
						fullMinX = p.x;
					}
					if(p.y > fullMaxY){
						fullMaxY = p.y;
					}
				}				
			}
			return {
				x: -fullMinX,
				y: fullMaxY
			};
		}
		else{
			return {
				x: 0,
				y: 0
			};
		}
	},
	
	//获取整体高度，厘米
	getFullHeight: function(p){
		let cmdProcessor = js3CommandProcessors["importWall2D"];
		return cmdProcessor.data2cm(p.json.scene.height,p.json.scene.scale);
	},
	
	//数据变厘米
	data2cm: function(v, scale){
		let cmdProcessor = js3CommandProcessors["importWall2D"];
		let newV = v * scale;
		return newV;
	},
	
	//获取立面和洞口的关系
	getInteriorWallHoles: function(p){
		var interiorWall2Holes = {};
		let allInteriorWallInfos = p.json.interiorWall;
		if(allInteriorWallInfos.length > 0){
			for(let i = 0; i < allInteriorWallInfos.length; i++){
				var interiorWallInfo = allInteriorWallInfos[i];
				interiorWall2Holes[interiorWallInfo.id] = {
					holes: [],
					rotation: null,
					thickness: 0
				};
			}
		}
		let allDoorInfos = p.json.door;
		if(allDoorInfos.length > 0){
			for(let i = 0; i < allDoorInfos.length; i++){
				var doorInfo = allDoorInfos[i];
				if(doorInfo.atInteriorWall != null){
					for(let j = 0; j < doorInfo.atInteriorWall.length; j++){
						let interiorWallId = doorInfo.atInteriorWall[j];
						interiorWall2Holes[interiorWallId].holes.push(doorInfo);
					}
				}
			}
		}
		let allWindowInfos = p.json.window;
		if(allWindowInfos.length > 0){
			for(let i = 0; i < allWindowInfos.length; i++){
				var windowInfo = allWindowInfos[i];
				if(windowInfo.atInteriorWall != null){
					for(let j = 0; j < windowInfo.atInteriorWall.length; j++){
						let interiorWallId = windowInfo.atInteriorWall[j];
						interiorWall2Holes[interiorWallId].holes.push(windowInfo);
					}
				}
			}
		}
		return interiorWall2Holes;
	},
	
	
	//获取墙和洞口的关系
	getWallHoles: function(p){
		var wall2Holes = {};
		let allWallInfos = p.json.wall;
		if(allWallInfos.length > 0){
			for(let i = 0; i < allWallInfos.length; i++){
				var wallInfo = allWallInfos[i];
				wall2Holes[wallInfo.id] = {
					holes: [],
					rotation: null,
					thickness: 0
				};
			}
		}
		let allDoorInfos = p.json.door;
		if(allDoorInfos.length > 0){
			for(let i = 0; i < allDoorInfos.length; i++){
				var doorInfo = allDoorInfos[i];
				wall2Holes[doorInfo.wallId].holes.push(doorInfo);
			}
		}
		let allWindowInfos = p.json.window;
		if(allWindowInfos.length > 0){
			for(let i = 0; i < allWindowInfos.length; i++){
				var windowInfo = allWindowInfos[i];
				wall2Holes[windowInfo.wallId].holes.push(windowInfo);
			}
		}
		return wall2Holes;
	},
	
	//构造墙
	initWallUnitSettings: function(p){
		let allWallInfos = p.json.wall;
		if(allWallInfos.length > 0){
			let cmdProcessor = js3CommandProcessors["importWall2D"];
			let editor = p.editor;
			let wallGroupInfo = {
				id: editor.getGuid(),
				name: cmdProcessor.defaultValues.wall.groupNamePrefix,
				isNew: true							
			};
			var i = 0;
			while(editor.checkHasSameNameGroup(wallGroupInfo)){
				i++;
				wallGroupInfo.name = cmdProcessor.defaultValues.wall.groupNamePrefix + "_" + i;
			} 
 
			for(let i = 0; i < allWallInfos.length; i++){
				var wallInfo = allWallInfos[i];
				
				//墙高
				var wallHeight = cmdProcessor.data2cm(wallInfo.height, p.scale);		
				
				
				//旋转角度
				var wallRotation = js3CommonFunction.getAngle(wallInfo.start, {x: wallInfo.start.x + 100, y: wallInfo.start.y, z: wallInfo.start.z}, wallInfo.end) * Math.PI / 180;
				
	
				//墙厚度
				var maxY = -Infinity;
				var minY = Infinity;
				var maxX = -Infinity;
				var minX = Infinity;
				var reverseWallRotationEuler = new THREE.Euler(0, 0, wallRotation);
				for(let j = 0; j < wallInfo.polygon.length; j++){
					var point = wallInfo.polygon[j];
					//yz互换
					var vector = new THREE.Vector3(point.x, point.y, point.z);
					var point = vector.applyEuler(reverseWallRotationEuler);
					if(point.y > maxY){
						maxY = point.y;
					}
					if(point.y < minY){
						minY = point.y;
					}			
					if(point.x > maxX){
						maxX = point.x;
					}
					if(point.x < minX){
						minX = point.x;
					}				
				}
				var wallThickness = maxY - minY;
								
				//墙宽
				var wallWidth = maxX - minX;
	
				
				//墙中心点,yz需要互换
				var centerPoint = js3CommonFunction.getCenterPoint(wallInfo.polygon[0], wallInfo.polygon[2]);
				var wallCenterPoint = {x: cmdProcessor.cm2mm(centerPoint.x) + cmdProcessor.cm2mm(p.shiftValues.x), y: cmdProcessor.cm2mm(wallHeight / 2), z: -cmdProcessor.cm2mm(centerPoint.y) + cmdProcessor.cm2mm(p.shiftValues.y)}
				
				//洞口
				var holeStrs = [];
				let wallHoleInfo = p.wall2Holes[wallInfo.id];
				wallHoleInfo.rotation = [0, wallRotation, 0],
				wallHoleInfo.thickness = wallThickness;
				for(let j = 0; j < wallHoleInfo.holes.length; j++){
					let holeInfo = wallHoleInfo.holes[j];
					let holeWidth = cmdProcessor.data2cm(holeInfo.length, p.scale);
					let holeHeight = cmdProcessor.data2cm(holeInfo.height, p.scale);
					let toBottom = cmdProcessor.data2cm(holeInfo.high, p.scale);

					let vector = new THREE.Vector3(holeInfo.position.x, holeInfo.position.y, holeInfo.position.z);
					let point = vector.applyEuler(reverseWallRotationEuler);
					let toLeft = point.x - minX - holeWidth / 2;
					holeStrs.push(cmdProcessor.cm2mm(holeWidth) + "," + cmdProcessor.cm2mm(holeHeight) + "," + cmdProcessor.cm2mm(toLeft) + "," + cmdProcessor.cm2mm(toBottom));					
				}
				let holeString = cmnPcr.arrayToString(holeStrs, ";");
				
	
				var wallUnitSetting = {
					name: "墙_" + (i + 1),
					 
					id: editor.getGuid(),
					
					code: cmdProcessor.defaultValues.wall.code, 
					versionNum: cmdProcessor.defaultValues.wall.versionNum, 
					mixType: js3UnitMixType.none,
					
					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,
					
					useWorldPosition: false,
					position: [js3CommonFunction.mm2m(wallCenterPoint.x), js3CommonFunction.mm2m(wallCenterPoint.y), js3CommonFunction.mm2m(wallCenterPoint.z)],
					rotation: [0, -wallRotation, 0],
					count: 1,
					materials: null,
					parameters: {
						"宽度": {value: cmdProcessor.cm2mm(wallWidth)},
						"厚度": {value: cmdProcessor.cm2mm(wallThickness)},
						"高度": {value: cmdProcessor.cm2mm(wallHeight)},
						"材质": {value: cmdProcessor.defaultValues.wall.material},
						"洞口": {value: holeString}
					},
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: wallGroupInfo.id,
						needSelect: false
					}
				};
				p.allUnitSettings.push(wallUnitSetting);				
			}
			p.allGroups.push(wallGroupInfo); 	
		}
	},
	
	//柱
	initPillarUnitSettings: function(p){
		let allPillarInfos = p.json.pillar;
		let pillarHeight = p.fullHeight;
		if(allPillarInfos.length > 0){
			let cmdProcessor = js3CommandProcessors["importWall2D"];
			let editor = p.editor;
			let pillarGroupInfo = {
				id: editor.getGuid(),
				name: cmdProcessor.defaultValues.pillar.groupNamePrefix,
				isNew: true							
			};
			var i = 0;
			while(editor.checkHasSameNameGroup(pillarGroupInfo)){
				i++;
				pillarGroupInfo.name = cmdProcessor.defaultValues.pillar.groupNamePrefix + "_" + i;
			} 
 
			for(let i = 0; i < allPillarInfos.length; i++){
				var pillarInfo = allPillarInfos[i]; 	
				
				
				//旋转角度
				var pillarRotation = js3CommonFunction.getAngle(pillarInfo.polygon[0], {x: pillarInfo.polygon[0].x, y: pillarInfo.polygon[0].y - 100, z: pillarInfo.polygon[0].z}, pillarInfo.polygon[1]) * Math.PI / 180;
				
	
				//宽度A、宽度B
				var maxY = -Infinity;
				var minY = Infinity;
				var maxX = -Infinity;
				var minX = Infinity;
				var reversePillarRotationEuler = new THREE.Euler(0, 0, pillarRotation);
				for(let j = 0; j < pillarInfo.polygon.length; j++){
					var point = pillarInfo.polygon[j];
					//yz互换
					var vector = new THREE.Vector3(point.x, point.y, point.z);
					var point = vector.applyEuler(reversePillarRotationEuler);
					if(point.y > maxY){
						maxY = point.y;
					}
					if(point.y < minY){
						minY = point.y;
					}			
					if(point.x > maxX){
						maxX = point.x;
					}
					if(point.x < minX){
						minX = point.x;
					}				
				}
				var widthA = maxX - minX;
				var widthB = maxY - minY;
	
				
				//中心点,yz需要互换
				var centerPoint = js3CommonFunction.getCenterPoint(pillarInfo.polygon[0], pillarInfo.polygon[2]);
				var pillarCenterPoint = {x: cmdProcessor.cm2mm(centerPoint.x) + cmdProcessor.cm2mm(p.shiftValues.x), y: cmdProcessor.cm2mm(pillarHeight / 2), z: -cmdProcessor.cm2mm(centerPoint.y) + cmdProcessor.cm2mm(p.shiftValues.y)}
	
				var pillarUnitSetting = {
					name: "柱_" + (i + 1),
					 
					id: editor.getGuid(),
					
					code: cmdProcessor.defaultValues.pillar.code, 
					versionNum: cmdProcessor.defaultValues.pillar.versionNum, 
					mixType: js3UnitMixType.none,
					
					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,
					
					useWorldPosition: false,
					position: [js3CommonFunction.mm2m(pillarCenterPoint.x), js3CommonFunction.mm2m(pillarCenterPoint.y), js3CommonFunction.mm2m(pillarCenterPoint.z)],
					rotation: [0, pillarRotation, 0],
					count: 1,
					materials: null,
					parameters: {
						"宽度A": {value: cmdProcessor.cm2mm(widthA)},
						"宽度B": {value: cmdProcessor.cm2mm(widthB)},
						"高度": {value: cmdProcessor.cm2mm(pillarHeight)},
						"材质": {value: cmdProcessor.defaultValues.pillar.material}
					},
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: pillarGroupInfo.id,
						needSelect: false
					}
				};
				p.allUnitSettings.push(pillarUnitSetting);				
			}
			p.allGroups.push(pillarGroupInfo);
		}
	},
	
	//构造门
	initDoorUnitSettings: function(p){
		let allDoorInfos = p.json.door;
		if(allDoorInfos.length > 0){
			let cmdProcessor = js3CommandProcessors["importWall2D"];
			let editor = p.editor;
			let doorGroupInfo = {
				id: editor.getGuid(),
				name: cmdProcessor.defaultValues.door.groupNamePrefix,
				isNew: true							
			};
			var i = 0;
			while(editor.checkHasSameNameGroup(doorGroupInfo)){
				i++;
				doorGroupInfo.name = cmdProcessor.defaultValues.door.groupNamePrefix + "_" + i;
			} 
 
			for(let i = 0; i < allDoorInfos.length; i++){
				var doorInfo = allDoorInfos[i];
				
				//高
				var doorHeight = cmdProcessor.data2cm(doorInfo.height, p.scale);	
				
				//宽
				var doorWidth = cmdProcessor.data2cm(doorInfo.length, p.scale);		
				
				
				//旋转角度
				let wallHoleInfo = p.wall2Holes[doorInfo.wallId];
				
				//墙厚
				let wallThickness= wallHoleInfo.thickness;
				   
				//中心点,yz需要互换 
				var doorCenterPoint = {x: cmdProcessor.cm2mm(doorInfo.position.x) + cmdProcessor.cm2mm(p.shiftValues.x), y: cmdProcessor.cm2mm(doorInfo.position.z), z: -cmdProcessor.cm2mm(doorInfo.position.y) + cmdProcessor.cm2mm(p.shiftValues.y)}
				 	
				var doorUnitSetting = {
					name: "门_" + (i + 1),
					 
					id: editor.getGuid(),
					
					code: cmdProcessor.defaultValues.door.code, 
					versionNum: cmdProcessor.defaultValues.door.versionNum, 
					mixType: js3UnitMixType.none,
					
					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,
					
					useWorldPosition: false,
					//position: [js3CommonFunction.mm2m(wallCenterPoint.x), js3CommonFunction.mm2m(wallCenterPoint.y), js3CommonFunction.mm2m(wallCenterPoint.z)],
					//rotation: wallRotation,
					position: [0, 0, 0],
					rotation: [0, 0, 0],
					count: 1,
					materials: null,
					parameters: {
						"宽度": {value: cmdProcessor.cm2mm(doorWidth)},
						"高度": {value: cmdProcessor.cm2mm(doorHeight)},
						"墙厚": {value: cmdProcessor.cm2mm(wallThickness)},
					},
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: doorGroupInfo.id,
						needSelect: false,
						is2DTo3D: true
					}
				};
				p.allUnitSettings.push(doorUnitSetting);
				
				cmdProcessor.doorUnit2Info[doorUnitSetting.id] = {
					info: doorInfo,
					scale: p.scale,
					rotation: [0, doorInfo.rotate, 0],
					position: [js3CommonFunction.mm2m(doorCenterPoint.x), js3CommonFunction.mm2m(doorCenterPoint.y), js3CommonFunction.mm2m(doorCenterPoint.z)]
				};
			}
			p.allGroups.push(doorGroupInfo); 
		}
	},	
	//构造窗
	initWindowUnitSettings: function(p){
		let allWindowInfos = p.json.window;
		if(allWindowInfos.length > 0){
			let cmdProcessor = js3CommandProcessors["importWall2D"];
			let editor = p.editor;
			let windowGroupInfo = {
				id: editor.getGuid(),
				name: cmdProcessor.defaultValues.window.groupNamePrefix,
				isNew: true							
			};
			var i = 0;
			while(editor.checkHasSameNameGroup(windowGroupInfo)){
				i++;
				windowGroupInfo.name = cmdProcessor.defaultValues.window.groupNamePrefix + "_" + i;
			} 
 
			for(let i = 0; i < allWindowInfos.length; i++){
				var windowInfo = allWindowInfos[i];
				
				//高
				var windowHeight = cmdProcessor.data2cm(windowInfo.height, p.scale);	
				
				//宽
				var windowWidth = cmdProcessor.data2cm(windowInfo.length, p.scale);		
				
				
				//旋转角度
				let wallHoleInfo = p.wall2Holes[windowInfo.wallId];
				
				//墙厚
				let wallThickness= wallHoleInfo.thickness;
				   
				//中心点,yz需要互换 
				var windowCenterPoint = {x: cmdProcessor.cm2mm(windowInfo.position.x) + cmdProcessor.cm2mm(p.shiftValues.x), y: cmdProcessor.cm2mm(windowInfo.position.z), z: -cmdProcessor.cm2mm(windowInfo.position.y) + cmdProcessor.cm2mm(p.shiftValues.y)}
				 	
				var windowUnitSetting = {
					name: "窗_" + (i + 1),
					 
					id: editor.getGuid(),
					
					code: cmdProcessor.defaultValues.window.code, 
					versionNum: cmdProcessor.defaultValues.window.versionNum, 
					mixType: js3UnitMixType.none,
					
					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,
					
					useWorldPosition: false,
					//position: [js3CommonFunction.mm2m(wallCenterPoint.x), js3CommonFunction.mm2m(wallCenterPoint.y), js3CommonFunction.mm2m(wallCenterPoint.z)],
					//rotation: wallRotation,
					position: [0, 0, 0],
					rotation: [0, 0, 0],
					count: 1,
					materials: null,
					parameters: {
						"宽度": {value: cmdProcessor.cm2mm(windowWidth)},
						"高度": {value: cmdProcessor.cm2mm(windowHeight)},
					},
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: windowGroupInfo.id,
						needSelect: false,
						is2DTo3D: true
					}
				};
				p.allUnitSettings.push(windowUnitSetting);
				
				cmdProcessor.windowUnit2Info[windowUnitSetting.id] = {
					info: windowInfo,
					scale: p.scale,
					rotation: [0, windowInfo.rotate, 0],
					position: [js3CommonFunction.mm2m(windowCenterPoint.x), js3CommonFunction.mm2m(windowCenterPoint.y), js3CommonFunction.mm2m(windowCenterPoint.z)]
				};
			}
			p.allGroups.push(windowGroupInfo); 
		}
	},
	//构造立面， 立面存在方向问题，掏洞的问题
	initInteriorWallUnitSettings: function(p){
		let allInteriorWallInfos = p.json.interiorWall;
		if(allInteriorWallInfos.length > 0){
			let cmdProcessor = js3CommandProcessors["importWall2D"];
			let editor = p.editor;
			let interiorWallGroupInfo = {
				id: editor.getGuid(),
				name: cmdProcessor.defaultValues.interiorWall.groupNamePrefix,
				isNew: true
			};
			var i = 0;
			while(editor.checkHasSameNameGroup(interiorWallGroupInfo)){
				i++;
				interiorWallGroupInfo.name = cmdProcessor.defaultValues.interiorWall.groupNamePrefix + "_" + i;
			}

			for(let i = 0; i < allInteriorWallInfos.length; i++){
				var interiorWallInfo = allInteriorWallInfos[i];

				//宽
				var interiorWallWidth = js3CommonFunction.getLineLength(interiorWallInfo.start, interiorWallInfo.end);

				//旋转角度
				var interiorWallRotation = js3CommonFunction.getAngle(interiorWallInfo.start, {x: interiorWallInfo.start.x + 100, y: interiorWallInfo.start.y, z: interiorWallInfo.start.z}, interiorWallInfo.end) * Math.PI / 180;


				//中心点,yz需要互换 
				var interiorWallCenterPoint = {
					x: cmdProcessor.cm2mm((interiorWallInfo.start.x + interiorWallInfo.end.x) / 2) + cmdProcessor.cm2mm(p.shiftValues.x),
					y: cmdProcessor.cm2mm(cmdProcessor.data2cm(interiorWallInfo.height, p.scale) / 2) + cmdProcessor.cm2mm(cmdProcessor.data2cm(interiorWallInfo.groundThickness, p.scale)),
					z: -cmdProcessor.cm2mm((interiorWallInfo.start.y + interiorWallInfo.end.y) / 2) + cmdProcessor.cm2mm(p.shiftValues.y)};

				//墙的max、min值（旋转为平行于x方向）
				var reverseInteriorWallRotationEuler = new THREE.Euler(0, 0, interiorWallRotation);
				var vectorStart = new THREE.Vector3(interiorWallInfo.start.x, interiorWallInfo.start.y, interiorWallInfo.start.z);
				var vectorEnd = new THREE.Vector3(interiorWallInfo.end.x, interiorWallInfo.end.y, interiorWallInfo.end.z);
				var pointStart = vectorStart.applyEuler(reverseInteriorWallRotationEuler);
				var pointEnd = vectorEnd.applyEuler(reverseInteriorWallRotationEuler);
				var maxX = pointStart.x > pointEnd.x ? pointStart.x : pointEnd.x;
				var minX = pointStart.x < pointEnd.x ? pointStart.x : pointEnd.x;

				//洞口
				var holeStrs = [];
				let interiorWallHoleInfo = p.interiorWall2Holes[interiorWallInfo.id];
				interiorWallHoleInfo.rotation = [0, interiorWallRotation, 0],
					interiorWallHoleInfo.thickness = cmdProcessor.defaultValues.interiorWall.thickness;
				for(let j = 0; j < interiorWallHoleInfo.holes.length; j++){
					let holeInfo = interiorWallHoleInfo.holes[j];
					let holeWidth = cmdProcessor.data2cm(holeInfo.length, p.scale);
					let holeHeight = cmdProcessor.data2cm(holeInfo.height, p.scale);
					let toBottom = cmdProcessor.data2cm(holeInfo.high - interiorWallInfo.groundThickness, p.scale);

					let vector = new THREE.Vector3(holeInfo.position.x, holeInfo.position.y, holeInfo.position.z);
					let point = vector.applyEuler(reverseInteriorWallRotationEuler);
					let toLeft = point.x - minX - holeWidth / 2;
					holeStrs.push(cmdProcessor.cm2mm(holeWidth) + "," + cmdProcessor.cm2mm(holeHeight) + "," + cmdProcessor.cm2mm(toLeft) + "," + cmdProcessor.cm2mm(toBottom));
				}
				let holeString = cmnPcr.arrayToString(holeStrs, ";");

				var interiorWallUnitSetting = {
					name: "立面_" + (i + 1),

					id: editor.getGuid(),

					code: cmdProcessor.defaultValues.interiorWall.code,
					versionNum: cmdProcessor.defaultValues.interiorWall.versionNum,
					mixType: js3UnitMixType.none,

					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,

					useWorldPosition: false,
					//position: [js3CommonFunction.mm2m(wallCenterPoint.x), js3CommonFunction.mm2m(wallCenterPoint.y), js3CommonFunction.mm2m(wallCenterPoint.z)],
					//rotation: wallRotation,
					position: [0, 0, 0],
					rotation: [0, 0, 0],
					count: 1,
					materials: null,
					parameters: {
						"宽度": {value: cmdProcessor.cm2mm(interiorWallWidth)},
						"高度": {value: cmdProcessor.cm2mm(cmdProcessor.data2cm(interiorWallInfo.height, p.scale))},
						"厚度": {value: cmdProcessor.defaultValues.interiorWall.thickness},
						"洞口": {value: holeString}
					},
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: interiorWallGroupInfo.id,
						needSelect: false,
						is2DTo3D: true
					}
				};
				p.allUnitSettings.push(interiorWallUnitSetting);

				cmdProcessor.interiorWallUnit2Info[interiorWallUnitSetting.id] = {
					info: interiorWallInfo,
					rotation: [0, -interiorWallRotation, 0],
					position: [js3CommonFunction.mm2m(interiorWallCenterPoint.x), js3CommonFunction.mm2m(interiorWallCenterPoint.y), js3CommonFunction.mm2m(interiorWallCenterPoint.z)]
				};
			}
			p.allGroups.push(interiorWallGroupInfo);
		}
	},
	//构造地面
	initFloorUnitSettings: function(p){
		let allFloorInfos = p.json.floor;
		if(allFloorInfos.length > 0){
			let cmdProcessor = js3CommandProcessors["importWall2D"];
			let editor = p.editor;
			let floorGroupInfo = {
				id: editor.getGuid(),
				name: cmdProcessor.defaultValues.floor.groupNamePrefix,
				isNew: true
			};
			let i = 0;
			while(editor.checkHasSameNameGroup(floorGroupInfo)){
				i++;
				floorGroupInfo.name = cmdProcessor.defaultValues.floor.groupNamePrefix + "_" + i;
			}

			for(let i = 0; i < allFloorInfos.length; i++){
				let floorInfo = allFloorInfos[i];

				//宽
				let floorThickness = cmdProcessor.cm2mm(cmdProcessor.data2cm(floorInfo.groundThickness, p.scale));

				//轮廓
				let solutionPaths = floorInfo.solutionPaths;
				let polygonStrs = [];
				for(let j = 0; j < solutionPaths.length; j++){
					let solutionPath = solutionPaths[j];
					let pointStrs = [];
					for(let k = 0; k < solutionPath.length; k++){
						let point = solutionPath[k];
						pointStrs.push((cmdProcessor.cm2mm(point.X) + cmdProcessor.cm2mm(p.shiftValues.x)) + "," + (cmdProcessor.cm2mm(-point.Y) + cmdProcessor.cm2mm(p.shiftValues.y)));
					}
					let pathString = cmnPcr.arrayToString(pointStrs, ";");
					polygonStrs.push(pathString);
				}
				let solutionString = cmnPcr.arrayToString(polygonStrs, "|");

				let floorUnitSetting = {
					name: "地面_" + (i + 1),
					id: editor.getGuid(),
					code: cmdProcessor.defaultValues.floor.code,
					versionNum: cmdProcessor.defaultValues.floor.versionNum,
					mixType: js3UnitMixType.none,
					viewLevel: js3ViewLevelType.always,
					useWorldPosition: true,
					position: [0, 0, 0],
					rotation: [0, 0, 0],
					count: 1,
					materials: null,
					parameters: {
						"厚度": {value: floorThickness},
						"距离底面": {value: 0},
						"轮廓": {value: solutionString}
					},
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: floorGroupInfo.id,
						needSelect: false,
						is2DTo3D: true
					}
				};
				p.allUnitSettings.push(floorUnitSetting);

				cmdProcessor.interiorWallUnit2Info[floorUnitSetting.id] = {
					info: floorUnitSetting,
					rotation: [0, 0, 0],
					position: [0, 0, 0]
				};
			}
			p.allGroups.push(floorGroupInfo);
		}
	},
	
};