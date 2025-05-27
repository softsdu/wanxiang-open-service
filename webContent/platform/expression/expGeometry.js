//几何
var expGeometry = { 
	//直角三角形
	rightTriangle: function(param1, param2){ 
		return "0,0;" + param1 + ",0;0," + param2; 
	},
	//等腰三角形	
	isoscelesTriangle: function(param1, param2){
		return "0,0;" + param2 + ",0;" + (param2 / 2) + "," + param1;
	},
	
	//获取X坐标值 added by ls 20220606
	getX: function(location){
		var values = expGeometry.getXYZ(location);
		return values[0];
	},
	//获取Y坐标值 added by ls 20220606
	getY: function(location){
		var values = expGeometry.getXYZ(location);
		return values[1];
	},
	//获取Z坐标值 added by ls 20220606
	getZ: function(location){
		var values = expGeometry.getXYZ(location);
		return values[2];
	},
	//获取坐标值数值 added by ls 20220606
	getXYZ: function(location){
		var values = new Array();
		values[0] = 0;
		values[1] = 0;
		values[2] = 0;
		if(location != null && location.trim().length != 0){ 
			var parts = location.trim().split(","); 
			for(var i = 0; i < parts.length; i++){
				var part = parts[i].trim();
				if(!cmnPcr.isDecimal(part)){
					values[i] = 0;
				}
				else{
					values[i] = cmnPcr.strToDecimal(part);
				}
			} 
		}
		return values;
	},	
	
	//线段长度 added by ls 20230615
	getLineLength: function(pointAStr, pointBStr){
		var pointA = expGeometry.getXYZ(pointAStr);
		var pointB = expGeometry.getXYZ(pointBStr);
		return Math.sqrt((pointA[0] - pointB[0]) * (pointA[0] - pointB[0]) + (pointA[1] - pointB[1]) * (pointA[1] - pointB[1]) + (pointA[2] - pointB[2]) * (pointA[2] - pointB[2]));
	}, 
	
	//获取点坐标 added by ls 20230613
	getXYZs: function(location){
		var locs = location.trim().split(";"); 
		var points = [];
		for(var i = 0; i < locs.length; i++){
			points.push(expGeometry.getXYZ(locs[i]));
		}
		return points;
	},
	getPointArray: function(locs, index){
		if(index >= locs.length){
			throw new Error("仅包含" + locs.length + "个点, 超出范围.");
		}
		else{
			var points = [];
			for(var i = 0; i < locs.length; i++){
				points.push(expGeometry.getXYZ(locs[i]));
			}
			return points[index];
		}
	},
	getPoint: function(location, index){
		var locs = location.trim().split(";"); 
		var point = expGeometry.getPointArray(locs, index.intValue());
		return point[0] + "," + point[1] + "," + point[2]; 
	},
	getFirstPoint: function(location){
		 var locs = location.trim().split(";"); 
		 var point = expGeometry.getPointArray(locs, 0);
		 return point[0] + "," + point[1] + "," + point[2]; 
	},
	getLastPoint: function(location){
		 var locs = location.trim().split(";"); 
		 var point = expGeometry.getPointArray(locs, locs.length - 1);
		 return point[0] + "," + point[1] + "," + point[2]; 
	}
}