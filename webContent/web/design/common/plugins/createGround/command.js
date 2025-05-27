import * as THREE from "three";
import CubicSpline from "common/js/algorithm/cubicSpline.js";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

//地形 added by ls 20231110
js3CommandProcessors["createGround"] = {
	toStatus: "normal",
	icon: "/images/createGround.png",
	editor: null,
	groundMaterials: {}, 
	defaultValues:{
		code: "9395-1001",
		versionNum: "1.0",
		namePrefix: "地形",
		groundColor: 0x006D00,
		length: 100000,
		width: 100000,
		height: 10000
	},
	
	//执行工具栏按钮
	run: function(p){ 
		p.commandJson.showGroundListDialog(p, { 
			afterFunc: function(p){
				js3CommandProcessors["createGround"].createNewGround(p);
			}
		}); 
	},
	
	//弹出选择地形数据的窗口
	showGroundListDialog: function(p, params){
		var popContainer = new PopupContainer( {
			width : 700,
			height : 500,
			top : 50,
			title: "选择地形数据"
		});
		
		popContainer.show();
		window.popInitParam = {
			closeWin: function(p){ 	
				var groundName = null;
				var groundId = null; 
				
				if(p.selectedRows != null){
					for(var rowId in p.selectedRows){
						var row = p.selectedRows[rowId];
						groundName = row.name;
						groundId = row.id;
					}
				}
				if(groundId != null){
					params.afterFunc({
						id: groundId,
						name: groundName
					});
				}
				popContainer.close();
			} 
		};
	
		var frameId = cmnPcr.getRandomValue();  
		var buttonContainerId = frameId + "_buttonContainer";
		var okBtnId = frameId + "_ok";
		var cancelBtnId = frameId + "_cancel";
		var pageUrl = basePath + "/web/design/common/plugins/createGround/res_GroundList.jsp";
		var innerHtml = "<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:0px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + frameId + "\" src=\"" + pageUrl + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"/>"
		 	+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml); 
	},
	
	createNewGround: function(p){
		let pluginProcessor = js3CommandProcessors["createGround"];
		let groundId = p.id;
		let groundName = p.name;
		
		let idAndName = pluginProcessor.editor.getNewUnitIdAndName(pluginProcessor.defaultValues.namePrefix + "_1", pluginProcessor.defaultValues.namePrefix);

		var groundUnitSetting = {
			name: idAndName.name,			 
			id: idAndName.id,			
			code: pluginProcessor.defaultValues.code, 
			versionNum: pluginProcessor.defaultValues.versionNum, 
			mixType: js3UnitMixType.none,
			
			//显示级别 added by ls 20230403
			viewLevel: js3ViewLevelType.always,
			
			useWorldPosition: false,
			position: [0, 0, 0],
			rotation: [0, 0, 0],
			count: 1,
			materials: null,
			parameters: {
				"长度": {value: pluginProcessor.defaultValues.length},
				"宽度": {value: pluginProcessor.defaultValues.width},
				"高度": {value: pluginProcessor.defaultValues.height},
				"地形": {value: groundId}
			},
			positionExps: {},
			rotationExps: {},
			uvs: null,
			otherInfo:{
				needSelect: false,
				isFileTo3D: true
			}
		};
		var allUnitSettings = [];
		allUnitSettings.push(groundUnitSetting);
		pluginProcessor.editor.createNewObject3DsByUser(allUnitSettings);	
	},
	
	init: function(p){
		let pluginProcessor = js3CommandProcessors["createGround"];
		pluginProcessor.editor = p.editor;
		pluginProcessor.textureLoader = new THREE.TextureLoader();
	    
		pluginProcessor.editor.bindEvent("afterAddUnitObject3DToScene", function(p){
			let pluginProcessor = js3CommandProcessors["createGround"];
			let object3D = p.object3D;
			if(object3D.unitData.code == pluginProcessor.defaultValues.code){
				pluginProcessor.getGroundFile({
					object3D: object3D,
					parameters: object3D.unitData.parameters,
					rotation: [object3D.rotation.x, object3D.rotation.y, object3D.rotation.z],
					position: [0, 0, 0]
				});
			}
			else{
				if(object3D.userData.subs != null){
					for(let i = 0; i < object3D.children.length; i++){
						let subObject3D = object3D.children[i];
						let namePath = subObject3D.name;
						let subUnitData = object3D.userData.subs[namePath];
						if(subUnitData != null && subUnitData.code == pluginProcessor.defaultValues.code){
							pluginProcessor.getGroundFile({
								object3D: subObject3D,
								parameters: subUnitData.parameters,
								rotation: subUnitData.rotation,
								position: subUnitData.position
							});
						}
					}
				}
			}
		})
	},
	getGroundFile: function(p){
		let pluginProcessor = js3CommandProcessors["createGround"];
		let groundId = p.parameters["地形"].value;
		let groundFileUrl = basePath + "/resource/getGround?id=" + groundId; 
		$.ajax({
			url: groundFileUrl, 
			method: "get", 
			dataType: "json", 
			success:function(data){				
				let geoInfo = pluginProcessor.getGeoInfos({
    		    	json: data,
					parameters: p.parameters
				});
				pluginProcessor.createGroundObject3D({
    		    	allGeoPositionArray: geoInfo.allGeoPositionArray,
    		    	allGeoIndexArray: geoInfo.allGeoIndexArray,
    		    	bottomY: geoInfo.bottomY,
					object3D: p.object3D,
					parameters: p.parameters,
					rotation: p.rotation,
					position: p.position
    		    }); 
			},
			error: function(error){
				msgBox.alert({info: error});
			}
		});  
		
	},
	createGroundObject3D: function(p){
		let pluginProcessor = js3CommandProcessors["createGround"];
		let object3D = p.object3D;
		let parameters = p.parameters;
		let position = p.position;
		let rotation = p.rotation; 
		
		//颜色
		let materialName = parameters["材质"].value;
		let materialInfo = js3StandardMaterials.infoMap[materialName];
		let groundColor = materialInfo == null ? pluginProcessor.defaultValues.groundColor : materialInfo.color;
		
		//材质
		if(pluginProcessor.groundMaterials[materialName] == null){
			pluginProcessor.groundMaterials[materialName] = new THREE.MeshStandardMaterial({
				color: groundColor,
				roughness: 1.0,
				metalness: 0.0,
		    	side: THREE.DoubleSide
		    });
		}
		let groundMaterial = pluginProcessor.groundMaterials[materialName]; 
		 
	    let groundGeometry = new THREE.BufferGeometry();
	    let positionAttribute = pluginProcessor.createFloatAttribute(p.allGeoPositionArray, 3);
	    let indexAttribute = pluginProcessor.createIntAttribute(p.allGeoIndexArray, 1);
	    groundGeometry.setAttribute("position", positionAttribute);
	    groundGeometry.setIndex(indexAttribute);
	    groundGeometry.deleteAttribute("normal");
	    groundGeometry = BufferGeometryUtils.mergeVertices(groundGeometry);
	    groundGeometry.computeVertexNormals();
  
	    let groundGroup = new THREE.Object3D();
	    groundGroup.add(new THREE.Mesh(groundGeometry, groundMaterial)); 
	    let box = new THREE.Box3().setFromObject(groundGroup, true);
        let widthScale = (box.max.x - box.min.x) > (box.max.z - box.min.z) ? (js3CommonFunction.mm2m(parameters["宽度"].value) / (box.max.x - box.min.x)) : (js3CommonFunction.mm2m(parameters["宽度"].value) / (box.max.z - box.min.z));
        let heightScale = js3CommonFunction.mm2m(parameters["高度"].value) / (box.max.y - box.min.y);
        groundGroup.scale.set(widthScale, heightScale, widthScale);
	    let newBox = new THREE.Box3().setFromObject(groundGroup, true);
	    groundGroup.position.set(-(newBox.min.x + newBox.max.x) / 2, -(newBox.min.y + newBox.max.y) / 2, -(newBox.min.z + newBox.max.z) / 2);

        let groundOuterObject3D = new THREE.Object3D();
        groundOuterObject3D.add(groundGroup);	    
        groundOuterObject3D.rotation.set(rotation[0], rotation[1], rotation[2]);
        groundOuterObject3D.position.set(position[0], position[1], position[2]); 
        
	    //更换外框材质
		let resourceBoxEdgeMaterial = pluginProcessor.editor.object3DCreator.resourceBoxEdgeMaterial;
		pluginProcessor.changeBoxMaterial(object3D, resourceBoxEdgeMaterial);
	    
	    object3D.add(groundOuterObject3D);
	    object3D.assistPoints = [];
	    object3D.assistPoints.push({
			pointType: p.pointType,
			x: 0,
			y: -p.bottomY * heightScale,
			z: 0
		});
	    
	    //判断如果已选中，那么把客户端造型的object也设置为选中
	    if(pluginProcessor.editor.selectedUnitObject3D != null && pluginProcessor.editor.selectedUnitObject3D.unitData.id == object3D.unitData.id){
	    	pluginProcessor.editor.selectObjectLight(object3D);
	    }
	},
	getGeoInfos: function(p){
		let pluginProcessor = js3CommandProcessors["createGround"];
		let partCount = pluginProcessor.editor.object3DCreator.getSphereSegmentCount();
		let groundJson = p.json;
		let xCount = groundJson.xCount;
		let zCount = groundJson.zCount;
		let xxCount = (xCount - 1) * partCount + 1;
		let zzCount = (zCount - 1) * partCount + 1;
		
		//x轴坐标
		let xValues = groundJson.xValues;

		//z轴坐标
		let zValues = groundJson.zValues;
		
		//y轴坐标
		let yValues = groundJson.yValues;

		//平行于z轴的曲线
		let vLines = [];
		for(let i = 0; i < xCount; i++){
			let x = xValues[i];
			
			//作为2D曲线计算样条上的点
			let points = [];
			for(let j = 0; j < zCount; j++){
				let z = zValues[j];
				let y = yValues[i][j];
				points.push({x: z, y: y});
			}
			let csiPoints = CubicSpline.calcPoints(points, partCount);
			
			let linePoints = [];
			for(let j = 0; j < csiPoints.length; j++){
				let p = csiPoints[j];
				linePoints.push({x: x, y: p.y, z: p.x});
			}
			vLines.push(linePoints);
		}
				
		//利用平行于z轴的xCount条线，构造更密集的平行于x轴的线，然后做样条
		let hhLines = [];
		for(let i = 0; i < zzCount; i++){
			let z = vLines[0][i].z;
			let points = [];
			for(let j = 0; j < xCount; j++){
				let point = vLines[j][i];
				points.push({x: point.x, y: point.y});
			}
			 
			let csiPoints = CubicSpline.calcPoints(points, partCount);
			
			let linePoints = [];
			for(let j = 0; j < csiPoints.length; j++){
				let p = csiPoints[j];
				linePoints.push({x: p.x, y: p.y, z: z});
			}
			hhLines.push(linePoints);
		}

		//平行于x轴的曲线
		let hLines = [];
		for(let i = 0; i < zCount; i++){
			let z = zValues[i];
			
			//作为2D曲线计算样条上的点
			let points = [];
			for(let j = 0; j < xCount; j++){
				let x = xValues[j];
				let y = yValues[j][i];
				points.push({x: x, y: y});
			}
			let csiPoints = pluginProcessor.getCurvePath(points, partCount * (points.length - 1));
			
			let linePoints = [];
			for(let j = 0; j < csiPoints.length; j++){
				let p = csiPoints[j];
				linePoints.push({x: p.x, y: p.y, z: z});
			}
			hLines.push(linePoints);
		}
		
		//利用平行于x轴的yCount条线，构造更密集的平行于y轴的线，然后做样条
		let vvLines = [];
		for(let i = 0; i < xxCount; i++){
			let x = hLines[0][i].x;
			let points = [];
			for(let j = 0; j < zCount; j++){
				let point = hLines[j][i];
				points.push({x: point.z, y: point.y});
			}
			 
			let csiPoints = pluginProcessor.getCurvePath(points, partCount * (points.length - 1));
			
			let linePoints = [];
			for(let j = 0; j < csiPoints.length; j++){
				let p = csiPoints[j];
				linePoints.push({x: x, y: p.y, z: p.x});
			}
			vvLines.push(linePoints);
		}
		
		
		//构造顶部（地面）部分的点和面
		let allFaces = [];
		let allPoints = [];
		for(let i = 0; i < vvLines.length; i++){
			//竖直方向上的点
			let vvPoints = vvLines[i];
			let vvCount = vvPoints.length;
			
			//遍历竖直方向上的点，找出来水平方向上的点，取平均值
			for(let j = 0; j < vvCount; j++){
				let vvPoint = vvPoints[j];
				
				//获取水平方向上的点
				let hhPoint = hhLines[j][i];
				
				//计算平均值点
				let point = {x: js3CommonFunction.mm2m(vvPoint.x + hhPoint.x) / 2, 
					y: js3CommonFunction.mm2m(vvPoint.y + hhPoint.y) / 2, 
					z: js3CommonFunction.mm2m(vvPoint.z + hhPoint.z) / 2
				};
				allPoints.push(point);
				
				//面
				if(i != 0 && j != 0){
					let pointIndex = allPoints.length - 1;
					let faceA = {a: pointIndex - vvCount - 1, b: pointIndex - vvCount, c: pointIndex};
					let faceB = {a: pointIndex, b: pointIndex - 1, c: pointIndex - vvCount - 1};
					allFaces.push(faceA);
					allFaces.push(faceB);
				}
			}
		} 
		
		var allGeoPositionArray = [];
		var allGeoIndexArray = [];
		for(let i = 0; i < allFaces.length; i++){
			let face = allFaces[i];
			allGeoIndexArray.push(i * 3);
			allGeoIndexArray.push(i * 3 + 1);
			allGeoIndexArray.push(i * 3 + 2);
			
			let aPoint = allPoints[face.a];
			allGeoPositionArray.push(aPoint.x);
			allGeoPositionArray.push(aPoint.y);
			allGeoPositionArray.push(aPoint.z);
			
			let bPoint = allPoints[face.b];
			allGeoPositionArray.push(bPoint.x);
			allGeoPositionArray.push(bPoint.y);
			allGeoPositionArray.push(bPoint.z);
			
			let cPoint = allPoints[face.c];
			allGeoPositionArray.push(cPoint.x);
			allGeoPositionArray.push(cPoint.y);
			allGeoPositionArray.push(cPoint.z);
		}

		//找到最低点，注意，这里是三维的点
		let bottomY = Number.MAX_VALUE;
		for(let i = 0; i < allPoints.length; i++){
			let point = allPoints[i];
			let y = point.y;
			if(y < bottomY){
				bottomY = y;
			} 
		} 
		 
		return {
			allGeoPositionArray: allGeoPositionArray,
			allGeoIndexArray: allGeoIndexArray,
			bottomY: bottomY
		};		
	},
	createFloatAttribute: function(array, itemSize) {
	  const typedArray = new Float32Array(array);
	  return new THREE.BufferAttribute(typedArray, itemSize, false);
	},
	createIntAttribute: function(array, itemSize) {
	  const typedArray = new Uint32Array(array);
	  return new THREE.BufferAttribute(typedArray, itemSize, false);
	},
	normalizeAttribute: function(attribute) {
	  var v = new THREE.Vector3();
	  for (var i = 0; i < attribute.count; i++) {
	    v.set(attribute.getX(i), attribute.getY(i), attribute.getZ(i));
	    v.normalize();
	    attribute.setXYZ(i, v.x, v.y, v.z);
	  }
	  return attribute;
	},
	//更换外框材质
	changeBoxMaterial: function(object3D, resourceBoxEdgeMaterial){
		let pluginProcessor = js3CommandProcessors["createGround"];
		for(var i = 0; i < object3D.children.length; i++){
			let subObject3D = object3D.children[i];
			if(subObject3D.isLine){
				subObject3D.material = resourceBoxEdgeMaterial;
			}
			else{
				pluginProcessor.changeBoxMaterial(subObject3D, resourceBoxEdgeMaterial);
			}
		}
	},
	getCurvePath: function(point2Ds, curvePointCount){
		let point3Ds = new Array();
		for(var i = 0; i < point2Ds.length; i++){
			var point2D = point2Ds[i];
			var p = new THREE.Vector3(point2D.x, point2D.y, 0);
			point3Ds.push(p);
		}
		var curve = new THREE.CatmullRomCurve3(point3Ds);
		var curvePoint3Ds = curve.getPoints(curvePointCount); 
		let curvePoint2Ds = new Array();
		for(var i = 0; i < curvePoint3Ds.length; i++){
			var curvePoint3D = curvePoint3Ds[i];
			curvePoint2Ds.push({
				x: curvePoint3D.x,
				y: curvePoint3D.y,
				z: 0
			});
		}
		return curvePoint2Ds;
	}
};