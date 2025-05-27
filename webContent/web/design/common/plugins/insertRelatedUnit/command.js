//插入关系件 added by ls 20230803
import * as THREE from "three";
js3CommandProcessors["insertRelatedUnit"] = {
	toStatus: "none",
	icon: "/images/insertRelatedUnit.png",
	editor: null,
	popContainer: null,
	mapTypeCode: "transfer",
	allUnitIds: null,
	selectUnitIds: null,
	run: function(p){
		p.commandJson.editor = p.editor;
		let selectedUnitObject3D = p.editor.selectedUnitObject3D;
		let multiSelectedUnitObject3Ds = p.editor.multiSelectedUnitObject3Ds;
		if(selectedUnitObject3D == null && multiSelectedUnitObject3Ds.length === 0){
			msgBox.alert({info: "请选中构件."});
		}
		else{
			let componentCode = null;
			let versionNum = null;
			let selectedUnitIds = [];
			if(selectedUnitObject3D != null){
				//单选的情况
				componentCode = selectedUnitObject3D.unitData.code;
				versionNum = selectedUnitObject3D.unitData.versionNum;
				selectedUnitIds.push(selectedUnitObject3D.unitData.id);
			}
			else{
				//多选的情况
				let unitTypeInfo = p.commandJson.getUnitTypeInfo({
					commandJson: p.commandJson,
					unitObject3Ds: multiSelectedUnitObject3Ds
				});
				if(unitTypeInfo == null){
					return;
				}
				componentCode = unitTypeInfo.code;
				versionNum = unitTypeInfo.versionNum;
				for(let i = 0; i < multiSelectedUnitObject3Ds.length; i++){
					let unitObject3D = multiSelectedUnitObject3Ds[i];
					selectedUnitIds.push(unitObject3D.unitData.id);
				}
			}

			let relatedMapComs = p.commandJson.getRelatedMapComs({
				fromComCode: componentCode,
				fromComVersionNum: versionNum,
				mapTypeCode: p.commandJson.mapTypeCode
			});
			if(relatedMapComs.length === 0){
				msgBox.alert({info: "没有指定相关构件."});
			}
			else{
				let allUnitIds = p.commandJson.getUnitIds({
					commandJson: p.commandJson,
					code: componentCode,
					versionNum: versionNum
				});
				p.commandJson.showComponentListDialog({
					code: componentCode,
					versionNum: versionNum,
					relatedMapComs: relatedMapComs,
					editor: p.editor,
					commandJson: p.commandJson,
					mapTypeCode: p.commandJson.mapTypeCode,
					allUnitIds: allUnitIds,
					selectedUnitIds: selectedUnitIds
				});
			}
		}
	},
	getUnitIds: function(p){
		let unitInfos = [];
		let allUnitObject3Ds = p.commandJson.editor.getAllUnitObject3Ds(p.code, p.versionNum);
		for(let i = 0; i < allUnitObject3Ds.length; i++){
			let unitObject3D = allUnitObject3Ds[i];
			if(unitObject3D.unitData.code === p.code && unitObject3D.unitData.versionNum === p.versionNum){
				unitInfos.push(unitObject3D.unitData.id);
			}
		}
		return unitInfos;
	},

	//多选时，需要确保选中的是同一个类型的构件
	getUnitTypeInfo: function (p){
		let unitTypeInfos = p.commandJson.getUnitTypeInfos(p);
		if(unitTypeInfos.length > 1){
			//选中了超过两类构件
			let alertMsg = "选中构件必须为同一类型.";
			for(let i = 0; i < unitTypeInfos.length; i++){
				let unitTypeInfo = unitTypeInfos[i];
				alertMsg += ( "\n" + (i + 1) + ". 类型: " + unitTypeInfo.name + ", 数量: " + unitTypeInfo.count + ".");
			}
			msgBox.alert({info: alertMsg});
			return null;
		}
		else{
			return unitTypeInfos[0];
		}
	},

	getUnitTypeInfos: function(p){
		let unitObject3Ds = p.unitObject3Ds;
		let unitTypeInfos = [];
		let unitTypeMap = {};
		for(let i = 0; i < unitObject3Ds.length; i++){
			let unitObject3D = unitObject3Ds[i];
			let key = unitObject3D.unitData.code + "_" + unitObject3D.unitData.versionNum;
			let unitTypeInfo = unitTypeMap[key];
			if(unitTypeInfo == null) {
				let componentInfo = p.commandJson.editor.getRefComponentInfo(unitObject3D.unitData.code, unitObject3D.unitData.versionNum);
				unitTypeInfo = {
					code: componentInfo.code,
					versionNum: componentInfo.versionNum,
					name: componentInfo.name,
					count: 0
				};
				unitTypeMap[key] = unitTypeInfo;
				unitTypeInfos.push(unitTypeInfo);
			}
			unitTypeInfo.count = unitTypeInfo.count + 1;
		}
		return unitTypeInfos;
	},
	getRelatedMapComs: function(p){
		let relatedMapComs = [];
		for(let i = 0; i < js3MapComs.length; i++){
			let mapCom = js3MapComs[i];
			if(mapCom.fromComCode === p.fromComCode
					&& mapCom.fromComVersionNum === p.fromComVersionNum
					&& mapCom.mapTypeCode === p.mapTypeCode){
				relatedMapComs.push(mapCom);
			}
		}
		return relatedMapComs;
	},
	getRelatedMapCom: function(p){
		for(let i = 0; i < js3MapComs.length; i++){
			let mapCom = js3MapComs[i];
			if(mapCom.fromComCode === p.fromComCode
				&& mapCom.fromComVersionNum === p.fromComVersionNum
				&& mapCom.toComCode === p.toComCode
				&& mapCom.toComVersionNum === p.toComVersionNum){
				return mapCom;
			}
		}
	},
	showComponentListDialog: function(p){
		p.commandJson.allUnitIds = p.allUnitIds;
		p.commandJson.selectedUnitIds = p.selectedUnitIds;

		let relatedMapComs = p.relatedMapComs;
		let popContainer = new PopupContainer({
			width: 380,
			height: (relatedMapComs.length > 4 ? 4 : relatedMapComs.length) * 60 + 110,
			top: 50,
			title: "选择关系构件"
		});
		popContainer.show();
		p.commandJson.popContainer = popContainer;

		let container = $("#" + popContainer.containerId);
		let frameId = cmnPcr.getRandomValue();
		let innerHtml = "<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:40px;font-size:11px;text-align:center;overflow-y:hidden;\">"
		 	+ "<iframe name=\"editorFrame\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
		 	+ "</iframe>"
			+ "</div>"
		 	+ "<div style=\"position:absolute;left:0px;right:0px;height:40px;bottom:0px;font-size:11px;text-align:right;\">"
			+ "<input type=\"button\" name=\"okAllBtn\" value=\"替换全部(" + p.allUnitIds.length + "个)\" class=\"commonBtn\" style=\"width:110px;\" />"
			+ "<input type=\"button\" name=\"okOneBtn\" value=\"替换选中(" + p.selectedUnitIds.length + "个)\" class=\"commonBtn\" style=\"width:110px;\"/>"
			+ "<input type=\"button\" name=\"cancelBtn\" value=\"取 消\" class=\"commonBtn\" />"
		$(container).html(innerHtml);
		$(container).find("iframe[name='editorFrame']").attr("src", "../common/plugins/insertRelatedUnit/insertRelatedUnit.jsp?code=" + p.code + "&versionNum=" + p.versionNum + "&mapTypeCode=" + p.mapTypeCode);
		$(container).find(".commonBtn[name='okOneBtn']").click(function(){
			let commandJson = js3CommandProcessors["insertRelatedUnit"];
			let popContainer = commandJson.popContainer;
			let comInfo = $("#" + popContainer.containerId).find("iframe[name='editorFrame']")[0].contentWindow.getSelectedComponent();
			let mapCom = commandJson.getRelatedMapCom(comInfo);
			if(commandJson.insertUnit({
				commandJson: p.commandJson,
				mapCom: mapCom,
				isAll: false
			})){
				popContainer.close();
			}
		});
		$(container).find(".commonBtn[name='okAllBtn']").click(function(){
			let commandJson = js3CommandProcessors["insertRelatedUnit"];
			let popContainer = commandJson.popContainer;
			let comInfo = $("#" + popContainer.containerId).find("iframe[name='editorFrame']")[0].contentWindow.getSelectedComponent();
			let mapCom = commandJson.getRelatedMapCom(comInfo);
			if(commandJson.insertUnit({
				commandJson: p.commandJson,
				mapCom: mapCom,
				isAll: true
			})){
				popContainer.close();
			}
		});
		$(container).find(".commonBtn[name='cancelBtn']").click(function(){
			let commandJson = js3CommandProcessors["insertRelatedUnit"];
			let popContainer = commandJson.popContainer;
			popContainer.close();
		});
	},
	insertUnit: function(p){
		let mapCom = p.mapCom;
		let isAll = p.isAll;
		let commandJson = js3CommandProcessors["insertRelatedUnit"];
		let editor = commandJson.editor;

		let unitIds;
		if(!isAll){
			//替换选中的
			unitIds = p.commandJson.selectedUnitIds;
		}
		else{
			//替换所有
			unitIds = p.commandJson.allUnitIds;
		}

		let allUnitSettings = [];
		let excludedNameHash = {};
		for(let i = 0; i < unitIds.length; i++) {
			let parameters = {};
			let unitData = editor.getObject3DByUnitId(unitIds[i]).unitData;
			for (let i = 0; i < mapCom.properties.length; i++) {
				let property = mapCom.properties[i];
				if (unitData.parameters[property.from] != null) {
					parameters[property.to] = {
						value: unitData.parameters[property.from].value
					};
				}
			}

			let idAndName = editor.getNewUnitIdAndName(mapCom.toComName + "_1", mapCom.toComName, excludedNameHash);
			excludedNameHash[idAndName.name] = true;

			let unitSetting = {
				name: idAndName.name,
				id: idAndName.id,
				code: mapCom.toComCode,
				versionNum: mapCom.toComVersionNum,
				mixType: js3UnitMixType.none,
				viewLevel: js3ViewLevelType.always,
				useWorldPosition: false,
				position: [0, 0, 0],
				rotation: [0, 0, 0],
				count: 1,
				countExp: null,
				materials: null,
				parameters: parameters,
				positionExps: {},
				rotationExps: {},
				uvs: null,
				otherInfo: {
					needSelect: unitIds.length === 1,
					commandName: "insertRelatedUnit",
					fromUnitId: unitData.id
				}
			};
			allUnitSettings.push(unitSetting);
		}
		editor.createNewObject3DsByUser(allUnitSettings);

		//取消多选
		editor.cancelAllMultiSelectUnitObjects();
    	return true;
	},
	afterAddObject3D: function(toObject3D){
		let commandJson = js3CommandProcessors["insertRelatedUnit"];
		commandJson.updateToObjectRotationAndPosition(toObject3D);
	},
	updateToObjectRotationAndPosition: function(toObject3D){
		let commandJson = js3CommandProcessors["insertRelatedUnit"];
		let editor = commandJson.editor;
		let toUnitData = toObject3D.unitData;
		let fromUnitId = toUnitData.otherInfo.fromUnitId;
		let fromObject3D = editor.getObject3DByUnitId(fromUnitId);
		let fromUnitData = fromObject3D.unitData;
		let mapCom = commandJson.getRelatedMapCom({
			fromComCode: fromUnitData.code,
			fromComVersionNum: fromUnitData.versionNum,
			toComCode: toUnitData.code,
			toComVersionNum: toUnitData.versionNum
		});
		if(mapCom.fromPointName != null && mapCom.toPointName != null){
			//先使用from的旋转给to旋转，再将二者的point重合
			toUnitData.rotation = [fromObject3D.rotation.x, fromObject3D.rotation.y, fromObject3D.rotation.z];
			editor.setObject3DRotation(toObject3D, toUnitData, false);
			let fromAssistPointA = commandJson.getAssistPointByName(fromObject3D, mapCom.fromPointName);
			let toAssistPointA = commandJson.getAssistPointByName(toObject3D, mapCom.toPointName);
			let fromWorldPointA = commandJson.getWorldPoint(fromAssistPointA, fromObject3D);
			let toWorldPointA = commandJson.getWorldPoint(toAssistPointA, toObject3D);
			let shiftPoint = {
				x: fromWorldPointA.x - toWorldPointA.x,
				y: fromWorldPointA.y - toWorldPointA.y,
				z: fromWorldPointA.z - toWorldPointA.z
			};
			toUnitData.position = [toObject3D.position.x + shiftPoint.x, toObject3D.position.y + shiftPoint.y, toObject3D.position.z + shiftPoint.z];
			editor.setObject3DPosition(toObject3D, toUnitData, false);
		}
		else{
			//直接使用from构件的位置、旋转，定位to构件的位置、旋转
			toUnitData.rotation = [fromObject3D.rotation.x, fromObject3D.rotation.y, fromObject3D.rotation.z];
			editor.setObject3DRotation(toObject3D, toUnitData, false);
			toUnitData.position = [fromObject3D.position.x, fromObject3D.position.y, fromObject3D.position.z];
			editor.setObject3DPosition(toObject3D, toUnitData, false);
		}
	},
	getAssistPointByName: function(object3D, pointName){
		for (let i = 0; i < object3D.assistPoints.length; i++) {
			let assistPoint = object3D.assistPoints[i];
			if(assistPoint.name === pointName){
				return assistPoint;
			}
		}
		throw new Error(object3D.unitData.name + " 不存在的辅助点 " + pointName);
	},
	getWorldPoint: function(assistPoint, object3D){
		let euler = new THREE.Euler(object3D.rotation.x, object3D.rotation.y, object3D.rotation.z);
		let shift = object3D.position;
		let assistVertice = new THREE.Vector3(assistPoint.x, assistPoint.y, assistPoint.z);
		assistVertice.applyEuler(euler);
		assistVertice.x = assistVertice.x + shift.x;
		assistVertice.y = assistVertice.y + shift.y;
		assistVertice.z = assistVertice.z + shift.z;
		return assistVertice;
    }
};