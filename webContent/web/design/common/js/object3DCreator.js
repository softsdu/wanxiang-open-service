//因升级threejs r146，更新此代码 modified by ls 20230322
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {FBXLoader} from "three/addons/loaders/FBXLoader.js";
import JS3BaseMaterials from "./js3BaseMaterials.js";

let Object3DCreator = function(){
	var thatObj3DCreator = this; 
	this.editor = null;

	//缓存
	this.object3DCache = {}; 
	
	this.edgeMaterial = new THREE.LineBasicMaterial({
		//color: 0x191970, //修改边线颜色为深蓝 modified by liyh 20230908 0x666666,
		color: 0x444444,
		linewidth: 1
	});
	
	//resource包围盒的外框material added by ls 20230829
	this.resourceBoxEdgeMaterial = new THREE.LineBasicMaterial({
		color: 0x888888,
		linewidth: 1,
		opacity: 0.5,
	    transparent: true,
	    visible: false //默认显示外框不显示
	});

	//是否显示材质渲染效果
	this.materialRenderEffect = false;

	this.gltfLoader = null;

	this.fbxLoader = null;

	this.materialSide = THREE.FrontSide; 
	
	this.doesShowEdge = true;
	
	//增加显示级别 added by ls 20230403
	this.viewLevel = js3ViewLevelType.high;
	
	this.detailLevel = 4;
	
	//支持构造构件中的标注 added by ls 20221206
	this.hasTags = true;

	this.baseMaterials;
	
	this.init = function(p){
		thatObj3DCreator.editor = p.editor; 
    	var object3DCache = new ComponentObject3DCache();    	
    	thatObj3DCreator.object3DCache = object3DCache;
		thatObj3DCreator.initGltfLoader();
		thatObj3DCreator.initFbxLoader();
		thatObj3DCreator.initBaseMaterials();
	}

	this.initBaseMaterials = function (){
		thatObj3DCreator.baseMaterials = new JS3BaseMaterials();
	}

	this.initGltfLoader = function(){
		thatObj3DCreator.gltfLoader = new GLTFLoader();
	}

	this.initFbxLoader = function(){
		thatObj3DCreator.fbxLoader = new FBXLoader();
	}
	
	this.waitingResourceObject3Ds = {};

	this.createObject3D = function(unitSetting, refComponentInfos, parentParameters, afterCreateFunc){ 
		
		var refComponentInfo = refComponentInfos[unitSetting.code + "_" + unitSetting.versionNum];
		
		var requestParentParameters = new Array();
		for(var i = 0; i < parentParameters.length; i++){
			var parentParameter = parentParameters[i];
			var p = {
				name: parentParameter.name,
				valueType: parentParameter.valueType,
				value: parentParameter.value
			};
			requestParentParameters.push(p);
		}
		
		var requestParameters = {};
		for(var paramName in unitSetting.parameters){
			var unitParameter = unitSetting.parameters[paramName];
			var refComponentInfoParameter = refComponentInfo.parameters[paramName];
			if(refComponentInfoParameter != null){
				var p = { 
					//如果参数值为undefined，那么赋值为null modified by ls 20220519
					value: unitParameter.value == undefined ? null : unitParameter.value,
					isGeo: refComponentInfoParameter.isGeo
				};
				
				if(unitParameter.exp != null){
					p.exp = {
						pim: unitParameter.exp.pim,
						js: unitParameter.exp.js
					};
				}			
				requestParameters[paramName] = p;
			}
		}
		
		//增加显示级别 modified by ls 20230403
		var cacheKey = thatObj3DCreator.object3DCache.getComponentObject3DKey(refComponentInfo.code, refComponentInfo.versionNum, requestParameters, unitSetting.useWorldPosition, thatObj3DCreator.detailLevel, thatObj3DCreator.viewLevel);

		if(thatObj3DCreator.object3DCache.hasRefComponentObject3D(cacheKey)){
			var object3D = thatObj3DCreator.object3DCache.cloneRefComponentObject3D(cacheKey);
			var cacheUnitSetting = thatObj3DCreator.object3DCache.getUnitSetting(cacheKey);
			thatObj3DCreator.cloneUnitSetting(unitSetting, cacheUnitSetting, object3D);
			afterCreateFunc({
				object3D: object3D,
				unitSetting: unitSetting,
				cacheKey: cacheKey
			});
		}
		else {
			var waitingUnitSettings = thatObj3DCreator.waitingCallbackCreators[cacheKey];
			thatObj3DCreator.addToWaitingCallbackCreateObject3D(cacheKey, unitSetting);
			if(waitingUnitSettings == null){
				thatObj3DCreator.createObject3DFromServer(unitSetting, requestParentParameters, requestParameters, cacheKey, afterCreateFunc);	
			}
		}	
	} 


	this.createObject3Ds = function(unitComInfoHash, refComponentInfos, parentParameters, afterCreateFunc){
		var requestParentParameters = new Array();
		for(var i = 0; i < parentParameters.length; i++){
			var parentParameter = parentParameters[i];
			var p = {
				name: parentParameter.name,
				valueType: parentParameter.valueType,
				value: parentParameter.value
			};
			requestParentParameters.push(p);
		}
		for(var refComponentKey in unitComInfoHash){
			var unitComInfo = unitComInfoHash[refComponentKey]
			var refComponentInfo = refComponentInfos[refComponentKey];
			var unitComReqInfoList = [];
			for(var i = 0; i < unitComInfo.unitSettings.length; i++){
				var unitSetting = unitComInfo.unitSettings[i];
				var requestParameters = {};
				for(var paramName in unitSetting.parameters){
					var unitParameter = unitSetting.parameters[paramName];
					var refComponentInfoParameter = refComponentInfo.parameters[paramName];
					if(refComponentInfoParameter != null){
						var p = { 
							//如果参数值为undefined，那么赋值为null modified by ls 20220519
							value: unitParameter.value == undefined ? null : unitParameter.value,
							isGeo: refComponentInfoParameter.isGeo
						};
						
						if(unitParameter.exp != null){
							p.exp = {
								pim: unitParameter.exp.pim,
								js: unitParameter.exp.js
							};
						}			
						requestParameters[paramName] = p;
					}
				}
				
				//增加显示级别 modified by ls 20230403
				var cacheKey = thatObj3DCreator.object3DCache.getComponentObject3DKey(refComponentInfo.code, refComponentInfo.versionNum, requestParameters, unitSetting.useWorldPosition, thatObj3DCreator.detailLevel, thatObj3DCreator.viewLevel);
				var waitingUnitSettings = thatObj3DCreator.waitingCallbackCreators[cacheKey];
				if(waitingUnitSettings == null){
					unitComReqInfoList.push({
						cacheKey: cacheKey,
						unitSetting: unitSetting,
						requestParentParameters: requestParentParameters,
						requestParameters: requestParameters
					});
				}
				thatObj3DCreator.addToWaitingCallbackCreateObject3D(cacheKey, unitSetting);
			}  
			thatObj3DCreator.createObject3DsFromServer(unitComReqInfoList, afterCreateFunc);	 
		}
	} 
	
	this.createObject3DsFromServer = function(unitComReqInfoList, afterCreateFunc){
		var reqParamList = [];
		for(var i = 0; i < unitComReqInfoList.length; i++){
			var unitComReqInfo = unitComReqInfoList[i];
			var reqParam = {
				code: unitComReqInfo.unitSetting.code,
				versionNum: unitComReqInfo.unitSetting.versionNum,
				parentParameters: unitComReqInfo.requestParentParameters,
				parameters: unitComReqInfo.requestParameters,
				unitSetting: unitComReqInfo.unitSetting,
				cacheKey: unitComReqInfo.cacheKey,
				detailLevel: thatObj3DCreator.detailLevel,
				
				//显示级别 added by ls 20230403
				viewLevel: thatObj3DCreator.viewLevel,
				
				//是否构造标注 added by ls 20221216
				hasTags: thatObj3DCreator.hasTags
			};
			reqParamList.push(reqParam);
		}
		var requestParam = {
			list: reqParamList
		}
		serverAccess.request({
			serviceName:"geometry3DNcpService",
			funcName:"createObject3Ds",  
		    args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj) {
				var resultList = obj.result.list;
				for(var i = 0; i < resultList.length; i++){
					var result = resultList[i];
					if(result.hasError){
						msgBox.error({title:"提示", info: result.errorInfo});
						
						var geoJson = {
							offText: "OFF\n8 12 0\n-0.5 0.5 -0.5\n0.5 0.5 -0.5\n0.5 0.5 0.5\n-0.5 0.5 0.5\n-0.5 -0.5 -0.5\n0.5 -0.5 -0.5\n0.5 -0.5 0.5\n-0.5 -0.5 0.5\n3 0 2 1\n3 0 3 2\n3 0 5 4\n3 0 1 5\n3 0 4 7\n3 0 7 3\n3 6 3 7\n3 6 2 3\n3 6 7 4\n3 6 4 5\n3 6 1 2\n3 6 5 1",
						};
						
						//加载一个空壳子
						var unitSetting = result.unitSetting;
						var cacheKey = result.cacheKey;
						var object3D = thatObj3DCreator.offToObject3D(geoJson, unitSetting);
						thatObj3DCreator.moveToCenter(object3D);
						thatObj3DCreator.addEdges(object3D, unitSetting);							
						thatObj3DCreator.callbackCreateObject3D(cacheKey, object3D, geoJson, unitSetting.id, unitSetting, afterCreateFunc); 
					}
					else{
	                    var geoJson = result.geoJson;
	                    var cacheKey = result.cacheKey;
	                    var resourceJsons = result.resourceJsons;
	                    var resourceStatusHash = null;
	                    if(resourceJsons != null && resourceJsons.length > 0){
							resourceStatusHash = {};
	                        for(var j = 0; j < resourceJsons.length; j++){
	                            var resourceJson = resourceJsons[j];
								var resourceType = resourceJson.resourceType;
								var resourceZipCode = resourceJson.name;
	                            var resourceCacheKey = thatObj3DCreator.object3DCache.getResourceObject3DKey(resourceZipCode, resourceType);
	                            if(!thatObj3DCreator.object3DCache.hasResourceObject3D(resourceCacheKey)){
									resourceStatusHash[resourceCacheKey] = false;
									switch(resourceType){
										case js3ResourceType.gltf:{
											thatObj3DCreator.addGltfObject3DToCache(resourceCacheKey, resourceZipCode);
											break;
										}
										case js3ResourceType.fbx:{
											thatObj3DCreator.addFbxObject3DToCache(resourceCacheKey, resourceZipCode);
											break;
										}
									}
	                            }
	                        }
	                        thatObj3DCreator.waitingResourceObject3Ds[cacheKey] = {
	                            cacheKey: cacheKey,
	                            resultJson: result,
	                            resourceStatusHash: resourceStatusHash,
	                            afterCreateFunc: afterCreateFunc
	                        }; 
	                    }
	                    if(resourceStatusHash == null){
	                        //不包含resource
	                        thatObj3DCreator.createObject3DAfterLoadResource(cacheKey, result,  afterCreateFunc);
	                    }
	                    else{
	                        //所有的resource都已经在此之前加载过了
	                        var allResourceLoaded = true;
	                        for(var key in resourceStatusHash){
	                            if(!resourceStatusHash[key]){
									allResourceLoaded = false;
	                                break;
	                            }
	                        }
	                        if(allResourceLoaded){
	                            thatObj3DCreator.createObject3DAfterLoadResource(cacheKey, result, afterCreateFunc);
	                        }
	                    }
	                }
				}
			},
			failFunc: function(obj) { 			
				for(var i = 0; i < reqParamList.length; i++){	
					var reqParam = reqParamList[i];					
					var geoJson = {
						offText: "OFF\n8 12 0\n-0.5 0.5 -0.5\n0.5 0.5 -0.5\n0.5 0.5 0.5\n-0.5 0.5 0.5\n-0.5 -0.5 -0.5\n0.5 -0.5 -0.5\n0.5 -0.5 0.5\n-0.5 -0.5 0.5\n3 0 2 1\n3 0 3 2\n3 0 5 4\n3 0 1 5\n3 0 4 7\n3 0 7 3\n3 6 3 7\n3 6 2 3\n3 6 7 4\n3 6 4 5\n3 6 1 2\n3 6 5 1",
					};
					
					//加载一个空壳子
					var object3D = thatObj3DCreator.offToObject3D(geoJson);
					thatObj3DCreator.moveToCenter(object3D);
					thatObj3DCreator.addEdges(object3D);							
					thatObj3DCreator.callbackCreateObject3D(reqParam.cacheKey, object3D, geoJson, null, null, afterCreateFunc); 
				}
				msgBox.error({title:"提示", info: obj.message});
			}
		});
	}
	
	this.createObject3DFromServer = function(unitSetting, requestParentParameters, requestParameters, cacheKey, afterCreateFunc){		
		var parameters = {};
		var requestParam = {
			code: unitSetting.code,
			versionNum: unitSetting.versionNum,
			parentParameters: requestParentParameters,
			parameters: requestParameters,
			unitSetting: unitSetting,
			cacheKey: cacheKey,
			detailLevel: thatObj3DCreator.detailLevel,
			
			//显示级别 added by ls 20230403
			viewLevel: thatObj3DCreator.viewLevel,
			
			//是否构造标注 added by ls 20221216
			hasTags: thatObj3DCreator.hasTags
		};
		serverAccess.request({
			serviceName:"geometry3DNcpService",
			funcName:"createObject3D",  
		    args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj) {
				//如果造型失败，那么增加使用方盒子代替造型结果，使得设计人员可以继续修改模型 modified by ls 20220723
				if(obj.result.hasError){
					msgBox.error({title:"提示", info: obj.result.errorInfo});
					
					var geoJson = {
						offText: "OFF\n8 12 0\n-0.5 0.5 -0.5\n0.5 0.5 -0.5\n0.5 0.5 0.5\n-0.5 0.5 0.5\n-0.5 -0.5 -0.5\n0.5 -0.5 -0.5\n0.5 -0.5 0.5\n-0.5 -0.5 0.5\n3 0 2 1\n3 0 3 2\n3 0 5 4\n3 0 1 5\n3 0 4 7\n3 0 7 3\n3 6 3 7\n3 6 2 3\n3 6 7 4\n3 6 4 5\n3 6 1 2\n3 6 5 1",
					};
					
					//加载一个空壳子
					var unitSetting = obj.result.unitSetting;
					var cacheKey = obj.result.cacheKey;
					var object3D = thatObj3DCreator.offToObject3D(geoJson, unitSetting);
					thatObj3DCreator.moveToCenter(object3D);
					thatObj3DCreator.addEdges(object3D, unitSetting);							
					thatObj3DCreator.callbackCreateObject3D(cacheKey, object3D, geoJson, unitSetting.id, unitSetting, afterCreateFunc); 
				}
				else{
                    var geoJson = obj.result.geoJson;
                    var cacheKey = obj.result.cacheKey;
                    var resourceJsons = obj.result.resourceJsons;
                    var resourceStatusHash = null;
                    if(resourceJsons != null && resourceJsons.length > 0){
						resourceStatusHash = {};
                        for(var i = 0; i < resourceJsons.length; i++){
                            var resourceJson = resourceJsons[i];
							var resourceType = resourceJson.resourceType;
							var resourceZipCode = resourceJson.name;
                            var resourceCacheKey = thatObj3DCreator.object3DCache.getResourceObject3DKey(resourceZipCode, resourceType);
                            if(!thatObj3DCreator.object3DCache.hasResourceObject3D(resourceCacheKey)){
								resourceStatusHash[resourceCacheKey] = false;
								switch(resourceType){
									case js3ResourceType.gltf:{
										thatObj3DCreator.addGltfObject3DToCache(resourceCacheKey, resourceZipCode);
										break;
									}
									case js3ResourceType.fbx:{
										thatObj3DCreator.addFbxObject3DToCache(resourceCacheKey, resourceZipCode);
										break;
									}
								}
                            }
                        }
                        thatObj3DCreator.waitingResourceObject3Ds[cacheKey] = {
                            cacheKey: cacheKey,
                            resultJson: obj.result,
                            resourceStatusHash: resourceStatusHash,
                            afterCreateFunc: afterCreateFunc
                        }; 
                    }
                    if(resourceStatusHash == null){
                        //不包含resource
                        thatObj3DCreator.createObject3DAfterLoadResource(cacheKey, obj.result,  afterCreateFunc);
                    }
                    else{
                        //所有的resource都已经在此之前加载过了
                        var allResourceLoaded = true;
                        for(var key in resourceStatusHash){
                            if(!resourceStatusHash[key]){
								allResourceLoaded = false;
                                break;
                            }
                        }
                        if(allResourceLoaded){
                            thatObj3DCreator.createObject3DAfterLoadResource(cacheKey, obj.result, afterCreateFunc);
                        }
                    }
                }
			},
			failFunc: function(obj) { 
				msgBox.error({title:"提示", info: obj.message});
				
				var geoJson = {
					offText: "OFF\n8 12 0\n-0.5 0.5 -0.5\n0.5 0.5 -0.5\n0.5 0.5 0.5\n-0.5 0.5 0.5\n-0.5 -0.5 -0.5\n0.5 -0.5 -0.5\n0.5 -0.5 0.5\n-0.5 -0.5 0.5\n3 0 2 1\n3 0 3 2\n3 0 5 4\n3 0 1 5\n3 0 4 7\n3 0 7 3\n3 6 3 7\n3 6 2 3\n3 6 7 4\n3 6 4 5\n3 6 1 2\n3 6 5 1",
				};
				
				//加载一个空壳子
				var object3D = thatObj3DCreator.offToObject3D(geoJson);
				thatObj3DCreator.moveToCenter(object3D);
				thatObj3DCreator.addEdges(object3D);							
				thatObj3DCreator.callbackCreateObject3D(cacheKey, object3D, geoJson, null, null, afterCreateFunc); 
			}
		});
	}
		
	this.createObject3DAfterLoadResource = function(cacheKey, resultJson, afterCreateFunc){
		var geoJson = resultJson.geoJson; 
		var serverUnitSetting = resultJson.unitSetting;
		var resourceJsons = resultJson.resourceJsons;

		//判断涉及的resources都已经load完成 modified by ls 20230312
		let allResourceLoaded = true;
		if(resourceJsons != null){
			for(let i = 0; i < resourceJsons.length; i++){
				let resJson = resourceJsons[i];
				let key = thatObj3DCreator.object3DCache.getResourceObject3DKey(resJson.name, resJson.resourceType);
				if(!thatObj3DCreator.object3DCache.hasResourceObject3D(key)){
					allResourceLoaded = false;
					break;
				}
			}
		}

		if(allResourceLoaded) {
			var resourceJson = geoJson["resource"];
			if (resourceJson == null) {
				//增加参数unitSetting added by ls 20220606
				var object3D = thatObj3DCreator.offToObject3D(geoJson, serverUnitSetting);

				if (!geoJson.useWorldPosition) {
					thatObj3DCreator.moveToCenter(object3D);
				}
				thatObj3DCreator.callbackCreateObject3D(cacheKey, object3D, geoJson, serverUnitSetting.id, serverUnitSetting, afterCreateFunc);
			} else {
				var object3D = thatObj3DCreator.jsonToResourceObject3D(geoJson, null, resultJson.unitSetting);

				thatObj3DCreator.callbackCreateObject3D(cacheKey, object3D, geoJson, serverUnitSetting.id, serverUnitSetting, afterCreateFunc);
			}
			delete thatObj3DCreator.waitingResourceObject3Ds[cacheKey];
		}
	}

	this.addGltfObject3DToCache = function(gltfCacheKey, gltfZipCode){
		var gltfFileUrl = thatObj3DCreator.getGltfFileUrl(gltfZipCode);
		THREE.Cache.enabled = true;
		var arrayBuffer = THREE.Cache.get(gltfFileUrl);
		if(arrayBuffer == null){
			var zipFs = new zip.fs.FS();
			//改为使用gltfZipCode获取文件 modifed by ls 20230828
			var gltfZipFilePath = thatObj3DCreator.getGltfZipFileUrl(gltfZipCode);
			zipFs.importHttpContent(gltfZipFilePath, false, function(zipFs, entries){
				var gltfEntry = null;
				var gltfName = "";
				var binEntry = null;
				var binName = "";
				var assistEntry = null;
				var assistName = "";
				for(var i = 0; i < zipFs.children.length; i++){
					var entry = zipFs.children[i];
					var entryName = entry.name;
					var entryLowerName = entryName.toLowerCase();
					if(entryLowerName.endWith(".gltf")){
						gltfEntry = entry;
						gltfName = entryName;
					}
					else if(entryLowerName.endWith(".bin")){
						binEntry = entry;
						binName = entryName;
					}
					else if(entryLowerName.endWith(".assist")){
						assistEntry = entry;
						assistName = entryName;
					}
				}

				var fileInfo = {
					gltfName: gltfName,
					binName: binName,
					assistName: assistName
				};

				//gltf
				var gltfBlobWriter = new zip.BlobWriter(zip.getMimeType(gltfName));
				gltfBlobWriter.fileInfo = fileInfo;
				gltfEntry.getData(gltfBlobWriter, function(blob){
						var reader = new FileReader();
						reader.fileInfo = blob.fileInfo;
						reader.onloadend = function(event) {
							var base64 = reader.result;
							var fileInfo = event.target.fileInfo;
							var gltfName = fileInfo.gltfName;
							var gltfFileUrl = thatObj3DCreator.getGltfFileUrl(gltfName);
							THREE.Cache.add(gltfFileUrl, base64);
							thatObj3DCreator.afterUnzipGltf(fileInfo.gltfName, fileInfo.binName, fileInfo.assistName);
						};
						reader.readAsArrayBuffer(blob);
					},
					function(progress){
					}, gltfEntry.crc32);

				//bin
				if(binEntry != null){
					var binBlobWriter = new zip.BlobWriter(zip.getMimeType(binName));
					binBlobWriter.fileInfo = fileInfo;
					binEntry.getData(binBlobWriter, function(blob){
							var reader = new FileReader();
							reader.fileInfo = blob.fileInfo;
							reader.onloadend = function(event) {
								var base64 = reader.result;
								var fileInfo = event.target.fileInfo;
								var binName = fileInfo.binName;
								var binFileUrl = thatObj3DCreator.getBinFileUrl(binName);
								THREE.Cache.add(binFileUrl, base64);
								thatObj3DCreator.afterUnzipGltf(fileInfo.gltfName, fileInfo.binName, fileInfo.assistName);
							};
							reader.readAsArrayBuffer(blob);
						},
						function(progress){
						}, binEntry.crc32);

				}

				//assist file
				if(assistEntry != null){
					var assistBlobWriter = new zip.BlobWriter(zip.getMimeType(assistName));
					assistBlobWriter.fileInfo = fileInfo;
					assistEntry.getData(assistBlobWriter, function(blob){
							var reader = new FileReader();
							reader.fileInfo = blob.fileInfo;
							reader.onloadend = function(event) {
								var base64 = reader.result;
								var fileInfo = event.target.fileInfo;
								var assistName = fileInfo.assistName;
								var assistFileUrl = thatObj3DCreator.getAssistFileUrl(assistName);
								THREE.Cache.add(assistFileUrl, base64);
								thatObj3DCreator.afterUnzipGltf(fileInfo.gltfName, fileInfo.binName, fileInfo.assistName);
							};
							reader.readAsArrayBuffer(blob);
						},
						function(progress){
						}, gltfEntry.crc32);
				}
			}, function(er){
				//throw er;
				//显示异常 modified by ls 20230828
				let message = "GLTF加载错误. " + er + " GltfName=" + gltfName;
				msgBox.alert({info: message});
				console.log(message);

				//添加一个box，用于显示错误的模型 added by ls 20230828
				var offText = "OFF\n"
					+ "8 12 0\n"
					+ "-0.5 0.5 -0.5\n"
					+ "0.5 0.5 -0.5\n"
					+ "0.5 0.5 0.5\n"
					+ "-0.5 0.5 0.5\n"
					+ "-0.5 -0.5 -0.5\n"
					+ "0.5 -0.5 -0.5\n"
					+ "0.5 -0.5 0.5\n"
					+ "-0.5 -0.5 0.5\n"
					+ "3 0 2 1\n"
					+ "3 0 3 2\n"
					+ "3 0 5 4\n"
					+ "3 0 1 5\n"
					+ "3 0 4 7\n"
					+ "3 0 7 3\n"
					+ "3 6 3 7\n"
					+ "3 6 2 3\n"
					+ "3 6 7 4\n"
					+ "3 6 4 5\n"
					+ "3 6 1 2\n"
					+ "3 6 5 1";

				var meshInfo = thatObj3DCreator.getMeshInfoFromOff(offText);
				var geometry = new THREE.BufferGeometry();
				geometry.setAttribute("position", new THREE.Float32BufferAttribute(meshInfo.vertices, 3))
				geometry.setIndex(meshInfo.faces)
				geometry.attributes.position.needsUpdate = true
				geometry.computeVertexNormals()
				geometry.addGroup(0, meshInfo.faces.length, 0);
				var material = thatObj3DCreator.getMaterial(null);
				var mesh = new THREE.Mesh(geometry, [material]);
				var object3D = new THREE.Object3D();
				object3D.add(mesh);
				thatObj3DCreator.object3DCache.addResourceObject3D(gltfCacheKey, object3D, null);
				thatObj3DCreator.afterLoadResourceFromServer(gltfCacheKey);
			});
			return;
		}
	}

	this.addFbxObject3DToCache = function(fbxCacheKey, fbxZipCode){
		var fbxFileUrl = thatObj3DCreator.getFbxFileUrl(fbxZipCode);
		THREE.Cache.enabled = true;
		var arrayBuffer = THREE.Cache.get(fbxFileUrl);
		if(arrayBuffer == null){
			var zipFs = new zip.fs.FS();
			//使用fbxZipCode获取文件
			var fbxZipFilePath = thatObj3DCreator.getFbxZipFileUrl(fbxZipCode);
			zipFs.importHttpContent(fbxZipFilePath, false, function(zipFs, entries){
				var fbxEntry = null;
				var fbxName = "";
				var assistEntry = null;
				var assistName = "";
				for(var i = 0; i < zipFs.children.length; i++){
					var entry = zipFs.children[i];
					var entryName = entry.name;
					var entryLowerName = entryName.toLowerCase();
					if(entryLowerName.endWith(".fbx")){
						fbxEntry = entry;
						fbxName = entryName;
					}
					else if(entryLowerName.endWith(".assist")){
						assistEntry = entry;
						assistName = entryName;
					}
				}

				const fileInfo = {
					fbxName:fbxName,
					assistName: assistName
				};

				//fbx
				var fbxBlobWriter = new zip.BlobWriter(zip.getMimeType(fbxName));
				fbxBlobWriter.fileInfo = fileInfo;
				fbxEntry.getData(fbxBlobWriter, function(blob){
						var reader = new FileReader();
						reader.fileInfo = blob.fileInfo;
						reader.onloadend = function(event) {
							const fileInfo = event.target.fileInfo;
							let fbxName = fileInfo.fbxName;
							let dotIndex = fileInfo.fbxName.lastIndexOf(".");
							let fbxZipCode = fileInfo.fbxName.substr(0, dotIndex);
							const fbxFileUrl = thatObj3DCreator.getFbxFileUrl(fbxZipCode, fbxName);
							fetch(fbxFileUrl)
								.then(response => {
									// 检查网络请求是否成功
									if (!response.ok) {
										let error = "Network response was not ok: " + response.statusText;
										msgBox.alert({info: error});
										throw new Error(error);
									}
									else{
										return response.arrayBuffer();
									}
								})
								.then(data => {
									THREE.Cache.add(fbxFileUrl, data);
									thatObj3DCreator.afterUnzipFbx(fileInfo.fbxName, fileInfo.assistName);
								})
								.catch(error => {
									msgBox.alert({info: error});
									console.error('Error during fetch:', error);
								});
						};
						reader.readAsArrayBuffer(blob);
					},
					function(progress){
					}, fbxEntry.crc32);


				//assist file
				if(assistEntry != null){
					var assistBlobWriter = new zip.BlobWriter(zip.getMimeType(assistName));
					assistBlobWriter.fileInfo = fileInfo;
					assistEntry.getData(assistBlobWriter, function(blob){
							var reader = new FileReader();
							reader.fileInfo = blob.fileInfo;
							reader.onloadend = function(event) {
								var base64 = reader.result;
								var fileInfo = event.target.fileInfo;
								var assistName = fileInfo.assistName;
								var assistFileUrl = thatObj3DCreator.getAssistFileUrl(assistName);
								THREE.Cache.add(assistFileUrl, base64);
								thatObj3DCreator.afterUnzipFbx(fileInfo.fbxName, fileInfo.assistName);
							};
							reader.readAsArrayBuffer(blob);
						},
						function(progress){
						}, assistEntry.crc32);
				}
			}, function(er){
				let message = "FBX加载错误. " + er + " FbxName=" + fbxZipCode;
				msgBox.alert({info: message});
				console.log(message);

				//添加一个box，用于显示错误的模型
				var offText = "OFF\n"
					+ "8 12 0\n"
					+ "-0.5 0.5 -0.5\n"
					+ "0.5 0.5 -0.5\n"
					+ "0.5 0.5 0.5\n"
					+ "-0.5 0.5 0.5\n"
					+ "-0.5 -0.5 -0.5\n"
					+ "0.5 -0.5 -0.5\n"
					+ "0.5 -0.5 0.5\n"
					+ "-0.5 -0.5 0.5\n"
					+ "3 0 2 1\n"
					+ "3 0 3 2\n"
					+ "3 0 5 4\n"
					+ "3 0 1 5\n"
					+ "3 0 4 7\n"
					+ "3 0 7 3\n"
					+ "3 6 3 7\n"
					+ "3 6 2 3\n"
					+ "3 6 7 4\n"
					+ "3 6 4 5\n"
					+ "3 6 1 2\n"
					+ "3 6 5 1";

				var meshInfo = thatObj3DCreator.getMeshInfoFromOff(offText);
				var geometry = new THREE.BufferGeometry();
				geometry.setAttribute("position", new THREE.Float32BufferAttribute(meshInfo.vertices, 3))
				geometry.setIndex(meshInfo.faces)
				geometry.attributes.position.needsUpdate = true
				geometry.computeVertexNormals()
				geometry.addGroup(0, meshInfo.faces.length, 0);
				var material = thatObj3DCreator.getMaterial(null);
				var mesh = new THREE.Mesh(geometry, [material]);
				var object3D = new THREE.Object3D();
				object3D.add(mesh);
				thatObj3DCreator.object3DCache.addResourceObject3D(fbxCacheKey, object3D, null);
				thatObj3DCreator.afterLoadResourceFromServer(fbxCacheKey);
			});
			return;
		}
	}

	this.getGltfFileUrl = function(gltfName){
    	var gltfFileUrl = basePath + "/resource/getGltf?name=" + encodeURIComponent(gltfName); 
    	return gltfFileUrl;
	}

	this.getGltfZipFileUrl = function(name){
		var gltfFileUrl = basePath + "/resource/getGltfZip?code=" + encodeURIComponent(name);
		return gltfFileUrl;
	}
	
	this.getBinFileUrl = function(binName){
    	var binFileUrl = binName == null || binName.length == 0 ? "" : (basePath + "/resource/getBin?name=" + encodeURIComponent(binName)); 
    	return binFileUrl;
	}
	
	this.getAssistFileUrl = function(assistName){
    	var assistFileUrl = assistName == null || assistName.length == 0 ? "" : (basePath + "/resource/getAssist?name=" + encodeURIComponent(assistName)); 
    	return assistFileUrl;
	}

	this.getFbxZipFileUrl = function(name){
		return basePath + "/resource/getFbxZip?code=" + encodeURIComponent(name);
	}

	this.getFbxImgFileUrl = function(resFbxName, imgName){
		return basePath + "/resource/getFbxImg?resFbxName=" + resFbxName + "&imgName=" + imgName;
	}

	this.getFbxFileUrl = function(resFbxName, fbxName){
		return fbxName == null || fbxName.length === 0 ? "" : (basePath + "/resource/getFbx?resFbxName=" + encodeURIComponent(resFbxName) + "&fbxName=" + encodeURIComponent(fbxName));
	}
	  
	this.waitingCallbackCreators = {};
	this.addToWaitingCallbackCreateObject3D = function(cacheKey, unitSetting){
		var waitingUnitSettings = thatObj3DCreator.waitingCallbackCreators[cacheKey];
		if(waitingUnitSettings == null){
			waitingUnitSettings = [];
			 thatObj3DCreator.waitingCallbackCreators[cacheKey] = waitingUnitSettings;
		}
		waitingUnitSettings.push(unitSetting);
	}
	
	this.callbackCreateObject3D = function(cacheKey, object3D, geoJson, unitId, serverUnitSetting, afterCreateFunc){
		thatObj3DCreator.object3DCache.addRefComponentObject3D(cacheKey, object3D, geoJson, unitId, serverUnitSetting);
		
		//有可能serverUnitSetting里的属性值与unitSetting的属性值不同（例如服务器端修改了属性值），那么需要更新 added by ls 20220623
		var requestParameters = {};
		var componentKey = serverUnitSetting.code + "_" + serverUnitSetting.versionNum;
		var refComponentInfo = thatObj3DCreator.editor.componentInfo.refComponents[componentKey];
		for(var paramName in serverUnitSetting.parameters){
			var unitParameter = serverUnitSetting.parameters[paramName];
			var refComponentInfoParameter = refComponentInfo.parameters[paramName];
			if(refComponentInfoParameter != null){
				var p = { 
					//如果参数值为undefined，那么赋值为null modified by ls 20220519
					value: unitParameter.value == undefined ? null : unitParameter.value,
					isGeo: refComponentInfoParameter.isGeo
				};
				
				if(unitParameter.exp != null){
					p.exp = {
						pim: unitParameter.exp.pim,
						js: unitParameter.exp.js
					};
				}			
				requestParameters[paramName] = p;
			}
		}
		var newCacheKey = thatObj3DCreator.object3DCache.getComponentObject3DKey(refComponentInfo.code, refComponentInfo.versionNum, requestParameters, serverUnitSetting.useWorldPosition, thatObj3DCreator.detailLevel, thatObj3DCreator.viewLevel);
		if(newCacheKey != cacheKey){
			thatObj3DCreator.object3DCache.addRefComponentObject3D(newCacheKey, object3D, geoJson, unitId, serverUnitSetting);
		}		
		
		var waitingUnitSettings = thatObj3DCreator.waitingCallbackCreators[cacheKey]; 
		for(var i = 0; i < waitingUnitSettings.length; i++){
			var unitSetting = waitingUnitSettings[i];
			var newObj3D = thatObj3DCreator.object3DCache.cloneRefComponentObject3D(cacheKey);
			
			//使用serverUnitSetting里的parameters更新js和ps
			if(serverUnitSetting != null){
				thatObj3DCreator.cloneUnitSetting(unitSetting, serverUnitSetting, newObj3D);
			}
			
			//resource增加边 added ls 20231024
			thatObj3DCreator.addEdges(newObj3D, unitSetting);
			
			if(afterCreateFunc != null){
				afterCreateFunc({
					object3D: newObj3D,
					unitSetting: unitSetting,
					cacheKey: cacheKey
				});
			}
		}
	}
	
	this.cloneUnitSetting = function(unitSetting, serverUnitSetting, object3D){
		var refComponentInfo = thatObj3DCreator.editor.componentInfo.refComponents[unitSetting.code + "_" + unitSetting.versionNum];
		for(var paramName in serverUnitSetting.parameters){
 
			//如果本参数参与了几何造型，那么使用服务器端返回的参数值 modified by ls 20231201
			var refParam = refComponentInfo.parameters[paramName];
			if(refParam != null && refParam.isGeo){			
				var serverUnitParam = serverUnitSetting.parameters[paramName];
				
				//参数值允许服务器端修改 modifed by ls 20220507
				var unitParam = unitSetting.parameters[paramName];
				if(unitParam != null){ 
					if(serverUnitParam.exp != null){
						unitParam.exp = serverUnitParam.exp;
					}
					unitParam.value = serverUnitParam.value;
				}
				else{
					//这是个新增的参数 added by ls 20230614
					unitSetting.parameters[paramName] = {
						value: serverUnitParam.value
					};
				}
			}
		}
		
		//更新位置和旋转 added by ls 20230628
		unitSetting.useParameterPosition = serverUnitSetting.useParameterPosition;
		if(serverUnitSetting.useParameterPosition){
			//当useParameterPosition时，使用服务器端返回的位置
			if(serverUnitSetting.position != null){
				unitSetting.position = serverUnitSetting.position;
			}
			if(serverUnitSetting.rotation != null){
				unitSetting.rotation = serverUnitSetting.rotation;
			}
		}
		else{
			//如果是新建的构件，且指定了中心点，且不是useParameterPosition，那么需要按照中心点做一下偏移 added by ls 20230629
			if(unitSetting.id == null){
				var refComponentInfo = thatObj3DCreator.editor.componentInfo.refComponents[unitSetting.code + "_" + unitSetting.versionNum];
				var assistPointName = refComponentInfo.init.locationType.assistPoint;
				if(assistPointName != null && assistPointName.length > 0){
					var assistPointInfo = thatObj3DCreator.getAssistPointInfoByName(assistPointName, object3D);
					//先判断辅助点是否存在 modified by ls 20230726
					if(assistPointInfo != null){
						unitSetting.position = [unitSetting.position[0] - assistPointInfo.x,
						                        unitSetting.position[1] - assistPointInfo.y,
						                        unitSetting.position[2] - assistPointInfo.z];
					}
				}
			}
		}
		
		//更新useWorldPosition added by ls 20220606
		unitSetting.useWorldPosition = serverUnitSetting.useWorldPosition;
		if(unitSetting.useWorldPosition){
			unitSetting.position = [0, 0, 0];
			unitSetting.rotation = [0, 0, 0]; 
		}
	}
	
	//获取辅助点信息 added by ls 20230629
	this.getAssistPointInfoByName = function(name, object3D){
		if(object3D.assistPoints != null){
			for(var i = 0; i < object3D.assistPoints.length; i++){
				var assistPointInfo = object3D.assistPoints[i];
				if(assistPointInfo.name == name){
					return assistPointInfo;
				}
			}
		}
		return null;
	}

    this.addEdges = function(object3D, unitSetting){
    	//标注不显示edge added by ls 20220606
    	if(thatObj3DCreator.doesShowEdge && !unitSetting.code.startWith(js3SysCatAndCom.tagCategoryPre)){
	        var childObject3Ds = thatObj3DCreator.getChildObject3Ds(object3D);
	    	if(childObject3Ds.length == 0){
	    		if(object3D.isLine){
	    			//如果本身就是线，那么不用加边了 added by ls 20230830
	    		}
	    		else if(object3D.geometry == null){
	    			//当geometry为空时，不加轮廓线，一般为造型返回的结果OFF为0 0 0，是个没有点线面的空模型 added by ls 20230906
	    		}
	    		else{
		            var edges= new THREE.EdgesGeometry(object3D.geometry, 60);
		            var line = new THREE.LineSegments(edges, thatObj3DCreator.edgeMaterial);
		            line.isEdgeLine = true; 
		            object3D.add(line);
	    		}
	    	}
	    	else{
	    		for(var i = 0; i < childObject3Ds.length; i++){
	    			var childObj = childObject3Ds[i];
	    			thatObj3DCreator.addEdges(childObj, unitSetting);
	    		}
	    	}
    	}
    }
    
    this.getChildObject3Ds = function(object3D){
    	var childObject3Ds = [];
    	for(var i = 0; i < object3D.children.length; i++){
    		var childObject3D = object3D.children[i];
    		if(!childObject3D.isEdgeLine){
    			childObject3Ds.push(childObject3D);
    		}
    	}
    	return childObject3Ds;
    } 

    //将计算位置的函数分为两个，一个计算，一个改变位置 modified by ls 20220606
    this.runUnitPositionExpJs = function(object3D, positionExps, ps){  
		var newPos =  thatObj3DCreator.calcUnitPositionByExpJs(object3D, positionExps, ps); 
       	object3D.position.set(newPos[0], newPos[1], newPos[2]);
    }    
    this.calcUnitPositionByExpJs = function(object3D, positionExps, ps){ 
		var position = null;
		if(object3D.unitData.position != null){
			position = [object3D.unitData.position[0], object3D.unitData.position[1], object3D.unitData.position[2]];
		}
		else{
			position = [object3D.position.x, object3D.position.y, object3D.position.z];
		}
		var newPos =  thatObj3DCreator.getPositionByUnitExpJs(position, positionExps, ps, object3D); 
		return newPos;
    }    
    this.getPositionByUnitExpJs = function(newPos, positionExps, ps, object3D){
    	var runner = new ExpressionRunner(); 
    	if(positionExps.posX != null || positionExps.minX != null || positionExps.maxX != null){
    		if(positionExps.posX != null){
    	    	var resultValue = runner.run(ps, positionExps.posX.js) / thatObj3DCreator.editor.valueMultiply;
    	    	newPos[0] = resultValue;
    		}
    		else if(positionExps.minX != null){
    	    	var resultValue = runner.run(ps, positionExps.minX.js) / thatObj3DCreator.editor.valueMultiply;
    	    	thatObj3DCreator.getPositionValuesByPosParam("unitMinX", resultValue, newPos, object3D);
    		}
    		else if(positionExps.maxX != null){
    	    	var resultValue = runner.run(ps, positionExps.maxX.js) / thatObj3DCreator.editor.valueMultiply;
    	    	thatObj3DCreator.getPositionValuesByPosParam("unitMaxX", resultValue, newPos, object3D);
    		}
    	}
    	if(positionExps.posY != null || positionExps.minY != null || positionExps.maxY != null){
    		if(positionExps.posY != null){
    	    	var resultValue = runner.run(ps, positionExps.posY.js) / thatObj3DCreator.editor.valueMultiply;
    	    	newPos[1] = resultValue;
    		}
    		else if(positionExps.minY != null){
    	    	var resultValue = runner.run(ps, positionExps.minY.js) / thatObj3DCreator.editor.valueMultiply;
    	    	thatObj3DCreator.getPositionValuesByPosParam("unitMinY", resultValue, newPos, object3D);
    		}
    		else if(positionExps.maxY != null){
    	    	var resultValue = runner.run(ps, positionExps.maxY.js) / thatObj3DCreator.editor.valueMultiply;
    	    	thatObj3DCreator.getPositionValuesByPosParam("unitMaxY", resultValue, newPos, object3D);
    		}
    	}
    	if(positionExps.posZ != null || positionExps.minZ != null || positionExps.maxZ != null){
    		if(positionExps.posZ != null){
    	    	var resultValue = runner.run(ps, positionExps.posZ.js) / thatObj3DCreator.editor.valueMultiply;
    	    	newPos[2] = resultValue;
    		}
    		else if(positionExps.minZ != null){
    	    	var resultValue = runner.run(ps, positionExps.minZ.js) / thatObj3DCreator.editor.valueMultiply;
    	    	thatObj3DCreator.getPositionValuesByPosParam("unitMinZ", resultValue, newPos, object3D);
    		}
    		else if(positionExps.maxZ != null){
    	    	var resultValue = runner.run(ps, positionExps.maxZ.js) / thatObj3DCreator.editor.valueMultiply;
    	    	thatObj3DCreator.getPositionValuesByPosParam("unitMaxZ", resultValue, newPos, object3D);
    		}
    	}
    	return newPos;
    }

    
    //将计算角度的函数分为两个，一个计算，一个改变位置 modified by ls 20220606
    this.runUnitRotationExpJs = function(object3D, rotationExps, ps){ 
		var newRot = thatObj3DCreator.calcUnitRotationByExpJs(object3D, rotationExps, ps);
       	object3D.rotation.set(newRot[0], newRot[1], newRot[2]);
    }
    this.calcUnitRotationByExpJs = function(object3D, rotationExps, ps){
		var rotation = null;
		if(object3D.unitData.rotation != null){
			rotation = [object3D.unitData.rotation[0], object3D.unitData.rotation[1], object3D.unitData.rotation[2]];
		}
		else{
			rotation = [object3D.rotation.x, object3D.rotation.y, object3D.rotation.z];
		}
		var newRot = thatObj3DCreator.getRotationByUnitExpJs(rotation, rotationExps, ps, object3D);
       	return newRot;
    }    
    this.getRotationByUnitExpJs = function(newRot, rotationExps, ps, object3D){ 
    	var runner = new ExpressionRunner();
    	if(rotationExps.rotX != null){ 
	    	var resultValue = runner.run(ps, rotationExps.rotX.js);
	    	newRot[0] = resultValue * Math.PI / 180; 
    	}
    	if(rotationExps.rotY != null){ 
	    	var resultValue = runner.run(ps, rotationExps.rotY.js);
	    	newRot[1] = resultValue * Math.PI / 180; 
    	}
    	if(rotationExps.rotZ != null){ 
	    	var resultValue = runner.run(ps, rotationExps.rotZ.js);
	    	newRot[2] = resultValue * Math.PI / 180; 
    	}
       	return newRot;
    }
    
    this.getPositionValuesByPosParam = function(posParamName, posParamValue, position, object3D){
        var box = new THREE.Box3().setFromObject(object3D, true); 
        var geoCenterPos = {
        	x: (box.min.x + box.max.x) / 2,
        	y: (box.min.y + box.max.y) / 2,
        	z: (box.min.z + box.max.z) / 2
        };
        //旋转后posX、posY、posZ不一定在中心点上
        if(posParamName == "unitMinX"){
			var newMinX = posParamValue;			 
			//var lenX = Math.abs(box.max.x - box.min.x); 
			position[0] = newMinX + (object3D.position.x - box.min.x);
		}
        else if(posParamName == "unitMaxX"){
			var newMaxX = posParamValue;
			//var lenX = Math.abs(box.max.x - box.min.x); 
			position[0] = newMaxX - (box.max.x - object3D.position.x);
		}
        else if(posParamName == "unitMinY"){
			var newMinY = posParamValue;
			//var lenY = Math.abs(box.max.y - box.min.y); 
			position[1] = newMinY + (object3D.position.y - box.min.y);
		}
        else if(posParamName == "unitMaxY"){
			var newMaxY = posParamValue;
			//var lenY = Math.abs(box.max.y - box.min.y); 
			position[1] = newMaxY - (box.max.y - object3D.position.y);
		}
        else if(posParamName == "unitMinZ"){
			var newMinZ = posParamValue;
			//var lenZ = Math.abs(box.max.z - box.min.z); 
			position[2] = newMinZ + (object3D.position.z - box.min.z);
		}
        else if(posParamName == "unitMaxZ"){
			var newMaxZ = posParamValue;
			//var lenZ = Math.abs(box.max.z - box.min.z); 
			position[2] = newMaxZ - (box.max.z - object3D.position.z);
		}	 
    }

	this.createJs3UnitComponentProcessor = function(componentCode, componentVersionNum){
		if(js3Components[componentCode] != null && js3Components[componentCode][componentVersionNum] != null){
			var componentInfo =  js3Components[componentCode][componentVersionNum];
			var componentClassName = componentInfo.className; 
			var hasLoad = false;
			try{
				eval(componentClassName);
				hasLoad = true;
			}
			catch(e){
				throw "加载构件类出错. " + componentClassName;
			} 
			var unitComProcessor = eval("new "+ componentClassName + "()");
			if(!unitComProcessor.checkCodeVersion(componentCode, componentVersionNum)){
				throw "加载构件类版本出错. code = " + componentCode + ", versionNum = " + componentVersionNum + " processorCode = " + unitComProcessor.componentInfo.componentCode + ", processorVersionNum = " + componentProcessor.componentInfo.componentVersionNum;
			}
			return unitComProcessor;
		}
		else{
			//使用通用的UnitComponentProceessor
			var unitComProcessor = new JS3UnitComponentProcessor();
			return unitComProcessor;
		}
	}     
	
	this.runUnitParameterExps = function(unitSetting, refComponentInfos, parentParameters){
		var componentInfo = refComponentInfos[unitSetting.code + "_" + unitSetting.versionNum];
		var unitParameters = unitSetting.parameters;
		var componentParameters = componentInfo.parameters;
		var parameters = {}; 
		var ps = {};
		var runner = new ExpressionRunner();
		for(var paramName in componentParameters){
			var componentParameter = componentParameters[paramName]; 
			var valueType = getValueTypeByParameterType(componentParameter.paramType);
			var unitParameter = unitParameters[paramName]; 
			var value = null;
			if(unitParameter != null){ 
				if(unitParameter.exp == null){ 
					//如果没有设置表达式，name直接使用unit参数指定的值
					value = unitParameter.value; 
				}
				else{
					//计算unit引用时，设置的表达式
					var jsCode = unitParameter.exp.js;
					value = runner.run(parentParameters, jsCode);
				}
			}
			else{
				//如果unit里没有这个参数，那么直接使用组件里设置的默认值
				value = cmnPcr.strToObject(componentParameter.defaultValue, valueType); 
			}
			parameters[paramName] = {
				value: value
			};
			ps[paramName] = value;
		} 
		
		if(componentInfo.sortedRunExpParameters != null){
		//计算本组件里，各个参数设置的表达式
		var runner = new ExpressionRunner();
			for(var i = 0; i < componentInfo.sortedRunExpParameters.length; i++){
				var paramName = componentInfo.sortedRunExpParameters[i];
				var parameter = componentParameters[paramName];
				if(parameter.exp != null){
					 var jsCode = parameter.exp.js;
					 var resultValue = runner.run(ps, jsCode);
					 ps[paramName] = resultValue;
					 parameters[paramName].value = resultValue;
				}
			}
		}
		return parameters;
	}
	
	this.runParameterExps = function(parameters, refComponentInfo){
		var ps = {};
		for(var paramName in refComponentInfo.parameters){
			var refParameter = refComponentInfo.parameters[paramName];
			var parameter = parameters[paramName];
			if(parameter == null){
				var valueType = getValueTypeByParameterType(refParameter.paramType);
				parameter = { 
					value: cmnPcr.strToObject(refParameter.defaultValue, valueType)
				};
				parameters[paramName] = parameter;
			}
			ps[paramName] = parameter.value;
		}
		
		//如果包含参数表达式
		if(refComponentInfo.sortedRunExpParameters != null){
			var runner = new ExpressionRunner();		
			for(var i = 0; i < refComponentInfo.sortedRunExpParameters.length; i++){
				var paramName = refComponentInfo.sortedRunExpParameters[i];
				var parameter = refComponentInfo.parameters[paramName];
				if(parameter.exp != null){
					 var jsCode = parameter.exp.js;
					 var resultValue = runner.run(ps, jsCode);
					 ps[paramName] = resultValue;
					 parameters[paramName].value = resultValue;
				}
			}
		}
	} 

	this.meshToOff = function(mesh){
		var geoText = "OFF\n";
		var vertices = mesh.geometry.vertices;
		var faces = mesh.geometry.faces;
		geoText += (vertices.length + " " + faces.length + " 0\n");
		for(var i = 0; i < vertices.length; i++){
			var vertice = vertices[i];
			var tempVertice = vertice.clone();
			tempVertice.applyMatrix4(mesh.matrixWorld);
			var x = tempVertice.x.toFixed(4);
			var y = tempVertice.y.toFixed(4);
			var z = tempVertice.z.toFixed(4);
			geoText += (x + " " + y + " " + z + "\n");
		}
		for(var i = 0; i < faces.length; i++){
			var face = faces[i];
			geoText += ("3  " + face.a + " " + face.b + " " + face.c + "\n");
		}
		return geoText;
	}
	
	//构造标注的object3Ds added by ls 20221208
	this.createTagRootObject3D = function(cacheKey){
		var geoJson = thatObj3DCreator.object3DCache.getGeoJson(cacheKey);
		var tagRootObject3D = new THREE.Object3D();
		var tagObject3Ds = new Array();
		if(geoJson.tags != null){
			for(var i = 0; i < geoJson.tags.length; i++){
				var tagJson = geoJson.tags[i];
				var tagObject3D = thatObj3DCreator.offToTagObject3D(tagJson);
				tagObject3Ds.push(tagObject3D);
			}
		}
		for(var i = 0; i < tagObject3Ds.length; i++){
			var tagObject3D = tagObject3Ds[i];
			tagRootObject3D.add(tagObject3D);
		}
		tagRootObject3D.isTagRootObject = true;
		
		return tagRootObject3D;		
	}
	
	//offJson转标注object3D added by ls 20221208
	this.offToTagObject3D = function(tagJson){
		var offText = tagJson["offText"];
		var materialName = tagJson["material"];
		if(offText == null){
			//包含子节点
			var childOffs = tagJson["children"];
			var object3D = new THREE.Object3D();
			for(var i = 0; i < childOffs.length; i++){
				var childOffJson = childOffs[i];
				var tempNamePath = childOffJson.name;
				thatObj3DCreator.offToSubTagObject3D(childOffJson, tagJson, object3D, tempNamePath); 
			} 
			return object3D;
		}
		else{
			var meshInfo = thatObj3DCreator.getMeshInfoFromOff(offText);
			var mesh = thatObj3DCreator.getMeshFromOff(meshInfo, materialName, lineMaterialName);
			mesh.name = "Mesh"; 
	        var object3D = new THREE.Object3D();
	        object3D.add(mesh); 
	        mesh.castShadow = thatObj3DCreator.editor.hasShadow;
	        mesh.receiveShadow = thatObj3DCreator.editor.hasShadow;
			thatObj3DCreator.refreshMeshUvMaterial(mesh, tagJson); 			
			return object3D;
		}
	}

	//offJson转标注subObject3D added by ls 20221208
	this.offToSubTagObject3D = function(tagJson, parentGeoJson, rootObject3D, namePath){
		tagJson.parentGeoJson = parentGeoJson;
		var offText = tagJson["offText"];
		var materialName = tagJson["material"];
		var lineMaterialName = tagJson["lineMaterial"];
		if(offText == null){
			var childOffs = tagJson["children"]; 
			for(var i = 0; i < childOffs.length; i++){
				var childOffJson = childOffs[i];
				var tempNamePath = (namePath.length == 0 ? "" : (namePath + "/")) + childOffJson.name;
				thatObj3DCreator.offToSubTagObject3D(childOffJson, tagJson, rootObject3D, tempNamePath);
			}  
		}
		else{
			var meshInfo = thatObj3DCreator.getMeshInfoFromOff(offText);
			var mesh = thatObj3DCreator.getMeshFromOff(meshInfo, materialName, lineMaterialName); 
			mesh.name = namePath;
			rootObject3D.add(mesh);
		} 
		tagJson.parentGeoJson = null;
	} 

	this.offToObject3D = function(geoJson, unitSetting){//增加unitSetting参数 modified by ls 20220606
		var offText = geoJson["offText"];
		var materialName = geoJson["material"];

		//线材质 added by ls 20221124
		var lineMaterialName = geoJson["lineMaterial"];
		
		var resourceJson = geoJson["resource"];
		if(resourceJson != null){
			//在此加载resource模型
			
		}
		else if(geoJson.isPoint){
			//辅助点造型 added by ls 20221025
	        var object3D = new THREE.Object3D();
			var mesh = thatObj3DCreator.getAssistMesh(unitSetting);
	        object3D.add(mesh); 
			return object3D;
		}
		else if(offText == null){
			//包含子节点
			var childOffs = geoJson["children"];
			var object3D = new THREE.Object3D();
			for(var i = 0; i < childOffs.length; i++){
				var childOffJson = childOffs[i];
				var tempNamePath = childOffJson.name;
				thatObj3DCreator.offToSubObject3D(childOffJson, geoJson, object3D, tempNamePath, unitSetting, true); 
			} 
			return object3D;
		}
		else{		  
			//从off里获取meshInfo added by ls 20221124
			var meshInfo = thatObj3DCreator.getMeshInfoFromOff(offText);
			var mesh = thatObj3DCreator.getMeshFromOff(meshInfo, materialName, lineMaterialName);
			mesh.name = "Mesh"; 
	        var object3D = new THREE.Object3D();
	        object3D.add(mesh); 
	        mesh.castShadow = thatObj3DCreator.editor.hasShadow;
	        mesh.receiveShadow = thatObj3DCreator.editor.hasShadow;
			thatObj3DCreator.refreshMeshUvMaterial(mesh, geoJson); 

			//增加unitSetting参数传递 modified by ls 20220606
			thatObj3DCreator.addEdges(object3D, unitSetting);	
			
			return object3D;
		}
	}

    
    this.moveToCenter = function(object3D){
        var box = new THREE.Box3().setFromObject(object3D, true);        
        var xHalf = (box.max.x - box.min.x) / 2;
        var yHalf = (box.max.y - box.min.y) / 2;
        var zHalf = (box.max.z - box.min.z) / 2;     
        var xCenter = (box.min.x + box.max.x) / 2;
        var yCenter = (box.min.y + box.max.y) / 2;
        var zCenter = (box.min.z + box.max.z) / 2;
        
        //记录下居中时造成的偏移量 added by ls 20221208
        object3D.centerShift = {
        	x: -xCenter,
        	y: -yCenter,
        	z: -zCenter
        };
        
        for(var i = 0; i < object3D.children.length; i++){
        	var meshObj = object3D.children[i]; 
        	if(!meshObj.userData.isResource){        		
	            var x = -xCenter;
	            var y = -yCenter;
	            var z = -zCenter;
	    		meshObj.position.set(x, y, z);   
        	}
        	else{        		
	            var x = meshObj.position.x - xCenter;
	            var y = meshObj.position.y - yCenter;
	            var z = meshObj.position.z - zCenter;
	    		meshObj.position.set(x, y, z);   
        	}
        } 
        
        //将辅助点的位置也平移，和整体一致 added by ls 20221026
        if(object3D.assistPoints != null){
        	for(var i = 0; i < object3D.assistPoints.length; i++){
        		var assistPoint = object3D.assistPoints[i];
        		assistPoint.x = assistPoint.x - xCenter;
        		assistPoint.y = assistPoint.y - yCenter;
        		assistPoint.z = assistPoint.z - zCenter;
        	}
        }
    }

	//resource的外轮廓mesh
	this.createResourceBoxMesh = function (boxMeshInfo, material){
		return thatObj3DCreator.getMeshFromOffWithMaterial(boxMeshInfo, null, material);
	}
    
    this.jsonToResourceObject3D = function(geoJson, parentGeoJson, unitSetting){
        //三个scale属性 modified by ls 20230901
        var scaleX = geoJson.resource.scaleX;
        var scaleY = geoJson.resource.scaleY;
        var scaleZ = geoJson.resource.scaleZ;
        
    	//外框 added by ls 20230829
		var boxMeshInfo = thatObj3DCreator.getMeshInfoFromOff(geoJson.offText);
		var boxMesh = thatObj3DCreator.createResourceBoxMesh(boxMeshInfo, thatObj3DCreator.resourceBoxEdgeMaterial);
		//thatObj3DCreator.moveToCenter(boxMesh); 

		var resourceType = geoJson.resource["resourceType"];
		var resourceZipCode = geoJson.resource["name"];
    	var cacheKey = thatObj3DCreator.object3DCache.getResourceObject3DKey(resourceZipCode, resourceType);
    	var resourceObject3D =  thatObj3DCreator.object3DCache.cloneResourceObject3D(cacheKey);
		thatObj3DCreator.moveToCenter(resourceObject3D);
		if(thatObj3DCreator.editor.hasShadow){
			thatObj3DCreator.setResourceMeshShadow(resourceObject3D);
		}

        var outerResourceObject3D = new THREE.Object3D();
		outerResourceObject3D.add(resourceObject3D);
		resourceObject3D.scale.set(scaleX, scaleY, scaleZ);
		resourceObject3D.rotation.set(geoJson.rotation[0], geoJson.rotation[1], geoJson.rotation[2]);
        thatObj3DCreator.moveToCenter(outerResourceObject3D);
        var box = new THREE.Box3().setFromObject(boxMesh, true);
        var xCenter = (box.min.x + box.max.x) / 2;
        var yCenter = (box.min.y + box.max.y) / 2;
        var zCenter = (box.min.z + box.max.z) / 2;
		outerResourceObject3D.position.set(xCenter, yCenter, zCenter);

        var object3D = new THREE.Object3D();
        object3D.add(outerResourceObject3D);
        object3D.add(boxMesh);
        //object3D.position.set(geoJson.position[0], geoJson.position[1], geoJson.position[2]);

        //增加辅助点 added by ls 20230418
    	var assistInfo =  thatObj3DCreator.object3DCache.getResourceAssistInfo(cacheKey);
		if(assistInfo != null ){
			object3D.assistPoints =  new Array();
			for(var pointName in assistInfo){
				var p = assistInfo[pointName];
				object3D.assistPoints.push({
					pointType: p.pointType,
					x: p.x * scaleX,
					y: p.y * scaleY,
					z: p.z * scaleZ
				});
			}
		}

		return object3D;
    }

    this.setResourceMeshShadow = function(object3D){
    	if(object3D.children.length > 0){
    		for(var i = 0; i < object3D.children.length; i++){
	    		var childObj = object3D.children[i];
	    		thatObj3DCreator.setResourceMeshShadow(childObj);
    		}
    	}
    	else{
    		object3D.castShadow = true;
    		object3D.receiveShadow = true;  
    		if(object3D.material != null){
	    		if(object3D.material.length == null){
	    			object3D.material.flatShading = true;
	    		}
	    		else{
	    			for(var i = 0; i < object3D.material.length; i++){
	        			object3D.material[i].flatShading = true;
	    			}
	    		} 
    		}
    	}
    }

	this.afterUnzipGltf = function(gltfName, binName, assistName){
		var canLoadGltfObject3D = true;
		var gltfFileUrl = thatObj3DCreator.getGltfFileUrl(gltfName);
		var gltfArray = THREE.Cache.get(gltfFileUrl);
		if(gltfArray == null){
			canLoadGltfObject3D = false;
		}
		var binFileUrl = "";
		if(binName != null && binName.length > 0){
			binFileUrl = thatObj3DCreator.getBinFileUrl(binName);
			var binArray = THREE.Cache.get(binFileUrl);
			if(binArray == null){
				canLoadGltfObject3D = false;
			}
		}
		var assistInfo = null;
		if(assistName != null && assistName.length > 0){
			var assistFileUrl = thatObj3DCreator.getAssistFileUrl(assistName);
			var assistArray = THREE.Cache.get(assistFileUrl);
			if(assistArray == null){
				canLoadGltfObject3D = false;
			}
			else{
				var assistText = (new TextDecoder('utf-8')).decode(assistArray);
				assistInfo = cmnPcr.strToJson(assistText);
			}
		}

		if(canLoadGltfObject3D){
			var gltfZipCode = gltfName.substring(0, gltfName.length - 5);
			var gltfCacheKey = thatObj3DCreator.object3DCache.getResourceObject3DKey(gltfZipCode, js3ResourceType.gltf);
			//升级threejs r146，更改应用gltfLoader的方式 modified by ls 20230417
			let loader = new GLTFLoader();
			loader.parse(gltfArray, binFileUrl,
				function ( obj ) {
					var glTF = {
						scene: obj.scene,
						scenes: obj.scenes,
						cameras: obj.cameras,
						animations: obj.animations,
						asset: obj.asset
					};
					var gltfCacheKey = glTF.asset.cacheKey;
					var assistInfo = glTF.asset.assistInfo;

					//支持scene包含多个object3d modified by ls 20231204
					var gltfObject3Ds = glTF.scene.children;
					var object3D = new THREE.Object3D();
					for(let i = 0; i < gltfObject3Ds.length; i++){
						let gltfObject3D = gltfObject3Ds[i];
						object3D.add(gltfObject3D);
					}
					thatObj3DCreator.object3DCache.addResourceObject3D(gltfCacheKey, object3D, assistInfo);

					thatObj3DCreator.afterLoadResourceFromServer(gltfCacheKey);

				},
				function(error) {
					console.log('load error!' + error.message);
				},
				{
					cacheKey: gltfCacheKey,
					assistInfo: assistInfo
				});
		}
	}

	this.afterUnzipFbx = function(fbxFileName, assistFileName){
		var canLoadFbxObject3D = true;
		let dotIndex = fbxFileName.lastIndexOf(".");
		let fbxZipCode = fbxFileName.substr(0, dotIndex);
		var fbxFileUrl = thatObj3DCreator.getFbxFileUrl(fbxZipCode, fbxFileName);
		var fbxArray = THREE.Cache.get(fbxFileUrl);
		if(fbxArray == null){
			canLoadFbxObject3D = false;
		}
		var assistInfo = null;
		if(assistFileName != null && assistFileName.length > 0){
			var assistFileUrl = thatObj3DCreator.getAssistFileUrl(assistFileName);
			var assistArray = THREE.Cache.get(assistFileUrl);
			if(assistArray == null){
				canLoadFbxObject3D = false;
			}
			else{
				var assistText = (new TextDecoder('utf-8')).decode(assistArray);
				assistInfo = cmnPcr.strToJson(assistText);
			}
		}

		if(canLoadFbxObject3D){
			let imgFileUrl = thatObj3DCreator.getFbxImgFileUrl(fbxZipCode, "");
			let fbxCacheKey = thatObj3DCreator.object3DCache.getResourceObject3DKey(fbxZipCode, js3ResourceType.fbx);
			let loader = new FBXLoader();
			let fbxObject3D = loader.parse(fbxArray, imgFileUrl);
			let object3D = new THREE.Object3D();
			object3D.add(fbxObject3D);
			thatObj3DCreator.object3DCache.addResourceObject3D(fbxCacheKey, object3D, assistInfo);
			thatObj3DCreator.afterLoadResourceFromServer(fbxCacheKey);
		}
	}

	this.afterLoadResourceFromServer = function(resourceCacheKey){
    	var allObjCacheKeys = new Array();
    	for(var waitingResourceObject3DKey in thatObj3DCreator.waitingResourceObject3Ds){
    		allObjCacheKeys.push(waitingResourceObject3DKey);
    	}
    	for(var i = 0; i < allObjCacheKeys.length; i++){
    		var objCacheKey = allObjCacheKeys[i];
    		var waitingResourceObject3D = thatObj3DCreator.waitingResourceObject3Ds[objCacheKey];
    		var resourceStatusHash = waitingResourceObject3D.resourceStatusHash;
    		if(resourceStatusHash[resourceCacheKey] != null){
				resourceStatusHash[resourceCacheKey] = true;
    			var canCreate = true;
    			for(var resourceStatus in resourceStatusHash){
    				if(resourceStatus == false){
    					canCreate = false;
    					break;
    				}
    			}
    			if(canCreate){ 
					thatObj3DCreator.createObject3DAfterLoadResource(objCacheKey, waitingResourceObject3D.resultJson, waitingResourceObject3D.afterCreateFunc);
    			}
    		}
    	}
    }
    
	this.offToSubObject3D = function(geoJson, parentGeoJson, rootObject3D, namePath, unitSetting, needAssistPoint){//增加参数unitSetting modified by ls 20220606
		//如果是辅助点，那么不构造mesh
		if(geoJson.isPoint){
			//递归处理时，子构件的辅助点，就不加进去了 modified by ls 20230616
			if(needAssistPoint){
				if(rootObject3D.assistPoints == null){
					rootObject3D.assistPoints =  new Array();
				}
				if(geoJson.children == null){
					rootObject3D.assistPoints.push({
						//增加记录辅助点类型 added by ls 20230208
						pointType: geoJson.pointType,
						name: geoJson.name,
						x: geoJson.position[0],
						y: geoJson.position[1],
						z: geoJson.position[2]
					});
				}
				else{
					//辅助点支持unitNum added by ls 20230726
					for(var i = 0; i < geoJson.children.length; i++){
						var childGeoJson = geoJson.children[i];
						rootObject3D.assistPoints.push({
							pointType: geoJson.pointType,
							name: geoJson.name + childGeoJson.name,
							x: childGeoJson.position[0],
							y: childGeoJson.position[1],
							z: childGeoJson.position[2]
						});
					}
				}
			}
		}
		else{
			geoJson.parentGeoJson = parentGeoJson;
			var offText = geoJson["offText"];
			var materialName = geoJson["material"];
			
			//线的材质 added by ls 20221124
			var lineMaterialName = geoJson["lineMaterial"];
			
			var resourceJson = geoJson["resource"];
			if(resourceJson != null){
				//在此加载resource模型
				var object3D = thatObj3DCreator.jsonToResourceObject3D(geoJson, parentGeoJson, unitSetting);
				rootObject3D.add(object3D); 
				object3D.name = namePath;
		        object3D.userData.isResource = true;
			}
			else if(offText == null){
				//包含子节点
				var childOffs = geoJson["children"];
				for(var i = 0; i < childOffs.length; i++){
					var childOffJson = childOffs[i];
					var tempNamePath = (namePath.length == 0 ? "" : (namePath + "/")) + childOffJson.name;
					thatObj3DCreator.offToSubObject3D(childOffJson, geoJson, rootObject3D, tempNamePath, unitSetting, false);
				}  
			}
			else{		  
				//从off里获取meshInfo added by ls 20221124
				var meshInfo = thatObj3DCreator.getMeshInfoFromOff(offText);
				var mesh = thatObj3DCreator.getMeshFromOff(meshInfo, materialName, lineMaterialName); 
				mesh.name = namePath; 
				thatObj3DCreator.refreshMeshUvMaterial(mesh, geoJson); 
				rootObject3D.add(mesh);
	
				//如果是点 modified by ls 20220810
				if(geoJson.isPoint){
					mesh.visible = true;
				}
				else{
			        mesh.castShadow = thatObj3DCreator.editor.hasShadow;
			        mesh.receiveShadow = thatObj3DCreator.editor.hasShadow;
					thatObj3DCreator.addEdges(mesh, unitSetting);
				}
				
				//geoJson里包含参数 added by ls 20230831
				if(geoJson.parameters != null){
					if(rootObject3D.userData.subs == null){
						rootObject3D.userData.subs = {};
					}
					var parameters = {};

					for(var i = 0; i < geoJson.parameters.length; i++){						
						var parameter = geoJson.parameters[i];
						parameters[parameter.name] = {
							value: cmnPcr.strToObject(parameter.value, parameter.type.toLowerCase())
						};
					}
					
					rootObject3D.userData.subs[namePath] = {
						code: geoJson.code,
						name: geoJson.name,
						versionNum: geoJson.versionNum,
						position: geoJson.position,
						rotation: geoJson.rotation,
						parameters: parameters
					};
				}
			} 
			geoJson.parentGeoJson = null;
		}
	} 
	
	this.refreshMeshUvMaterial = function(mesh, geoJson){
		var nameParts = mesh.name.split("/");
		var pathIndex = nameParts.length;
		var partPath = "Mesh";
		var tempGeoJson = geoJson;
		var uv = null;
		while(tempGeoJson != null){
			if(tempGeoJson.uvs != null && tempGeoJson.uvs[partPath] != null){
				uv = tempGeoJson.uvs[partPath];
			}
			pathIndex = pathIndex - 1;
			partPath = nameParts[pathIndex] + (pathIndex == nameParts.length - 1 ? "" : ("/" + partPath));
			tempGeoJson = tempGeoJson.parentGeoJson;
		}
		if(uv != null){
			thatObj3DCreator.editor.refreshMeshUvMaterial(mesh, uv, false); 
		}
	}
	
	//从off里获取meshInfo added by ls 20221124
	this.getMeshInfoFromOff = function(offText){
		var txts = offText.split("\n");
		var counts = txts[1].split(" ");
		var pointCount = parseInt(counts[0]);
		var faceCount = parseInt(counts[1]);
		var lineCount = parseInt(counts[2]);
		var offPoints = [];
		var vertices = [];
		var faces = [];
		var lines = [];
		for(var i = 2; i < 2 + pointCount; i++){
			let parts = txts[i].split(" ");
			offPoints.push({x: parseFloat(parts[0]), y: parseFloat(parts[1]), z: parseFloat(parts[2])});
		}
		let faceIndex = 0;
		for(var i = 2 + pointCount; i < 2 + pointCount + faceCount; i++){
			let parts = txts[i].split(" ");
			let pointA = offPoints[parseInt(parts[1])];
			let pointB = offPoints[parseInt(parts[2])];
			let pointC = offPoints[parseInt(parts[3])];
			vertices.push(pointA.x, pointA.y, pointA.z);
			vertices.push(pointB.x, pointB.y, pointB.z);
			vertices.push(pointC.x, pointC.y, pointC.z);
			faces.push(faceIndex * 3, faceIndex * 3 + 1, faceIndex * 3 + 2);
			faceIndex++;
		}
		for(var i = 2 + pointCount + faceCount; i < 2 + pointCount + faceCount + lineCount; i++){
			let parts = txts[i].split(" ");
			let lineStart = parseInt(parts[1]);
			let lineEnd = parseInt(parts[2]);
			let line = new THREE.Line3();
			line.start = offPoints[lineStart];
			line.end = offPoints[lineEnd];
			lines.push(line);
		}
		return {
			vertices: vertices,
			faces: faces,
			lines: lines
		};
	}

	//使用off构造mesh modified by ls 20230829
	this.getMeshFromOff = function(meshInfo, materialName, lineMaterialName){
    	var material = thatObj3DCreator.getMaterial(materialName);
    	var lineMaterial = thatObj3DCreator.getLineMaterial(lineMaterialName);
    	return thatObj3DCreator.getMeshFromOffWithMaterial(meshInfo, material, lineMaterial);
	}

	//使用off构造mesh modified by ls 20230829
	this.getMeshFromOffWithMaterial = function(meshInfo, material, lineMaterial){
		var geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", new THREE.Float32BufferAttribute(meshInfo.vertices, 3));	    
		geometry.setIndex(meshInfo.faces)
		geometry.attributes.position.needsUpdate = true
		geometry.computeVertexNormals()
		geometry.addGroup(0, meshInfo.faces.length, 0);
    	
    	var mesh = null;
    	if(meshInfo.faces.length > 0){
			mesh = new THREE.Mesh(geometry, [material]);
    	}
    	else{
    		mesh = new THREE.Object3D();
    		mesh.noneGeometry = true;
    	}
    	
		for(var i = 0; i < meshInfo.lines.length; i++){
			var line = meshInfo.lines[i];
			let pointsLine = [];
			pointsLine.push( new THREE.Vector3( line.start.x, line.start.y, line.start.z ) );
			pointsLine.push( new THREE.Vector3( line.end.x, line.end.y, line.end.z ) );
			var geometry = new THREE.BufferGeometry().setFromPoints( pointsLine );
            var line = new THREE.Line(geometry, lineMaterial); 
            line.isUnitLine = true;
            mesh.add(line);
		}
		
		thatObj3DCreator.setMeshUvs(mesh); 
		return mesh;
	}
	
	//构造辅助点 added by ls 20221025
	this.getAssistMesh = function(unitSetting){
		var materialName = unitSetting.parameters["material"].value;
		var placePointRadius = js3CommonFunction.mm2m(unitSetting.parameters["size"].value / 2);
		var offText = "OFF\n"
			+ "8 12 0\n"
			+ "-" + placePointRadius + " " + placePointRadius + " -" + placePointRadius + "\n"
			+ placePointRadius + " " + placePointRadius + " -" + placePointRadius + "\n"
			+ placePointRadius + " " + placePointRadius + " " + placePointRadius + "\n"
			+ "-" + placePointRadius + " " + placePointRadius + " " + placePointRadius + "\n"
			+ "-" + placePointRadius + " -" + placePointRadius + " -" + placePointRadius + "\n"
			+ placePointRadius + " -" + placePointRadius + " -" + placePointRadius + "\n"
			+ placePointRadius + " -" + placePointRadius + " " + placePointRadius + "\n"
			+ "-" + placePointRadius + " -" + placePointRadius + " " + placePointRadius + "\n"
			+ "3 0 2 1\n"
			+ "3 0 3 2\n"
			+ "3 0 5 4\n"
			+ "3 0 1 5\n"
			+ "3 0 4 7\n"
			+ "3 0 7 3\n"
			+ "3 6 3 7\n"
			+ "3 6 2 3\n"
			+ "3 6 7 4\n"
			+ "3 6 4 5\n"
			+ "3 6 1 2\n"
			+ "3 6 5 1";
		
		var meshInfo = thatObj3DCreator.getMeshInfoFromOff(offText);
		var geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", new THREE.Float32BufferAttribute(meshInfo.vertices, 3))
		geometry.setIndex(meshInfo.faces)
		geometry.attributes.position.needsUpdate = true
		geometry.computeVertexNormals()
		geometry.addGroup(0, meshInfo.faces.length, 0);		
    	var material = thatObj3DCreator.getMaterial(materialName);  
		var mesh = new THREE.Mesh(geometry, [material]);
		return mesh;
	}
        
    
	
	
	this.getPositionInParent = function(mesh, parentObject3D){
		var newPosition = {
			x: parentObject3D.position.x + mesh.position.x,
			y: parentObject3D.position.y + mesh.position.y,
			z: parentObject3D.position.z + mesh.position.z
		};		
		return newPosition;
	} 

    this.mm2m = function(mm){
    	return js3CommonFunction.mm2m(mm);
    } 

    this.m2mm = function(m){
    	return js3CommonFunction.m2mm(m);
    }  

	this.setMeshUvs = function (mesh) {
		if (mesh.geometry != null) {
			let positions = mesh.geometry.getAttribute("position");
			let faceNum = 0;
			let index = mesh.geometry.index;
			if (index && index.count > 0) {
				faceNum = index.count / 3;
			} 
			else {
				faceNum = positions.count / 3
			}
			var euler = new THREE.Euler(0, 0, 0);
			var uvs = new Array();
			for (var j = 0; j < faceNum; j++) {
				let point1Index = index.array[j * 3];
				let point2Index = index.array[j * 3 + 1];
				let point3Index = index.array[j * 3 + 2];
				let pA = new THREE.Vector3(positions.array[point1Index * 3], positions.array[point1Index * 3 + 1], positions.array[point1Index * 3 + 2]);
				let pB = new THREE.Vector3(positions.array[point2Index * 3], positions.array[point2Index * 3 + 1], positions.array[point2Index * 3 + 2]);
				let pC = new THREE.Vector3(positions.array[point3Index * 3], positions.array[point3Index * 3 + 1], positions.array[point3Index * 3 + 2]);
				var uv = [0, 0, 1, 0, 1, 1];
				pA.applyEuler(euler);
				pB.applyEuler(euler);
				pC.applyEuler(euler);
				if (pA.x == pB.x && pA.x == pC.x) {
					uv = [pA.y, pA.z, pB.y, pB.z, pC.y, pC.z];
				} 
				else if (pA.z == pB.z && pA.z == pC.z) {
					uv = [pA.y, pA.x, pB.y, pB.x, pC.y, pC.x];
				} 
				else if (pA.y == pB.y && pA.y == pC.y) {
					uv = [pA.x, pA.z, pB.x, pB.z, pC.x, pC.z];
				} 
				else {
					uv = [pA.y, pA.z, pB.y, pB.z, pC.y, pC.z];
				}
				for(var k = 0; k < uv.length; k++){
					uvs.push(uv[k]);
				}				
			}
			mesh.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
			mesh.geometry.attributes.uv.needsUpdate = true;
		}
	}

	this.setMaterialRenderEffect = function(materialRenderEffect){
		thatObj3DCreator.materialRenderEffect = materialRenderEffect;
		thatObj3DCreator.editor.selectUnitObject(null);
		js3StandardMaterials.objectMap = {};
		let allUnitObject3Ds = thatObj3DCreator.editor.getAllUnitObject3Ds();
		for(let i = 0; i < allUnitObject3Ds.length; i++){
			let unitObject3D = allUnitObject3Ds[i];
			thatObj3DCreator.changeUnitMaterial(unitObject3D);
		}
	}

	this.changeUnitMaterial = function (unitObject3D){
		if(!unitObject3D.isLine && unitObject3D.material != null){
			if(unitObject3D.material.length != null){
				let newMaterials = [];
				for(let i = 0; i < unitObject3D.material.length; i++){
					let material = unitObject3D.material[i];
					let newMaterial;
					if(unitObject3D.isUnitLine){
						newMaterial = thatObj3DCreator.getLineMaterial(material.name);
					}
					else {
						newMaterial = thatObj3DCreator.getMaterial(material.name);
					}
					newMaterials.push(newMaterial);
				}
				unitObject3D.material = newMaterials;
				unitObject3D.oldMaterial = newMaterials;
			}
			else {
				let newMaterial = thatObj3DCreator.getMaterial(material.name);
				unitObject3D.material = newMaterial;
				unitObject3D.oldMaterial = newMaterial;
			}
		}
		for(let i = 0; i < unitObject3D.children.length; i++){
			let childObj = unitObject3D.children[i];
			thatObj3DCreator.changeUnitMaterial(childObj);
		}
	}


	//增加materialName不是字符串的处理 added by ls20220606
    this.getMaterial = function(materialDescription) {
		let materialName = materialDescription;
		let isMaterialJson = false;
		if (materialDescription != null && typeof materialDescription != "string") {
			materialName = cmnPcr.jsonToStr(materialDescription);
			isMaterialJson = true;
		}
		let material = js3StandardMaterials.getMaterialObject(materialName);
		let materialInfo = js3StandardMaterials.getMaterialInfo(materialName, isMaterialJson);
		if (materialInfo == null &&  material == null){
			materialInfo = {
				materialName: materialName,
				color: 0xAAAAAA,
				side: thatObj3DCreator.materialSide,
				flatShading: true,
				metalness: 0,
				roughness: 1,
				imageName: "",
				normalImageName: "",
				opacityImageName: "",
				metalnessImageName: "",
				roughnessImageName:"",
			};
			let materialCreate = thatObj3DCreator.baseMaterials.defaultCreator;
			material = materialCreate(materialInfo);
			material.userData.isUnitMaterial = true;
			js3StandardMaterials.setMaterialObject(materialName, material);
		}
		else {
			if (material == null) {
				let materialCreate;
				if(!thatObj3DCreator.materialRenderEffect){
					materialInfo = {
						name: materialInfo.name,
						color: materialInfo.color,
						imageName: materialInfo.imageName,
						opacity: materialInfo.opacity,
						scaleWidth: materialInfo.scaleWidth,
						scaleHeight: materialInfo.scaleHeight,
						rotation: materialInfo.rotation,
						isMirror: materialInfo.isMirror,
						isDoubleSide: materialInfo.isDoubleSide,
						typeCode: materialInfo.typeCode,
						normalImageName: "",
						opacityImageName: "",
						metalnessImageName: "",
						roughnessImageName:"",
					};
					materialCreate = thatObj3DCreator.baseMaterials.defaultCreator;
				}
				else {
					materialCreate = thatObj3DCreator.baseMaterials.creators[materialInfo.typeCode];
					if (materialCreate == null) {
						materialCreate = thatObj3DCreator.baseMaterials.defaultCreator;
					}
				}
				material = materialCreate(materialInfo);
				material.userData.isUnitMaterial = true;
				js3StandardMaterials.setMaterialObject(materialName, material);
			}
		}
		return material;
	}

	//获取线的材质  added by ls 20230323
    this.getLineMaterial = function(materialDescription){ 
		let materialName = materialDescription;
		let isMaterialJson = false;
		if(materialDescription != null && typeof materialDescription != "string"){
			materialName = cmnPcr.jsonToStr(materialDescription); 
			isMaterialJson = true;
		}
		let lineMaterialName = "Line_" + materialName;
		let materialInfo = js3StandardMaterials.getMaterialInfo(materialName, isMaterialJson);
		let material;
	  	if(materialInfo == null){
			material = new THREE.LineBasicMaterial({
		    	color:0xAAAAAA, 
				name: lineMaterialName
	    	});
			material.userData.isUnitMaterial = true;
			js3StandardMaterials.setMaterialObject(lineMaterialName, material);
	  	}
	  	else{
	  		material = js3StandardMaterials.getMaterialObject(lineMaterialName);
	  		if(material == null){
				if(materialInfo.typeCode.length === 0) {
					material = new THREE.LineBasicMaterial({
						color: materialInfo.color,
						name: lineMaterialName
					});
				}
				else{
					material = thatObj3DCreator.baseMaterials.creators[materialInfo.typeCode](materialInfo);
				}
				material.userData.isUnitMaterial = true;
	  			js3StandardMaterials.setMaterialObject(lineMaterialName, material);
	  		}
	  	}
		return material;
    }

    //根据精细级别获取分割段数 added by ls 20231110
    this.getSphereSegmentCount = function(){
    	let detailLevel = thatObj3DCreator.detailLevel;
		if(detailLevel <= 0){
			detailLevel = 4;
		}
		else if(detailLevel > 8){
			detailLevel = 8;
		}
		switch(detailLevel){ 
			case 1:{
				return 8;
			}
			case 2:{
				return 12;
			}
			case 3:{
				return 16;
			}
			case 4:{
				return 24;
			}
			case 5:{
				return 32;
			}
			case 6:{
				return 48;
			}
			case 7:{
				return 64;
			}
			case 8:{
				return 92;
			}
			default:{
				return 12;
			}
		}
	} 
}

export default Object3DCreator