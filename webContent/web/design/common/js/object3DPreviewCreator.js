//因升级threejs r146，更新此代码 modified by ls 20230322
import Object3DCreator from "common/js/object3DCreator.js";

let Object3DPreviewCreator = function(){
	var thatObj3DCreator = this; 
	this.base = Object3DCreator;
	this.base(); 
	
	this.unitSetting = null;
	
	//显示级别 added by ls 20230403
	this.viewLevel = js3ViewLevelType.high;
    
    this.detailLevel = 4; 
	
	this.createPreviewObject3D = function(componentInfo, afterCreateFunc){  
		thatObj3DCreator.unitSetting = {
			code: componentInfo.code,
			versionNum: componentInfo.versionNum,
			position: [0, 0, 0],
			rotation: [0, 0, 0]		
		};  
		var requestParam = {
			content: encodeURIComponent(componentInfo.toString()),
			unitSetting: thatObj3DCreator.unitSetting,

			//显示级别 added by ls 20230403
			viewLevel: thatObj3DCreator.viewLevel,
			
			//传递detailLevel added by ls 20221107
			detailLevel: thatObj3DCreator.detailLevel
		};
		serverAccess.request({
			serviceName:"geometry3DNcpService",
			funcName:"createPreviewObject3D", 
		    args:{ requestParam: cmnPcr.jsonToStr(requestParam) }, 
			successFunc: function(obj) {
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
					//不包含gltf
					thatObj3DCreator.createObject3DAfterLoadResource(cacheKey, obj.result, afterCreateFunc);
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
				
			},
			failFunc: function(obj) { 
				msgBox.error({title:"提示", info: obj.message});
			}
		});
	} 
	
	this.callbackCreateObject3D = function(cacheKey, object3D, geoJson, unitId, unitSetting, afterCreateFunc){  
		afterCreateFunc({
			object3D: object3D,
			unitSetting: thatObj3DCreator.unitSetting
		}); 
	}	
}

export default Object3DPreviewCreator