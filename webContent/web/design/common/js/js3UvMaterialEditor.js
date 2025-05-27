import * as THREE from "three";
import {CSS2DRenderer} from "three/addons/renderers/CSS2DRenderer.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
//因升级threejs r146，更新此代码 modified by ls 20230322
let JS3UvMaterialEditor = function(){
	var thatMaterialEditor = this;   
	this.containerId = null; 
	this.name = null;
	
	this.unitUvInfo = {
		id: null,
		uvs: null
	};
	
	this.camera = null; //相机
	this.renderer = null; //渲染器 
	this.renderer2d = null; //渲染器2D
	this.orbitControl = null; //控制器
	this.raycaster = null; //光投射器 
	this.backgroundColor = 0xFFF0BA;
	this.pi = 3.14159265;
	this.mouseDownPosition = null;
	this.materialObject3D = null;
	this.selectedMesh = null;
	this.selectedFaceUv = null;
	this.materialParameters = null;
	this.materialParamWin = null;
	this.opacityMaterial = null;
	
	this.faceLine = null;
	this.faceLineColor = 0xFF0000;
	this.faceSegBalls = null;
	this.faceSegBallColors = [0x00FF00, 0x0000FF, 0x00FFFF];
	this.faceSegBallRadius = 0.1;

	this.singleParamWin = null;
	this.multiParamWin = null;
	this.pointsParamWin = null;
	
	this.containerPos = {
		x: 0,
		y: 0
	}; 
	this.getMaterials = function(){
		var materials = [];
		var resultValues = thatMaterialEditor.materialParamWin.getParamValues();
		var materialInputElements = $("#" + thatMaterialEditor.containerId).find(".materialStandard .zlpDispUnitInput");
		for(var i = 0; i < materialInputElements.length; i++){ 
			var materialInputElement = materialInputElements[i];
			var fieldName = $(materialInputElement).attr("name");
			var materialName = $(materialInputElement).attr("materialName");
			var materialStandard = resultValues[fieldName];
			if(materialStandard != null && materialStandard.length != 0){
				materials.push({
					name: materialName,
					standard: materialStandard
				});
			}
		}
		return materials.length == 0 ? null : materials;
	}
	         
	this.init = function(p){
		thatMaterialEditor.containerId = p.containerId;
		thatMaterialEditor.name = p.name;
		thatMaterialEditor.selectedMaterialName = p.materialName;    
		thatMaterialEditor.unitUvInfo = thatMaterialEditor.getUnitUvInfo(p.sourceObject3D.unitData);	
		thatMaterialEditor.faceSegBallRadius = p.faceSegBallRadius == null ? thatMaterialEditor.faceSegBallRadius : p.faceSegBallRadius;
		thatMaterialEditor.initScene();
		thatMaterialEditor.initCamera();
		thatMaterialEditor.initRender();
		thatMaterialEditor.initRender2D();
		thatMaterialEditor.initRaycaster();      
		thatMaterialEditor.initLight();
		thatMaterialEditor.initControls();
		thatMaterialEditor.initContainerPos();
		thatMaterialEditor.initOpacityMaterial();
		thatMaterialEditor.initParameterInputs(); 
		thatMaterialEditor.initFaceLine();
		thatMaterialEditor.animate();
		thatMaterialEditor.addObject3D(p.sourceObject3D);
		thatMaterialEditor.showAllMeshes(thatMaterialEditor.materialObject3D);
		thatMaterialEditor.initObject3DMaterial(thatMaterialEditor.materialObject3D);
	}

 	//增加导出gltf的功能 added by ls 20210825
	this.exportGltf = function(){

		var gltfExporter = new THREE.GLTFExporter();
		gltfExporter.parse(thatMaterialEditor.materialObject3D, function(result){
			var link = document.createElement("a");
			link.style.display = "none";
			document.body.appendChild(link);
			link.href = URL.createObjectURL(new Blob([JSON.stringify(result)], {type: "text/plain"}));
			link.download = unescape(thatMaterialEditor.name) + ".gltf";
			link.click();
			document.body.removeChild(link);
		});
	}

 	//增加导入uv贴图值的功能 added by ls 20210825
	this.importUV = function(){
		
	}
	
	this.initParameterInputs = function(){ 
		thatMaterialEditor.initMultiParameterInputs(); 
		thatMaterialEditor.initSingleParameterInputs(); 
		thatMaterialEditor.initPointsParameterInputs(); 
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditorFaceSettingTab").click(function(){
			$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingInnerContainer").removeClass("uvMaterialEditFaceSettingInnerContainerActive");
			$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditorFaceSettingTab").removeClass("uvMaterialEditorFaceSettingTabActive");
			$(this).addClass("uvMaterialEditorFaceSettingTabActive");
			var name = $(this).attr("name");
			$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingInnerContainer[name='" + name + "']").addClass("uvMaterialEditFaceSettingInnerContainerActive");
			if(name == "pointsSetting"){
				thatMaterialEditor.initPointLabels(thatMaterialEditor.selectedMesh);
			}
			else{
				thatMaterialEditor.removePointLabels();
			}
		});
	}
	
	
	this.initSingleParameterInputs = function(){ 
		var inputContainerId = cmnPcr.getRandomValue();
		var inputContainer = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingInnerContainer[name='singleSetting']");
		$(inputContainer).attr("id", inputContainerId);
		var paramWin = new NcpParamWin({
			containerId: inputContainerId,
			paramWinModel: thatMaterialEditor.formUISingleParameters
		});  
		paramWin.valueChange = function(jq, value){	
			var faceUv = thatMaterialEditor.selectedFaceUv;
			var name = $(jq).attr("name");
			switch(name){
				case "singleimagename":{
					faceUv.imageName = value == null ? null : value.name;
					break;
				}
				case "pointax":{
					faceUv.a.x = value;
					break;
				}
				case "pointay":{
					faceUv.a.y = value;
					break;
				}
				case "pointbx":{
					faceUv.b.x = value;
					break;
				}
				case "pointby":{
					faceUv.b.y = value;
					break;
				}
				case "pointcx":{
					faceUv.c.x = value;
					break;
				}
				case "pointcy":{
					faceUv.c.y = value;
					break;
				}
			}			
			thatMaterialEditor.refreshSingleFaceUvInMesh(thatMaterialEditor.selectedMesh, faceUv);
		};
		paramWin.show();
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingContainer").css({"display": "none"});
		thatMaterialEditor.singleParamWin = paramWin;
	}
	
	this.initMultiParameterInputs = function(){ 
		var inputContainerId = cmnPcr.getRandomValue();
		var inputContainer = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingInnerContainer[name='multiSetting']");
		$(inputContainer).attr("id", inputContainerId);
		var paramWin = new NcpParamWin({
			containerId: inputContainerId,
			paramWinModel: thatMaterialEditor.formUIMultiParameters
		});  
		paramWin.valueChange = function(jq, value){	
			var resultValues = thatMaterialEditor.multiParamWin.getParamResult().values; 
			var multiFaceUv = {
				imageName: resultValues["multiimagename"],
				left: resultValues["left"],
				right: resultValues["right"],
				top: resultValues["top"],
				bottom: resultValues["bottom"]
			};
			thatMaterialEditor.refreshMultiFaceUvInMesh(multiFaceUv);
		};
		paramWin.show();
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingContainer").css({"display": "none"});
		thatMaterialEditor.multiParamWin = paramWin;
	}
	
	this.initPointsParameterInputs = function(){ 
		var inputContainerId = cmnPcr.getRandomValue();
		var inputContainer = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingInnerContainer[name='pointsSetting']");
		$(inputContainer).attr("id", inputContainerId);
		var paramWin = new NcpParamWin({
			containerId: inputContainerId,
			paramWinModel: thatMaterialEditor.formUIPointsParameters
		});   
		paramWin.show();
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingContainer").css({"display": "none"});
		thatMaterialEditor.pointsParamWin = paramWin;

		$("#" + thatMaterialEditor.containerId).find(".vvMaterialEditorPointsUvBtn").click(function(){
			var resultValues = thatMaterialEditor.pointsParamWin.getParamResult().values; 
			var pointsUv ={
				imageName: resultValues["pointsimagename"],
				uv: resultValues["pointsuv"]
			}
			if(pointsUv.imageName.length == 0){
				msgBox.alert({info: "请选择图片"});
			}
			else if(pointsUv.uv.length == 0){
				msgBox.alert({info: "请填写多点uv的值"});
			}
			else{
				thatMaterialEditor.refreshPointsUvInMesh(pointsUv);
			}
		});
	}
	
	this.refreshPointsUvInMesh = function(pointsUv){
		var uvPoints = {};
		var pointLines = pointsUv.uv.split("\n");
		for(var i = 0; i < pointLines.length; i++){
			var pointLine = pointLines[i].trim();
    		var pointValues = pointLine.split("\t");
    		if(pointValues.length == 0){
    			//不做处理
    		}
    		else if(pointValues.length == 1){
    			uvPoints[pointValues[0].trim()] = {
    				x: null,
    				y: null
    			};
    		}
    		else if(pointValues.length == 3){
    			uvPoints[pointValues[0].trim()] = {
    				x: parseFloat(pointValues[1].trim()),
    				y: parseFloat(pointValues[2].trim())
    			};
    		}
    		else{
    			msgBox.alert({info: "多点uv的值错误(" + pointValues[0] + ")"});
    			return false;
    		}    		
		}
		var mesh = thatMaterialEditor.selectedMesh;

		var materialIndex = 0;
		for(var i = 0; i < mesh.material.length; i++){
			var m = mesh.material[i];
			if(m.name == pointsUv.imageName){
				materialIndex = i;
			} 
		}
		if(materialIndex == 0){
			var imageUrl = basePath + "/cms/getCMSImage?name=" + pointsUv.imageName;
	      	var texture = THREE.ImageUtils.loadTexture(imageUrl, {}, function() { 	
				 
	      	});
			var faceMaterial = new THREE.MeshPhongMaterial( { 
				name: pointsUv.imageName,
				map: texture,
				flatShading: true,
	        	side: THREE.FrontSide 
			});
			mesh.material.push(faceMaterial); 
			materialIndex = mesh.material.length - 1;
		}
		
		
		var vertices = mesh.geometry.vertices;
		var allFaces = mesh.geometry.faces;
		var meshFaceUvs = thatMaterialEditor.unitUvInfo.uvs[mesh.name];
		if(meshFaceUvs == null){	 
			meshFaceUvs = {};
			thatMaterialEditor.unitUvInfo.uvs[meshNamePath] = meshFaceUvs;
		} 
		for(var i = 0; i < allFaces.length; i++){
			var face = allFaces[i];
			if(uvPoints[face.a] != null && uvPoints[face.b] != null && uvPoints[face.c] != null){
				var faceVertex = mesh.geometry.faceVertexUvs[0][i]; 
				var faceUv = {
					faceIndex: i.toString(),
					imageName: pointsUv.imageName,
					a: {
						x: uvPoints[face.a].x, 
						y: uvPoints[face.a].y
					},
					b:  {
						x: uvPoints[face.b].x, 
						y: uvPoints[face.b].y
					},
					c: {
						x: uvPoints[face.c].x, 
						y: uvPoints[face.c].y
					}
				};
				face.materialIndex = materialIndex;
				meshFaceUvs[i.toString()] = faceUv; 
				faceVertex[0].set(faceUv.a.x, faceUv.a.y);
				faceVertex[1].set(faceUv.b.x, faceUv.b.y);
				faceVertex[2].set(faceUv.c.x, faceUv.c.y);
			}
		}
		mesh.geometry.uvsNeedUpdate = true;	 	
		mesh.geometry.groupsNeedUpdate = true;
	}
	
	this.refreshMultiFaceUvInMesh = function(multiFaceUv){
		if(multiFaceUv.imageName != null
			&& multiFaceUv.left != null
			&& multiFaceUv.right != null
			&& multiFaceUv.top != null
			&& multiFaceUv.bottom != null){
			var mesh = thatMaterialEditor.selectedMesh;
			
			var faceIndexes = mesh.geometry.index.array;
			var uvs = mesh.geometry.attributes.uv.array;
			var positionArray = mesh.geometry.attributes.position.array;
			var groups = mesh.geometry.groups;		
			
			var materialIndex = 0;
			for(var i = 0; i < mesh.material.length; i++){
				var m = mesh.material[i];
				if(m.name == multiFaceUv.imageName){
					materialIndex = i;
				} 
			}
			if(materialIndex == 0){
				var imageUrl = basePath + "/cms/getCMSImage?name=" + multiFaceUv.imageName;

  				let textureLoader = new THREE.TextureLoader();
				var texture = textureLoader.load(imageUrl, function () { });
				var faceMaterial = new THREE.MeshPhongMaterial( { 
					name: multiFaceUv.imageName,
					map: texture,
					flatShading: true,
		        	side: THREE.FrontSide 
				});
				mesh.material.push(faceMaterial); 
				materialIndex = mesh.material.length - 1;
			}
			
			var allCheckedInputs = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceItemChecked");
			var allFaceIndexes = new Array();
			for(var i = 0; i < allCheckedInputs.length; i++){
				var faceItem = $(allCheckedInputs[i]).parent();
				var faceIndex = $(faceItem).attr("faceIndex");
				allFaceIndexes.push(faceIndex);
			}
			
			var faceAIndex = faceIndexes[faceIndex * 3];
			var faceBIndex = faceIndexes[faceIndex * 3 + 1];
			var faceCIndex = faceIndexes[faceIndex * 3 + 2];
			var pointA = new THREE.Vector3(positionArray[faceAIndex * 3], positionArray[faceAIndex * 3 + 1], positionArray[faceAIndex * 3 + 2]);
			var pointB = new THREE.Vector3(positionArray[faceBIndex * 3], positionArray[faceBIndex * 3 + 1], positionArray[faceBIndex * 3 + 2]);
			var pointC = new THREE.Vector3(positionArray[faceCIndex * 3], positionArray[faceCIndex * 3 + 1], positionArray[faceCIndex * 3 + 2]);
			var flatPointDirect = thatMaterialEditor.getFlatPointDirect(pointA, pointB, pointC);
			
			var axisList = new Array();
			if("x" != flatPointDirect){
				axisList.push("x");
			}
			if("y" != flatPointDirect){
				axisList.push("y");
			}
			if("z" != flatPointDirect){
				axisList.push("z");
			}
			var minMaxValue = {
				minH: 10000,
				minV: 10000,
				maxH: -10000,
				maxV: -10000
			};
			for(var i = 0; i < allFaceIndexes.length; i++){
				var fIndex = allFaceIndexes[i];
				
				var fAIndex = faceIndexes[fIndex * 3];
				var fBIndex = faceIndexes[fIndex * 3 + 1];
				var fCIndex = faceIndexes[fIndex * 3 + 2];
				var pA = new THREE.Vector3(positionArray[fAIndex * 3], positionArray[fAIndex * 3 + 1], positionArray[fAIndex * 3 + 2]);
				var pB = new THREE.Vector3(positionArray[fBIndex * 3], positionArray[fBIndex * 3 + 1], positionArray[fBIndex * 3 + 2]);
				var pC = new THREE.Vector3(positionArray[fCIndex * 3], positionArray[fCIndex * 3 + 1], positionArray[fCIndex * 3 + 2]);
				
				if(pA[axisList[0]] < minMaxValue.minH){
					minMaxValue.minH = pA[axisList[0]];
				}
				if(pB[axisList[0]] < minMaxValue.minH){
					minMaxValue.minH = pB[axisList[0]];
				}
				if(pC[axisList[0]] < minMaxValue.minH){
					minMaxValue.minH = pC[axisList[0]];
				} 

				if(pA[axisList[1]] < minMaxValue.minV){
					minMaxValue.minH = pA[axisList[1]];
				}
				if(pB[axisList[1]] < minMaxValue.minV){
					minMaxValue.minH = pB[axisList[1]];
				}
				if(pC[axisList[1]] < minMaxValue.minV){
					minMaxValue.minV = pC[axisList[1]];
				} 

				if(pA[axisList[0]] > minMaxValue.maxH){
					minMaxValue.maxH = pA[axisList[0]];
				}
				if(pB[axisList[0]] > minMaxValue.maxH){
					minMaxValue.maxH = pB[axisList[0]];
				}
				if(pC[axisList[0]] > minMaxValue.maxH){
					minMaxValue.maxH = pC[axisList[0]];
				} 

				if(pA[axisList[1]] > minMaxValue.maxV){
					minMaxValue.maxV = pA[axisList[1]];
				}
				if(pB[axisList[1]] > minMaxValue.maxV){
					minMaxValue.maxV = pB[axisList[1]];
				}
				if(pC[axisList[1]] > minMaxValue.maxV){
					minMaxValue.maxV = pC[axisList[1]];
				} 
			}

			var meshFaceUvs = thatMaterialEditor.unitUvInfo.uvs[mesh.name];
			 
			for(var i = 0; i < allFaceIndexes.length; i++){
				var fIndex = allFaceIndexes[i];
				
				var fAIndex = faceIndexes[fIndex * 3];
				var fBIndex = faceIndexes[fIndex * 3 + 1];
				var fCIndex = faceIndexes[fIndex * 3 + 2];
				var pA = new THREE.Vector3(positionArray[fAIndex * 3], positionArray[fAIndex * 3 + 1], positionArray[fAIndex * 3 + 2]);
				var pB = new THREE.Vector3(positionArray[fBIndex * 3], positionArray[fBIndex * 3 + 1], positionArray[fBIndex * 3 + 2]);
				var pC = new THREE.Vector3(positionArray[fCIndex * 3], positionArray[fCIndex * 3 + 1], positionArray[fCIndex * 3 + 2]);
				var groupStart = faceIndexes[fIndex * 3];
				
				var group = thatMaterialEditor.getUvGroup(mesh, fIndex);
				 
				if(meshFaceUvs == null){	 
					meshFaceUvs = {};
					thatMaterialEditor.unitUvInfo.uvs[meshNamePath] = meshFaceUvs;
				} 		
				
				var faceUv = {
					faceIndex: fIndex,
					imageName: multiFaceUv.imageName,
					a: {
						x: multiFaceUv.left + (multiFaceUv.right - multiFaceUv.left) * (pA[axisList[0]] - minMaxValue.minH) / (minMaxValue.maxH - minMaxValue.minH), 
						y: multiFaceUv.top + (multiFaceUv.bottom - multiFaceUv.top) * (pA[axisList[1]] - minMaxValue.minV) / (minMaxValue.maxV - minMaxValue.minV)
					},
					b:  {
						x: multiFaceUv.left + (multiFaceUv.right - multiFaceUv.left) * (pB[axisList[0]] - minMaxValue.minH) / (minMaxValue.maxH - minMaxValue.minH), 
						y: multiFaceUv.top + (multiFaceUv.bottom - multiFaceUv.top) * (pB[axisList[1]] - minMaxValue.minV) / (minMaxValue.maxV - minMaxValue.minV)
					},
					c: {
						x: multiFaceUv.left + (multiFaceUv.right - multiFaceUv.left) * (pC[axisList[0]] - minMaxValue.minH) / (minMaxValue.maxH - minMaxValue.minH), 
						y: multiFaceUv.top + (multiFaceUv.bottom - multiFaceUv.top) * (pC[axisList[1]] - minMaxValue.minV) / (minMaxValue.maxV - minMaxValue.minV)
					}
				};
				
				uvs[groupStart * 2] = faceUv.a.x;
				uvs[groupStart * 2 + 1] = faceUv.a.y;
				uvs[(groupStart + 1) * 2] = faceUv.b.x;
				uvs[(groupStart + 1) * 2 + 1] = faceUv.b.y;
				uvs[(groupStart + 2) * 2] = faceUv.c.x;
				uvs[(groupStart + 2)* 2 + 1] = faceUv.c.y;

				if(group == null){
					group = {
						count: 3,
						materialIndex: materialIndex,
						start: groupStart
					};
					mesh.geometry.groups.push(group);
				}
				else{
					group.materialIndex = materialIndex;
				}		
				
				meshFaceUvs[fIndex] = faceUv;  
			}
			mesh.geometry.setAttribute("uv", new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );	
		}
		else{
			var mesh = thatMaterialEditor.selectedMesh;
			var faceIndexes = mesh.geometry.index.array;
			var uvs = mesh.geometry.attributes.uv.array;
			var positionArray = mesh.geometry.attributes.position.array;
			var groups = mesh.geometry.groups;		
			var allCheckedInputs = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceItemChecked");
			var allFaceIndexes = new Array();
			for(var i = 0; i < allCheckedInputs.length; i++){
				var faceItem = $(allCheckedInputs[i]).parent();
				var faceIndex = $(faceItem).attr("faceIndex");
				allFaceIndexes.push(faceIndex);
			} 
			var allFaces = mesh.geometry.faces;
			for(var i = 0; i < allFaceIndexes.length; i++){
				var fIndex = allFaceIndexes[i];
				
				var fAIndex = faceIndexes[fIndex * 3];
				var fBIndex = faceIndexes[fIndex * 3 + 1];
				var fCIndex = faceIndexes[fIndex * 3 + 2];
				var pA = new THREE.Vector3(positionArray[fAIndex * 3], positionArray[fAIndex * 3 + 1], positionArray[fAIndex * 3 + 2]);
				var pB = new THREE.Vector3(positionArray[fBIndex * 3], positionArray[fBIndex * 3 + 1], positionArray[fBIndex * 3 + 2]);
				var pC = new THREE.Vector3(positionArray[fCIndex * 3], positionArray[fCIndex * 3 + 1], positionArray[fCIndex * 3 + 2]);
				var groupStart = faceIndexes[fIndex * 3];
				
				var group = thatMaterialEditor.getUvGroup(mesh, fIndex);
				if(group != null){
					group.materialIndex = 0;
				}		
			}
			mesh.geometry.groupsNeedUpdate = true;	 
 
			var meshFaceUvs = thatMaterialEditor.unitUvInfo.uvs[mesh.name];
			for(var i = 0; i < allFaceIndexes.length; i++){
				var fIndex = allFaceIndexes[i];
				if(meshFaceUvs == null){ 
					meshFaceUvs = {};
					thatMaterialEditor.unitUvInfo.uvs[meshNamePath] = meshFaceUvs;
				}
				meshFaceUvs[faceIndex] = {
					faceIndex: fIndex,
					imageName: null,
					a: {x: null, y: null},
					b: {x: null, y: null},
					c: {x: null, y: null}
				};  
			}
		}
	}
	
	//获取面对应的material的group added by ls 20231011
	this.getUvGroup = function(mesh, faceIndex){
		var faceIndexes = mesh.geometry.index.array;
		var pointArray = mesh.geometry.attributes.position.array;
		var groupStart = faceIndexes[faceIndex * 3]; 
		var groups = mesh.geometry.groups;
		
		//从第2个group找起
		for(var i = 1; i < groups.length; i++){
			var g = groups[i];
			if(g.start == groupStart){
				return g;
			}
		}
		return null;
	}
	
	this.refreshSingleFaceUvInMesh = function(mesh, faceUv){
		var faceIndexes = mesh.geometry.index.array;
		var uvs = mesh.geometry.attributes.uv.array;
		var groups = mesh.geometry.groups;		
		var group = thatMaterialEditor.getUvGroup(mesh, faceUv.faceIndex);
		if(faceUv.imageName != null 
			&& faceUv.a.x != null
			&& faceUv.a.y != null
			&& faceUv.b.x != null
			&& faceUv.b.y != null
			&& faceUv.c.x != null
			&& faceUv.c.y != null){
			var materialIndex = 0;
			for(var i = 0; i < mesh.material.length; i++){
				var m = mesh.material[i];
				if(m.name == faceUv.imageName){
					materialIndex = i;
				} 
			}
			if(materialIndex == 0){
				var imageUrl = basePath + "/cms/getCMSImage?name=" + faceUv.imageName;
  				let textureLoader = new THREE.TextureLoader();
				var texture = textureLoader.load(imageUrl, function () { });
				var faceMaterial = new THREE.MeshPhongMaterial( { 
					name: faceUv.imageName,
					map: texture,
					flatShading: true,
		        	side: THREE.FrontSide 
				});
				mesh.material.push(faceMaterial); 
				materialIndex = mesh.material.length - 1;
			}
			
			var groupStart = faceIndexes[faceUv.faceIndex * 3];
			uvs[groupStart * 2] = faceUv.a.x;
			uvs[groupStart * 2 + 1] = faceUv.a.y;
			uvs[(groupStart + 1) * 2] = faceUv.b.x;
			uvs[(groupStart + 1) * 2 + 1] = faceUv.b.y;
			uvs[(groupStart + 2) * 2] = faceUv.c.x;
			uvs[(groupStart + 2)* 2 + 1] = faceUv.c.y;
			if(group == null){
				group = {
					count: 3,
					materialIndex: materialIndex,
					start: groupStart
				};
				mesh.geometry.groups.push(group);
			}
			else{
				group.materialIndex = materialIndex;
			}				
			
			//mesh.geometry.uvsNeedUpdate = true;	 	
			//mesh.geometry.groupsNeedUpdate = true;	 
			mesh.geometry.setAttribute("uv", new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );	
		}
		else{
			if(group != null){
				var newGroups = new Array();
				for(var i = 0; i < groups.length; i++){
					var g = groups[i];
					if(g != group){
						newGroups.push(g);
					}
				}
				mesh.geometry.groups = newGroups;
				mesh.geometry.groupsNeedUpdate = true;	 
			}
		}
		/*
		var face = mesh.geometry.faces[faceUv.faceIndex];
		if(faceUv.imageName != null 
			&& faceUv.a.x != null
			&& faceUv.a.y != null
			&& faceUv.b.x != null
			&& faceUv.b.y != null
			&& faceUv.c.x != null
			&& faceUv.c.y != null){  
			var faceVertex = mesh.geometry.faceVertexUvs[0][faceUv.faceIndex];
			var materialIndex = 0;
			for(var i = 0; i < mesh.material.length; i++){
				var m = mesh.material[i];
				if(m.name == faceUv.imageName){
					materialIndex = i;
				} 
			}
			if(materialIndex == 0){
				var imageUrl = basePath + "/cms/getCMSImage?name=" + faceUv.imageName;
		      	var texture = THREE.ImageUtils.loadTexture(imageUrl, {}, function() { 	
					 
		      	});
				var faceMaterial = new THREE.MeshPhongMaterial( { 
					name: faceUv.imageName,
					map: texture,
					flatShading: true,
		        	side: THREE.FrontSide 
				});
				mesh.material.push(faceMaterial); 
				materialIndex = mesh.material.length - 1;
			}
			face.materialIndex = materialIndex;
			faceVertex[0].set(faceUv.a.x, faceUv.a.y);
			faceVertex[1].set(faceUv.b.x, faceUv.b.y);
			faceVertex[2].set(faceUv.c.x, faceUv.c.y);	
			mesh.geometry.uvsNeedUpdate = true;	 	
			mesh.geometry.groupsNeedUpdate = true;	 	
		}
		else{
			if(face.materialIndex != 0){
				face.materialIndex = 0;
				mesh.geometry.groupsNeedUpdate = true;	 
			}
		}
		*/
	}
	
	this.initFaceLine = function(){ 
        var lineMaterial = new THREE.LineBasicMaterial({ 
        	color: thatMaterialEditor.faceLineColor,
        	depthTest: false,
        	transparent: true,
        	opacity: 0.5,
        	side: THREE.FrontSide
		});   
		var lineGeometry = new THREE.BufferGeometry();
		var vertices = [0, 0, 0, 1, 0, 0, 1, 1, 0];
		lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
		
        /*
        var lineGeometry = new THREE.Geometry(); 
        lineGeometry.vertices.push(
    		new THREE.Vector3(0, 0, 0),
    		new THREE.Vector3(1, 0, 0),
    		new THREE.Vector3(1, 1, 0)
		); 
		*/
		
        var line = new THREE.LineLoop( lineGeometry, lineMaterial );
        line.isFaceLine = true;
        line.visible = false;
        thatMaterialEditor.scene.add(line); 
		thatMaterialEditor.faceLine = line;
		
		var allSegBalls = new Array();
		for(var i = 0; i < 3; i++){
	        var ballGeometry = new THREE.SphereGeometry(thatMaterialEditor.faceSegBallRadius, 10, 10); 
	        var ballMaterial = new THREE.MeshBasicMaterial({
	        	color: thatMaterialEditor.faceSegBallColors[i],
	        	depthTest: false,
	        	opacity: 0.5,
	        	side: THREE.FrontSide
	    	}); 
	        var ball = new THREE.Mesh(ballGeometry, ballMaterial); 
	        ball.isFaceLine = true;
	        ball.visible = false;
	        thatMaterialEditor.scene.add(ball); 
	        allSegBalls.push(ball);
		}
		thatMaterialEditor.faceSegBalls = allSegBalls;
	}
	
	this.initOpacityMaterial = function(){
      	var material = new THREE.MeshPhongMaterial({
      		color: 0xFFFFFF,
      		transparent: true,
      		opacity: 0.2,
			flatShading: true,
        	side: THREE.FrontSide 
      	}); 
      	thatMaterialEditor.opacityMaterial = material; 
	}  
 
    this.setChildNewMaterial = function(object3D, materialName, material){  		
	  	for(var i = 0; i < object3D.children.length; i++){
	  		var childObj = object3D.children[i];
    		if(!childObj.isUserObject){
    			if(childObj.type == "Mesh" && childObj.children.length == 0){
    				var mesh = childObj;
			  		var needChangeMeterial = false;
			  		if(mesh.oldMaterial != null){
			  			if(mesh.oldMaterial.name == materialName){
				  			needChangeMeterial = true;
			  			}
			  		}
			  		else{
			  			if(mesh.material.name == materialName){
				  			needChangeMeterial = true;
			  			}
			  		}
			  		if(needChangeMeterial){
				  		if(mesh.hasNewMaterial){
				  			if(material == null){
				  				material = mesh.oldMaterial;
				  			} 	      			 
				          	mesh.material = material;
				            mesh.material.needsUpdate = true;  
				  		}
				  		else{
				  			if(mesh.oldMaterial == null){
				  				mesh.oldMaterial = mesh.material;
				  			} 
				      		if(mesh.oldGeometry == null){
				      			mesh.oldGeometry = mesh.geometry.clone(); 
				      		}
				      		if(mesh.oldGeometry.index == null){
				      			//不存在mesh.geometry.index;
					          	mesh.material = material;
					            mesh.material.needsUpdate = true; 
				      		}
				      		else
				      		{ 
					          	const geometry = new THREE.Geometry();
					          	var points = new Array();
					          	var posArray = mesh.oldGeometry.attributes.position.array;
					          	var posCount = posArray.length;
					          	for(var j = 0; j < posCount; j = j + 3){
					          		var posX = posArray[j];
					          		var posY = posArray[j + 1];
					          		var posZ = posArray[j + 2];
					          		var vec = new THREE.Vector3(posX, posY, posZ);
					          		geometry.vertices.push(vec);
					          	}              	
					          	 
					          	var faceIndexArray = mesh.oldGeometry.index.array;
					          	var facePointCount = faceIndexArray.length;
					          	for(var j = 0; j < facePointCount; j = j + 3){
					          		geometry.faces.push( new THREE.Face3( faceIndexArray[j], faceIndexArray[j + 1], faceIndexArray[j + 2] ) );
					          	}
					      		geometry.computeBoundingSphere();
					
					          	var uvs = new Array();
					          	var faceCount = mesh.oldGeometry.index.array.length / 3;
					          	for(j = 0; j < faceCount; j++){ 
					          		uvs.push(0);
					          		uvs.push(0);
					          		
					          		uvs.push(0);
					          		uvs.push(0);
					          		
					          		uvs.push(0);
					          		uvs.push(0);
					          	}
					          	          		
					      		var flatFacess = [];
					      		var flatFaceDic = {};
					      		if(geometry.faces.length > 1){
					      			//超过1000个面，不再计算
						      		for(var j = 0; j < geometry.faces.length; j++){
						      			var face = geometry.faces[j]; 
					      				var flatFaces = new Array();
					  					var faceKey = face.a + "_" + face.b + "_" + face.c;
					  					var faceJson = {key: faceKey, face: face};
					      				flatFaces.push(faceJson);
					      				flatFacess.push(flatFaces);
					      				flatFaceDic[faceKey] = faceJson; 
						      		}
					      		}
					      		else{
						      		for(var j = 0; j < geometry.faces.length; j++){
						      			var face = geometry.faces[j];
						      			var added = false;
						      			for(var k = 0; k < flatFacess.length; k++){
						      				if(!added){
						      					var flatFaces = flatFacess[k];
						      					var firstFace = flatFaces[0].face; 
						      					var vec1 = geometry.vertices[firstFace.a]; 
						      					var vec2 = geometry.vertices[firstFace.b]; 
						      					var vec3 = geometry.vertices[firstFace.c]; 
						
						      					var faceKey = face.a + "_" + face.b + "_" + face.c;
						      					var p1 = geometry.vertices[face.a]; 
						      					var p2 = geometry.vertices[face.b]; 
						      					var p3 = geometry.vertices[face.c]; 
						      					
						      					var plane = new THREE.Plane();
						      					plane.setFromCoplanarPoints(vec1, vec2, vec3);
						      					var distance1 = Math.abs(plane.distanceToPoint(p1));
						      					var distance2 = Math.abs(plane.distanceToPoint(p2));
						      					var distance3 = Math.abs(plane.distanceToPoint(p3));
						      					if(distance1 < ignoreDistance && distance2 < ignoreDistance && distance3 < ignoreDistance){
						          					var faceJson ={key: faceKey, face: face};
						      						flatFaces.push(faceJson);
						              				flatFaceDic[faceKey] = faceJson;
						      						added = true;
						      					}
						      				}
						      			}
						      			if(!added){
						      				var flatFaces = new Array();
						  					var faceKey = face.a + "_" + face.b + "_" + face.c;
						  					var faceJson = {key: faceKey, face: face};
						      				flatFaces.push(faceJson);
						      				flatFacess.push(flatFaces);
						      				flatFaceDic[faceKey] = faceJson;
						      			}
						      		}
					      		}
					      		
					      		
					      		for(var j = 0; j < flatFacess.length; j++){
					      			var flatFaces = flatFacess[j]; 
					      			var firstFace = flatFaces[0];
					      			var pointA = geometry.vertices[firstFace.face.a];           			
					      			var pointB = null;  
					      			for(var k = 0; k < flatFaces.length; k++){
					      				var flatFace = flatFaces[k];
					          			var points = new Array();
					          			points.push(geometry.vertices[flatFace.face.a]); 
					          			points.push(geometry.vertices[flatFace.face.b]);
					          			points.push(geometry.vertices[flatFace.face.c]); 
					          			for(var l = 0; l < points.length; l++){
					          				var point = points[l];
					          				if(point != pointA && point.z == pointA.z){
					          					pointB = point;
					          					break;
					          				}
					          			}
					          			if(pointB != null){
					          				break;
					          			}
					      			}
					      			var angleX = 0;//pointB.y != pointA.y ? Math.atan((pointB.z - pointA.z) / (pointB.y - pointA.y)) : ( pointB.z > pointA.z ? 0 : Math.PI);
					      			var angleY = 0;//pointB.z != pointA.z ? Math.atan((pointB.x - pointA.x) / (pointB.z - pointA.z)) : ( pointB.x > pointA.x ? 0 : Math.PI);
					      			var angleZ = 0;//pointB.x != pointA.x ? Math.atan((pointB.y - pointA.y) / (pointB.x - pointA.x)) : ( pointB.y > pointA.y ? 0 : Math.PI);
					              	var euler = new THREE.Euler(angleX, angleY, angleZ); 
					      			for(var k = 0; k < flatFaces.length; k++){
					      				var flatFace = flatFaces[k]; 
					      				var pA = geometry.vertices[flatFace.face.a].clone();
					      				pA.applyEuler(euler); 
					      				var pB = geometry.vertices[flatFace.face.b].clone();
					      				pB.applyEuler(euler); 
					      				var pC = geometry.vertices[flatFace.face.c].clone();
					      				pC.applyEuler(euler); 
					      				flatFace.uv = {
					      					a: pA,
					      					b: pB,
					      					c: pC
					      				}; 
					      			}
					      		}
					
					          	var uvs = new Array();
					          	var positions = new Array();
					          	var normals = new Array();
					          	var faceCount = mesh.oldGeometry.index.array.length / 3;
					          	for(j = 0; j < faceCount; j++){ 
					          		var key = mesh.oldGeometry.index.array[j * 3] + "_" + mesh.oldGeometry.index.array[j * 3 + 1] + "_" + mesh.oldGeometry.index.array[j * 3 + 2];
					          		var face = flatFaceDic[key];  
					          		if(face.uv.a.x == face.uv.b.x && face.uv.a.x == face.uv.c.x){
					              		uvs.push(face.uv.a.y);
					              		uvs.push(face.uv.a.z);
					              		uvs.push(face.uv.b.y);
					              		uvs.push(face.uv.b.z);	
					              		uvs.push(face.uv.c.y);  
					              		uvs.push(face.uv.c.z);
					          		}
					          		else if(face.uv.a.z == face.uv.b.z && face.uv.a.z == face.uv.c.z){
					              		uvs.push(face.uv.a.y);
					              		uvs.push(face.uv.a.x);
					              		uvs.push(face.uv.b.y);	
					              		uvs.push(face.uv.b.x);
					              		uvs.push(face.uv.c.y);
					              		uvs.push(face.uv.c.x);  
					          		}
					          		else  {
					              		uvs.push(face.uv.a.x);
					              		uvs.push(face.uv.a.z);
					              		uvs.push(face.uv.b.x);	
					              		uvs.push(face.uv.b.z); 
					              		uvs.push(face.uv.c.x);
					              		uvs.push(face.uv.c.z); 
					          		}
					
					          		positions.push(geometry.vertices[face.face.a].x)
					          		positions.push(geometry.vertices[face.face.a].y)
					          		positions.push(geometry.vertices[face.face.a].z)
					          		positions.push(geometry.vertices[face.face.b].x)
					          		positions.push(geometry.vertices[face.face.b].y)
					          		positions.push(geometry.vertices[face.face.b].z)
					          		positions.push(geometry.vertices[face.face.c].x)
					          		positions.push(geometry.vertices[face.face.c].y)
					          		positions.push(geometry.vertices[face.face.c].z)
					
					          		normals.push(1);
					          		normals.push(1);
					          		normals.push(1);
					          		normals.push(1);
					          		normals.push(1);
					          		normals.push(1);
					          		normals.push(1);
					          		normals.push(1);
					          		normals.push(1); 
					          	}  
					
					            var uvNumComponents = 2;
					            var positionNumComponents = 3;
					            var normalNumComponents = 3;
					            mesh.geometry.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
					            mesh.geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
					            mesh.geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
					            mesh.geometry.setIndex(null);
					          	mesh.material = material;
					            mesh.material.needsUpdate = true; 
					      	} 
				  		}
				  		mesh.hasNewMaterial = true;
			  		}
    			}
    			else {
    				thatMaterialEditor.setChildNewMaterial(childObj, materialName, material);
    			}
    		}
	  	}
    } 
	
	this.initContainerPos = function(){
		var coreContainer =  $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreContainer");
		thatMaterialEditor.containerPos = {
			x: $(coreContainer).offset().left,
			y: $(coreContainer).offset().top
		};
	}
	
    this.onMouseDown = function(ev) { 
    	var targetElement = ev.target; 
    	thatMaterialEditor.mouseDownPosition = {
    		x: ev.clientX - thatMaterialEditor.containerPos.x,
    		y: ev.clientY - thatMaterialEditor.containerPos.y 
    	};  
    };

    this.onMouseUp = function(ev) {
        if (thatMaterialEditor.mouseDownPosition != null) {
        	var mouseUpPosition = {
        		x: ev.clientX - thatMaterialEditor.containerPos.x,
        		y: ev.clientY - thatMaterialEditor.containerPos.y  
        	};
        	if(ev.button == 0 || ev.button == 2){
	        	if(Math.abs(mouseUpPosition.x - thatMaterialEditor.mouseDownPosition.x) < 2 && Math.abs(mouseUpPosition.y - thatMaterialEditor.mouseDownPosition.y) < 2 ){ 
	                event.preventDefault();
	            	var mouse = new THREE.Vector2(); //二维向量 
	                mouse.x = ((event.clientX - thatMaterialEditor.containerPos.x) / $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").width()) * 2 - 1;
	                mouse.y = -((event.clientY - thatMaterialEditor.containerPos.y) / $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").height()) * 2 + 1;  
	                thatMaterialEditor.raycaster.setFromCamera(mouse, thatMaterialEditor.camera);
	                var intersects = thatMaterialEditor.raycaster.intersectObjects(thatMaterialEditor.scene.children, true); //将遍历数组内的所有模型的子类，也就是深度遍历 
	                var faces = thatMaterialEditor.selectObjectFaces(intersects);     
	        	}
        	}
        } 
    }; 
    
    this.selectObjectFaces = function(intersects){ 
        if (intersects.length > 0) {
        	var index = 0;
        	while(index < intersects.length){
            	var tempObj = intersects[index].object; 
				thatMaterialEditor.selectFlatFaces(tempObj); 
            	return tempObj; 
        	} 
        	thatMaterialEditor.selectFlatFaces(null);
            return null;
        }
        else{
        	thatMaterialEditor.selectFlatFaces(null);
        }
        return null;
    }; 
	
    this.selectFlatFaces = function(object){ 
    	if(object == null){    		
	    	for(var i = 0; i < thatMaterialEditor.materialObject3D.children.length; i++){
	        	var mesh = thatMaterialEditor.materialObject3D.children[i];
	    		if(!mesh.isUserObject){
		        	if(mesh.oldMaterial != null){
		        		mesh.material = mesh.oldMaterial;
		        	}
	    		}
	        }
    	}
    	else{
	    	for(var i = 0; i < thatMaterialEditor.materialObject3D.children.length; i++){
	        	var mesh = thatMaterialEditor.materialObject3D.children[i];
	    		if(!mesh.isUserObject){
		        	if(mesh.oldMaterial == null){
		        		mesh.oldMaterial = mesh.material;
		        	}
	    	    	var newMaterial = mesh.oldMaterial.clone();
	    	    	newMaterial.transparent = true;
	    	    	newMaterial.opacity = 0.1;
	    	    	mesh.material = newMaterial;
	    		}	        	
	        } 
    		object.material = object.oldMaterial;     		
    	}
    } 
	
	this.addObject3D = function(sourceObject3D){   
		var newObject3D = thatMaterialEditor.cloneObject3D(sourceObject3D);
		
		newObject3D.position.set(0, 0, 0); 
		newObject3D.rotation.set(0, 0, 0);
		thatMaterialEditor.scene.add(newObject3D);  
		thatMaterialEditor.materialObject3D = newObject3D; 
	}
	
	this.showAllMeshes = function(object3D){
		var allMeshList = new Array();
		thatMaterialEditor.getChildMeshes(object3D, "", allMeshList);
		if(allMeshList.length > 0){
			var allMeshItemHtml = "";
			for(var i = 0; i < allMeshList.length; i++){
				var meshItem = allMeshList[i];
				var meshItemHtml = thatMaterialEditor.getMeshItemHtml(meshItem);
				allMeshItemHtml += meshItemHtml;			
			}
			$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditMeshListContainer").html(allMeshItemHtml);
			$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditMeshItem").click(function(){
				var fullName = $(this).attr("fullName");
				thatMaterialEditor.selectMeshItem(fullName);
				thatMaterialEditor.selectMeshObject3D(fullName);
				thatMaterialEditor.selectFaceObj(null);
				thatMaterialEditor.showMeshFaceList(thatMaterialEditor.selectedMesh);
				thatMaterialEditor.removePointLabels();
			});
		}
		else{
			$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditMeshListContainer").html("<div style=\"position:absolute;height:40px;left:5px;right:5px;top:10px;font-size:13px;\">不可以给外部导入的组件设置UV贴图.</div>");
		}
	}
	
	this.selectMeshItem = function(fullName){
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditMeshItem").removeClass("uvMaterialEditMeshItemActive");
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditMeshItem[fullName='" + fullName + "']").addClass("uvMaterialEditMeshItemActive");
	}
	
	this.showMeshFaceList = function(meshObj){
		var allFaceIndexes = meshObj.geometry.index.array;
		var allFaceItemHtml = "";
		for(var i = 0; i < allFaceIndexes.length; i = i + 3){
			var faceIndex = i / 3;
			var faceItem = {
				index: faceIndex,
				name: faceIndex + 1
			};
			var faceItemHtml = thatMaterialEditor.getFaceItemHtml(faceItem);
			allFaceItemHtml += faceItemHtml;
		}
		/*
		var allFaces = meshObj.geometry.faces;
		var allFaceItemHtml = "";
		for(var i = 0; i < allFaces.length; i++){
			var face = allFaces[i];
			var faceItem = {
				index: i,
				name: i + 1
			};
			var faceItemHtml = thatMaterialEditor.getFaceItemHtml(faceItem);
			allFaceItemHtml += faceItemHtml;
		}
		*/
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceListContainer").html(allFaceItemHtml);
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceItem").click(function(){
			var faceIndex = $(this).attr("faceIndex");
			thatMaterialEditor.selectFaceItem(faceIndex);
			thatMaterialEditor.selectFaceObj(faceIndex); 
			thatMaterialEditor.checkSameFlatFaces(faceIndex);
			
			if($("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingInnerContainer[name='pointsSetting']").css("display") == "block"){
				thatMaterialEditor.initPointLabels(thatMaterialEditor.selectedMesh);
			}
		});

		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceItemCheck").click(function(){
			/*
			var checked = $(this).hasClass("uvMaterialEditFaceItemChecked");
			if(checked){
				$(this).removeClass("uvMaterialEditFaceItemChecked")
			}
			else{
				$(this).addClass("uvMaterialEditFaceItemChecked")
			} 
			*/ 
		});
	}
	
	this.checkSameFlatFaces = function(faceIndex){
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceItemCheck").removeClass("uvMaterialEditFaceItemChecked");
		var positionArray = thatMaterialEditor.selectedMesh.geometry.attributes.position.array;
		var faceIndexes = thatMaterialEditor.selectedMesh.geometry.index.array;
		var faceAIndex = faceIndexes[faceIndex * 3];
		var faceBIndex = faceIndexes[faceIndex * 3 + 1];
		var faceCIndex = faceIndexes[faceIndex * 3 + 2];
		var pointA = new THREE.Vector3(positionArray[faceAIndex * 3], positionArray[faceAIndex * 3 + 1], positionArray[faceAIndex * 3 + 2]);
		var pointB = new THREE.Vector3(positionArray[faceBIndex * 3], positionArray[faceBIndex * 3 + 1], positionArray[faceBIndex * 3 + 2]);
		var pointC = new THREE.Vector3(positionArray[faceCIndex * 3], positionArray[faceCIndex * 3 + 1], positionArray[faceCIndex * 3 + 2]);
		var flatPointDirect = thatMaterialEditor.getFlatPointDirect(pointA, pointB, pointC);
		for(var i = 0; i < faceIndexes.length; i = i + 3){
			var fAIndex = faceIndexes[i];
			var fBIndex = faceIndexes[i + 1];
			var fCIndex = faceIndexes[i + 2];
			var pA = new THREE.Vector3(positionArray[fAIndex * 3], positionArray[fAIndex * 3 + 1], positionArray[fAIndex * 3 + 2]);
			var pB = new THREE.Vector3(positionArray[fBIndex * 3], positionArray[fBIndex * 3 + 1], positionArray[fBIndex * 3 + 2]);
			var pC = new THREE.Vector3(positionArray[fCIndex * 3], positionArray[fCIndex * 3 + 1], positionArray[fCIndex * 3 + 2]);
			if(Math.ceil(pointA[flatPointDirect] * 10000) == Math.ceil(pA[flatPointDirect] * 10000) 
				&& Math.ceil(pointA[flatPointDirect] * 10000) == Math.ceil(pB[flatPointDirect] * 10000) 
				&& Math.ceil(pointA[flatPointDirect] * 10000) == Math.ceil(pC[flatPointDirect] * 10000)){
				$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceItem[faceIndex='" + (i / 3) + "'] .uvMaterialEditFaceItemCheck").addClass("uvMaterialEditFaceItemChecked");
			}
		}
	}
	
	//获取三个点组成的面垂直于哪个坐标轴
	this.getFlatPointDirect = function(pointA, pointB, pointC){
		var flatPointDirect = "";
		if(thatMaterialEditor.checkIsSameFlat(pointA.x, pointB.x, pointC.x)){
			flatPointDirect = "x";
		}
		else if(thatMaterialEditor.checkIsSameFlat(pointA.y, pointB.y, pointC.y)){
			flatPointDirect = "y";
		}
		else if(thatMaterialEditor.checkIsSameFlat(pointA.z, pointB.z, pointC.z)){
			flatPointDirect = "z";
		}
		return flatPointDirect;
	}
	
	this.checkIsSameFlat = function(valueA, valueB, valueC){
		return Math.ceil(valueA * 10000) == Math.ceil(valueB * 10000) && Math.ceil(valueA * 10000) == Math.ceil(valueC * 10000);
	}
	
	this.getFaceItemHtml = function(faceItem){
		var faceItemHtml = "<div class=\"uvMaterialEditFaceItem\" faceIndex=\"" + faceItem.index + "\" faceName=\"" + faceItem.name + "\"><input type=\"checkbox\" class=\"uvMaterialEditFaceItemCheck\" /><div class=\"uvMaterialEditFaceItemText\">F_" + faceItem.name + "</div></div>";
		return faceItemHtml;
	}
	
	
	this.selectFaceItem = function(faceIndex){
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceItem").removeClass("uvMaterialEditFaceItemActive");
		$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceItem[faceIndex='" + faceIndex + "']").addClass("uvMaterialEditFaceItemActive");
		
	}
	
	this.selectFaceObj = function(faceIndex){
		if(faceIndex == null){
			thatMaterialEditor.faceLine.visible = false;
			for(var i = 0; i < thatMaterialEditor.faceSegBalls.length; i++){
				thatMaterialEditor.faceSegBalls[i].visible = false;
			}

			$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingContainer").css({"display": "none"});
		}
		else{
				
			var meshNamePath = thatMaterialEditor.selectedMesh.name;
			var meshFaceUvs = thatMaterialEditor.unitUvInfo.uvs[meshNamePath];
			var faceUv = null;
			if(meshFaceUvs != null){				
				faceUv = meshFaceUvs[faceIndex];
			}
			else{
				meshFaceUvs = {};
				thatMaterialEditor.unitUvInfo.uvs[meshNamePath] = meshFaceUvs;
			}
			if(faceUv == null){
				faceUv = {
					faceIndex: faceIndex,
					imageName: null,
					a: {x: null, y: null},
					b: {x: null, y: null},
					c: {x: null, y: null}
				};
				meshFaceUvs[faceIndex] = faceUv;
				faceUv.faceIndex = faceIndex;
			}
			thatMaterialEditor.singleParamWin.setParamValues({
				singleimagename: faceUv == null ? null : {name: faceUv.imageName},
				pointax: faceUv.a == null ? null : faceUv.a.x,
				pointay: faceUv.a == null ? null : faceUv.a.y,
				pointbx: faceUv.b == null ? null : faceUv.b.x,
				pointby: faceUv.b == null ? null : faceUv.b.y,
				pointcx: faceUv.c == null ? null : faceUv.c.x,
				pointcy: faceUv.c == null ? null : faceUv.c.y
			});
			thatMaterialEditor.selectedFaceUv = faceUv;

			var faceIndexes = thatMaterialEditor.selectedMesh.geometry.index.array;
			var faceAIndex = faceIndexes[faceIndex * 3];
			var faceBIndex = faceIndexes[faceIndex * 3 + 1];
			var faceCIndex = faceIndexes[faceIndex * 3 + 2];
			var positionArray = thatMaterialEditor.selectedMesh.geometry.attributes.position.array;

			var verticeA = new THREE.Vector3(positionArray[faceAIndex * 3], positionArray[faceAIndex * 3 + 1], positionArray[faceAIndex * 3 + 2]);
			var verticeB = new THREE.Vector3(positionArray[faceBIndex * 3], positionArray[faceBIndex * 3 + 1], positionArray[faceBIndex * 3 + 2]);
			var verticeC = new THREE.Vector3(positionArray[faceCIndex * 3], positionArray[faceCIndex * 3 + 1], positionArray[faceCIndex * 3 + 2]);
			verticeA = verticeA.applyMatrix4(thatMaterialEditor.selectedMesh.matrixWorld);
			verticeB = verticeB.applyMatrix4(thatMaterialEditor.selectedMesh.matrixWorld);
			verticeC = verticeC.applyMatrix4(thatMaterialEditor.selectedMesh.matrixWorld);
			
			var pointArr = [verticeA.x, verticeA.y, verticeA.z, verticeB.x, verticeB.y, verticeB.z, verticeC.x, verticeC.y, verticeC.z];
			thatMaterialEditor.faceLine.geometry.setAttribute("position", new THREE.Float32BufferAttribute(pointArr, 3))
			thatMaterialEditor.faceLine.geometry.verticesNeedUpdate = true;
			thatMaterialEditor.faceLine.visible = true;
			for(var i = 0; i < thatMaterialEditor.faceSegBalls.length; i++){
				var ball = thatMaterialEditor.faceSegBalls[i];
				ball.position.set(pointArr[i * 3], pointArr[i * 3 + 1], pointArr[i * 3 + 2]);
				ball.visible = true;
			}
			/*
			var faceObj = thatMaterialEditor.selectedMesh.geometry.faces[faceIndex];
			var vertices = thatMaterialEditor.selectedMesh.geometry.vertices;
			var points = new Array();
			points.push(vertices[faceObj.a].clone().applyMatrix4(thatMaterialEditor.selectedMesh.matrixWorld));
			points.push(vertices[faceObj.b].clone().applyMatrix4(thatMaterialEditor.selectedMesh.matrixWorld));
			points.push(vertices[faceObj.c].clone().applyMatrix4(thatMaterialEditor.selectedMesh.matrixWorld));  
			thatMaterialEditor.faceLine.geometry.vertices = points;
			thatMaterialEditor.faceLine.geometry.verticesNeedUpdate = true;
			thatMaterialEditor.faceLine.visible = true;
			for(var i = 0; i < thatMaterialEditor.faceSegBalls.length; i++){
				var newPos = points[i];
				var ball = thatMaterialEditor.faceSegBalls[i];
				ball.position.set(newPos.x, newPos.y, newPos.z);
				ball.visible = true;
			}
			*/

			$("#" + thatMaterialEditor.containerId).find(".uvMaterialEditFaceSettingContainer").css({"display": "block"});
			
		}
	}
	
	this.selectMeshObject3D = function(fullName){ 
		var tempObject3D = null;
		for(var i = 0; i < thatMaterialEditor.materialObject3D.children.length; i++){
			var childObject3D = thatMaterialEditor.materialObject3D.children[i];
			if(childObject3D.name == fullName){
				tempObject3D = childObject3D;		
				break;
			}
		} 
		var selectedMesh = tempObject3D;		 
		
		thatMaterialEditor.selectedMesh = selectedMesh;
		
		thatMaterialEditor.setMeshLight(selectedMesh);
	}
	
	this.setMeshLight = function(selectedMesh){
		thatMaterialEditor.setChildMeshLight(thatMaterialEditor.materialObject3D, selectedMesh);
	}
	
	this.setChildMeshLight = function(parentObject3D, selectedMesh){
		for(var i = 0; i < parentObject3D.children.length; i++){
			var childObject3D = parentObject3D.children[i];
			if(childObject3D == selectedMesh){
				childObject3D.material = childObject3D.oldMaterial;
			}
			else{
				if(childObject3D.material != null){ 
					childObject3D.material = thatMaterialEditor.opacityMaterial;
				}
			} 
			thatMaterialEditor.setChildMeshLight(childObject3D, selectedMesh);
		}
	}
	
	this.initObject3DMaterial = function(object3D){
		thatMaterialEditor.initChildObject3DMaterial(object3D);
	}
	
	this.initChildObject3DMaterial = function(parentObject3D){
		for(var i = 0; i < parentObject3D.children.length; i++){
			var childObject3D = parentObject3D.children[i];
			if(!childObject3D.userData.isResource && childObject3D.material != null){
				childObject3D.oldMaterial = childObject3D.material; 
				if(childObject3D.material.length != null){
					var materials = new Array();
					for(var j = 0; j < childObject3D.material.length; j++){
						materials.push(childObject3D.material[j].clone());
					}
					childObject3D.material = materials;
				} 
				else{
					childObject3D.oldMaterial = childObject3D.material; 
					childObject3D.material = childObject3D.oldMaterial.clone();
				}
			} 
		}
	}
	
	this.getMeshItemHtml = function(meshItem){
		var fullName = (meshItem.namePath.length  == 0 ? "" : (meshItem.namePath + "/")) + meshItem.name;
		var meshItemHtml = "<div class=\"uvMaterialEditMeshItem\" fullName=\"" + fullName + "\"><div class=\"uvMaterialEditMeshItemText\">" + fullName + "</div></div>";
		return meshItemHtml;
	}
	
	this.getChildMeshes = function(object3D, namePath, allMeshList){
		if(!object3D.userData.isResource){
			if(object3D.type == "Mesh"){ 
				var meshItem = {
					name: object3D.name, 
					namePath: namePath
				};
				allMeshList.push(meshItem); 
			}
			else{ 
				for(var i = 0; i < object3D.children.length; i++){
					var childObj = object3D.children[i]; 
					var tempNamePath = (namePath.length == 0 ? "" : (namePath + "/")) + object3D.name;
					thatMaterialEditor.getChildMeshes(childObj, tempNamePath, allMeshList);
				} 		
			}
		}
	}
	
	this.removePointLabels = function(){
		var allLabelPoints = new Array();
		for(var i = 0; i < thatMaterialEditor.scene.children.length; i++){
			var object3D = thatMaterialEditor.scene.children[i];
			if(object3D.isLabelPoint){
				allLabelPoints.push(object3D);
			}
		}
		for(var i = 0; i < allLabelPoints.length; i++){
			var object3D = allLabelPoints[i];
			thatMaterialEditor.scene.remove(object3D);
		}
		$(".uv2dLabel").remove();
		
	}
	
	this.initPointLabels = function(mesh){ 
		var geometry = mesh.geometry;
		var vertices = mesh.geometry.vertices;

    	var cubeGeo = new THREE.BoxGeometry(0.001, 0.001, 0.001); 
        var cubeMaterial = new THREE.MeshBasicMaterial({
        	color: 0xffffff,
            transparent: true,
        })
        
		for(var i = 0; i < vertices.length; i++){ 
			var pointVer = vertices[i].clone().applyMatrix4(mesh.matrixWorld)
	        var pointObject = new THREE.Mesh(cubeGeo, cubeMaterial);
	        pointObject.position.set(pointVer.x, pointVer.y, pointVer.z);  
	        pointObject.visible = false; 
	        pointObject.isLabelPoint = true;
	        thatMaterialEditor.scene.add(pointObject);
	        
			var labelDiv = document.createElement("div");
			labelDiv.className = "uv2dLabel";
			labelDiv.id = "uv2dLabel_" + i;
			$(labelDiv).text(i); 
			var label2d = new THREE.CSS2DObject( labelDiv );
			label2d.position.set( 0, 0, 0 );
			pointObject.add( label2d );
		}
	}
	
	this.cloneObject3D = function(sourceObject3D){
		var newObject3D = new THREE.Object3D();	
		newObject3D.hasNewMaterial = false;
		for(var i = 0; i < sourceObject3D.children.length; i++){
			var sourceObj = sourceObject3D.children[i];
    		if(!sourceObj.isUserObject){
    			if(sourceObj.type == "Mesh"){
    				var sourceMesh = sourceObj;
					var newMesh = sourceMesh.clone();
					newMesh.geometry = sourceMesh.oldGeometry == null ? sourceMesh.geometry.clone() : sourceMesh.oldGeometry.clone(); 
					newObject3D.add(newMesh);
					newMesh.material = sourceMesh.oldMaterial;
    			}
    			else {
    				var newChildObj = thatMaterialEditor.cloneObject3D(sourceObj);
    				newChildObj.name = sourceObj.name;
    				newChildObj.userData.isResource = sourceObj.userData.isResource;
    				newChildObj.position.set(sourceObj.position.x, sourceObj.position.y, sourceObj.position.z);
    				newChildObj.rotation.set(sourceObj.rotation.x, sourceObj.rotation.y, sourceObj.rotation.z);
    				newObject3D.add(newChildObj);
    			}
    		}
		}
		return newObject3D;
	} 
	
	this.getUnitUvInfo = function(unitData){
		var unitUvInfo = {
			id: unitData.id,
			uvs: {}
		};
		if(unitData.uvs != null){
			for(var meshKey in unitData.uvs){
				var meshFaceUvs = unitData.uvs[meshKey];
				var newMeshFaceUvs = {};
				for(var faceKey in meshFaceUvs){
					var faceUv = meshFaceUvs[faceKey];
					var newFaceUv = {
						faceIndex: faceUv.faceIndex,
						imageName: faceUv.imageName,
						a: {x: faceUv.a.x, y: faceUv.a.y},
						b: {x: faceUv.b.x, y: faceUv.b.y},
						c: {x: faceUv.c.x, y: faceUv.c.y}			
					};
					newMeshFaceUvs[faceKey] = newFaceUv;
				}
				unitUvInfo.uvs[meshKey] = newMeshFaceUvs;
			}
		}
		return unitUvInfo;
	}
	
	
	this.getParameters = function(){
		var unitUvInfo = thatMaterialEditor.unitUvInfo;
		var needRemoveMeshUvs = new Array();
		var error = "";
		for(var meshKey in unitUvInfo.uvs){
			var meshUv = unitUvInfo.uvs[meshKey];
			var needRemoveFaceUvs = new Array();
			var faceCount = 0;
			for(var faceKey in meshUv){
				var faceUv = meshUv[faceKey];
				if(faceUv.imageName == null
					&& faceUv.a.x == null 
					&& faceUv.a.y == null 
					&& faceUv.b.x == null 
					&& faceUv.b.y == null 
					&& faceUv.c.x == null 
					&& faceUv.c.y == null){
					//去掉此面
					needRemoveFaceUvs.push(faceKey);
				}
				else if(faceUv.imageName == null
					|| faceUv.a.x == null 
					|| faceUv.a.y == null 
					|| faceUv.b.x == null 
					|| faceUv.b.y == null 
					|| faceUv.c.x == null 
					|| faceUv.c.y == null){
					error += ("'" + meshKey + "'的面'" + faceKey + "’参数缺失.\r\n");
				}
				else{
					faceCount++;
				}
			}
			for(var i = 0; i < needRemoveFaceUvs.length; i++){
				var faceKey = needRemoveFaceUvs[i];
				delete meshUv[faceKey];
			}
			if(faceCount == 0){
				needRemoveMeshUvs.push(meshKey);
			}
		}
		for(var i = 0; i < needRemoveMeshUvs.length; i++){
			var meshKey = needRemoveMeshUvs[i];
			delete unitUvInfo.uvs[meshKey];
		}
		if(error.length == 0){		
			return {
				unitUvInfo: unitUvInfo
			};
		}
		else{
			return {
				error: error
			};
		}
	}
    
	this.initScene = function() {
    	thatMaterialEditor.scene = new THREE.Scene();
    }

	this.initRender = function() { 
    	thatMaterialEditor.renderer = new THREE.WebGLRenderer({ 
    		antialias: true 
		}); 
        var width = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").width();
        var height = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").height();
        thatMaterialEditor.renderer.setSize(width, height);  
        thatMaterialEditor.renderer.setClearColor(thatMaterialEditor.backgroundColor); 
        $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").append(thatMaterialEditor.renderer.domElement); 
    } 
    
    this.initRender2D = function() { 
    	thatMaterialEditor.renderer2d = new CSS2DRenderer();
        var width = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").width();
        var height = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").height();
        thatMaterialEditor.renderer2d.setSize( width, height );
        thatMaterialEditor.renderer2d.domElement.style.position = 'absolute';
        thatMaterialEditor.renderer2d.domElement.style.top = '0px';
        thatMaterialEditor.renderer2d.domElement.tabIndex =	 0;
        thatMaterialEditor.renderer2d.domElement.className = "uvMaterialEditCoreInnerRenderer2d";
        $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").append(thatMaterialEditor.renderer2d.domElement); 
    }
	
    this.initCamera = function() { 
        var width = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").width();
        var height = $("#" + thatMaterialEditor.containerId).find(".uvMaterialEditCoreInnerContainer").height();            
        thatMaterialEditor.camera = new THREE.OrthographicCamera(width / -200, width / 200, height / 200, height / -200 , -1000, 1000);        
        thatMaterialEditor.camera.position.set(20, 20, 20);   
        thatMaterialEditor.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    
    this.initControls = function() {    	 
    	var orbitControl = new OrbitControls(thatMaterialEditor.camera, thatMaterialEditor.renderer2d.domElement);   
    	thatMaterialEditor.orbitControl = orbitControl;
    }
 
    this.initRaycaster = function() {  
    	thatMaterialEditor.raycaster = new THREE.Raycaster();
    	thatMaterialEditor.raycaster.linePrecision = 3; 
    }

    this.initLight = function() { 
    	var ambientLight = new THREE.AmbientLight(0xffffff);
    	thatMaterialEditor.scene.add(ambientLight);


    	var pointLight = new THREE.PointLight(0xFFFFFF, 0.2);
    	pointLight.position.set(lightSize, lightSize ,-lightSize);	
    	thatMaterialEditor.scene.add(pointLight);  
    	
    	var lightSize = 100; 
    	var lights = [
	    	{
	    		x: lightSize * 2.0,
	    		y: lightSize * 2.0,
	    		z: lightSize * 2.0,
	    		color: 0xFFFFFF,
	    		size: 0.05
	    		
	    	},
	    	{
	    		x: -lightSize * 2.0,
	    		y: -lightSize * 2.0,
	    		z: 0,//lightSize * 4.0,
	    		color: 0xFFFFFF,
	    		size: 0.07
	    	} ,
	    	{
	    		x: -lightSize * 2.0,
	    		y: lightSize * 2.0,
	    		z: 0,//lightSize * 4.0,
	    		color: 0xFFFFFF,
	    		size: 0.04
	    	} 
    	];
    	for(var i = 0; i < lights.length; i++) {
    		var light = lights[i];
	    	var dirLight = new THREE.DirectionalLight(light.color, light.size);
	    	dirLight.position.set(light.x, light.y, light.z);
	    	var dirLightTarget = new THREE.Object3D();
	    	dirLightTarget.position.set(0, 0, 0);
	    	thatMaterialEditor.scene.add(dirLightTarget);
    	
	    	//平行光的参数
	    	dirLight.target = dirLightTarget; 
	    	dirLight.shadow.camera.near = 1; //产生阴影的最近距离
	    	dirLight.shadow.camera.far = lightSize * 3; //产生阴影的最远距离
	    	dirLight.shadow.camera.left = -lightSize * 1.5; //产生阴影距离位置的最左边位置
	    	dirLight.shadow.camera.right = lightSize * 1.5; //最右边
	    	dirLight.shadow.camera.top = lightSize * 1.5; //最上边
	    	dirLight.shadow.camera.bottom = -lightSize * 1.5; //最下面
	    	dirLight.shadow.mapSize.height = 1024 * 16;
	    	dirLight.shadow.mapSize.width = 1024 * 16; 
	    	dirLight.castShadow = true;    
	    	thatMaterialEditor.scene.add(dirLight);  
    	} 
    }
    
    this.animate = function() {  
    	thatMaterialEditor.renderer.render(thatMaterialEditor.scene, thatMaterialEditor.camera); 
        thatMaterialEditor.renderer2d.render(thatMaterialEditor.scene, thatMaterialEditor.camera);    
        requestAnimationFrame( thatMaterialEditor.animate );   
    }; 

	this.formUISingleParameters = {
		id:1,
		name:"",
		units:{
		    "singleimagename":{
		    	id:1,
		    	name:"singleimagename",
		    	label:"图片",
		    	valueType:valueType.string,
		    	inputHelpType:"pop",
		    	inputHelpName:"web/pop/view_CmsImage.jsp",
		    	decimalNum:"",
		    	valueLength:100,
		    	isMultiValue:false,
		    	isNullable:false,
		    	unitType:"pop",
		    	maps:{"singleimagename": "name"}, 
		    	defaultValue:"",
				isEditable: true
		    },
			"pointax":{
				id:2,
				name:"pointax",
				label:"pointax",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    },
			"pointay":{
				id:3,
				name:"pointay",
				label:"pointay",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    },
			"pointbx":{
				id:4,
				name:"pointbx",
				label:"pointbx",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    },
			"pointby":{
				id:5,
				name:"pointby",
				label:"pointby",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    },
			"pointcx":{
				id:6,
				name:"pointcx",
				label:"pointcx",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    },
			"pointcy":{
				id:7,
				name:"pointcy",
				label:"pointcy",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    }
		}
	};

	this.formUIMultiParameters = {
		id:1,
		name:"",
		units:{
		    "multiimagename":{
		    	id:1,
		    	name:"multiimagename",
		    	label:"图片",
		    	valueType:valueType.string,
		    	inputHelpType:"pop",
		    	inputHelpName:"web/pop/view_CmsImage.jsp",
		    	decimalNum:"",
		    	valueLength:100,
		    	isMultiValue:false,
		    	isNullable:false,
		    	unitType:"pop",
		    	maps:{"multiimagename": "name"}, 
		    	defaultValue:"",
				isEditable: true
		    },
			"left":{
				id:2,
				name:"left",
				label:"left",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    },
			"right":{
				id:3,
				name:"right",
				label:"right",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    },
			"top":{
				id:4,
				name:"top",
				label:"top",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    },
			"bottom":{
				id:5,
				name:"bottom",
				label:"bottom",
				valueType:valueType.decimal,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"5",
				valueLength:10,
				isMultiValue:false,
				isNullable:false,
				unitType:"decimal",
				defaultValue:"",
				isEditable: true
		    } 
		}
	};

	this.formUIPointsParameters = {
		id:1,
		name:"",
		units:{
		    "pointsimagename":{
		    	id:1,
		    	name:"pointsimagename",
		    	label:"图片",
		    	valueType:valueType.string,
		    	inputHelpType:"pop",
		    	inputHelpName:"web/pop/view_CmsImage.jsp",
		    	decimalNum:"",
		    	valueLength:100,
		    	isMultiValue:false,
		    	isNullable:false,
		    	unitType:"pop",
		    	maps:{"pointsimagename": "name"}, 
		    	defaultValue:"",
				isEditable: true
		    },
			"pointsuv":{
				id:2,
				name:"pointsuv",
				label:"pointsuv",
				valueType:valueType.string,
				inputHelpType:"",
				inputHelpName:"",
				decimalNum:"0",
				valueLength:10000,
				isMultiValue:false,
				isNullable:false,
				unitType:"text",
				defaultValue:"",
				isEditable: true
		    } 
		}
	};     
}

export default JS3UvMaterialEditor