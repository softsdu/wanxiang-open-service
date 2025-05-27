import * as THREE from "three";

//导入dxf slab json added by ls 20231031
js3CommandProcessors["importDxfSlab"] = {
	toStatus: "normal",
	icon: "/images/importDxfSlab.png",
	editor: null,
	ignoreSize: 1,
	//dxfSlabJson
	dxfSlabJson: null,
	
	//默认值
	defaultValues:{
		slab: {
			code:"9394-2001",
			versionNum: "1.0",
			material: "混凝土色",
			groupNamePrefix: "叠合板"
		}
	},
	
	//初始化
	init: function(p){
		let cmdProcessor = js3CommandProcessors["importDxfSlab"];
		cmdProcessor.editor = p.editor;
		cmdProcessor.editor.bindEvent("afterAddUnitObject3DToScene", function(p){
			let cmdProcessor = js3CommandProcessors["importDxfSlab"];
			let object3D = p.object3D;
		});
	},
	
	//执行工具栏按钮
	run: function(p){ 
		p.commandJson.showDxfSlabListDialog(p, { 
			afterFunc: function(p){
				js3CommandProcessors["importDxfSlab"].getDxfSlabJson(p);
			}
		}); 
	},
	
	//弹出选择DxfSlab的窗口
	showDxfSlabListDialog: function(p, params){
		var popContainer = new PopupContainer( {
			width : 700,
			height : 500,
			top : 50,
			title: "选择叠合板图纸"
		});
		
		popContainer.show();
		window.popInitParam = {
			closeWin: function(p){ 	
				var dxfSlabName = null;
				var dxfSlabId = null; 
				
				if(p.selectedRows != null){
					for(var rowId in p.selectedRows){
						var row = p.selectedRows[rowId];
						dxfSlabName = row.name;
						dxfSlabId = row.id;
					}
				}
				if(dxfSlabId != null){
					params.afterFunc({
						id: dxfSlabId,
						name: dxfSlabName
					});
				}
				popContainer.close();
			} 
		};
	
		var frameId = cmnPcr.getRandomValue();  
		var buttonContainerId = frameId + "_buttonContainer";
		var okBtnId = frameId + "_ok";
		var cancelBtnId = frameId + "_cancel";
		var pageUrl = basePath + "/web/design/common/plugins/importDxfSlab/res_DxfSlabList.jsp";
		var innerHtml = "<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:0px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + frameId + "\" src=\"" + pageUrl + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"/>"
		 	+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml); 
	},
	
	//获取json内容
	getDxfSlabJson: function(p){
		var requestParam = {
			id: p.id
		};
		serverAccess.request({
			serviceName:"resourceFileNcpService",
			funcName:"getDxfSlabResult",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj) {
				let resultStr = decodeURIComponent(obj.result.resultInfo);
				if(resultStr.length != 0){
					let json = cmnPcr.strToJson(resultStr);
					let cmdProcessor = js3CommandProcessors["importDxfSlab"];
					cmdProcessor.afterGotDxfSlabJson(json); 
				}
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
	},
	
	//构造所有的构件
	afterGotDxfSlabJson: function(json){
		let cmdProcessor = js3CommandProcessors["importDxfSlab"];
		cmdProcessor.dxfSlabJson = json;
		let shiftValues = cmdProcessor.getShiftValues({json: json});
		let allUnitSettings = [];
		let allGroups = [];
		cmdProcessor.initSlabUnitSettings({
			editor: cmdProcessor.editor,
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
	
	//获取整体移动的距离（坐标系切换需要）
	getShiftValues: function(p){ 
		let allSlabInfos = p.json.slabs; 
		var fullMinX = Infinity;
		var fullMaxX = -Infinity;
		var fullMinY= Infinity;
		var fullMaxY = -Infinity;
		for(let name in allSlabInfos){
			var slabInfo = allSlabInfos[name];
			for(let j = 0; j < slabInfo.points.length; j++){
				var p = slabInfo.points[j];
				if(p.x < fullMinX){
					fullMinX = p.x;
				}
				if(p.x > fullMaxX){
					fullMaxX = p.x;
				}
				if(p.y < fullMinY){
					fullMinY = p.y;
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
	},
	
	//构造Slab
	initSlabUnitSettings: function(p){
		let allSlabInfos = p.json.slabs;
		let allSlabTypeInfos = p.json.slabTypes; 
		let cmdProcessor = js3CommandProcessors["importDxfSlab"];
		let editor = p.editor;
		let slabGroupInfo = {
			id: editor.getGuid(),
			name: cmdProcessor.defaultValues.slab.groupNamePrefix,
			isNew: true							
		};
		var i = 0;
		while(editor.checkHasSameNameGroup(slabGroupInfo)){
			i++;
			slabGroupInfo.name = cmdProcessor.defaultValues.slab.groupNamePrefix + "_" + i;
		} 
		
		let maxFloorThickness = 0;
		
		//楼板的最大厚度 added by ls 20231206
		for(let name in allSlabInfos){
			var slabInfo = allSlabInfos[name];
			if(slabInfo.checked){
				var slabTypeInfo = allSlabTypeInfos[slabInfo.slabType];
				var floorThickness = slabTypeInfo.levelThickness + slabTypeInfo.slabThickness;
				if(floorThickness > maxFloorThickness){
					maxFloorThickness = floorThickness;
				}
			}			
		}
				
		for(let name in allSlabInfos){
			var slabInfo = allSlabInfos[name];
			if(slabInfo.checked){
				var slabTypeInfo = allSlabTypeInfos[slabInfo.slabType];
	
				//长度
				var slabLength = slabInfo.length;	
				//宽度
				var slabWidth = slabInfo.width;					
	
				//板厚
				var slabThickness = slabTypeInfo.slabThickness;
				
				//墙中心点,yz需要互换
				var slabCenterPoint = {x: slabInfo.position[0], y: maxFloorThickness - slabTypeInfo.levelThickness - slabThickness / 2, z: slabInfo.position[2]};
				
				//洞口
				var holeStrs = [];
				for(let j = 0; j < slabInfo.holes.length; j++){
					let holeInfo = slabInfo.holes[j]; 
					holeStrs.push(holeInfo.length + "," + holeInfo.width + "," + holeInfo.left + "," + (slabWidth - holeInfo.width - holeInfo.bottom));					
				}
				let holeString = cmnPcr.arrayToString(holeStrs, ";");
				
				//四个角的开口
				if(slabInfo.text == '3~27PCB-41'){
					var a = "";
				}
				let cornerHoleInfos = cmdProcessor.calcCornerHoleInfos(slabInfo);
	
				var slabUnitSetting = {
					name: slabInfo.text,
					 
					id: editor.getGuid(),
					
					code: cmdProcessor.defaultValues.slab.code, 
					versionNum: cmdProcessor.defaultValues.slab.versionNum, 
					mixType: js3UnitMixType.none,
					
					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,
					
					useWorldPosition: false,
					position: [js3CommonFunction.mm2m(slabCenterPoint.x + p.shiftValues.x), 
					           js3CommonFunction.mm2m(slabCenterPoint.y), 
					           js3CommonFunction.mm2m(-slabCenterPoint.z + p.shiftValues.y)],
					rotation: [0, slabInfo.rotation[1], 0],
					count: 1,
					materials: null,
					parameters: {
						"长度": {value: slabLength},
						"宽度": {value: slabWidth},
						"厚度": {value: slabThickness},
						"材质": {value: cmdProcessor.defaultValues.slab.material},
						"洞口": {value: holeString},
						//左上
						"左上角是否开口": {value: cornerHoleInfos.leftTop.hasHole ? "是" : "否"},
						"左上角_开口长": {value: cornerHoleInfos.leftTop.length},
						"左上角_开口宽": {value: cornerHoleInfos.leftTop.width},
						//左下
						"左下角是否开口": {value: cornerHoleInfos.leftBottom.hasHole ? "是" : "否"},
						"左下角_开口长": {value: cornerHoleInfos.leftBottom.length},
						"左下角_开口宽": {value: cornerHoleInfos.leftBottom.width},
						//右上
						"右上角是否开口": {value: cornerHoleInfos.rightTop.hasHole ? "是" : "否"},
						"右上角_开口长": {value: cornerHoleInfos.rightTop.length},
						"右上角_开口宽": {value: cornerHoleInfos.rightTop.width},
						//右下
						"右下角是否开口": {value: cornerHoleInfos.rightBottom.hasHole ? "是" : "否"},
						"右下角_开口长": {value: cornerHoleInfos.rightBottom.length},
						"右下角_开口宽": {value: cornerHoleInfos.rightBottom.width},
						 
					},
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: slabGroupInfo.id,
						needSelect: false
					}
				};
				p.allUnitSettings.push(slabUnitSetting);	
			}
		}
		p.allGroups.push(slabGroupInfo); 	
	}, 	
	
	//计算左上、左下、右上、右下是否有洞口，长、宽等信息
	calcCornerHoleInfos: function(slabInfo){
		let cmdProcessor = js3CommandProcessors["importDxfSlab"];
		let cornerInfos ={
			leftTop:{
				hasHole: false,
				width: 0,
				length: 0
			},
			leftBottom:{
				hasHole: false,
				width: 0,
				length: 0
			},
			rightTop:{
				hasHole: false,
				width: 0,
				length: 0
			},
			rightBottom:{
				hasHole: false,
				width: 0,
				length: 0
			}
		};
		let slabLength = slabInfo.length;
		let slabWidth = slabInfo.width;
		for(let i = 0; i < slabInfo.holes.length; i++){
			let holeInfo = slabInfo.holes[i];
			
			//左侧
			if(Math.abs(holeInfo.left) < cmdProcessor.ignoreSize){
				
				//下方
				if(Math.abs(holeInfo.bottom) < cmdProcessor.ignoreSize){
					cornerInfos.leftBottom.hasHole = true;
					cornerInfos.leftBottom.length = Math.round(holeInfo.length);
					cornerInfos.leftBottom.width = Math.round(holeInfo.width);
				}
				//上方
				else if(Math.abs(holeInfo.bottom + holeInfo.width - slabWidth) < cmdProcessor.ignoreSize){
					cornerInfos.leftTop.hasHole = true;
					cornerInfos.leftTop.length = Math.round(holeInfo.length);
					cornerInfos.leftTop.width = Math.round(holeInfo.width);
				}
			}
			//右侧
			else if(Math.abs(holeInfo.left + holeInfo.length - slabLength) < cmdProcessor.ignoreSize){
				
				//下方
				if(Math.abs(holeInfo.bottom) < cmdProcessor.ignoreSize){
					cornerInfos.rightBottom.hasHole = true;
					cornerInfos.rightBottom.length = Math.round(holeInfo.length);
					cornerInfos.rightBottom.width = Math.round(holeInfo.width);
				}
				//上方
				else if(Math.abs(holeInfo.bottom + holeInfo.width - slabWidth) < cmdProcessor.ignoreSize){
					cornerInfos.rightTop.hasHole = true;
					cornerInfos.rightTop.length = Math.round(holeInfo.length);
					cornerInfos.rightTop.width = Math.round(holeInfo.width);
				}
			}
		}
		return cornerInfos;
	}
};