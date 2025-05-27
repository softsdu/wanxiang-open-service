import * as THREE from "three";
import CubicSpline from "common/js/algorithm/cubicSpline.js";

//导入2D地形 added by ls 20231207
js3CommandProcessors["importGround2D"] = {
	toStatus: "normal",
	icon: "/images/importGround2D.png",
	editor: null,
	
	//ground2DInfo
	ground2DInfo: null,
	
	//ground2DSize
	ground2DSize: null,
	
	//默认值
	defaultValues:{
		//等高线
		contour: {
			code: "939501-1001",
			versionNum: "1.0"
		},
		//2D区域
		region2D: {
			code: "939501-1002",
			versionNum: "1.0"
		},
		//3D区域
		region3D: {
			code: "9395-1003",
			namePrefix: "区域",
			versionNum: "1.0",
			groupName: "区域"
		},
		//地形
		ground3D: {
			code: "9395-1002",
			versionNum: "1.0",
			namePrefix: "地形",
			groupName: "地形"
		},
		
		//网格个数
		gridCount: 10,

		//单个网格分切个数
		cellSplitCount: 10,
	},
	
	//初始化
	init: function(p){
		let commandProcessor = js3CommandProcessors["importGround2D"];
		commandProcessor.editor = p.editor;
	},
	
	//执行工具栏按钮
	run: function(p){ 
		p.commandJson.showGround2DListDialog(p, { 
			afterFunc: function(p){
				js3CommandProcessors["importGround2D"].getGround2DJson(p);
			}
		}); 
	},
	
	//弹出选择2D地形的窗口
	showGround2DListDialog: function(p, params){
		var popContainer = new PopupContainer( {
			width : 1000,
			height : 800,
			top : 50,
			title: "选择2D地形"
		});
		
		popContainer.show();
		window.popInitParam = {
			closeWin: function(p){ 	
				var ground2DName = null;
				var ground2DId = null; 
				
				if(p.selectedRows != null){
					for(var rowId in p.selectedRows){
						var row = p.selectedRows[rowId];
						ground2DName = row.name;
						ground2DId = row.id;
					}
				}
				if(ground2DId != null){
					params.afterFunc({
						id: ground2DId,
						name: ground2DName
					});
				}
				popContainer.close();
			} 
		};
	
		var frameId = cmnPcr.getRandomValue();  
		var buttonContainerId = frameId + "_buttonContainer";
		var okBtnId = frameId + "_ok";
		var cancelBtnId = frameId + "_cancel";
		var pageUrl = basePath + "/web/design/common/plugins/importGround2D/view_mdl_ComponentGround2D.jsp";
		var innerHtml = "<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:0px;font-size:11px;text-align:center;\">"
		 	+ "<iframe id=\"" + frameId + "\" src=\"" + pageUrl + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"/>"
		 	+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml); 
	},
	 
	//获取json内容
	getGround2DJson: function(p){  	
		var requestParam = {
			componentId: p.id 
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"getComponentFile",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj) {
				let commandProcessor = js3CommandProcessors["importGround2D"];
				var componentInfo = new MdlComponent();
				componentInfo.parse(obj.result.componentInfo.id, obj.result.componentInfo.categoryId, decodeURIComponent(obj.result.componentInfo.content));
				commandProcessor.afterGotGround2DJson(componentInfo); 
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		}); 
	},
	
	getNearYValue: function(commandProcessor, allContourInfos, x, z, xCellSize, zCellSize){
		let minDistance = Number.MAX_VALUE;
		let y = null;
		for(let i = 0; i < allContourInfos.length; i++){
			let points = allContourInfos[i].points;
			for(let j = 0; j < points.length; j++){
				let point = points[j];
				if(Math.abs(point.x - x) < xCellSize 
						&& Math.abs(point.z - z) < zCellSize){
					let distance = Math.sqrt((point.x - x) * (point.x - x) + (point.z - z) * (point.z - z));
					if(distance < minDistance){
						minDistance = distance;
						y = point.y;
					}
				}
			}
		}
		return y;
	}, 
	
	//创建区域
	createAllRegion3Ds: function(p){
		let commandProcessor = js3CommandProcessors["importGround2D"];
		let editor = commandProcessor.editor; 
		let ground2DInfo = p.ground2DInfo;
		let gridPointsList = p.gridPointsList;
		let allRegionInfos = [];
		for(let unitId in ground2DInfo.units){
			let unitInfo = ground2DInfo.units[unitId];
			if(unitInfo.code == commandProcessor.defaultValues.region2D.code
					&& unitInfo.versionNum == commandProcessor.defaultValues.region2D.versionNum){
				let material = unitInfo.parameters["填充材质"].value;
				let text = unitInfo.parameters["标注内容"].value;
				let pointsStr = unitInfo.parameters["边界"].value;
				let removePointsListStr = unitInfo.parameters["剔除区域"].value; 
				allRegionInfos.push({
					name: unitInfo.name,
					material: material,
					text: text,
					pointsStr: pointsStr,
					removePointsListStr: removePointsListStr
				});
			}
		}
		
		let groundGridPointsStr = commandProcessor.convertGridPointsToString(gridPointsList);

		//如果组不存在，那么新建一个
		let regionGroupInfo = editor.getGroupInfoByName(commandProcessor.defaultValues.region3D.groupName);
		if(regionGroupInfo == null){
			regionGroupInfo = {
				id: editor.getGuid(),
				name: commandProcessor.defaultValues.region3D.groupName,
				isNew: true							
			};
			editor.addNewGroup(regionGroupInfo); 
		}
		
		let regionNameHash = {};
		let regionUnitSettings = [];
		for(let i = 0; i < allRegionInfos.length; i++){
			let regionInfo = allRegionInfos[i];
			let idAndName = commandProcessor.editor.getNewUnitIdAndName(regionInfo.name, regionInfo.name, regionNameHash);
			regionNameHash[idAndName.name] = true;
	
			let regionUnitSetting = {
				name: idAndName.name,			 
				id: idAndName.id,			
				code: commandProcessor.defaultValues.region3D.code, 
				versionNum: commandProcessor.defaultValues.region3D.versionNum, 
				mixType: js3UnitMixType.none,
				viewLevel: js3ViewLevelType.always,
				useWorldPosition: true,
				position: [0, 0, 0],
				rotation: [0, 0, 0],
				count: 1,
				materials: null,
				parameters: {
					"材质": {value: regionInfo.material},
					"名称": {value: regionInfo.text},
					"边界": {value: regionInfo.pointsStr},
					"剔除区域": {value: regionInfo.removePointsListStr},
					"地形": {value: groundGridPointsStr}
				},
				positionExps: {},
				rotationExps: {},
				uvs: null,
				otherInfo:{
					groupId: regionGroupInfo.id,
					needSelect: false
				} 
			};
			regionUnitSettings.push(regionUnitSetting);
		}
		commandProcessor.editor.createNewObject3DsByUser(regionUnitSettings);
	},
	
	//计算地形3D的点
	calcGround3DPointsList: function(p){
		let commandProcessor = js3CommandProcessors["importGround2D"];
		let ground2DInfo = p.ground2DInfo;
		let ground2DSize = p.ground2DSize;
		let allContourInfos = [];
		for(let unitId in ground2DInfo.units){
			let unitInfo = ground2DInfo.units[unitId];
			if(unitInfo.code == commandProcessor.defaultValues.contour.code
					&& unitInfo.versionNum == commandProcessor.defaultValues.contour.versionNum){
				let elevation = unitInfo.parameters["高程"].value;
				let pointsStr = unitInfo.parameters["points"].value;
				let pointStrs = pointsStr.split(";");
				let polygonPoints = [];
				for(let i = 0; i < pointStrs.length; i++){
					let pointStr = pointStrs[i];
					let pStrs = pointStr.split(",");
					polygonPoints.push({
						x: parseFloat(pStrs[0]),
						y: elevation,
						z: parseFloat(pStrs[1])
					});
				}
				let points = [];
				for(let i = 0; i < polygonPoints.length; i++){
					let polygonPoint = polygonPoints[i];
					let nextPolygonPoint = i < polygonPoints.length - 1 ? polygonPoints[i + 1] : polygonPoints[0];
					for(let j = 0; j < commandProcessor.defaultValues.gridCount; j++){
						points.push({
							x: polygonPoint.x + (nextPolygonPoint.x - polygonPoint.x) * j / commandProcessor.defaultValues.gridCount,
							y: elevation,
							z: polygonPoint.z + (nextPolygonPoint.z - polygonPoint.z) * j / commandProcessor.defaultValues.gridCount,
						});
					}
				}
				allContourInfos.push({
					points: points
				});
			}
		}
		
		//画网格，找到网格每个点的Y方向的值
		let xCellSize = (ground2DSize.maxX - ground2DSize.minX) / commandProcessor.defaultValues.gridCount;
		let zCellSize = (ground2DSize.maxZ - ground2DSize.minZ) / commandProcessor.defaultValues.gridCount;
		let xzPointsList = [];
		for(let i = 0; i <= commandProcessor.defaultValues.gridCount; i++){
			let x = xCellSize * i;
			let gridPoints = [];
			for(let j = 0; j <= commandProcessor.defaultValues.gridCount; j++){
				let z = zCellSize * j;
				let y = commandProcessor.getNearYValue(commandProcessor, allContourInfos, x, z, xCellSize / 2, zCellSize / 2);
				gridPoints.push({
					x: x,
					y: y,
					z: z
				});
			}
			xzPointsList.push(gridPoints);
		}

		//先做一次
		let gridPointsList = commandProcessor.getCurvedPointsList(xzPointsList, xCellSize, zCellSize);
		
		//再来一次
		let sceGridPointsList = commandProcessor.getCurvedPointsList(gridPointsList, xCellSize, zCellSize);
		
		//再来一次
		let thiGridPointsList = commandProcessor.getMoreCurvedPointsList(sceGridPointsList, xCellSize, zCellSize);
		
		return thiGridPointsList;
	},
	
	//细化网格
	getMoreCurvedPointsList: function(xzPointsList, xCellSize, zCellSize){
		let commandProcessor = js3CommandProcessors["importGround2D"];
		//x方向的曲线
		let hCurvePointsList = [];
		for(let i = 0; i <= commandProcessor.defaultValues.gridCount; i++){
			let hPoints = [];
			let z = zCellSize * i;
			let isYAllNull = true;
			for(let j = 0; j <= commandProcessor.defaultValues.gridCount; j++){
				let point = xzPointsList[j][i];
				let hPoint = {
					x: point.x,
					y: point.y,
					z: point.z
				};
				hPoints.push(hPoint); 
			}
			let hCruvePoints = commandProcessor.calcHCurvePoints(z, hPoints, commandProcessor.defaultValues.gridCount * commandProcessor.defaultValues.cellSplitCount + 1);
			hCurvePointsList.push(hCruvePoints); 
		}
		
		//z方向的曲线
		let vCurvePointsList = [];
		for(let i = 0; i <= commandProcessor.defaultValues.gridCount; i++){
			let vPoints = [];
			let x = xCellSize * i;
			let isYAllNull = true;
			for(let j = 0; j <= commandProcessor.defaultValues.gridCount; j++){
				let point = xzPointsList[i][j];
				let vPoint = {
					x: point.x,
					y: point.y,
					z: point.z
				};
				vPoints.push(vPoint); 
			}
			let vCruvePoints = commandProcessor.calcVCurvePoints(x, vPoints, commandProcessor.defaultValues.gridCount * commandProcessor.defaultValues.cellSplitCount + 1);
			vCurvePointsList.push(vCruvePoints); 
		}
		
		//x方向计算更细间隔曲线上的点
		let hhCurvePointsList = [];
		let zzCellSize = zCellSize / commandProcessor.defaultValues.cellSplitCount;
		for(let i = 0; i <= commandProcessor.defaultValues.gridCount * commandProcessor.defaultValues.cellSplitCount; i++){
			let hhPoints = [];
			let z = zzCellSize * i;
			let isYAllNull = true;
			for(let j = 0; j <= commandProcessor.defaultValues.gridCount; j++){
				let point = vCurvePointsList[j][i];
				let hhPoint = {
					x: point.x,
					y: point.y,
					z: point.z
				};
				hhPoints.push(hhPoint); 
			}
			let hhCruvePoints = commandProcessor.calcHCurvePoints(z, hhPoints, commandProcessor.defaultValues.gridCount * commandProcessor.defaultValues.cellSplitCount + 1);
			hhCurvePointsList.push(hhCruvePoints); 
		}
		
		//y方向计算更细间隔曲线上的点
		let vvCurvePointsList = [];
		let xxCellSize = xCellSize / commandProcessor.defaultValues.cellSplitCount;
		for(let i = 0; i <= commandProcessor.defaultValues.gridCount * commandProcessor.defaultValues.cellSplitCount; i++){
			let vvPoints = [];
			let x = xxCellSize * i;
			let isYAllNull = true;
			for(let j = 0; j <= commandProcessor.defaultValues.gridCount; j++){
				let point = hCurvePointsList[j][i];
				let vvPoint = {
					x: point.x,
					y: point.y,
					z: point.z
				};
				vvPoints.push(vvPoint); 
			}
			let vvCruvePoints = commandProcessor.calcVCurvePoints(x, vvPoints, commandProcessor.defaultValues.gridCount * commandProcessor.defaultValues.cellSplitCount + 1);
			vvCurvePointsList.push(vvCruvePoints); 
		}

		//构造网格上的点 
		let gridPointsList = [];
		for(let i = 0; i <= commandProcessor.defaultValues.gridCount * commandProcessor.defaultValues.cellSplitCount; i++){
			let gridPoints = [];
			for(let j = 0; j <= commandProcessor.defaultValues.gridCount * commandProcessor.defaultValues.cellSplitCount; j++){
				let hhPoint = hhCurvePointsList[j][i];
				let vvPoint = vvCurvePointsList[i][j];
				gridPoints[j] = {
					x: (hhPoint.x + vvPoint.x) / 2,
					y: (hhPoint.y + vvPoint.y) / 2,
					z: (hhPoint.z + vvPoint.z) / 2
				}; 
			}
			gridPointsList.push(gridPoints);
		}
		return gridPointsList;
	},

	//把点变成曲面上的点
	getCurvedPointsList: function(xzPointsList, xCellSize, zCellSize){
		let commandProcessor = js3CommandProcessors["importGround2D"];
		//x方向的曲线
		let hCurvePointsList = [];
		for(let i = 0; i <= commandProcessor.defaultValues.gridCount; i++){
			let hPoints = [];
			let z = zCellSize * i;
			let isYAllNull = true;
			for(let j = 0; j <= commandProcessor.defaultValues.gridCount; j++){
				let point = xzPointsList[j][i];
				let hPoint = {
					x: point.x,
					y: point.y,
					z: point.z
				};
				hPoints.push(hPoint);
				if(point.y != null){
					isYAllNull = false;
				}
				else{
					if(i == 0 || j == 0 || i == commandProcessor.defaultValues.gridCount || j == commandProcessor.defaultValues.gridCount){
						hPoint.y = 0;
					}
				}
			}
			if(isYAllNull){
				hCurvePointsList.push(hPoints);
			}
			else{
				let hCruvePoints = commandProcessor.calcHCurvePoints(z, hPoints, commandProcessor.defaultValues.gridCount + 1);
				hCurvePointsList.push(hCruvePoints);
			}
		}
		
		//z方向上的曲线
		let vCurvePointsList = [];
		for(let i = 0; i <= commandProcessor.defaultValues.gridCount; i++){
			let vPoints = [];
			let x = xCellSize * i;
			let isYAllNull = true;
			for(let j = 0; j <= commandProcessor.defaultValues.gridCount; j++){
				let point = xzPointsList[i][j];
				let vPoint = {
					x: point.x,
					y: point.y,
					z: point.z
				};
				vPoints.push(vPoint);
				if(point.y != null){
					isYAllNull = false;
				}
				else{
					if(i == 0 || j == 0 || i == commandProcessor.defaultValues.gridCount || j == commandProcessor.defaultValues.gridCount){
						vPoint.y = 0;
					}
				}
			}
			if(isYAllNull){
				vCurvePointsList.push(vPoints);
			}
			else{
				let vCruvePoints = commandProcessor.calcVCurvePoints(x, vPoints, commandProcessor.defaultValues.gridCount + 1);
				vCurvePointsList.push(vCruvePoints);
			}
		}
		
		//构造网格上的点 
		let gridPointsList = [];
		for(let i = 0; i <= commandProcessor.defaultValues.gridCount; i++){
			let gridPoints = [];
			for(let j = 0; j <= commandProcessor.defaultValues.gridCount; j++){
				let hPoint = hCurvePointsList[j][i];
				let vPoint = vCurvePointsList[i][j];
				gridPoints[j] = {
					x: (hPoint.x + vPoint.x) / 2,
					y: (hPoint.y != null && vPoint.y != null 
							? ((hPoint.y + vPoint.y) / 2) 
							: (hPoint.y == null ? vPoint.y : hPoint.y)),
					z: (hPoint.z + vPoint.z) / 2
				}; 
			}
			gridPointsList.push(gridPoints);
		}
		return gridPointsList;
	},

	//根据网格点计算水平方向曲线上的点
	calcHCurvePoints: function(z, points, pointCount){
		let tempPoints = new Array();
		for(let i = 0; i < points.length; i++){
			let point = points[i];
			if(point.y != null){
				tempPoints.push({
					x: point.x,
					y: point.y
				});
			}
		} 
		//如果前后的点的y值是一样的，那么去除
		let pathPoints = new Array();
		for(let i = 0; i < tempPoints.length; i++){
			let point = tempPoints[i];
			if(i == 0 || i == tempPoints.length - 1){
				pathPoints.push(point);
			}
			else{
				let prePoint = tempPoints[i - 1];
				let nextPoint = tempPoints[i + 1];
				if(prePoint.y == point.y && nextPoint.y == point.y){
					//不放在内
				}
				else{
					pathPoints.push(point);
				}
			}
		} 

		let csiPoints = CubicSpline.calcNPoints(tempPoints, pointCount);
		let curvePoints = new Array();
		for(var i = 0; i < csiPoints.length; i++){
			var p = csiPoints[i];
			curvePoints.push({
				x: p.x,
				y: p.y,
				z: z
			});
		} 
		return curvePoints; 
	},
	//根据网格点计算垂直方向曲线上的点
	calcVCurvePoints: function(x, points, pointCount){
		let tempPoints = new Array();
		for(let i = 0; i < points.length; i++){
			let point = points[i];
			if(point.y != null){
				tempPoints.push({
					x: point.z,
					y: point.y
				});
			}
		}
		 
		//如果前后的点的y值是一样的，那么去除
		let pathPoints = new Array();
		for(let i = 0; i < tempPoints.length; i++){
			let point = tempPoints[i];
			if(i == 0 || i == tempPoints.length - 1){
				pathPoints.push(point);
			}
			else{
				let prePoint = tempPoints[i - 1];
				let nextPoint = tempPoints[i + 1];
				if(prePoint.y == point.y && nextPoint.y == point.y){
					//不放在内
				}
				else{
					pathPoints.push(point);
				}
			}
		} 

		let csiPoints = CubicSpline.calcNPoints(tempPoints, pointCount);
		let curvePoints = new Array();
		for(var i = 0; i < csiPoints.length; i++){
			var p = csiPoints[i];
			curvePoints.push({
				x: x,
				y: p.y,
				z: p.x
			});
		} 
		return curvePoints; 
	},
	
	//获取ground2D的大小
	getGroundSize: function(ground2DInfo){
		let commandProcessor = js3CommandProcessors["importGround2D"];
		let minMaxValues = {
			minX: Number.MAX_VALUE,
			maxX: -Number.MAX_VALUE,
			minZ: Number.MAX_VALUE,
			maxZ: -Number.MAX_VALUE
		};
		for(let unitId in ground2DInfo.units){
			let unitInfo = ground2DInfo.units[unitId];
			if(unitInfo.code == commandProcessor.defaultValues.contour.code
					&& unitInfo.versionNum == commandProcessor.defaultValues.contour.versionNum){
				let mmValues = commandProcessor.getMinMaxValues(unitInfo.parameters["points"].value);
				if(minMaxValues.minX > mmValues.minX){
					minMaxValues.minX = mmValues.minX;
				}
				if(minMaxValues.minZ > mmValues.minZ){
					minMaxValues.minZ = mmValues.minZ;
				}
				if(minMaxValues.maxX < mmValues.maxX){
					minMaxValues.maxX = mmValues.maxX;
				}
				if(minMaxValues.maxZ < mmValues.maxZ){
					minMaxValues.maxZ = mmValues.maxZ;
				}
			}
			if(unitInfo.code == commandProcessor.defaultValues.region2D.code
					&& unitInfo.versionNum == commandProcessor.defaultValues.region2D.versionNum){
				let mmValues = commandProcessor.getMinMaxValues(unitInfo.parameters["边界"].value);
				if(minMaxValues.minX > mmValues.minX){
					minMaxValues.minX = mmValues.minX;
				}
				if(minMaxValues.minZ > mmValues.minZ){
					minMaxValues.minZ = mmValues.minZ;
				}
				if(minMaxValues.maxX < mmValues.maxX){
					minMaxValues.maxX = mmValues.maxX;
				}
				if(minMaxValues.maxZ < mmValues.maxZ){
					minMaxValues.maxZ = mmValues.maxZ;
				}
			}
		}
		return minMaxValues;
	},
	
	convertToPoints: function(pointsStr){
		let pointStrs = pointsStr.split(";");
		let points = [];
		for(let i = 0; i < pointStrs.length; i++){
			let pointStr = pointStrs[i];
			let pStrs = pointStr.split(",");
			points.push({
				x: parseFloat(pStrs[0]),
				y: elevation,
				z: parseFloat(pStrs[1])
			});
		}
		return points;
	},
	
	getMinMaxValues: function(pointsStr){
		let minMaxValues = {
			minX: Number.MAX_VALUE,
			maxX: -Number.MAX_VALUE,
			minZ: Number.MAX_VALUE,
			maxZ: -Number.MAX_VALUE
		};
		let pointStrs = pointsStr.split(";");
		for(let i = 0; i < pointStrs.length; i++){
			let pointStr = pointStrs[i];
			let pStrs = pointStr.split(",");
			let point = {
				x: parseFloat(pStrs[0]),
				z: parseFloat(pStrs[1])
			};
			if(minMaxValues.minX > point.x){
				minMaxValues.minX = point.x;
			}
			if(minMaxValues.minZ > point.z){
				minMaxValues.minZ = point.z;
			}
			if(minMaxValues.maxX < point.x){
				minMaxValues.maxX = point.x;
			}
			if(minMaxValues.maxZ < point.z){
				minMaxValues.maxZ = point.z;
			}
		}
		return minMaxValues;
	},
	
	//构造所有的构件
	afterGotGround2DJson: function(ground2DInfo){
		let commandProcessor = js3CommandProcessors["importGround2D"];
		
		//获取尺寸
		let ground2DSize = commandProcessor.getGroundSize(ground2DInfo);
		
		commandProcessor.ground2DInfo = ground2DInfo;
		commandProcessor.ground2DSize = ground2DSize;
		
		//计算地形3D的点
		let gridPointsList = commandProcessor.calcGround3DPointsList({
			ground2DInfo: ground2DInfo,
			ground2DSize: ground2DSize
		});
		
		//生成3D地形
		//删除，暂不显示生成3D地形
		commandProcessor.createGround3D({
			gridPointsList: gridPointsList
		});
		
		//生成3D区域
		/*
		commandProcessor.createAllRegion3Ds({
			ground2DInfo: ground2DInfo,
			gridPointsList: gridPointsList
		});
		*/
	},
	
	convertGridPointsToString: function(gridPointsList){
		let pointsListStr = "";
		for(let i = 0; i < gridPointsList.length; i++){
			let gridPoints = gridPointsList[i];
			pointsListStr += (i == 0 ? "" : "#");
			for(let j = 0; j < gridPoints.length; j++){
				let point = gridPoints[j];
				pointsListStr += ((j == 0 ? "" : ";") + point.x + "," + point.y + "," + point.z);
			}			
		}
		return pointsListStr;
	},
	
	//构造3D区域
	createGround3D: function(p){
		let commandProcessor = js3CommandProcessors["importGround2D"];
		let editor = commandProcessor.editor; 
		let gridPointsList = p.gridPointsList;
		
		let pointsListStr = commandProcessor.convertGridPointsToString(gridPointsList);

		//如果组不存在，那么新建一个
		let groundGroupInfo = editor.getGroupInfoByName(commandProcessor.defaultValues.ground3D.groupName);
		if(groundGroupInfo == null){
			groundGroupInfo = {
				id: editor.getGuid(),
				name: commandProcessor.defaultValues.ground3D.groupName,
				isNew: true							
			};
			editor.addNewGroup(groundGroupInfo); 
		}		 

		let idAndName = commandProcessor.editor.getNewUnitIdAndName(commandProcessor.defaultValues.ground3D.namePrefix + "_1", 
			commandProcessor.defaultValues.ground3D.namePrefix);
	
		let groundUnitSetting = {
			name: idAndName.name,			 
			id: idAndName.id,			
			code: commandProcessor.defaultValues.ground3D.code, 
			versionNum: commandProcessor.defaultValues.ground3D.versionNum, 
			mixType: js3UnitMixType.none,
			viewLevel: js3ViewLevelType.always,
			useWorldPosition: true,
			position: [0, 0, 0],
			rotation: [0, 0, 0],
			count: 1,
			materials: null,
			parameters: {
				"地形": {value: pointsListStr}
			},
			positionExps: {},
			rotationExps: {},
			uvs: null,
			otherInfo:{
				groupId: groundGroupInfo.id,
				needSelect: false
			} 
		};
		commandProcessor.editor.createNewObject3DsByUser([groundUnitSetting]);
	},
};