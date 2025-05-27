import * as THREE from "three";
//生成区域  added by ls 20220606
js3CommandProcessors["generateGroundRegion"] = {
	toStatus: "normal",	 
	icon: "/images/generateGroundRegion.png",
	editor: null,
	
	defaultValues:{
		region:{
			code: "939501-1002",
			versionNum: "1.0",
			namePrefix: "区域",
			groupName: "区域"
		},
		//允许误差1mm
		fixedNum: 5,
		ignoreSize: 0,
		spliters: [{
			"code": "939501-1003",
			"versionNum": "1.0"
		},{
			"code": "939501-1004",
			"versionNum": "1.0"
		}],
	},
	run: function(p){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"];
		commandProcessor.defaultValues.ignoreSize = commandProcessor.getIgnoreSize(commandProcessor.defaultValues.fixedNum);
		commandProcessor.editor = p.editor;		
		commandProcessor.generate(p); 
	}, 
	
	getIgnoreSize: function(fixedNum){
		let str = "0.";
		for(let i = 0; i < fixedNum - 1; i++){
			str += "0";
		}
		str += "1";
		return parseFloat(str);
	},
	
	//判断是否为分割线
	checkIsSpliter: function(unitData){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"]
		for(let i = 0; i < commandProcessor.defaultValues.spliters.length; i++){
			let spliter = commandProcessor.defaultValues.spliters[i];
			if(spliter.code == unitData.code && spliter.versionNum == unitData.versionNum){
				return true;
			}
		}
		return false;
	},
	generate: function(p){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"]
		let allPartPolylineHash = commandProcessor.getPartPolylineHash(p);
		let allTerminalPointHash = commandProcessor.getAllTerminalPointHash(allPartPolylineHash);
		let allRegionHash = commandProcessor.getAllRegionHash(allTerminalPointHash, allPartPolylineHash);
		let allLegalRegionHash = commandProcessor.geLegalRegionHash(allRegionHash, allPartPolylineHash, allTerminalPointHash);
		commandProcessor.addRegionObjects(allLegalRegionHash);
	},
	
	//根据区域外轮廓，构造区域构件
	addRegionObjects: function(allLegalRegionHash){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"];
		let editor = commandProcessor.editor;
		let regionCount = 0;
		for(let key in allLegalRegionHash){
			regionCount++;
		}
		if(regionCount == 0){
			msgBox.alert({info: "没有识别出任何区域."});
		}
		else{
			//如果组不存在，那么新建一个
			let regionGroupInfo = editor.getGroupInfoByName(commandProcessor.defaultValues.region.groupName);
			if(regionGroupInfo == null){
				regionGroupInfo = {
					id: editor.getGuid(),
					name: commandProcessor.defaultValues.region.groupName,
					isNew: true							
				};
				editor.addNewGroup(regionGroupInfo); 
			}
				
			let regionUnitSettings = [];
			let regionNameHash = {};
			for(let key in allLegalRegionHash){
				let region = allLegalRegionHash[key];
	
				let commandProcessor = js3CommandProcessors["generateGroundRegion"];
				
				let idAndName = commandProcessor.editor.getNewUnitIdAndName(commandProcessor.defaultValues.region.namePrefix + "_1", 
					commandProcessor.defaultValues.region.namePrefix, 
					regionNameHash);
				regionNameHash[idAndName.name] = true;
	
				let polygonStr = "";
				for(let i = 0; i < region.points.length; i++){
					let point = region.points[i];
					polygonStr += ((i == 0 ? "" : ";") + js3CommonFunction.m2mm(point.x) + "," + js3CommonFunction.m2mm(point.y));
				}
				let removePolygonsStr = "";
				for(let i = 0; i < region.innerRegions.length; i++){
					let regionName = region.innerRegions[i];
					let innerRegion = allLegalRegionHash[regionName];
					removePolygonsStr += (i == 0 ? "" : "#");
					for(let j = 0; j < innerRegion.points.length; j++){
						let point = innerRegion.points[j];
						removePolygonsStr += ((j == 0 ? "" : ";") + js3CommonFunction.m2mm(point.x) + "," + js3CommonFunction.m2mm(point.y));
					}
				}
				
				//判断是否已经存在此unit
				let existUnit = false;
				if(regionGroupInfo.units != null){
					for(let i = 0; i < regionGroupInfo.units.length; i++){
						let unitId = regionGroupInfo.units[i];
						let object3D = editor.getObject3DByUnitId(unitId);
						let unitData = object3D.unitData;
						if(unitData.parameters["边界"].value == polygonStr
							&& (unitData.parameters["剔除区域"].value == removePolygonsStr || (unitData.parameters["剔除区域"].value == null && removePolygonsStr.length == 0))){
							existUnit = true;
							break;
						}
					}
				}
				if(!existUnit){
					let regionUnitSetting = {
						name: idAndName.name,			 
						id: idAndName.id,			
						code: commandProcessor.defaultValues.region.code, 
						versionNum: commandProcessor.defaultValues.region.versionNum, 
						mixType: js3UnitMixType.none,
						viewLevel: js3ViewLevelType.always,
						useWorldPosition: true,
						position: [0, 0, 0],
						rotation: [0, 0, 0],
						count: 1,
						materials: null,
						parameters: {
							"边界": {value: polygonStr},
							"剔除区域": {value: removePolygonsStr}
						},
						positionExps: {},
						rotationExps: {},
						uvs: null,
						otherInfo:{
							needSelect: false,
							groupId: regionGroupInfo.id
						}
					};
					regionUnitSettings.push(regionUnitSetting);
				}
			}
			commandProcessor.editor.createNewObject3DsByUser(regionUnitSettings);
			if(regionUnitSettings.length == 0){
				msgBox.alert({info: "没有检测到新的区域."});
			}
			else{
				msgBox.alert({info: "完成! 新生成" + regionUnitSettings.length + "个区域"});
			}
		}
	},
	
	geLegalRegionHash: function(allRegionHash, allPartPolylineHash, allTerminalPointHash){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"]
		let minX = Number.MAX_VALUE;
		let maxX = -Number.MAX_VALUE;
		let minY = Number.MAX_VALUE;
		let maxY = -Number.MAX_VALUE;
		for(let key in allPartPolylineHash){
			let partPolylineObj = allPartPolylineHash[key];
			for(let i = 0; i < partPolylineObj.points.length; i++){
				var p = partPolylineObj.points[i];
				if(p.x > maxX){
					maxX = p.x;
				}
				if(p.x < minX){
					minX = p.x;
				}
				if(p.y > maxY){
					maxY = p.y;
				}
				if(p.y < minY){
					minY = p.y;
				}
			}
		}
		let outPoint = {
			x: minX - 1,
			y: minY - 1
		};
		let allTempRegionHash = {};
		for(let regionKey in allRegionHash){
			let region = allRegionHash[regionKey];
		
			if(!commandProcessor.checkIsSamePoint(region.startPoint, region.endPoint)){
				//如果没有形成环，那么region不合法
			}
			else{				
				if(region.polylines.length > 0){
					let points = [];
					for(let i = 0; i < region.polylines.length; i++){
						let polyline = region.polylines[i];
						let polylinePoints = allPartPolylineHash[polyline.polyline.name].points;
						if(polyline.direction == "forward"){
							for(var j = 0; j < polylinePoints.length - 1; j++){
								var point = polylinePoints[j];
								if(points.length == 0 || !commandProcessor.checkIsSamePoint(point, points[points.length - 1])){
									points.push(point);
								}
							}
						}
						else {
							for(var j = polylinePoints.length - 1; j > 0; j--){
								var point = polylinePoints[j];
								if(points.length == 0 || !commandProcessor.checkIsSamePoint(point, points[points.length - 1])){
									points.push(point);
								}
							}
						}
					}
					
					//判断是否所有terminalPoint是否都在此region内部
					var allTerminalPointInRegion = true;
					for(let pointKey in allTerminalPointHash){
						var point = allTerminalPointHash[pointKey].point;
						//点不在多边形的轮廓上，也不在多边形内部
						if(!commandProcessor.checkOnEdgeOfPolygon(point, points) && !js3CommonFunction.checkPointInPolygon(point, points)){
							allTerminalPointInRegion = false;
							break;
						}
					}

					//这是不是最外层的region，那么留下
					if(!allTerminalPointInRegion){

						//用先进先出，去掉连续走了两遍的边
						var polylineList = [];
						for(let i = 0; i < region.polylines.length; i++){
							let polyline = region.polylines[i];
							let lastPolyline = polylineList.length == 0 ? null : polylineList[polylineList.length - 1];
							if(lastPolyline == null || lastPolyline.name != polyline.name){
								polylineList.push(polyline);
							}
							else{
								let tempList = [];
								for(let j = 0; j < polylineList.length - 1; j++){
									tempList.push(polylineList[j]);
								}
								polylineList = tempList;
							}
						}
						region.polylines = polylineList;
						
						if(region.polylines.length > 0){
							allTempRegionHash[regionKey] = region;
						}
					}
				}
			}
		}
		
		//计算中间被抠出的区域
		let allLegalRegionHash = {};
		for(let regionName in allTempRegionHash){
			let region = allTempRegionHash[regionName];
			
			//计算外轮廓上所有的点
			let points = [];
			for(let i = 0; i < region.polylines.length; i++){
				let polyline = region.polylines[i];
				let polylinePoints = allPartPolylineHash[polyline.polyline.name].points;
				if(polyline.direction == "forward"){
					for(var j = 0; j < polylinePoints.length - 1; j++){
						points.push(polylinePoints[j]);
					}
				}
				else {
					for(var j = polylinePoints.length - 1; j > 0; j--){
						points.push(polylinePoints[j]);
					}
				}
			}
			if(points.length > 2){
				region.points = points;
				allLegalRegionHash[regionName] = region; 
			}
		}

		for(let regionName in allLegalRegionHash){
			let region = allLegalRegionHash[regionName];			
			//判断其他region是否在此region内部
			for(let rn in allLegalRegionHash){
				if(rn != regionName){
					let isIn = true;
					let r = allLegalRegionHash[rn];
					for(let i = 0; i < r.polylines.length; i++){
						let pl = r.polylines[i];
						if(!js3CommonFunction.checkPointInPolygon(pl.polyline.points[0], region.points)){
							isIn = false;
							break;
						}
					}
					if(isIn){
						region.innerRegions.push(rn);
					}
				}
			}
			
		}
		
		return allLegalRegionHash;
	},
	
	//判断点是否在多边形的轮廓
	checkOnEdgeOfPolygon: function(point, polygonPoints){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"];
		for(let i = 0; i < polygonPoints.length; i++){
			let pPoint = polygonPoints[i];
			if(commandProcessor.checkIsSamePoint(point, pPoint, false)){
				return true;
			}
		}
		return false;
	},
	
	//判断点是否在多边形的内部
	checkInPolygon: function(point, polygonPoints){
		for(let i = 0; i < polygonPoints.length; i++){
			let pPoint = polygonPoints[i];
			if(js3CommonFunction.checkPointInPolygon(point, pPoint, false)){
				return true;
			}
		}
		return false;
	},
	
	getPointName: function(point){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"];
		let pointName = point.x.toFixed(commandProcessor.defaultValues.fixedNum) + "_" + point.y.toFixed(commandProcessor.defaultValues.fixedNum);
		return pointName;
	},
	
	getAllTerminalPointHash: function(allPartPolylineHash){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"];
		
		//所有端点
		let allTerminalPointHash = {};
		for(let name in allPartPolylineHash){
			let partPolyline = allPartPolylineHash[name];
			let pointA = partPolyline.points[0];
			let pointB = partPolyline.points[partPolyline.points.length - 1];
			let pointAName = commandProcessor.getPointName(pointA);
			let pointBName = commandProcessor.getPointName(pointB);
			if(allTerminalPointHash[pointAName] == null){
				allTerminalPointHash[pointAName] = {
					point: pointA,
					edges: []
				};
			}
			if(allTerminalPointHash[pointBName] == null){
				allTerminalPointHash[pointBName] = {
					point: pointB,
					edges: []
				};
			}
			allTerminalPointHash[pointAName].edges.push(name);
			if(pointAName != pointBName){
				allTerminalPointHash[pointBName].edges.push(name);
			}
		}
		return allTerminalPointHash;
	},
	
	getAllRegionHash: function(allTerminalPointHash, allPartPolylineHash){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"]
		
		//记录已经走过的点+边
		let usedPointEdgeHash = {};
		
		let allRegionHash = {};
		let regionIndex = 0;
		for(let pointName in allTerminalPointHash){
			let terminalPointObj = allTerminalPointHash[pointName];
			let edges = terminalPointObj.edges;			
			for(let edgeName in edges){
				let pointEdgeName = pointName + "_" + edgeName;
				if(usedPointEdgeHash[pointEdgeName] == null){
					regionIndex++;
					let region = {
						name: "rg_" + regionIndex,
						startPoint: terminalPointObj.point,
						endPoint: terminalPointObj.point,
						polylines: [],
						innerRegions: []
					};
	
					let rightNearestPolylineObj = commandProcessor.getRightNearestPolyline({x: terminalPointObj.point.x + 1, y: terminalPointObj.point.y}, 
							terminalPointObj.point, 
							allTerminalPointHash, 
							allPartPolylineHash, 
							usedPointEdgeHash);
					while(rightNearestPolylineObj != null){
						let rightNearestPolyline = allPartPolylineHash[rightNearestPolylineObj.edgeName];
						region.polylines.push({
							name: rightNearestPolylineObj.edgeName,
							polyline: rightNearestPolyline,
							direction: rightNearestPolylineObj.direction
						});
						let pointA = rightNearestPolyline.points[0];
						let pointB = rightNearestPolyline.points[rightNearestPolyline.points.length - 1];
						if(rightNearestPolylineObj.direction == "forward"){ 
							region.endPoint = pointB;
							if(commandProcessor.checkIsSamePoint(region.startPoint, pointB)){
								//闭合
								allRegionHash[region.name] = region;
								rightNearestPolylineObj = null;
							}
							else{
								//没有闭合，继续找下一个
								rightNearestPolylineObj = commandProcessor.getRightNearestPolyline(rightNearestPolyline.points[rightNearestPolyline.points.length - 2], 
									pointB, 
									allTerminalPointHash, 
									allPartPolylineHash, 
									usedPointEdgeHash);
							}
						}
						else { 
							region.endPoint = pointA;
							if(commandProcessor.checkIsSamePoint(region.startPoint, pointA)){
								//闭合
								allRegionHash[region.name] = region;
								rightNearestPolylineObj = null;
							}
							else{
								//没有闭合，继续找下一个
								rightNearestPolylineObj = commandProcessor.getRightNearestPolyline(rightNearestPolyline.points[1], 
									pointA, 
									allTerminalPointHash, 
									allPartPolylineHash, 
									usedPointEdgeHash);
							}
						}
					}
				}
			}
		}
		
		return allRegionHash;
		
	},
	
	//找到右手边最靠近的polyline
	getRightNearestPolyline: function(fromPoint, centerPoint, allTerminalPointHash, allPartPolylineHash, usedPointEdgeHash){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"]
		let pointName = commandProcessor.getPointName(centerPoint);
		let edges = allTerminalPointHash[pointName].edges;
		let minAngle = Number.MAX_VALUE;
		let direction = null;
		let rightNearestEdgeName = null;
		for(let i = 0; i < edges.length; i++){
			let edgeName = edges[i];
			let partPolylineObj = allPartPolylineHash[edgeName];
			let pointA = partPolylineObj.points[0];
			let pointB = partPolylineObj.points[partPolylineObj.points.length - 1];
			let pointEdgeKey = pointName + "_" + edgeName;
			if(usedPointEdgeHash[pointEdgeKey] == null){
				if(commandProcessor.checkIsSamePoint(centerPoint, pointA)){
					let toPoint = partPolylineObj.points[1];
					let angle = js3CommonFunction.getAngle2D(centerPoint, fromPoint, toPoint);
					if(angle < 0.0001){
						angle = 360;
					}
					if(angle < minAngle){
						minAngle = angle;
						rightNearestEdgeName = edgeName;
						direction = "forward";
					}
				}
				if(commandProcessor.checkIsSamePoint(centerPoint, pointB)){
					let toPoint = partPolylineObj.points[partPolylineObj.points.length - 2];
					let angle = js3CommonFunction.getAngle2D(centerPoint, fromPoint, toPoint);
					if(angle < 0.0001){
						angle = 360;
					}
					if(angle < minAngle){
						minAngle = angle;
						rightNearestEdgeName = edgeName;
						direction = "reverse";
					}
				}
			}
		}
		if(rightNearestEdgeName != null){
			let pointEdgeKey = pointName + "_" + rightNearestEdgeName;
			usedPointEdgeHash[pointEdgeKey] = true;
			return {
				edgeName: rightNearestEdgeName,
				direction: direction
			};
		}
		else{
			return null;
		}
	},
	
	//字符串转为点数组
	convertToPoints: function(pointsStr){
		let pointStrs = pointsStr.split(";");
		let points = new Array();
		for(let i = 0; i < pointStrs.length; i++){
			let pointStr = pointStrs[i];
			let pStrs = pointStr.split(",");
			points.push({
				x: js3CommonFunction.mm2m(parseFloat(pStrs[0])),
				y: js3CommonFunction.mm2m(parseFloat(pStrs[1])),
			});
		}
		return points;
	},
	
	//将分割线拆成更细的polyline（遇到交叉点，就断开）
	getPartPolylineHash: function(p){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"]
		let editor = p.editor;
		let allPolylines = [];
		
		//边框
		let sizeObj = editor.componentInfo.size;
		allPolylines.push({points:[{x: 0, y: 0}, {x: sizeObj.x, y: 0}]});
		allPolylines.push({points:[{x: sizeObj.x, y: 0}, {x: sizeObj.x, y: sizeObj.z}]});
		allPolylines.push({points:[{x: sizeObj.x, y: sizeObj.z}, {x: 0, y: sizeObj.z}]});
		allPolylines.push({points:[{x: 0, y: sizeObj.z}, {x: 0, y: 0}]});
		
		//分割线
		let allObject3Ds = editor.getAllUnitObject3Ds()
		for(let i = 0; i < allObject3Ds.length; i++){
			let unitData = allObject3Ds[i].unitData;
			if(commandProcessor.checkIsSpliter(unitData)){
				var pointsStr = unitData.parameters["points"].value;
				var points = commandProcessor.convertToPoints(pointsStr);
				allPolylines.push({points: points})
			}
		}
		
		//所有被交叉点截断的polyline
		let allPartPolylineHash = {};
		let partPolylineIndex = 0;
		
		//遍历所有的polyline，用其他polyline切割它
		for(let i = 0; i < allPolylines.length; i++){
			if(i == 2){
				var a = 1;
			}
			let polyline = allPolylines[i];

			partPolylineIndex++;
			let newPartPolyline = {
				name: "pl_" + partPolylineIndex,
				points: []				
			};
			newPartPolyline.points.push(polyline.points[0]);
			for(let j = 1; j < polyline.points.length; j++){
				let pointA = polyline.points[j - 1];
				let pointB = polyline.points[j];
				let pointBIsPolylineEnd = j == polyline.points.length - 1;
				let crossPointObjs = commandProcessor.getCrossPoints(pointA, pointB, allPolylines, pointBIsPolylineEnd, i, j);
				if(crossPointObjs.length > 0){
					for(let k = 0; k < crossPointObjs.length; k++){
						let crossPointObj = crossPointObjs[k];
						newPartPolyline.points.push(crossPointObj.point);
						commandProcessor.removeSamePointInPolyline(newPartPolyline, allPartPolylineHash);
						partPolylineIndex++;
						newPartPolyline = {
							name: "pl_" + partPolylineIndex,
							points: []
						};
						newPartPolyline.points.push(crossPointObj.point);
					}
				}
				newPartPolyline.points.push(pointB);
			}
			 
			commandProcessor.removeSamePointInPolyline(newPartPolyline, allPartPolylineHash);
		}
		
		return allPartPolylineHash;
	},
	
	//去除polyline中重复的点，如果polyline剩余一个点，那么不要此polyline
	removeSamePointInPolyline: function(newPartPolyline, allPartPolylineHash){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"]
		let points = new Array();
		for(let k = 0; k < newPartPolyline.points.length; k++){
			let p = newPartPolyline.points[k];
			if(k == 0){
				points.push(p);
			}
			else{
				if(!commandProcessor.checkIsSamePoint(p, points[points.length - 1])){
					points.push(p);
				}
			}
		}
		newPartPolyline.points = points;
		if(points.length > 1){			
			newPartPolyline.points = points;
			allPartPolylineHash[newPartPolyline.name] = newPartPolyline;
		}
	},
	
	//查找线段是否和其他polyline有相交的地方，返回相交的点（可能存在一个线段被分割为多份
	getCrossPoints: function(pointA, pointB, allPolylines, pointBIsPolylineEnd, polylineIndex, partIndex){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"]
		let crossPoints = [];
		
		//找到交点
		for(let i = 0; i < allPolylines.length; i++){
			let polyline = allPolylines[i];
			for(let j = 1; j < polyline.points.length; j++){
				if(j == 192){
					var a = 1;
				}
				if(i == polylineIndex && Math.abs(j - partIndex) < 2){
					//polyline的某个线段和自身完全重合或收尾相接的线段，不允许切割自己或收尾相接的线段
				}
				else{
					var checkA = polyline.points[j - 1];
					var checkB = polyline.points[j];
					
					//判断是否与末尾相接
					if(commandProcessor.checkIsSamePoint(pointB, checkA) || commandProcessor.checkIsSamePoint(pointB, checkB)){
						if(pointBIsPolylineEnd){
							//本来就是结尾了，那就不做处理了						
						}
						else{
							//pointB是polyline中的某个点，不是端点，那么可以截断
							crossPoints.push(pointB);
						}
					}
					else{
						if(!js3CommonFunction.checkLine2DParallel(pointA, pointB, checkA, checkB)){
							let point = js3CommonFunction.getCrossPoint2DInSegment(pointA, pointB, checkA, checkB, commandProcessor.defaultValues.ignoreSize);
							if(point != null){
								if(!commandProcessor.checkIsSamePoint(point, pointA, true) //不与pointA重合
									&& (!commandProcessor.checkIsSamePoint(point, pointB) || !pointBIsPolylineEnd)){ //不与pointB重合或者不是pointB所在polyline的终点
									crossPoints.push(point);
								}
							}
						}
						else{
							//背检测的线段端点在当前线段内部
							if(js3CommonFunction.checkPoint2DInSegment(checkA, pointA, pointB, commandProcessor.defaultValues.ignoreSize) && !commandProcessor.checkIsSamePoint(checkA, pointA) && !commandProcessor.checkIsSamePoint(checkA, pointB)){
								crossPoints.push(checkA);
							}
							if(js3CommonFunction.checkPoint2DInSegment(checkB, pointA, pointB, commandProcessor.defaultValues.ignoreSize) && !commandProcessor.checkIsSamePoint(checkB, pointA) && !commandProcessor.checkIsSamePoint(checkB, pointB)){
								crossPoints.push(checkB);
							}
						}
					}
				}
			}
		}
		
		//按照交点和pointA的距离，进行排序
		let sortedCrossPoints = [];
		for(let i = 0; i < crossPoints.length; i++){
			let point = crossPoints[i];
			let distance = js3CommonFunction.getLine2DLength(pointA, point);

			let added = false;
			let tempCrossPoints = [];
			for(let j = 0; j < sortedCrossPoints.length; j++){
				let scPoint = sortedCrossPoints[j];
				if(Math.abs(scPoint.distance - distance) < commandProcessor.defaultValues.ignoreSize){
					//距离太近，不再重新计算这个点
				}
				else if(!added && distance < scPoint.distance){
					//距离pointA更近，那么把这个点排在前面
					tempCrossPoints.push({
						point: point,
						distance: distance
					});
					tempCrossPoints.push(scPoint);
					added = true;
				}
				else{
					tempCrossPoints.push(scPoint);
				}
			}
			if(!added){
				tempCrossPoints.push({
					point: point,
					distance: distance
				});
			}
			sortedCrossPoints = tempCrossPoints;
		}
		return sortedCrossPoints;
	},
	
	//判断是否为同一个点
	checkIsSamePoint: function(pA, pB, accurateMatch){
		let commandProcessor = js3CommandProcessors["generateGroundRegion"]
		if(accurateMatch){
			return pA.x == pB.x && pA.y == pB.y; 
		}
		else{
			if(Math.abs(pA.x - pB.x) < commandProcessor.defaultValues.ignoreSize
					&& Math.abs(pA.y - pB.y) < commandProcessor.defaultValues.ignoreSize){
					return true;
				}
				else{
					return false;
				}
		}
	}
};