import * as THREE from "three";
import {GLTFExporter} from "three/addons/exporters/GLTFExporter.js";

js3CommandProcessors["exportS3D"] = {
	toStatus: "normal",	
	icon: "/images/s3d.png",
	editor: null,
	popContainer: null,
	run: function(p){
		let commandProcessor = js3CommandProcessors["exportS3D"];
		commandProcessor.editor = p.editor;
		let popContainer = new PopupContainer( {
			width : 300 ,
			height : 150,
			top : 50,
			title: "导出S3D文件"
		});

		popContainer.show();
		let innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:30px;bottom:0px;font-size:16px;text-align:center;\">"
			+ "<div name=\"exportStatus\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;overflow:auto;\" >"
			+ "正在导出"
			+ "</div>"
			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		commandProcessor.popContainer = popContainer;
		commandProcessor.exportS3D();
	},

	exportS3D: function(){
		let commandProcessor = js3CommandProcessors["exportS3D"];
		let editor = commandProcessor.editor;
		let componentInfo = editor.getLastComponentInfo();
		let parentParameters = editor.getComponentParametersForEditExp();
		let geoContents = {};
		let allUnitSettings = [];
		let materials = {};
		for(let i = 0; i < editor.scene.children.length; i++){
			let childObj3D = editor.scene.children[i];
			if(childObj3D.isUnitObject
				&& !childObj3D.unitData.code.startWith(js3SysCatAndCom.tagCategoryPre)
				&& !childObj3D.unitData.code.startWith(js3SysCatAndCom.assistPointCategoryPre)){
				let unitSetting = editor.getUnitSettingFromObject3D(childObj3D);

				let parameters = {};
				let componentKey = unitSetting.code + "_" + unitSetting.versionNum;
				let refComponentInfo = editor.componentInfo.refComponents[componentKey];
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

				//增加显示级别作为参数 modified by ls 20230403
				let cacheKey = editor.object3DCreator.object3DCache.getComponentObject3DKey(unitSetting.code,
					unitSetting.versionNum,
					parameters,
					unitSetting.useWorldPosition,
					editor.object3DCreator.detailLevel,
					editor.object3DCreator.viewLevel);

				unitSetting.geoKey = cacheKey;
				allUnitSettings.push(unitSetting);

				if(geoContents[cacheKey] == null){
					let geoJson = editor.object3DCreator.object3DCache.getGeoJson(cacheKey);
					geoContents[cacheKey] = geoJson;
					editor.getGeoJsonMaterials(materials, geoJson);
				}
			}
		}

		let mainInfo = {
			id: componentInfo.id,
			name: encodeURIComponent(componentInfo.name),
			code: encodeURIComponent(componentInfo.code),
			size: componentInfo.size,
			camera: componentInfo.camera,
			parameters: parentParameters
		};

		let requestParam = {
			id: editor.componentInfo.id,
			name: encodeURIComponent(editor.componentInfo.name),
			code: encodeURIComponent(editor.componentInfo.code),
			mainInfo: mainInfo,
			unitSettings: allUnitSettings,
			geoContents: geoContents,
			materials: materials
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"exportLZW",
			args:{requestParam:cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj) {
				let commandProcessor = js3CommandProcessors["exportS3D"];
				$("#" + commandProcessor.containerId).find("div[name='exportStatus']").text("导出成功!");
				let downloadUrl = "../export/" + obj.result.exportFileName;

				window.open(downloadUrl);
			},
			failFunc: function(obj) {
				let commandProcessor = js3CommandProcessors["exportS3D"];
				$("#" + commandProcessor.containerId).find("div[name='exportStatus']").text("导出失败!\r\n" + obj.message);
			}
		});
	}
};