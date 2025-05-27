function ComponentObject3DCache(){
	var thatCache = this; 

	//记录引用的组件的编码+版本+参数与Object3D的对照关系，用于量大的时候clone
	this.refComponentObject3Ds = {};

	this.addRefComponentObject3D = function(cacheKey, object3D, geoJson, sameUnitId, unitSetting){ 
		thatCache.refComponentObject3Ds[cacheKey] = {
			object3D: object3D,
			geoJson: geoJson,
			sameUnitId: sameUnitId,
			unitSetting: unitSetting
		};
	}
		
	this.getComponentObject3DKey = function(componentCode, versionNum, parameters, useWorldPosition, detailLevel, viewLevel){
		//增加viewLevel modified by ls 20230403
		var key = componentCode + "_" + versionNum + "_" + viewLevel + "_" + detailLevel + "_" + (useWorldPosition ? "worldPosition" : "localPosition") + "_" + thatCache.getParameterString(parameters);
		return key;
	}
	
	this.cloneRefComponentObject3D = function(cacheKey){ 
		var cacheObj = thatCache.refComponentObject3Ds[cacheKey];
		var newObject3D = cacheObj.object3D.clone();
		
		//辅助点信息 added by ls 20221026
		newObject3D.assistPoints = cacheObj.object3D.assistPoints;

		//记录下这个Unit的cacheKey added by ls 20221026
		newObject3D.cacheKey = cacheKey;

		//记录居中造成的位移 added by ls 20221026
		newObject3D.centerShift = cacheObj.object3D.centerShift;
		
		//如果不是加载的resource,那么把geometry也复制 modified by ls 20210820
		if(cacheObj.geoJson.resource == null){
			thatCache.cloneObject3DGeometry(newObject3D)
		}
		return newObject3D;
	}
	
	this.getUnitSetting = function(cacheKey){
		var cacheObj = thatCache.refComponentObject3Ds[cacheKey];
		return cacheObj.unitSetting;
	}
	
	this.getGeoJson = function(cacheKey){
		var cacheObj = thatCache.refComponentObject3Ds[cacheKey];
		return cacheObj.geoJson;
	}
	
	this.hasRefComponentObject3D = function(cacheKey){ 
		var cacheObj = thatCache.refComponentObject3Ds[cacheKey];
		return cacheObj != null;
	}
		
	this.resourceObject3Ds = {};

	this.addResourceObject3D = function(cacheKey, object3D, assistInfo){ //增加辅助点信息 added by ls 20230418
		thatCache.resourceObject3Ds[cacheKey] = {
			object3D: object3D, 
			assistInfo: assistInfo
		};
	}
	
	this.cloneResourceObject3D = function(cacheKey){
		var cacheObj = thatCache.resourceObject3Ds[cacheKey];
		return cacheObj.object3D.clone();
	}
	
	//resource的辅助点信息 added by ls 20230418
	this.getResourceAssistInfo = function(cacheKey){
		var cacheObj = thatCache.resourceObject3Ds[cacheKey];
		var assistInfo = cacheObj.assistInfo;
		return assistInfo;
	}
	
	this.cloneObject3DGeometry = function(object3D){
		if(object3D.children != null){
			for(var i = 0 ; i < object3D.children.length; i++){
				var childObj = object3D.children[i];
				//如果是应用的resource，那么不做此操作 modified by ls 20210820
				if(!childObj.userData.isResource){
					//如果包含了material（没有face就没有material) modified by ls 20221125
					if(childObj.material != null){
						var materials = childObj.material;
						var newMaterials = new Array();
						for(var j = 0; j < materials.length; j++){
							newMaterials.push(materials[j]);
						}
						childObj.material = newMaterials;
					}
					//如果包含了geometry（没有face就没有geometry) modified by ls 20221125
					if(childObj.geometry != null){
						//不进行深度克隆，继续复用geometry deleted by ls 20230324
						//childObj.geometry = childObj.geometry.clone();
					}
					//修改isEdgeLine属性 added by ls 20230323
					if(childObj.children.length > 0){
						for(var j = 0; j < childObj.children.length; j++){
							cObj = childObj.children[j];
							if(cObj.type == "LineSegments"){
								cObj.isEdgeLine = true;
							}
						}
					}
				}
			}
		}
	}
	
	this.hasResourceObject3D = function(cacheKey){
		var cacheObj = thatCache.resourceObject3Ds[cacheKey];
		return cacheObj != null;
	}
	
	this.getResourceObject3DKey = function(resourceZipCode, resourceType){
		return resourceZipCode + "_" + resourceType;
	}
	
	this.getParameterString = function(parameters){
		var sortedParameters = [];
		var parameterHash = {};
		var paramCount = 0;
		for(var paramName in parameters){
			var parameter = parameters[paramName];
			if(parameter.isGeo){
				//增加参数值为json的处理 modified by ls 20220606
				var parameterValue = parameter.value;
				if(parameterValue != null && typeof parameterValue != "string"){
					parameterValue = cmnPcr.jsonToStr(parameterValue);
				}
				parameterHash[paramName] = {
					name: paramName,
					value:  parameterValue,
					
					//增加表达式作为key的一部分 added by ls 20220722
					exp: parameter.exp == null ? null : parameter.exp.pim
				};
				paramCount++;
			}
		}
		var count = 0;
		while(count < paramCount){
			var tempName = "";
			for(var name in parameterHash){
				if(name > tempName){
					tempName = name;
				}
			}
	        sortedParameters.push(parameterHash[tempName]);
	        delete parameterHash[tempName];
	        count++;
		}
		var parameterStr = "";
		for(var i = 0; i < sortedParameters.length; i++){
			var parameter = sortedParameters[i];

			//增加表达式作为key的一部分 added by ls 20220722
			parameterStr += (parameter.name + ":" + (parameter.value == null ? "" : parameter.value) + (parameter.exp == null ? "" : ("," + parameter.exp)) + "; ");
		}
		return parameterStr;
	} 
}