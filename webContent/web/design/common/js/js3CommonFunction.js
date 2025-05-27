let js3CommonFunction = {
    mm2m: function(mm){
    	return mm / 1000;
    },
    m2mm: function(m){
    	return m * 1000;
    },
	cloneObject3D: function(object3D){
		var newObject3D = object3D.clone();
		if(newObject3D.children != null){
			for(var i = 0 ; i < newObject3D.children.length; i++){
				var childObj = newObject3D.children[i]; 
				var materials = childObj.material;
				var newMaterials = new Array();
				for(var j = 0; j < materials.length; j++){
					newMaterials.push(materials[j]);
				}
				childObj.material = newMaterials;				
				childObj.geometry = childObj.geometry.clone(); 
			}
		}
		return newObject3D;
	},
	//字符串转rgb added by ls 20220606
    stringToRGBArray: function(color){ 
        let r = parseInt(color.substring(0, 2), 16);
        let g = parseInt(color.substring(2, 4), 16);
        let b = parseInt(color.substring(4, 6), 16) 
        return [r,g,b]
    },
	//字符串转rgbInt added by ls 20220606
    stringToRGBInt: function(color){
        let r = parseInt(color.substring(0, 2), 16);
        let g = parseInt(color.substring(2, 4), 16);
        let b = parseInt(color.substring(4, 6), 16) 
        return r * 256*256 + g * 256 + b;
    },
    //rgb转字符串 added by ls 20220606
    rgbToString: function(r,g,b) {
        return "#"+r.toString(16)+g.toString(16)+b.toString(16);
    },
    //rbgInt转单个值数值 added by ls 20221102
    rgbIntToRGBIntArray: function(rgbInt){
    	var rInt = rgbInt / (256 * 256);
    	var remained = rgbInt %  (256 * 256);
    	var gInt = remained / 256;
    	var bInt = remained % 256;
    	return [rInt, gInt, bInt];
    },
    //计算夹角 added by ls 20230810
    getAngle: function(center, start, end){ 
    	let x1 = start.x - center.x;
		let y1 = start.y - center.y;
        let z1 = start.z - center.z; 
        let x2 = end.x - center.x;
        let y2 = end.y - center.y;
        let z2 = end.z - center.z; 
        let vectorDot = x1 * x2 + y1 * y2 + z1 * z2; 
        let vectorMold1 = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2) + Math.pow(z1, 2)); 
        let vectorMold2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2) + Math.pow(z2, 2));
        let cosAngle = vectorDot / (vectorMold1 * vectorMold2);
        if(cosAngle > 1){
        	cosAngle = 1;
        }
        let radian = Math.acos(cosAngle);
        return radian * 180 / Math.PI;
	},
	
    //计算夹角 added by ls 20231130
    getAngle2D: function(center, start, end){ 
    	let x1 = start.x - center.x;
		let y1 = start.y - center.y;
        let x2 = end.x - center.x;
        let y2 = end.y - center.y;
        let vectorDot = x1 * x2 + y1 * y2; 
        let vectorMold1 = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)); 
        let vectorMold2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2));
        let cosAngle = vectorDot / (vectorMold1 * vectorMold2);
        if(cosAngle > 1){
        	cosAngle = 1;
        }
        let radian = Math.acos(cosAngle);
        if(js3CommonFunction.getDirectionByLine2D(center, start, end)){
        	//如果end在start+center的左侧
        	radian = 2 * Math.PI - radian;
        }
        return radian * 180 / Math.PI;
	},
	
	//计算旋转角度 added by ls 20230810
	getRotation: function(start, end){
		let length = Math.sqrt((end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y) + (end.z - start.z) * (end.z - start.z));
		let center = {x: 0, y: 0, z: 0};
		let vectorA = {x: 1, y: 0, z: 0};
		let vectorB = {x: (end.x - start.x) / length, y: (end.y - start.y) / length, z: (end.z - start.z) / length};
		
		let tempPoint1 = {x: vectorB.x, y: 0, z: vectorB.z};
		let yAngle = js3CommonFunction.getAngle(center, vectorA, tempPoint1);
		
		let tempX = Math.sqrt(end.x * end.x + end.z * end.z);
		let tempPoint2 = {x: tempX, y: vectorB.y, z: 0};
		let zAngle = js3CommonFunction.getAngle(center, vectorA, tempPoint2);
		return {
			x: 0,
			y: yAngle * Math.PI / 180,
			z: zAngle * Math.PI / 180
		};
	},
	
	//获取线的长度 added by ls 20231031
	getLineLength: function(start, end){
		let length = Math.sqrt((end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y) + (end.z - start.z) * (end.z - start.z));
		return length;
	},
	
	//获取线的长度 added by ls 20231201
	getLine2DLength: function(start, end){
		let length = Math.sqrt((end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y));
		return length;
	},
	
	//获取中心点坐标 added by ls 20231031
	getCenterPoint: function(start, end){
		return {
			x: (start.x + end.x) / 2,
			y: (start.y + end.y) / 2,
			z: (start.z + end.z) / 2
		};
	},
	
	//判断点在多边形内部还是外部 added by ls 20231104
	checkPointInPolygon: function(pt, polygonPoints, noneZeroMode) {
        let ptNum = polygonPoints.length; 
        let j = ptNum - 1;
        let oddNodes = false;
        let zeroState = 0;
        for (let k = 0; k < ptNum; k++) {
        	let ptK = polygonPoints[k];
        	let ptJ = polygonPoints[j];
            if (((ptK.y > pt.y) != (ptJ.y > pt.y)) && (pt.x < (ptJ.x - ptK.x) * (pt.y - ptK.y) / (ptJ.y - ptK.y) + ptK.x)) {
                oddNodes = !oddNodes;
                if (ptK.y > ptJ.y) {
                    zeroState++;
                }
                else {
                    zeroState--;
                }
            }
            j = k;
        }
        return noneZeroMode ? zeroState != 0 : oddNodes;
    },
    
    //判断平面上的两条直线是否平行 added by ls 20231130
    checkLine2DParallel(p1, p2, p3, p4){
		if(p2.x == p1.x || p4.x == p3.x){
			if(p2.x  == p1.x && p4.x == p3.x){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			let g1 = js3CommonFunction.getGradient2D(p1, p2);
			let g2 = js3CommonFunction.getGradient2D(p3, p4);
			return Math.abs(g2 - g1) < 0.00001; //这里有精度问题
		}		
	},
	
	//计算平面上直线的斜率
	getGradient2D(p1, p2){
		return (p2.y - p1.y) / (p2.x - p1.x);
	},
	
	//获取直线的交点
	getCrossPoint2D: function(p1, p2, p3, p4) {
        let a1 = p1.y - p2.y;
        let b1 = p2.x - p1.x;
        let c1 = a1 * p1.x + b1 * p1.y;

        let a2 = p3.y - p4.y;
        let b2 = p4.x - p3.x;
        let c2 = a2 * p3.x + b2 * p3.y;

        let det_k = a1 * b2 - a2 * b1;

        if(Math.abs(det_k) < 0.000001){//设置了精度
            return null;
        }

        let a = b2 / det_k;
        let b = -1 * b1 / det_k;
        let c = -1 * a2/det_k;
        let d = a1 / det_k;

        let x = a * c1 + b * c2;
        let y = c * c1 + d * c2;

        return {x: x, y: y};
	}, 
	
	//获取直线的交点
	getCrossPoint2DInSegment: function(p1, p2, p3, p4, ignoreSize) {
		let point = js3CommonFunction.getCrossPoint2D(p1, p2, p3, p4);
		if(point != null && js3CommonFunction.checkPoint2DInSegment(point, p1, p2, ignoreSize) && js3CommonFunction.checkPoint2DInSegment(point, p3, p4, ignoreSize)){
			return point;
		}
		else{
			return null;
		}
	},

	//判断点是否在线段内
	checkPoint2DInSegment: function(point, pointA, pointB, ignoreSize){
		ignoreSize = ignoreSize == null ? 0.000001 : ignoreSize;
		let segLen = js3CommonFunction.getLine2DLength(pointA, pointB);
		let toALen = js3CommonFunction.getLine2DLength(pointA, point);
		let toBLen = js3CommonFunction.getLine2DLength(point, pointB);
		return toALen - segLen < ignoreSize && toBLen - segLen < ignoreSize && (Math.abs(toALen + toBLen - segLen) < ignoreSize);
	},
	
	//判断点在线的哪一侧
	getDirectionByLine2D: function(point, pointA, pointB){ 
		//key > 0 在左侧,key = 0 在线上,key < 0 在右侧
		var key = (pointA.y - pointB.y) * point.x + (pointB.x - pointA.x) * point.y + pointA.x * pointB.y - pointB.x * pointA.y; 
		return key > 0;
	}
}