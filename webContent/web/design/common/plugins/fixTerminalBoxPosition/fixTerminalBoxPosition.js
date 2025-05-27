import * as THREE from "three";

let FixTerminalBoxPositionForm = function(){
	var thatForm = this;

	this.editor = null;
	this.boxObject3DId = null;
	this.wallObject3DId = null;
	this.steelbarObject3DIds = null;
	
	this.currentSteelbarProcessInfo = null;
	
	this.paramWin = null;  
	
	this.containerId = null;

	this.getObject3D = function(unitId){
		return thatForm.editor.getObject3DByUnitId(unitId);
	}
	
	this.getMove3DVector = function(moveValue, steelbarObject3D, boxObject3D, wallObject3D){ 
		var lineEndPoints = thatForm.getSteelbarEndPoints(steelbarObject3D);
		var wallRotation = wallObject3D.rotation;
		var reverseWallRotation = new THREE.Euler(-wallRotation.x, -wallRotation.y, -wallRotation.z);
		var lineEndPoint2Ds = thatForm.convert3DTo2DPoints(lineEndPoints, reverseWallRotation);
		var lineY = lineEndPoint2Ds[1].y - lineEndPoint2Ds[0].y; 
		var lineX = lineEndPoint2Ds[1].x - lineEndPoint2Ds[0].x; 
		var lineLen = Math.sqrt(lineY * lineY + lineX * lineX);		
		var move2DVector = {x:- moveValue * lineY / lineLen, y: moveValue * lineX / lineLen}; 
		var move3DVector = thatForm.convert2DTo3DPoint(move2DVector, wallRotation);
		return move3DVector;		
	}
	 
	
	//获取线盒的顶点和钢筋的距离，垂线交叉点等信息
	this.getBoxPointsToLineInfos = function(steelbarObject3DId, boxObject3DId, wallObject3DId){
		var steelbarObject3D = thatForm.getObject3D(steelbarObject3DId);		
		var wallObject3D = thatForm.getObject3D(wallObject3DId);
		var boxObject3D = thatForm.getObject3D(boxObject3DId);
		
		var lineEndPoints = thatForm.getSteelbarEndPoints(steelbarObject3D);
		var boxPoints = thatForm.getBoxPoints(boxObject3D);
		
		//墙的旋转角度
		var wallRotation = wallObject3D.rotation;
		var reverseWallRotation = new THREE.Euler(-wallRotation.x, -wallRotation.y, -wallRotation.z);
		
		//计算钢筋、线盒在墙上的投影坐标，投影后的三维y为二维y，三维x为二维x
		var lineEndPoint2Ds = thatForm.convert3DTo2DPoints(lineEndPoints, reverseWallRotation);
		var boxPoint2Ds = thatForm.convert3DTo2DPoints(boxPoints, reverseWallRotation);
				
		//box上每个点（包含中心点）向line发射垂直的射线，算出来交叉点，以及在线的左侧还是右侧，计算出来需要躲避的距离
		var boxPointToLineInfos = new Array();
		var boxCenterPointToLineInfo = {
			point: thatForm.getCenterPoint2D(boxPoint2Ds)
		};				
		boxPointToLineInfos.push(boxCenterPointToLineInfo);
		for(var i = 0; i < boxPoint2Ds.length; i++){
			boxPointToLineInfos.push({
				point: boxPoint2Ds[i]
			});
		}
		for(var i = 0; i < boxPointToLineInfos.length; i++){
			var boxPointToLineInfo = boxPointToLineInfos[i];
			var point = boxPointToLineInfo.point;
			boxPointToLineInfo.crossPoint = thatForm.getCrossPointByPoint2Line(point, lineEndPoint2Ds[0], lineEndPoint2Ds[1]);
			boxPointToLineInfo.distance = thatForm.getDistanceByPoint2Line(point, lineEndPoint2Ds[0], lineEndPoint2Ds[1]);
			boxPointToLineInfo.direction = thatForm.getDirectionByPoint2Line(point, lineEndPoint2Ds[0], lineEndPoint2Ds[1]);			
		} 
		return boxPointToLineInfos;		
	}
	
	this.getCenterPoint2D = function(point2Ds){
		var minMaxValues = {minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxX: -Number.MAX_VALUE, maxY: -Number.MAX_VALUE};
		for(var i = 0; i < point2Ds.length; i++){
			var point = point2Ds[i];
			if(point.x > minMaxValues.maxX){
				minMaxValues.maxX = point.x;
			}
			if(point.x < minMaxValues.minX){
				minMaxValues.minX = point.x;
			}
			if(point.y > minMaxValues.maxY){
				minMaxValues.maxY = point.y;
			}
			if(point.y < minMaxValues.minY){
				minMaxValues.minY = point.y;
			}
		}
		return {
			x: (minMaxValues.minX + minMaxValues.maxX) / 2,
			y: (minMaxValues.minY + minMaxValues.maxY) / 2
		};
	}
	
	//计算点到线的垂线的交点坐标
	this.getCrossPointByPoint2Line = function(point, pointA, pointB){

	    var crossPoint = {x: 0, y: 0};
	  
	    //如果p1.x==p2.x 说明是条竖着的线
	    if(pointA.x - pointB.x==0) {
	    	crossPoint.x = pointA.x;
	    	crossPoint.y = point.y;
	    }
	    else {
	        var a = (pointA.y - pointB.y)/(pointA.x - pointB.x);
	        var b = pointA.y - a * pointA.x;
	        var m = point.x + a * point.y;
	  
	        crossPoint.x = (m - a * b) / ( a * a + 1);
	        crossPoint.y = a * crossPoint.x + b;
	    }
	      
	    return crossPoint;
	}
	
	//计算点到线的垂直距离
	this.getDistanceByPoint2Line = function(point, pointA, pointB) {
	    var len;
	  
	    //如果p1.x==p2.x 说明是条竖着的线
	    if(pointA.x - pointB.x == 0) {
	        len = Math.abs(point.x - pointA.x);
	    }
	    else {
	        var a = (pointA.y - pointB.y) / (pointA.x - pointB.x);
	        var b = pointA.y - a * pointA.x;	          
	        len = Math.abs((a * point.x + b - point.y) / Math.sqrt( a * a + 1));
	    }
	      
	    return len
	}
	
	//判断点在线的哪一侧
	this.getDirectionByPoint2Line = function(point, pointA, pointB){ 
		//key > 0 在左侧,key = 0 在线上,key < 0 在右侧
		var key = (pointA.y - pointB.y) * point.x + (pointB.x - pointA.x) * point.y + pointA.x * pointB.y - pointB.x * pointA.y; 
		return key;
	}

	
	//3D转2D坐标，投影后的三维y为二维y，三维x为二维x
	this.convert3DTo2DPoints = function(points, rotation){
		var point2Ds = new Array();
		for(var i = 0; i < points.length; i++){
			var point = points[i]; 
			var p = thatForm.convert3DTo2DPoint(point, rotation);
			point2Ds.push(p);
		}
		return point2Ds;
	}
	
	//3D转2D坐标，投影后的三维y为二维y，三维x为二维x
	this.convert3DTo2DPoint = function(point, rotation){
		var vector = new THREE.Vector3(point.x, point.y, point.z);
		var p =  vector.applyEuler(rotation);
		return {
			x: p.x,
			y: p.y
		};
	} 
	
	//2D转3D坐标，投影后的二维y为三维y，二维x为三维x，0为三维z然后旋转
	this.convert2DTo3DPoint = function(point, rotation){
		var vector = new THREE.Vector3(point.x, point.y, 0);
		var p =  vector.applyEuler(rotation);
		return {
			x: p.x,
			y: p.y,
			z: p.z
		};
	}
		
	//获取两点的距离
	this.getPointsDistance = function(pointA, pointB){
		return Math.sqrt((pointA.x - pointB.x) * (pointA.x - pointB.x) + (pointA.y - pointB.y) * (pointA.y - pointB.y) + (pointA.z - pointB.z) * (pointA.z - pointB.z));
	}
		
	//获取两个点中间的点，给出距离A点的距离
	this.getPointBetweenPoints = function(pointA, pointB, length2PointA){
		var len = Math.sqrt((pointA.x - pointB.x) * (pointA.x - pointB.x) + (pointA.y - pointB.y) * (pointA.y - pointB.y) + (pointA.z - pointB.z) * (pointA.z - pointB.z));
		return {
			x: pointA.x + (pointB.x - pointA.x) * length2PointA / len,
			y: pointA.y + (pointB.y - pointA.y) * length2PointA / len,
			z: pointA.z + (pointB.z - pointA.z) * length2PointA / len
		};
	}
	
	this.checkHit = function(boxObject3D, steelbarObject3D){
    	var hitDetection = new HitDetection();
    	var hitSteelbarObject3Ds = hitDetection.processHitDetection({
    		fixNum: 4,
        	mainObject3D: boxObject3D,
        	object3Ds: [steelbarObject3D]
    	});
    	return hitSteelbarObject3Ds.length > 0;
	}
	
	this.selectSteelbarItem = function(steelbarId){
		$("#" + thatForm.containerId).find(".steelbarListContainer .steelbarItem").removeClass("steelbarItemActive");
		$("#" + thatForm.containerId).find(".steelbarListContainer .steelbarItem[steelbarId='" + steelbarId + "']").addClass("steelbarItemActive");
 
		var steelbarObject3D = thatForm.getObject3D(steelbarId);
		
		var boxPointToLineInfos = thatForm.getBoxPointsToLineInfos(steelbarId, thatForm.boxObject3DId, thatForm.wallObject3DId);

		var steelbarRadius = js3CommonFunction.mm2m(steelbarObject3D.unitData.parameters["半径"].value);
		var direction = boxPointToLineInfos[0].direction;
		var moveDistance = 0;
		if(direction > 0){
			//线盒中心点在钢筋的右侧（钢筋坐标小）
			for(var i = 1; i < boxPointToLineInfos.length; i++){
				var boxPointToLineInfo = boxPointToLineInfos[i];
				if(boxPointToLineInfo.direction <= 0){
					if(boxPointToLineInfo.distance + steelbarRadius > moveDistance){
						moveDistance = boxPointToLineInfo.distance + steelbarRadius;
					}
				} 
			}
		}
		else{
			//线盒中心点在钢筋的左侧（钢筋坐标大）
			for(var i = 1; i < boxPointToLineInfos.length; i++){
				var boxPointToLineInfo = boxPointToLineInfos[i];
				if(boxPointToLineInfo.direction >= 0){
					if(boxPointToLineInfo.distance + steelbarRadius > moveDistance){
						moveDistance = boxPointToLineInfo.distance + steelbarRadius;
					}
				} 
			}			
		}
		var boxObject3D = thatForm.getObject3D(thatForm.boxObject3DId);
		var needFix = thatForm.editor.checkHit(boxObject3D, steelbarObject3D);

		if(!needFix){
			msgBox.alert({info: "此钢筋与线盒已不存在碰撞, 无需处理."});
			moveDistance = 0;
		}
		else{
			moveDistance = Math.ceil(js3CommonFunction.m2mm(moveDistance));
		}
		thatForm.currentSteelbarProcessInfo = {
			distanceInfos: boxPointToLineInfos,
			steelbarObject3DId: steelbarId,
			direction: direction,
			moveDistance: moveDistance,
			needFix: needFix
		};  
		thatForm.paramWin.doCtrlMethodByParamName("bendsteelbardistance", "setValue", direction > 0 ? -moveDistance : moveDistance);
		thatForm.paramWin.doCtrlMethodByParamName("movesteelbardistance", "setValue", direction > 0 ? -moveDistance : moveDistance);
		thatForm.paramWin.doCtrlMethodByParamName("moveboxdistance", "setValue", direction > 0 ? moveDistance : -moveDistance);
		
		thatForm.editor.selectUnitObject(steelbarObject3D);
	}
	 
	
	
	this.initSteelbarList = function(){
		var html = "";
		for(var i = 0; i < thatForm.steelbarObject3DIds.length; i++){
			var steelbarObject3D = thatForm.getObject3D(thatForm.steelbarObject3DIds[i]);
			html += ("<div class=\"steelbarItem" + (i == 0 ? "" : " steelbarItemWithSplit") + "\" steelbarId=\"" + steelbarObject3D.unitData.id + "\">" + cmnPcr.html_encode(steelbarObject3D.unitData.name) + "</div>");
		}
		$("#" + thatForm.containerId).find(".steelbarListContainer").html(html);
		$("#" + thatForm.containerId).find(".steelbarListContainer .steelbarItem").click(function(){
			var steelbarId = $(this).attr("steelbarId");
			thatForm.selectSteelbarItem(steelbarId);
		});
		
		thatForm.selectSteelbarItem(thatForm.steelbarObject3DIds[0]);
	}
	
	this.init = function(p){
		thatForm.containerId = p.containerId;  
		thatForm.editor = p.editor;
		thatForm.boxObject3DId = p.boxObject3DId;
		thatForm.wallObject3DId = p.wallObject3DId;
		thatForm.steelbarObject3DIds = p.steelbarObject3DIds;
		 
		var formUIParameters = thatForm.getFormUIParameters(p.parameters); 
		var paramWin = new NcpParamWin({
			containerId: p.containerId,
			paramWinModel: formUIParameters
		});
		paramWin.addExternalObject({
			beforeDoList: function(param){
				param.rows = param.paramModel.list.rows; 
				paramWin.processListData(param);
				paramWin.afterBaseList(param);
				paramWin.afterDoList(param);
			},
			onUnitValueChange: function(param){
				var jq = param.jq;
				switch($(jq).attr("name")){
					case "fixtypetitle":{
						var fixTypeName = param.newValue.name;
						thatForm.paramWin.doCtrlMethodByParamName("fixtypename", "setValue", param.newValue == null ? "" : fixTypeName);
						$("#" + thatForm.containerId).find(".steelbarSettingContainer").css({display: "none"});
						$("#" + thatForm.containerId).find(".steelbarSettingContainer[name='" + fixTypeName + "']").css({display: "table-row"});						
						break;
					}
				}
			}
		});
		paramWin.show(); 
		thatForm.paramWin = paramWin;
		
		thatForm.initSteelbarList(); 
		
		$("#" + thatForm.containerId).find(".zlpDispUnitButton[name='fixBtn']").click(function(){
			var parameters = thatForm.getParameters();
			var fixTypeName = parameters.fixtypename;
			switch(fixTypeName){
				case "bendSteelbar":{
					if(parameters.bendsteelbardistance == null){
						msgBox.alert({info: "请输入钢筋弯曲距离"});
					}
					else{
						var bendType = parameters.bendtypename;
						thatForm.bendSteelbar(parameters.bendsteelbardistance, bendType);
					}
					break;
				}
				case "moveSteelbar":{
					if(parameters.movesteelbardistance == null){
						msgBox.alert({info: "请输入钢筋移动距离"});
					}
					else{
						thatForm.moveSteelbar(parameters.movesteelbardistance);
					}
					break;
				}
				case "moveBox":{
					if(parameters.moveboxdistance == null){
						msgBox.alert({info: "请输入线盒移动距离"});
					}
					else{
						thatForm.moveBox(parameters.moveboxdistance);
					}
					break;
				}
			}
		});
	} 
	
	this.bendTypePartsDic = {
		"inclineBend": [0, 0.06, 0.24, 0.3],
		"straightBend": [0.04, 0.05, 0.05, 0.06]	
	};
	
	this.bendSteelbar = function(value, bendType){
		//要根据平移的距离和钢筋在平面上的斜率，计算出来平面的x、y方向的移动距离，
		//再根据墙的旋转，推算出来，在x、y、z方向的移动距离，然后再执行移动
		//按照这个算法，让线盒每个顶点与钢筋垂线的crossPoint位置都平移一下，这样让让钢筋弯曲
		var steelbarObject3D = thatForm.getObject3D(thatForm.currentSteelbarProcessInfo.steelbarObject3DId);		
		var wallObject3D = thatForm.getObject3D(thatForm.wallObject3DId);
		var boxObject3D = thatForm.getObject3D(thatForm.boxObject3DId);
		
		var wallRotation = wallObject3D.rotation;
		var reverseWallRotation = new THREE.Euler(-wallRotation.x, -wallRotation.y, -wallRotation.z); 
		
		var lineEndPoints = thatForm.getSteelbarEndPoints(steelbarObject3D); 
		var lineEndPoint2Ds = thatForm.convert3DTo2DPoints(lineEndPoints, reverseWallRotation);
		var lineLen3D = thatForm.getPointsDistance(lineEndPoints[0], lineEndPoints[1]);
		
		var move3DVector = thatForm.getMove3DVector(value, steelbarObject3D, boxObject3D, wallObject3D);

		var lineStartNearestPoint = null;
		var lineEndNearestPoint = null;
		var minCrossPoint2LineStartLen = Number.MAX_VALUE;
		var minCrossPoint2LineEndLen = Number.MAX_VALUE;
		var lineLen2D = Math.sqrt((lineEndPoint2Ds[1].x - lineEndPoint2Ds[0].x) * (lineEndPoint2Ds[1].x - lineEndPoint2Ds[0].x) + (lineEndPoint2Ds[1].y - lineEndPoint2Ds[0].y) * (lineEndPoint2Ds[1].y - lineEndPoint2Ds[0].y));
		for(var i = 1; i < thatForm.currentSteelbarProcessInfo.distanceInfos.length; i++){
			var distanceInfo = thatForm.currentSteelbarProcessInfo.distanceInfos[i]; 
			var cross2BeginLen2D = Math.sqrt((distanceInfo.crossPoint.x - lineEndPoint2Ds[0].x) * (distanceInfo.crossPoint.x - lineEndPoint2Ds[0].x) + (distanceInfo.crossPoint.y - lineEndPoint2Ds[0].y) * (distanceInfo.crossPoint.y - lineEndPoint2Ds[0].y));
			var crossPoint3D = thatForm.getPointBetweenPoints(lineEndPoints[0], lineEndPoints[1], cross2BeginLen2D * lineLen3D / lineLen2D);
			
			var crossPoint2LineStartLen = thatForm.getPointsDistance(crossPoint3D, lineEndPoints[0]);
			if(crossPoint2LineStartLen < minCrossPoint2LineStartLen){
				minCrossPoint2LineStartLen = crossPoint2LineStartLen;
				lineStartNearestPoint = crossPoint3D;
			}
			
			var crossPoint2LineEndLen = thatForm.getPointsDistance(crossPoint3D, lineEndPoints[1]);
			if(crossPoint2LineEndLen < minCrossPoint2LineEndLen){
				minCrossPoint2LineEndLen = crossPoint2LineEndLen;
				lineEndNearestPoint = crossPoint3D;
			}			
		}
		
		var bendTypeParts = thatForm.bendTypePartsDic[bendType];
		var bendStartPartAPoint = thatForm.getPointBetweenPoints(lineStartNearestPoint, lineEndPoints[0], bendTypeParts[0]);
		var bendStartPartBPoint = thatForm.getPointBetweenPoints(lineStartNearestPoint, lineEndPoints[0], bendTypeParts[1]);
		var bendStartPartCPoint = thatForm.getPointBetweenPoints(lineStartNearestPoint, lineEndPoints[0], bendTypeParts[2]);
		var bendStartPartDPoint = thatForm.getPointBetweenPoints(lineStartNearestPoint, lineEndPoints[0], bendTypeParts[3]);
		var bendEndPartAPoint = thatForm.getPointBetweenPoints(lineEndNearestPoint, lineEndPoints[1], bendTypeParts[0]);
		var bendEndPartBPoint = thatForm.getPointBetweenPoints(lineEndNearestPoint, lineEndPoints[1], bendTypeParts[1]);
		var bendEndPartCPoint = thatForm.getPointBetweenPoints(lineEndNearestPoint, lineEndPoints[1], bendTypeParts[2]);
		var bendEndPartDPoint = thatForm.getPointBetweenPoints(lineEndNearestPoint, lineEndPoints[1], bendTypeParts[3]);
		bendStartPartAPoint = {
				x: bendStartPartAPoint.x +  + js3CommonFunction.mm2m(move3DVector.x),
				y: bendStartPartAPoint.y +  + js3CommonFunction.mm2m(move3DVector.y),
				z: bendStartPartAPoint.z +  + js3CommonFunction.mm2m(move3DVector.z),
			};
		bendStartPartBPoint = {
				x: bendStartPartBPoint.x +  + js3CommonFunction.mm2m(move3DVector.x),
				y: bendStartPartBPoint.y +  + js3CommonFunction.mm2m(move3DVector.y),
				z: bendStartPartBPoint.z +  + js3CommonFunction.mm2m(move3DVector.z),
			};
		bendEndPartAPoint = {
				x: bendEndPartAPoint.x +  + js3CommonFunction.mm2m(move3DVector.x),
				y: bendEndPartAPoint.y +  + js3CommonFunction.mm2m(move3DVector.y),
				z: bendEndPartAPoint.z +  + js3CommonFunction.mm2m(move3DVector.z),
			};
		bendEndPartBPoint = {
				x: bendEndPartBPoint.x +  + js3CommonFunction.mm2m(move3DVector.x),
				y: bendEndPartBPoint.y +  + js3CommonFunction.mm2m(move3DVector.y),
				z: bendEndPartBPoint.z +  + js3CommonFunction.mm2m(move3DVector.z),
			};
		var pointPath = "";
		pointPath += (js3CommonFunction.m2mm(lineEndPoints[0].x) + "," + js3CommonFunction.m2mm(lineEndPoints[0].y) + "," + js3CommonFunction.m2mm(lineEndPoints[0].z) + ";");
		pointPath += (js3CommonFunction.m2mm(bendStartPartDPoint.x) + "," + js3CommonFunction.m2mm(bendStartPartDPoint.y) + "," + js3CommonFunction.m2mm(bendStartPartDPoint.z) + ";");
		pointPath += (js3CommonFunction.m2mm(bendStartPartCPoint.x) + "," + js3CommonFunction.m2mm(bendStartPartCPoint.y) + "," + js3CommonFunction.m2mm(bendStartPartCPoint.z) + ";");
		pointPath += (js3CommonFunction.m2mm(bendStartPartBPoint.x) + "," + js3CommonFunction.m2mm(bendStartPartBPoint.y) + "," + js3CommonFunction.m2mm(bendStartPartBPoint.z) + ";");
		pointPath += (js3CommonFunction.m2mm(bendStartPartAPoint.x) + "," + js3CommonFunction.m2mm(bendStartPartAPoint.y) + "," + js3CommonFunction.m2mm(bendStartPartAPoint.z) + ";");
		pointPath += (js3CommonFunction.m2mm(bendEndPartAPoint.x) + "," + js3CommonFunction.m2mm(bendEndPartAPoint.y) + "," + js3CommonFunction.m2mm(bendEndPartAPoint.z) + ";");
		pointPath += (js3CommonFunction.m2mm(bendEndPartBPoint.x) + "," + js3CommonFunction.m2mm(bendEndPartBPoint.y) + "," + js3CommonFunction.m2mm(bendEndPartBPoint.z) + ";");
		pointPath += (js3CommonFunction.m2mm(bendEndPartCPoint.x) + "," + js3CommonFunction.m2mm(bendEndPartCPoint.y) + "," + js3CommonFunction.m2mm(bendEndPartCPoint.z) + ";");
		pointPath += (js3CommonFunction.m2mm(bendEndPartDPoint.x) + "," + js3CommonFunction.m2mm(bendEndPartDPoint.y) + "," + js3CommonFunction.m2mm(bendEndPartDPoint.z) + ";");
		pointPath += (js3CommonFunction.m2mm(lineEndPoints[1].x) + "," + js3CommonFunction.m2mm(lineEndPoints[1].y) + "," + js3CommonFunction.m2mm(lineEndPoints[1].z));
		 
		steelbarObject3D.unitData.parameters["是否弯曲"].value = "是";
		steelbarObject3D.unitData.parameters["路径"].value = pointPath;
		if(!steelbarObject3D.unitData.useWorldPosition){ 
			thatForm.editor.changeUseWorldPosition(steelbarObject3D, true);
		}

	    thatForm.editor.rebuildUnitObject3Ds([steelbarObject3D]);
	}
	
	this.moveSteelbar = function(value){ 
		//要根据平移的距离和钢筋在平面上的斜率，计算出来平面的x、y方向的移动距离，
		//再根据墙的旋转，推算出来，在x、y、z方向的移动距离，然后再执行移动
		var steelbarObject3D = thatForm.getObject3D(thatForm.currentSteelbarProcessInfo.steelbarObject3DId);		
		var wallObject3D = thatForm.getObject3D(thatForm.wallObject3DId);
		var boxObject3D = thatForm.getObject3D(thatForm.boxObject3DId);
		
		var move3DVector = thatForm.getMove3DVector(value, steelbarObject3D, boxObject3D, wallObject3D); 

		steelbarObject3D.unitData.positionExps = {};
		steelbarObject3D.unitData.position = [
		  steelbarObject3D.unitData.position[0] + js3CommonFunction.mm2m(move3DVector.x), 
		  steelbarObject3D.unitData.position[1] + js3CommonFunction.mm2m(move3DVector.y), 
		  steelbarObject3D.unitData.position[2] + js3CommonFunction.mm2m(move3DVector.z)]; 
		steelbarObject3D.position.set(steelbarObject3D.unitData.position[0], steelbarObject3D.unitData.position[1], steelbarObject3D.unitData.position[2]); 
		steelbarObject3D.unitData.parameters["是否弯曲"].value = "否";
		steelbarObject3D.unitData.parameters["路径"].value = "";
		if(steelbarObject3D.unitData.useWorldPosition){ 
			thatForm.editor.changeUseWorldPosition(steelbarObject3D, false);
		}

	    thatForm.editor.rebuildUnitObject3Ds([steelbarObject3D]); 
	}
	 
	this.moveBox = function(value){
		//要根据平移的距离和钢筋在平面上的斜率，计算出来平面的x、y方向的移动距离，
		//再根据墙的旋转，推算出来，在x、y、z方向的移动距离，然后再执行移动
		var steelbarObject3D = thatForm.getObject3D(thatForm.currentSteelbarProcessInfo.steelbarObject3DId);		
		var wallObject3D = thatForm.getObject3D(thatForm.wallObject3DId);
		var boxObject3D = thatForm.getObject3D(thatForm.boxObject3DId);
		var move3DVector = thatForm.getMove3DVector(value, steelbarObject3D, boxObject3D, wallObject3D); 
 
		boxObject3D.unitData.positionExps = {};
		boxObject3D.unitData.position = [
		  boxObject3D.unitData.position[0] + js3CommonFunction.mm2m(move3DVector.x), 
		  boxObject3D.unitData.position[1] + js3CommonFunction.mm2m(move3DVector.y), 
		  boxObject3D.unitData.position[2] + js3CommonFunction.mm2m(move3DVector.z)]; 
		boxObject3D.position.set(boxObject3D.unitData.position[0], boxObject3D.unitData.position[1], boxObject3D.unitData.position[2]); 
		if(boxObject3D.unitData.useWorldPosition){ 
			thatForm.editor.changeUseWorldPosition(boxObject3D, false);
		}

	    thatForm.editor.rebuildUnitObject3Ds([boxObject3D]); 
	}
	
	this.getParameters = function(){
		var result = thatForm.paramWin.getParamResult();
		if(result.verified){ 
			return result.values;
		}
		else{
			msgBox.alert({info: result.error});
			return null;
		}
	} 
	
	this.getBoxPoints = function(boxObject3D){
        var box = new THREE.Box3().setFromObject(boxObject3D, true);
        var boxPoints = [{
        	x: box.min.x,
        	y: box.min.y,
        	z: box.min.z
        },{
        	x: box.min.x,
        	y: box.min.y,
        	z: box.max.z
        },{
        	x: box.min.x,
        	y: box.max.y,
        	z: box.min.z
        },{
        	x: box.min.x,
        	y: box.max.y,
        	z: box.max.z
        },{
        	x: box.max.x,
        	y: box.min.y,
        	z: box.min.z
        },{
        	x: box.max.x,
        	y: box.min.y,
        	z: box.max.z
        },{
        	x: box.max.x,
        	y: box.max.y,
        	z: box.min.z
        },{
        	x: box.max.x,
        	y: box.max.y,
        	z: box.max.z
        }];
        return boxPoints;
	}
	
	this.getSteelbarEndPoints = function(steelbarObject3D){
		var position = steelbarObject3D.unitData.position;
		var rotation = steelbarObject3D.unitData.rotation; 
		var directLength = js3CommonFunction.mm2m(steelbarObject3D.unitData.parameters["直线距离"].value);
		var halfLength = directLength / 2;
		var beginVector = new THREE.Vector3(0, halfLength,0);
		var euler = new THREE.Euler(rotation[0], rotation[1], rotation[2]);
		beginVector.applyEuler(euler);
		var endVector = new THREE.Vector3(0, -halfLength,0);
		endVector.applyEuler(euler);
		return [{
			x: beginVector.x + position[0],
			y: beginVector.y + position[1],
			z: beginVector.z + position[2]
		},
		{
			x: endVector.x + position[0],
			y: endVector.y + position[1],
			z: endVector.z + position[2]
		}];
	}
	  
	this.getFormUIParameters = function(parameters){		
		var uiParameters = {
			id: 0,
			name: "",
			units:{
			    "fixtypename":{
			    	id:1,
			    	name:"fixtypename",
			    	label:"处理方式",
			    	valueType:valueType.string, 
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
			    	unitType:"text",
			    	maps:null,
			    	list:null,		    	
					defaultValue: "bendSteelbar",
					isEditable: false
			    }, 
			    "fixtypetitle":{
			    	id:2,
			    	name:"fixtypetitle",
			    	label:"处理方式",
			    	valueType:valueType.string, 
					inputHelpType:"list",
					inputHelpName:"fixtype",
					decimalNum:"0",
					valueLength:40,
					isMultiValue:false,
					isNullable:false,
			    	unitType:"list",
			    	maps:{"fixtypetitle": "title", "fixtypename": "name"},
			    	list:{
			    		name:"fixtype",
			    		columns:[
		    		         {field:"name", valueType: valueType.string, title:"name", width:100, hidden:true},
		    		         {field:"title", valueType: valueType.string, title:"处理方式", width:100, hidden:false}
			    		], 
			    		rows: [
				    	    {name: "bendSteelbar", title: "折弯钢筋"},
				    	    {name: "moveSteelbar", title: "移动钢筋"},
				    	    {name: "moveBox", title: "移动线盒"}
			    	    ]
			    	},		    	
					defaultValue: "折弯钢筋",
					isEditable: true
			    }, 
			    "bendsteelbardistance":{
			    	id:3,
			    	name:"bendsteelbardistance",
			    	label:"弯曲距离",
					valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:true,
			    	unitType:"decimal",
			    	maps:null,
			    	list:null,		    	
					defaultValue: "0",
					isEditable: true
			    }, 
			    "movesteelbardistance":{
			    	id:4,
			    	name:"movesteelbardistance",
			    	label:"移动距离",
					valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:true,
			    	unitType:"decimal",
			    	maps:null,
			    	list:null,		    	
					defaultValue: "0",
					isEditable: true
			    }, 
			    "moveboxdistance":{
			    	id:5,
			    	name:"moveboxdistance",
			    	label:"移动距离",
					valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:true,
			    	unitType:"decimal",
			    	maps:null,
			    	list:null,		    	
					defaultValue: "0",
					isEditable: true
			    },
			    "bendtypename":{
			    	id:6,
			    	name:"bendtypename",
			    	label:"弯曲方式",
			    	valueType:valueType.string, 
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
			    	unitType:"text",
			    	maps:null,
			    	list:null,		    	
					defaultValue: "inclineBend",
					isEditable: false
			    }, 
			    "bendtypetitle":{
			    	id:7,
			    	name:"bendtypetitle",
			    	label:"弯曲方式",
			    	valueType:valueType.string, 
					inputHelpType:"list",
					inputHelpName:"bendtype",
					decimalNum:"0",
					valueLength:40,
					isMultiValue:false,
					isNullable:false,
			    	unitType:"list",
			    	maps:{"bendtypetitle": "title", "bendtypename": "name"},
			    	list:{
			    		name:"bendtype",
			    		columns:[
		    		         {field:"name", valueType: valueType.string, title:"name", width:100, hidden:true},
		    		         {field:"title", valueType: valueType.string, title:"处理方式", width:100, hidden:false}
			    		], 
			    		rows: [
				    	    {name: "inclineBend", title: "斜弯"},
				    	    {name: "straightBend", title: "直弯"} 
			    	    ]
			    	},		    	
					defaultValue: "斜弯",
					isEditable: true
			    }, 
			}
		}	 
		return uiParameters;
	};
}
export default FixTerminalBoxPositionForm