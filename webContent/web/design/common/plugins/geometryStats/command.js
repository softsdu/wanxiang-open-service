import * as THREE from "three";

//几何统计 added by ls 20230529
js3CommandProcessors["geometryStats"] = {
	toStatus: "normal",	
	icon: "/images/geometryStats.png",
	maxShowCount: 50,
	run: function(p){ 
		var info = p.commandJson.getSceneStatisticInfo(p);
		
		//前几个面数最多的构件
		var showCount = p.commandJson.maxShowCount > info.allObjectsFaceCount.length ? info.allObjectsFaceCount.length: p.commandJson.maxShowCount;
		var objFaceCountListStr = "● 单构件 (按面数排序" + (showCount == p.commandJson.maxShowCount ? ("前" + showCount) : "") + ")\r\n";
		for(let i = 0; i < showCount; i++){
			let faceCoutObj = info.allObjectsFaceCount[i];
			objFaceCountListStr += ("  " + (i + 1) + ". " + faceCoutObj.name + ": " + faceCoutObj.faceCount + "\r\n");
		}
		var totalInfoStr = "● 合计信息\r\n"  
			+ "  构件数: " + info.objectCount + "\r\n"  
			+ "  网格数: " + info.meshCount + "\r\n"  
			+ "  三角面数: " + info.faceCount + "\r\n";
		msgBox.alert({
			info: totalInfoStr + objFaceCountListStr,
			maxHeight: 400
		});
	},	
	//获取scene信息（统计用） added by ls 20230529
	getSceneStatisticInfo: function(p){
		var info = {
			objectCount: 0,
			meshCount: 0, 
			faceCount: 0,
			allObjectsFaceCount: {}
		};
	    var mainScene = p.editor.getMainScene();
	    var allObject3Ds = [];
		for(var i = 0; i < mainScene.children.length; i++){
			var childObj = mainScene.children[i];
			if(childObj.isUnitObject){
				info.objectCount++;
				info.allObjectsFaceCount[childObj.unitData.name] = 0;
				p.commandJson.getObject3DStatisticInfo(p, childObj, childObj.unitData.name, info);
			}
		}
		var sortedObjectsFaceCount = [];
		for(var objectName in info.allObjectsFaceCount){
			var objectFaceCount = info.allObjectsFaceCount[objectName];
			var tempObjectsFaceCount = [];
			var added = false;
			for(var i = 0; i < sortedObjectsFaceCount.length; i++){
				var tempCountObj = sortedObjectsFaceCount[i];
				if(!added && tempCountObj.faceCount < objectFaceCount){
					added = true;
					tempObjectsFaceCount.push({
						name: objectName,
						faceCount: objectFaceCount
					});
				}
				tempObjectsFaceCount.push(tempCountObj);
			}
			if(!added){
				tempObjectsFaceCount.push({
					name: objectName,
					faceCount: objectFaceCount
				});
			}
			sortedObjectsFaceCount = tempObjectsFaceCount;
		}
		info.allObjectsFaceCount = sortedObjectsFaceCount;		
		return info;
	},
	
	//获取threejs对象信息（统计用） added by ls 20230529
	getObject3DStatisticInfo: function(p, object, objectName, info) {
		// only count in Mesh and Line
		if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
			info.meshCount++;
			if (object.geometry != null) {
				var geom = object.geometry;
				if (geom.index != null) {
					let geofaceCount = geom.index.array.length / 3;
					info.faceCount += geofaceCount;
					info.allObjectsFaceCount[objectName] = info.allObjectsFaceCount[objectName] + geofaceCount;
				}
			}
		}
		else if(object instanceof THREE.Object3D){
			for(var i = 0; i < object.children.length; i++){
				var childObj = object.children[i];
				p.commandJson.getObject3DStatisticInfo(p, childObj, objectName, info);
			}
		}
	}
};