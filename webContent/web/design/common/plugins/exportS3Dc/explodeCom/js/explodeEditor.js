import CoreEditor from "common/js/coreEditor.js";
import Object3DExplodeCreator from "explodeCom/js/object3DExplodeCreator.js";
import {GLTFExporter} from "three/addons/exporters/GLTFExporter.js";

let ExplodeEditor = function(){
	var thatCE = this;

	
	this.base = CoreEditor;
	
	this.base();  
		
	this.publishComponentInfo = null;
	this.canExplodeItemTree = null;

	this.waitingExplodeUnitIds = [];

	this.completeExploded = false;

	this.publishInfo = null;

	this.gltfExporter = null;
		
    this.initTitle = function(componentInfo){
    	if(thatCE.titleVisible){
	    	let title = componentInfo.name + "(" + componentInfo.code + " | " + componentInfo.versionNum + ")";
	    	$("#" + thatCE.containerId).find(".core3dTitleContainer .core3dFileName").text(title);  
	    	$("title").text("分解 - " + title);
    	}
    }  
    
    this.initObject3DCreator = function(){
    	let object3DCreator = new Object3DExplodeCreator();
    	object3DCreator.init({
    		editor: thatCE
    	});
    	thatCE.object3DCreator = object3DCreator;
    }
	//初始化,入口方法
	this.init = function(p) {
		thatCE.containerId = p.containerId;
		thatCE.componentId = p.componentId;
		thatCE.sourceComponentInfo = p.sourceComponentInfo;
		thatCE.canExplodeItemTree = p.canExplodeItemTree;
		thatCE.transformControlVisible = p.transformControlVisible == null ? true : p.transformControlVisible;
		thatCE.attachLine2dVisible = p.attachLine2dVisible == null ? true : p.attachLine2dVisible;
		thatCE.unitInfoVisible = p.unitInfoVisible == null ? true : p.unitInfoVisible;
		thatCE.unitListVisible = p.unitListVisible == null ? true : p.unitListVisible;
		thatCE.groupVisible = p.groupVisible == null ? true : p.groupVisible;
		thatCE.gridVisible = p.gridVisible == null ? true : p.gridVisible;
		thatCE.groundContextMenuVisible = p.groundContextMenuVisible == null ? true : p.groundContextMenuVisible;
		thatCE.componentContextMenuVisible = p.componentContextMenuVisible == null ? true : p.componentContextMenuVisible;
		thatCE.titleVisible = p.titleVisible == null ? true : p.titleVisible;
		thatCE.canSelectObject3D = p.canSelectObject3D == null ? true : p.canSelectObject3D;
		thatCE.hasShadow = p.hasShadow == null ? false : p.hasShadow;

		thatCE.initPlugins();

		thatCE.afterSelectUnitFunc = p.afterSelectUnitFunc;
		thatCE.afterShowUnitFunc = p.afterShowUnitFunc;
		thatCE.loadFont(p);
	};

	this.openComponent = function(p){
		thatCE.componentInfo = thatCE.sourceComponentInfo;
		thatCE.load(thatCE.componentInfo);
	}

	this.afterLoadAllUnits = function(operateType){
		thatCE.beginExplodeUnits();

		thatCE.doEvent("afterLoadAllUnits", {
			editor: thatCE,
			operateType: operateType
		});
	}

	this.beginExplodeUnits = function (){
		for(let unitId in thatCE.canExplodeItemTree){
			thatCE.addToWaitingExplodeUnitIds(unitId);
		}
		thatCE.explodeNextUnit();
	}

	this.fetchOneWaitingExplodeUnitId = function (){
		if(thatCE.waitingExplodeUnitIds.length === 0){
			return null;
		}
		else{
			let firstUnitId = thatCE.waitingExplodeUnitIds[0];
			let unitIds = [];
			for(let i = 1; i < thatCE.waitingExplodeUnitIds.length; i++){
				unitIds.push(thatCE.waitingExplodeUnitIds[i]);
			}
			thatCE.waitingExplodeUnitIds = unitIds;
			return firstUnitId;
		}
	}

	this.addToWaitingExplodeUnitIds = function (unitId){
		thatCE.waitingExplodeUnitIds.push(unitId);
	}

	this.checkNeedExplode = function (unitSetting){
		let unitIdPath = unitSetting.otherInfo.unitIdPath;
		let pathParts = unitIdPath.split(",");
		let subItems = thatCE.canExplodeItemTree;
		for(let i = 0; i < pathParts.length; i++){
			let itemNode = subItems[pathParts[i]];
			if(itemNode == null){
				return false;
			}
			else{
				subItems = itemNode.children;
			}
		}
		return true;
	}

	this.explodeNextUnit = function (){
		let firstUnitId = thatCE.fetchOneWaitingExplodeUnitId();
		if(firstUnitId == null){
			thatCE.completeExploded = true;
		}
		else {
			let explodeCommandProcessor = js3CommandProcessors["explode"];
			explodeCommandProcessor.explode({
				unitId: firstUnitId,
				editor: thatCE,
				needConfirm: false,
				afterExplodeObjectFunc: function (p) {
					if (thatCE.checkNeedExplode(p.unit3DInfo.unitSetting)) {
						thatCE.addToWaitingExplodeUnitIds(p.unit3DInfo.unitSetting.id);
					}
					if (p.allCompleted) {
						thatCE.explodeNextUnit();
					}
				}
			});
		}
	}

	//生成S3Dc文件
	this.generateS3dc = function (){
		thatCE.publishInfo = thatCE.getS3DcInfo();
	}

	//获取S3D信息
	this.getS3DcInfo = function (){
		let componentInfo = thatCE.getLastComponentInfo();
		let parentParameters = thatCE.getComponentParametersForEditExp();
		let unitMap = {};
		let materialMap = {};
		let unitTypeMap = {};
		let cacheKeyMap = {};
		let groupArray = [];
		for(let i = 0; i < thatCE.scene.children.length; i++){
			let childObj3D = thatCE.scene.children[i];
			if(childObj3D.isUnitObject
				&& !childObj3D.unitData.code.startWith(js3SysCatAndCom.tagCategoryPre)
				&& !childObj3D.unitData.code.startWith(js3SysCatAndCom.assistPointCategoryPre)){
				let unitSetting = thatCE.getUnitSettingFromObject3D(childObj3D);
				let unitParams = {};
				for(let paramName in unitSetting.parameters){
					unitParams[paramName] = {
						value: unitSetting.parameters[paramName].value
					};
				}
				unitMap[unitSetting.id] = {
					id: unitSetting.id,
					code: unitSetting.code,
					versionNum: unitSetting.versionNum,
					name: unitSetting.name,
					position: unitSetting.position,
					rotation: unitSetting.rotation,
					parameters: unitParams,
					useWorldPosition: unitSetting.useWorldPosition,
					isServer: true
				};

				let parameters = {};
				let componentKey = unitSetting.code + "_" + unitSetting.versionNum;
				let refComponentInfo = thatCE.componentInfo.refComponents[componentKey];
				for(let paramName in unitSetting.parameters){
					let refParameter = refComponentInfo.parameters[paramName];

					//如果组件存在这个参数（有可能之前有这个参数，后来被删除了） added by ls 20220623
					if(refParameter != null){
						let unitParameter = unitSetting.parameters[paramName];
						let p = {
							name: paramName,
							value: unitParameter.value,
							isGeo: refParameter.isGeo == null ? true : refParameter.isGeo
						};
						if(unitParameter.exp != null){
							p.exp = {
								pim: unitParameter.exp.pim,
								js: unitParameter.exp.js
							};
						}
						parameters[paramName] = p;
					}
				}

				let cacheKey = thatCE.object3DCreator.object3DCache.getComponentObject3DKey(unitSetting.code,
					unitSetting.versionNum,
					parameters,
					unitSetting.useWorldPosition,
					thatCE.object3DCreator.detailLevel,
					thatCE.object3DCreator.viewLevel);
				if(cacheKeyMap[cacheKey] == null) {
					cacheKeyMap[cacheKey] = true;
					let geoJson = thatCE.object3DCreator.object3DCache.getGeoJson(cacheKey);
					thatCE.getGeoJsonMaterials(materialMap, geoJson);
				}
			}
		}

		for(let i = 0; i < componentInfo.groups.length; i++){
			let groupInfo = componentInfo.groups[i];
			let g = {
				id: groupInfo.id,
				name: groupInfo.name,
				isDefault: groupInfo.isDefault,
				units: []
			};
			for(let j = 0; j < groupInfo.units.length; j++){
				let unitId = groupInfo.units[j];
				if(unitMap[unitId] != null){
					g.units.push(unitId);
				}
			}
			groupArray.push(g);
		}

		for(let unitId in unitMap){
			let unit = unitMap[unitId];
			let key = unit.code + "_" + unit.versionNum;
			if(!unitTypeMap[key]){
				let refComponentInfo = thatCE.getRefComponentInfo(unit.code, unit.versionNum);
				let parameters = {};
				for(let paramName in refComponentInfo.parameters){
					let parameter = refComponentInfo.parameters[paramName];
					parameters[parameter.name] = {
						name: parameter.name,
						paramType: parameter.paramType,
						valueType:  getValueTypeByParameterType(parameter.paramType),
						categoryName: parameter.categoryName,
						groupName: parameter.groupName,
						indexInGroup: parameter.indexInGroup,
						isNullable: parameter.isNullable,
						maxValue: parameter.maxValue,
						minValue: parameter.minValue,
						defaultValue: parameter.defaultValue,
						listValues: parameter.listValues,
						isGeo: parameter.isGeo
					};
				}

				unitTypeMap[key] = {
					code: refComponentInfo.code,
					versionNum: refComponentInfo.versionNum,
					name: refComponentInfo.name,
					parameters: parameters
				};
			}
		}

		return {
			id: componentInfo.id,
			name: componentInfo.name,
			code: componentInfo.code,
			versionNum: componentInfo.versionNum,
			axis: {
				size: componentInfo.size,
				gridSpace: componentInfo.gridSpace,
				fontSize: componentInfo.axisFontSize
			},
			scene: {skyBoxName: "WhiteCloud"},
			camera: {
				type: "Perspective",
				target: componentInfo.camera.target,
				position: componentInfo.camera.position,
				zoom: componentInfo.camera.zoom
			},
			parameters: parentParameters,
			groups: groupArray,
			unitMap: unitMap,
			unitTypeMap: unitTypeMap,
			materialMap: materialMap
		};
	}

	this.getGeoJsonMaterials = function(materialMap, geoJson){
		let materialName = geoJson.material;
		if(materialName != null && materialName.length > 0 && materialMap[materialName] == null){
			let material = js3StandardMaterials.getMaterialInfo(materialName);
			if(material != null){
				materialMap[materialName] = material;
			}
		}
		if(geoJson.children != null){
			for(let i = 0; i < geoJson.children.length; i++){
				let childGeoJson = geoJson.children[i];
				thatCE.getGeoJsonMaterials(materialMap, childGeoJson);
			}
		}
	}
}

export default ExplodeEditor