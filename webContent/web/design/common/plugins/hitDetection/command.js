import * as THREE from "three";
import CSG from "common/js/csg/csg.js";

js3CommandProcessors["hitDetection"] = {
	toStatus: "normal",	 
	icon: "/images/hitDetection.png",
	run: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;
		if(thatCE.selectedUnitObject3D == null){
			msgBox.alert({info: "请先选中一个物体."});
		}
		else{ 	
			thatCommandJson.showHitDetectionWindow(p);
		}
	},
	showHitDetectionWindow: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;
		var popContainer = new PopupContainer( {
			width : 500,
			height :250,
			top : 50,
			title: "碰撞检测"
		});
		
		popContainer.show(); 
		var inputId = cmnPcr.getRandomValue(); 
		var titleId = inputId + "_title";  
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var statusDivId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
		 	+ "<div id=\"" + statusDivId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;line-height:24px;padding-top: 30px;text-align:center;font-size:16px;\" >"    
		 	+ "</div>"  
		 	+ "</div>" 
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"关 闭\" class=\"commonBtn\" />" 
			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);  
		$("#" + statusDivId).text("正在检测...");
		var waitingBar = new WaitingBar();
		waitingBar.begin();		
		$("#" + okBtnId).click(function(){ 
			popContainer.close();
		}); 
		p.waitingBar = waitingBar;
		p.statusDivId = statusDivId;
		
		//检测精度 小数点4位，1mm(包括小数点)		
		p.fixNum = 4;
			
		thatCommandJson.processHitDetection(p);		
	},		
	processHitDetection: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson; 
		var waitingBar = p.waitingBar; 
		var statusDivId = p.statusDivId;
		var fixNum = p.fixNum;
		var mainObject3D = thatCE.selectedUnitObject3D;
        var mainBox = new THREE.Box3().setFromObject(mainObject3D, true);
        mainBox = thatCommandJson.processBoxDecimalNum({
        	box: mainBox,
        	fixNum: fixNum
        });
        
        var needMeshDetectObject3Ds = new Array();
        for(var i = 0; i < thatCE.scene.children.length; i++){
        	var object3D = thatCE.scene.children[i];
        	if(object3D != mainObject3D && object3D.unitData != null){
        		
        		if(object3D.unitData.code.startWith(js3SysCatAndCom.tagCategoryPre)){
            		//判定是否为特殊图元，例如标注 added by ls 20220606
        			break;
        		}
        		else{        		
	                var box = new THREE.Box3().setFromObject(object3D, true);
	                box = thatCommandJson.processBoxDecimalNum({
	                	box: box,
	                	fixNum: fixNum
	                });
	                if(thatCommandJson.intersectsBox(box, mainBox)){
	                	needMeshDetectObject3Ds.push(object3D);
	                }
        		}
        	}
        }
        if(needMeshDetectObject3Ds.length > 0){ 
        	$("#" + statusDivId).text("该物体可能与" + needMeshDetectObject3Ds.length + "个物体存在碰撞!");
        	
        	var hitObject3Ds = new Array();
        	for(var i = 0; i < needMeshDetectObject3Ds.length; i++){
        		var needMeshDetectObject3D = needMeshDetectObject3Ds[i];
        		if(thatCommandJson.checkSubMeshHit({
        			object3DA: mainObject3D,
    				object3DB: needMeshDetectObject3D,
    				commandJson: thatCommandJson,
    				fixNum: fixNum
        		})){
        			hitObject3Ds.push(needMeshDetectObject3D);
        		}
        	}
    		if(hitObject3Ds.length > 0){
    			var message = "该物体与" + hitObject3Ds.length + "个物体存在碰撞:<br/>";
    			for(var i = 0; i < hitObject3Ds.length; i++){
    				var object3D = hitObject3Ds[i];
    				message += ((i + 1) + ". " + object3D.unitData.name + (i == hitObject3Ds.length - 1 ? "." : "; "));
    			}
            	$("#" + statusDivId).html(message);
            }
    		else{
            	$("#" + statusDivId).text("没有检测到碰撞.");    			
    		}	
        }
        else{ 
        	$("#" + statusDivId).text("没有检测到碰撞.");
        }
		waitingBar.end();    	
	},
	processBoxDecimalNum: function(p){
		var box = p.box;
		var fixNum= p.fixNum;
		box.min.x = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.min.x, false, fixNum));
		box.min.y = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.min.y, false, fixNum));
		box.min.z = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.min.z, false, fixNum));
		box.max.x = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.max.x, false, fixNum));
		box.max.y = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.max.y, false, fixNum));
		box.max.z = cmnPcr.strToDecimal(cmnPcr.decimalToStr(box.max.z, false, fixNum));
		return box;
	},
	intersectsBox: function(boxA, boxB) { 
		return boxA.max.x <= boxB.min.x || boxA.min.x >= boxB.max.x ||
			boxA.max.y <= boxB.min.y || boxA.min.y >= boxB.max.y ||
			boxA.max.z <= boxB.min.z || boxA.min.z >= boxB.max.z ? false : true;
	},
	checkSubMeshHit: function(p){
		var object3DA = p.object3DA;
		var object3DB = p.object3DB;
		var thatCommandJson = p.commandJson; 
		var fixNum= p.fixNum;
		
		var needBspDetectSubObject3Ds = new Array();		
		for(var i = 0; i < object3DA.children.length; i++){
			var subObject3DA = object3DA.children[i];
            var subBoxA = new THREE.Box3().setFromObject(subObject3DA, true);
            subBoxA = thatCommandJson.processBoxDecimalNum({
            	box: subBoxA,
            	fixNum: fixNum
            });
			for(var j = 0; j < object3DB.children.length; j++){
				var subObject3DB = object3DB.children[j];
	            var subBoxB = new THREE.Box3().setFromObject(subObject3DB, true);
	            subBoxB = thatCommandJson.processBoxDecimalNum({
	            	box: subBoxB,
	            	fixNum: fixNum
	            });
                if(thatCommandJson.intersectsBox(subBoxA, subBoxB)){
                	if(thatCommandJson.checkBspMesh({
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
	},
	checkBspMesh: function(p){
		var thatCommandJson = p.commandJson;
		
		var meshA = thatCommandJson.cloneToWorldMesh(p.meshA);
		var meshB = thatCommandJson.cloneToWorldMesh(p.meshB);
		let csgA = thatCommandJson.createCsgByGeometry(meshA);
		let intersectResult = csgA.intersect([meshB]); 
		return intersectResult.polygons.length != 0;
	},
	createCsgByGeometry: function(geometry){ 
		const csg = new CSG();
		csg.setFromMesh(geometry);
		return csg;
	},
	cloneToWorldMesh: function(mesh){
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
	},
	cloneGeometry: function(mesh){ 
		if(mesh.geometry == null){
			//这种情况是加载的gltf，直接用它的box来判断吧
            var box = new THREE.Box3().setFromObject(mesh, true);
			var tempMesh = new THREE.Mesh(
		        new THREE.BoxGeometry(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z),
		        new THREE.MeshLambertMaterial({ color:0x0000FF })
		    ); 
			var newGeo = tempMesh.geometry;
			var pos = {x: (box.max.x + box.min.x) / 2, y: (box.max.y + box.min.y) / 2, z: (box.max.z + box.min.z) / 2}
			for(var i = 0; i < newGeo.vertices.length; i++){
				var vertice = newGeo.vertices[i];
				vertice.x = vertice.x + pos.x;
				vertice.y = vertice.y + pos.y;
				vertice.z = vertice.z + pos.z;
			}
			return newGeo;
		}
		else{
			var newGeo = mesh.geometry.clone();
			var posArray = mesh.geometry.attributes.position.array;
			var newPosArray = [];
			for(var i = 0; i < posArray.length; i = i + 3){
				var vec = new THREE.Vector3(posArray[i], posArray[i + 1], posArray[i + 2]);
				vec.applyMatrix4(mesh.matrixWorld);
				newPosArray[i] = vec.x;
				newPosArray[i + 1] = vec.y;
				newPosArray[i + 2] = vec.z;
			}
			//return {positions: newPosArray, faces: mesh.geometry.index.array};
			return newGeo;
		}
	}
};