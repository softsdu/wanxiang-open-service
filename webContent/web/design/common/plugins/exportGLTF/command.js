import * as THREE from "three";
import {GLTFExporter} from "three/addons/exporters/GLTFExporter.js";

js3CommandProcessors["exportGLTF"] = {
	toStatus: "normal",	
	icon: "/images/gltf.png",
	run: function(p){ 
		p.commandJson.exportGltf(p);
	}, 
	exportGltf: function(p){
	    var exporter = new GLTFExporter();
	    var mainScene = p.editor.getMainScene();
	    var allObject3Ds = [];
		for(var i = 0; i < mainScene.children.length; i++){
			var childObj = mainScene.children[i];
			if(childObj.isUnitObject){
				allObject3Ds.push(childObj);
			}
		}
	    exporter.parse(allObject3Ds, function (result) {p.commandJson.saveString(p, JSON.stringify(result), p.editor.componentInfo.code + ".gltf")});
	},
	saveString: function(p, text, fileName) {
		p.commandJson.save(p, new Blob([text], { type: "text/plain"}), fileName);
	},
    save: function(p, blob, fileName) {
        var link = document.createElement("a");
        link.style.display = "none";
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName || "data.json";
        link.click();
    }
};