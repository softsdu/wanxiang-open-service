import * as THREE from "three";
import Tree from "./proctree.js";

//景观绿化树木 added by ls 20230830
js3CommandProcessors["createTree"] = {
	toStatus: "normal",
	editor: null,
	treeCode: "936810-1001",
	treeColor: 0x41322c,
    twigColor: 0x2cf24f,
	treeMaterials: {},
    twigMaterials: {},
    textureLoader: null,
	init: function(p){
		let pluginProcessor = js3CommandProcessors["createTree"];
		pluginProcessor.editor = p.editor;
		pluginProcessor.textureLoader = new THREE.TextureLoader();
	    
		pluginProcessor.editor.bindEvent("afterAddUnitObject3DToScene", function(p){
			let object3D = p.object3D;
			if(object3D.unitData.code == pluginProcessor.treeCode){
				js3CommandProcessors["createTree"].createTreeObject3D({
					object3D: object3D,
					parameters: object3D.unitData.parameters,
					rotation: [object3D.rotation.x, object3D.rotation.y, object3D.rotation.z],
					position: [0, 0, 0]
				});
			}
			else{
				if(object3D.userData.subs != null){
					for(var i = 0; i < object3D.children.length; i++){
						var subObject3D = object3D.children[i];
						var namePath = subObject3D.name;
						var subUnitData = object3D.userData.subs[namePath];
						if(subUnitData != null && subUnitData.code == pluginProcessor.treeCode){
							js3CommandProcessors["createTree"].createTreeObject3D({
								object3D: subObject3D,
								parameters: subUnitData.parameters,
								rotation: subUnitData.rotation,
								position: subUnitData.position
							});
						}
					}
				}
			}
		})
	},
	createTreeObject3D: function(p){
		let pluginProcessor = js3CommandProcessors["createTree"];
		let object3D = p.object3D;
		let parameters = p.parameters;
		let position = p.position;
		let rotation = p.rotation; 
		
		//颜色
		let treeMaterialName = parameters["treeColor"].value;
		let treeMaterialInfo = js3StandardMaterials.infoMap[treeMaterialName];
		let treeColor = treeMaterialInfo == null ? pluginProcessor.treeColor : treeMaterialInfo.color;
		let twigMaterialName = parameters["twigColor"].value;
		let twigMaterialInfo = js3StandardMaterials.infoMap[twigMaterialName];
		let twigColor = twigMaterialInfo == null ? pluginProcessor.twigColor : twigMaterialInfo.color;
		
		//材质
		if(pluginProcessor.treeMaterials[treeMaterialName] == null){
			pluginProcessor.treeMaterials[treeMaterialName] = new THREE.MeshStandardMaterial({
				color: treeColor,
				roughness: 1.0,
				metalness: 0.0
		    });
		}
		let treeMaterial = pluginProcessor.treeMaterials[treeMaterialName];
		if(pluginProcessor.twigMaterials[twigMaterialName] == null){
			pluginProcessor.twigMaterials[twigMaterialName] = new THREE.MeshStandardMaterial({
		    	color: twigColor,
		    	roughness: 1.0,
		    	metalness: 0.0,
		    	map: pluginProcessor.textureLoader.load(basePath + "/web/design/common/plugins/createTree/images/twig-1.png"),
		    	alphaTest: 0.9
		    });
		}
		let twigMaterial = pluginProcessor.twigMaterials[twigMaterialName];
		
		//动态生成树		
		let config = {
		    "seed": parameters["seed"].value,
		    "segments": 6,
		    "levels": parameters["levels"].value,
		    "vMultiplier": 2.36,
		    "twigScale": parameters["twigScale"].value,
		    "initalBranchLength": parameters["initalBranchLength"].value,
		    "lengthFalloffFactor": parameters["lengthFalloffFactor"].value,
		    "lengthFalloffPower": parameters["lengthFalloffPower"].value,
		    "clumpMax": parameters["clumpMax"].value,
		    "clumpMin": parameters["clumpMin"].value,
		    "branchFactor": parameters["branchFactor"].value,
		    "dropAmount": parameters["dropAmount"].value,
		    "growAmount": parameters["growAmount"].value,
		    "sweepAmount": parameters["sweepAmount"].value,
		    "maxRadius": parameters["maxRadius"].value,
		    "climbRate": parameters["climbRate"].value,
		    "trunkKink": parameters["trunkKink"].value,
		    "treeSteps": parameters["treeSteps"].value,
		    "taperRate": parameters["taperRate"].value,
		    "radiusFalloffRate": parameters["radiusFalloffRate"].value,
		    "twistRate": parameters["twistRate"].value,
		    "trunkLength": parameters["trunkLength"].value,
		    "treeColor": treeColor,
		    "twigColor": twigColor
		};
	    let tree = new Tree(config);

	    let treeGeometry = new THREE.BufferGeometry();
	    treeGeometry.setAttribute('position', pluginProcessor.createFloatAttribute(tree.verts, 3));
	    treeGeometry.setAttribute('normal', pluginProcessor.normalizeAttribute(pluginProcessor.createFloatAttribute(tree.normals, 3)));
	    treeGeometry.setAttribute('uv', pluginProcessor.createFloatAttribute(tree.UV, 2));
	    treeGeometry.setIndex(pluginProcessor.createIntAttribute(tree.faces, 1));

	    let twigGeometry = new THREE.BufferGeometry();
	    twigGeometry.setAttribute('position', pluginProcessor.createFloatAttribute(tree.vertsTwig, 3));
	    twigGeometry.setAttribute('normal', pluginProcessor.normalizeAttribute(pluginProcessor.createFloatAttribute(tree.normalsTwig, 3)));
	    twigGeometry.setAttribute('uv', pluginProcessor.createFloatAttribute(tree.uvsTwig, 2));
	    twigGeometry.setIndex(pluginProcessor.createIntAttribute(tree.facesTwig, 1));

	    let treeGroup = new THREE.Object3D();
	    treeGroup.add(new THREE.Mesh(treeGeometry, treeMaterial));
	    treeGroup.add(new THREE.Mesh(twigGeometry, twigMaterial));
	    let box = new THREE.Box3().setFromObject(treeGroup, true);
        let widthScale = (box.max.x - box.min.x) > (box.max.z - box.min.z) ? (js3CommonFunction.mm2m(parameters["宽度"].value) / (box.max.x - box.min.x)) : (js3CommonFunction.mm2m(parameters["宽度"].value) / (box.max.z - box.min.z));
        let heightScale = js3CommonFunction.mm2m(parameters["高度"].value) / (box.max.y - box.min.y);
        treeGroup.scale.set(widthScale, heightScale, widthScale);
	    let newBox = new THREE.Box3().setFromObject(treeGroup, true);
        treeGroup.position.set(-(newBox.min.x + newBox.max.x) / 2, -(newBox.min.y + newBox.max.y) / 2, -(newBox.min.z + newBox.max.z) / 2);

        let treeOuterObject3D = new THREE.Object3D();
        treeOuterObject3D.add(treeGroup);	    
	    treeOuterObject3D.rotation.set(rotation[0], rotation[1], rotation[2]);
	    treeOuterObject3D.position.set(position[0], position[1], position[2]);

	    //更换外框材质
		let resourceBoxEdgeMaterial = pluginProcessor.editor.object3DCreator.resourceBoxEdgeMaterial;
		pluginProcessor.changeBoxMaterial(object3D, resourceBoxEdgeMaterial);
	    
	    object3D.add(treeOuterObject3D);  
	    
	    //支持阴影
	    if(pluginProcessor.editor.hasShadow){
	    	pluginProcessor.enableShadow(pluginProcessor, object3D);
	    }
	},
	
	enableShadow: function(pluginProcessor, object3D){
		object3D.castShadow = true;
		object3D.receiveShadow = true;
		for(let i = 0; i < object3D.children.length; i++){
			let subObject3D = object3D.children[i];
	    	pluginProcessor.enableShadow(pluginProcessor, subObject3D);
		}
	},
	
	createFloatAttribute: function(array, itemSize) {
	  const typedArray = new Float32Array(Tree.flattenArray(array));
	  return new THREE.BufferAttribute(typedArray, itemSize);
	},
	createIntAttribute: function(array, itemSize) {
	  const typedArray = new Uint16Array(Tree.flattenArray(array));
	  return new THREE.BufferAttribute(typedArray, itemSize);
	},
	normalizeAttribute: function(attribute) {
	  var v = new THREE.Vector3();
	  for (var i = 0; i < attribute.count; i++) {
	    v.set(attribute.getX(i), attribute.getY(i), attribute.getZ(i));
	    v.normalize();
	    attribute.setXYZ(i, v.x, v.y, v.z);
	  }
	  return attribute;
	},
	//更换外框材质
	changeBoxMaterial: function(object3D, resourceBoxEdgeMaterial){
		let pluginProcessor = js3CommandProcessors["createTree"];
		for(var i = 0; i < object3D.children.length; i++){
			let subObject3D = object3D.children[i];
			if(subObject3D.isLine){
				subObject3D.material = resourceBoxEdgeMaterial;
			}
			else{
				pluginProcessor.changeBoxMaterial(subObject3D, resourceBoxEdgeMaterial);
			}
		}
	}
};