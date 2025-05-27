import * as THREE from "three";
//import ThreeBSP from "common/js/csg/csg.js";
import CSG from "common/js/csg/csg.js";

//碰撞检测基础类库  added by ls 202201
let HitDetection = function(){
	var thatHitDetection = this;
	
	this.defaultFixNum = 4;
	

	this.processHitDetection = function(p){
		
		//检测精度小数点4位，1mm(包括小数点)		
		if(p.fixNum == null){
			p.fixNum = thatHitDetection.defaultFixNum;
		}
		
		var fixNum = p.fixNum;
		var mainObject3D = p.mainObject3D;
		var object3Ds = p.object3Ds;
		
        var mainBox = new THREE.Box3().setFromObject(mainObject3D, true);
        mainBox = thatHitDetection.processBoxDecimalNum({
        	box: mainBox,
        	fixNum: fixNum
        });
        
        var needMeshDetectObject3Ds = new Array();
        for(var i = 0; i < object3Ds.length; i++){
        	var object3D = object3Ds[i];
        	if(object3D != mainObject3D && object3D.unitData != null){
                var box = new THREE.Box3().setFromObject(object3D, true);
                box = thatHitDetection.processBoxDecimalNum({
                	box: box,
                	fixNum: fixNum
                });
                if(thatHitDetection.intersectsBox(box, mainBox)){
                	needMeshDetectObject3Ds.push(object3D);
                }
        	}
        }
    	var hitObject3Ds = new Array();
        if(needMeshDetectObject3Ds.length > 0){  
        	for(var i = 0; i < needMeshDetectObject3Ds.length; i++){
        		var needMeshDetectObject3D = needMeshDetectObject3Ds[i];
        		if(thatHitDetection.checkSubMeshHit({
        			object3DA: mainObject3D,
    				object3DB: needMeshDetectObject3D, 
    				fixNum: fixNum
        		})){
        			hitObject3Ds.push(needMeshDetectObject3D);
        		}
        	} 
        }
        return hitObject3Ds;
	}
	this.processBoxDecimalNum = function(p){
		var box = p.box;
		var fixNum= p.fixNum;
		box.min.x = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.min.x, false, fixNum));
		box.min.y = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.min.y, false, fixNum));
		box.min.z = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.min.z, false, fixNum));
		box.max.x = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.max.x, false, fixNum));
		box.max.y = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.max.y, false, fixNum));
		box.max.z = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.max.z, false, fixNum));
		return box;
	}
	
	this.intersectsBox = function(boxA, boxB) { 
		return boxA.max.x <= boxB.min.x || boxA.min.x >= boxB.max.x ||
			boxA.max.y <= boxB.min.y || boxA.min.y >= boxB.max.y ||
			boxA.max.z <= boxB.min.z || boxA.min.z >= boxB.max.z ? false : true;
	}
	
	this.checkSubMeshHit = function(p){
		var object3DA = p.object3DA;
		var object3DB = p.object3DB;
		var thatCommandJson = p.commandJson; 
		var fixNum= p.fixNum;
		
		var needBspDetectSubObject3Ds = new Array();		
		for(var i = 0; i < object3DA.children.length; i++){
			var subObject3DA = object3DA.children[i];
            var subBoxA = new THREE.Box3().setFromObject(subObject3DA, true);
            subBoxA = thatHitDetection.processBoxDecimalNum({
            	box: subBoxA,
            	fixNum: fixNum
            });
			for(var j = 0; j < object3DB.children.length; j++){
				var subObject3DB = object3DB.children[j];
	            var subBoxB = new THREE.Box3().setFromObject(subObject3DB, true);
	            subBoxB = thatHitDetection.processBoxDecimalNum({
	            	box: subBoxB,
	            	fixNum: fixNum
	            });
                if(thatHitDetection.intersectsBox(subBoxA, subBoxB)){
                	if(thatHitDetection.checkBspMesh({
                		meshA: subObject3DA,
            			meshB:subObject3DB,
        				commandJson: thatCommandJson
                	})){
                		return true;
                	}
                }				
			}
		}
		return false;
	}
	
	this.checkBspMesh =  function(p){ 
		var thatCommandJson = p.commandJson;		
		var meshA = thatHitDetection.cloneToWorldMesh(p.meshA);
		var meshB = thatHitDetection.cloneToWorldMesh(p.meshB);
		let csgA = thatHitDetection.createCsgByGeometry(meshA);
		let intersectResult = csgA.intersect([meshB]); 
		return intersectResult.polygons.length != 0;
	}
	
	this.createCsgByGeometry = function(geometry){ 
		const csg = new CSG();
		csg.setFromMesh(geometry);
		return csg;
	}
	
	this.cloneToWorldMesh = function(mesh){
		var newGeo = null;
		if(mesh.geometry == null){
			//这种情况是加载的gltf，直接用它的box来判断吧
            var box = new THREE.Box3().setFromObject(mesh, true);
			var tempMesh = new THREE.Mesh(
		        new THREE.BoxGeometry(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z),
		        new THREE.MeshLambertMaterial({ color:0x0000FF })
		    ); 
			newGeo = tempMesh.geometry;
			var pos = {x: (box.max.x + box.min.x) / 2, y: (box.max.y + box.min.y) / 2, z: (box.max.z + box.min.z) / 2}
			for(var i = 0; i < newGeo.vertices.length; i++){
				var vertice = newGeo.vertices[i];
				vertice.x = vertice.x + pos.x;
				vertice.y = vertice.y + pos.y;
				vertice.z = vertice.z + pos.z;
			}
		}
		else{
			mesh.matrixWorldNeedsUpdate = true;
			newGeo = new THREE.BufferGeometry();
			var posArray = mesh.geometry.attributes.position.array;
			var vertices = [];
			for(var i = 0; i < posArray.length; i = i + 3){
				var vec = new THREE.Vector3(posArray[i], posArray[i + 1], posArray[i + 2]);
				vec.applyMatrix4(mesh.matrixWorld);
				vertices[i] = vec.x;
				vertices[i + 1] = vec.y;
				vertices[i + 2] = vec.z;
			}
			var faces = [];
			for(var i = 0; i < mesh.geometry.index.array.length; i++){
				faces[i] = mesh.geometry.index.array[i];
			}
			
			newGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
			newGeo.setIndex(faces);
			newGeo.attributes.position.needsUpdate = true;
		}
		return new THREE.Mesh(newGeo);
	}
}
export default HitDetection