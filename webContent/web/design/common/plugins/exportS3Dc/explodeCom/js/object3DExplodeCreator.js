import * as THREE from "three";
import Object3DCreator from "common/js/object3DCreator.js";

let Object3DExplodeCreator = function(){
	var thatObj3DCreator = this; 
	this.base = Object3DCreator;
	this.base();

	this.resourceBoxEdgeMaterial.opacity = 0;

	this.materialSide = THREE.FrontSide;

    this.doesShowEdge = false;
    
    //显示级别 added by ls 20230403
    this.viewLevel = js3ViewLevelType.medium;
    
    this.detailLevel = 3;

	//gltf的外轮廓mesh
	this.createGltfBoxMesh = function (boxMeshInfo, material){
		let boxMesh = thatObj3DCreator.getMeshFromOffWithMaterial(boxMeshInfo, null, material);
		boxMesh.visible = false;
	}
}

export default Object3DExplodeCreator