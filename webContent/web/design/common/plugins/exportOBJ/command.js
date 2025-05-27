//导出OBJ文件 added by ls 20230307
js3CommandProcessors["exportOBJ"] = {
	toStatus: "normal",
	run: function(p){ 
		var editor = p.editor; 
		var modelName = editor.componentInfo.name;
		var processor = js3CommandProcessors["exportOBJ"];
		var allObject3Ds = processor.getAllObject3Ds(p);
		var allMaterialInfos = processor.getAllMaterials(p, allObject3Ds);
		var modelDomText = processor.generateDomText(p, allObject3Ds, allMaterialInfos);
		processor.save(p, modelDomText, modelName + ".obj");
	},
	getAllMaterials: function(p, allObject3Ds){
		var allMaterialNames = new Array();
		var allMaterialInfos = new Array();
		for(var i = 0; i < allObject3Ds.length; i++){
			var object3D = allObject3Ds[i];
			if(object3D.type == "Mesh"){
				var material = object3D.material instanceof Array ? object3D.material[0] : object3D.material;
				var materialName = material.name;
				if(!allMaterialNames.contains(materialName)){
					allMaterialNames.push(materialName); 
					var materialInfo = {
						name: materialName,
						color: [material.color.r, material.color.g, material.color.b],
						opacity: material.opacity,
						metalness: material.metalness
					};
					allMaterialInfos.push(materialInfo);
				}
			}
			else{
				for(var j = 0; j < object3D.children.length; j++){
					var mesh = object3D.children[j];				
					var material = mesh.material instanceof Array ? mesh.material[0] : mesh.material;
					var materialName = material.name;
					if(!allMaterialNames.contains(materialName)){
						allMaterialNames.push(materialName); 
						var materialInfo = {
							name: materialName,
							color: [material.color.r, material.color.g, material.color.b],
							opacity: material.opacity,
							metalness: material.metalness
						};
						allMaterialInfos.push(materialInfo);
					}
				}
			}
		}
		return allMaterialInfos;
	},
	generateDomText: function(p, allObject3Ds, allMaterialInfos){
		var processor = js3CommandProcessors["exportDAE"];
		var domText = "# Alias OBJ Model File\r\n";
		domText += "# File units = meters\r\n";
		
		//增加up axis和单位
		domText += " <asset>\r\n";
		domText += "  <unit meter=\"1\" name=\"m\"/>\r\n";
		domText += "  <up_axis>Y_UP</up_axis>\r\n";
		domText += " </asset>\r\n";
		
		domText += " <scene><instance_visual_scene url=\"#Scene\" /></scene>\r\n";
		
		//材质
		domText += " <library_materials>\r\n";
		var materialName2Index = {};
		for(var i = 0; i < allMaterialInfos.length; i++){
			var materialInfo = allMaterialInfos[i];
			materialName2Index[materialInfo.name] = i;
			domText += "  <material id=\"mat_" + materialInfo.name + "\" name=\"mat_" + materialInfo.name + "\">\r\n"
				+ "   <instance_effect url=\"#effect_" + i + "\" />\r\n"
				+ "  </material>\r\n";
		}
		domText += " </library_materials>\r\n";
		domText += " <library_effects>\r\n";
		for(var i = 0; i < allMaterialInfos.length; i++){
			var materialInfo = allMaterialInfos[i];
			var color = materialInfo.color;
			var opacity = materialInfo.opacity;
			domText += "  <effect id=\"effect_" + i + "\" name=\"effect_" + i + "\">\r\n";
			domText += "   <profile_COMMON>\r\n";
			domText += "    <technique sid=\"common\">\r\n";
			domText += "     <lambert>\r\n";
			domText += "      <emission>\r\n";
			domText += "       <color sid=\"emission\">0 0 0 1</color>\r\n";
			domText += "      </emission>\r\n";
			domText += "      <diffuse>\r\n";
			domText += "       <color sid=\"diffuse\">" + color[0] + " " + color[1] + " " + color[2] + " " + opacity + "</color>\r\n";
			domText += "      </diffuse>\r\n";
			domText += "      <transparency>\r\n";
			domText += "       <float>" + opacity + "</float>\r\n";
			domText += "      </transparency>\r\n";
			domText += "     </lambert>\r\n";
			domText += "    </technique>\r\n";
			domText += "   </profile_COMMON>\r\n";
			domText += "   </effect>\r\n";
		}
		domText += " </library_effects>\r\n";
		
		//节点
		domText += " <library_visual_scenes>\r\n";
		domText += "  <visual_scene id=\"Scene\" name=\"Scene\">\r\n"
			+ "   <node id=\"RootNode\" name=\"RootNode\">\r\n";
		for(var i = 0; i < allObject3Ds.length; i++){
			var object3D = allObject3Ds[i];
			if(object3D.type == "Mesh"){
				//var meshName = "node_" + object3D.unitData.name;
				//var geometryName = "mesh_" + object3D.unitData.name;
				var meshName = "node_" + i + "_" + object3D.unitData.code;
				var geometryName = "mesh_" + i + "_" + object3D.unitData.code;
				domText += processor.getLeafNodeText(p, object3D, meshName, geometryName);
			}
			else{
				var transform = object3D.matrix.elements;
				domText += "    <node id=\"node_"  + i + "_" + object3D.unitData.code + "\" name=\"node_" + i + "_" + object3D.unitData.code + "\">\r\n"
				domText += "     <matrix sid=\"matrix\">" 
					+ transform[0] + " " 
					+ transform[4] + " " 
					+ transform[8] + " " 
					+ transform[12] + " " 
					+ transform[1] + " " 
					+ transform[5] + " " 
					+ transform[9] + " " 
					+ transform[13] + " " 
					+ transform[2] + " " 
					+ transform[6] + " " 
					+ transform[10] + " " 
					+ transform[14] + " " 
					+ transform[3] + " " 
					+ transform[7] + " " 
					+ transform[11] + " " 
					+ transform[15] + " " 
					+ "</matrix>\r\n";
				for(var j = 0; j < object3D.children.length; j++){
					var mesh = object3D.children[j];
					//var meshName = "node_" + object3D.unitData.name + "_" + j;
					//var geometryName = "mesh_" + object3D.unitData.name + "_" + j;
					var meshName = "node_" + i + "_" + mesh.name.replaceAll("/", "_").replaceAll("#", "_") + "_" + j;
					var geometryName = "mesh_" + i + "_" + mesh.name.replaceAll("/", "_").replaceAll("#", "_") + "_" + j;
					domText += processor.getLeafNodeText(p, mesh, meshName, geometryName);
				}
				domText += "    </node>\r\n"
			}	
		}
		domText += "   </node>\r\n"
		domText += "  </visual_scene>\r\n";
		domText += " </library_visual_scenes>\r\n";		
		
		//几何
		domText += " <library_geometries>";
		for(var i = 0; i < allObject3Ds.length; i++){
			var object3D = allObject3Ds[i];
			if(object3D.type == "Mesh"){
				var geometryName = "mesh_" + i + "_" + object3D.unitData.code;
				//var meshName = "mesh_" + object3D.unitData.name;
				domText += processor.getMeshGeometryText(p, object3D, geometryName);
			}
			else{
				for(var j = 0; j < object3D.children.length; j++){
					var mesh = object3D.children[j];
					//var meshName = "mesh_" + object3D.unitData.name + "_" + j;
					var geometryName = "mesh_" + i + "_" + mesh.name.replaceAll("/", "_").replaceAll("#", "_") + "_" + j;
					domText += processor.getMeshGeometryText(p, mesh, geometryName);
				}
			}
		}
		domText += " </library_geometries>\r\n";
		
		domText += "</COLLADA>";
		return domText;
	},
	getLeafNodeText: function(p, mesh, meshName, geometryName, materialName){		
		var meshTransform = mesh.matrix.elements;
		var materialName = "mat_" + (mesh.material instanceof Array ? mesh.material[0].name : mesh.material.name);
		domText = "     <node id=\""+ meshName + "\" name=\"" + meshName + "\">\r\n";
		domText += "      <matrix sid=\"matrix\">" 
			+ meshTransform[0] + " " 
			+ meshTransform[4] + " " 
			+ meshTransform[8] + " " 
			+ meshTransform[12] + " " 
			+ meshTransform[1] + " " 
			+ meshTransform[5] + " " 
			+ meshTransform[9] + " " 
			+ meshTransform[13] + " " 
			+ meshTransform[2] + " " 
			+ meshTransform[6] + " " 
			+ meshTransform[10] + " " 
			+ meshTransform[14] + " " 
			+ meshTransform[3] + " " 
			+ meshTransform[7] + " " 
			+ meshTransform[11] + " " 
			+ meshTransform[15] + " " 
			+ "</matrix>\r\n";
		domText += "      <instance_geometry url=\"#"+ geometryName + "\" name=\"" + geometryName + "\">\r\n";
		domText += "       <bind_material>\r\n";
		domText += "        <technique_common>\r\n";				
		domText += "         <instance_material symbol=\"" + materialName + "\" target=\"#" + materialName + "\" />\r\n";
		domText += "        </technique_common>\r\n";
		domText += "       </bind_material>\r\n";
		domText += "      </instance_geometry>\r\n";
		domText += "     </node>\r\n";
		return domText;
	},
	getMeshGeometryText: function(p, mesh, meshName){
		mesh.geometry.computeVertexNormals();
		mesh.geometry.computeFaceNormals();
		
		var vertices = mesh.geometry.vertices;
		var faces = mesh.geometry.faces;
		var pointCount = vertices.length;
		var faceCount = faces.length;
		var normalCount = faceCount * 3;
		var pointStr = "";
		var normalStr = "";
		var faceStr = "";
		for(var k = 0; k < vertices.length; k++){
			var vertice = vertices[k];
			pointStr += (k == 0 ? "" : " ") + vertice.x + " " + vertice.y + " " + vertice.z;
		}
		for(var k = 0; k < faces.length; k++){
			var face = faces[k];
			faceStr += (k == 0 ? "" : " ") + face.a + " " + (k * 3) + " " + face.b + " " + (k * 3 + 1) + " " + face.c + " " + (k * 3 + 2);
			
			//var vertexNormals = face.vertexNormals;
			//normalStr += (k == 0 ? "" : " ") + vertexNormals[0].x + " " + vertexNormals[0].y + " " + vertexNormals[0].z + " " + vertexNormals[1].x + " " + vertexNormals[1].y + " " + vertexNormals[1].z + " " + vertexNormals[2].x + " " + vertexNormals[2].y + " " + vertexNormals[2].z;
			
			var normal = face.normal;
			normalStr += (k == 0 ? "" : " ") + normal.x + " " + normal.y + " " + normal.z + " " + normal.x + " " + normal.y + " " + normal.z + " " + normal.x + " " + normal.y + " " + normal.z;
		}
		domText = " <geometry id=\"" + meshName + "\" name=\"" + meshName + "\">\r\n";
		domText += "  <mesh>\r\n";
		domText += "   <source id=\"positions_" + meshName + "\">\r\n";
		domText += "    <float_array id=\"positions_array_" + meshName + "\" count=\"" + (pointCount * 3) + "\">" + pointStr + "</float_array>\r\n";
		domText += "    <technique_common>\r\n";
		domText += "     <accessor count=\"" + pointCount + "\" source=\"#positions_array_" + meshName+ "\" stride=\"3\">\r\n";
		domText += "      <param name=\"X\" type=\"float\" />\r\n";
		domText += "      <param name=\"Y\" type=\"float\" />\r\n";
		domText += "      <param name=\"Z\" type=\"float\" />\r\n";
		domText += "     </accessor>\r\n";
		domText += "    </technique_common>\r\n";
		domText += "   </source>\r\n";
		domText += "   <source id=\"normals_" + meshName + "\">\r\n";
		domText += "    <float_array id=\"normals_array_" + meshName + "\" count=\"" + (normalCount * 3) + "\">" + normalStr + "</float_array>\r\n";
		domText += "    <technique_common>\r\n";
		domText += "     <accessor count=\"" + normalCount + "\" source=\"#normals_array_" + meshName+ "\" stride=\"3\">\r\n";
		domText += "      <param name=\"X\" type=\"float\" />\r\n";
		domText += "      <param name=\"Y\" type=\"float\" />\r\n";
		domText += "      <param name=\"Z\" type=\"float\" />\r\n";
		domText += "     </accessor>\r\n";
		domText += "    </technique_common>\r\n";
		domText += "   </source>\r\n";
		domText += "   <vertices id=\"vertices_" + meshName + "\">\r\n";
		domText += "    <input semantic=\"POSITION\" source=\"#positions_" + meshName + "\" />\r\n";
		domText += "   </vertices>\r\n";
		domText += "   <triangles count=\"" + faceCount + "\">\r\n";
		domText += "    <input offset=\"0\" semantic=\"VERTEX\" source=\"#vertices_" + meshName + "\" />\r\n";
		domText += "    <input offset=\"1\" semantic=\"NORMAL\" source=\"#normals_" + meshName+ "\" />\r\n";
		domText += "    <p>" + faceStr + "</p>\r\n";
		domText += "   </triangles>\r\n";				
		domText += "  </mesh>\r\n";
		domText += " </geometry>\r\n";
		return domText;
	},
	save: function(p, text, fileName) {
        var blob = new Blob([text], {type: "text/plain"});
        var link = document.createElement("a");
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = fileName || "model.obj";
        link.click();
    },
    getAllObject3Ds: function(p){
		var editor = p.editor;
		var allObject3Ds = new Array();
        for(var i = 0; i < editor.scene.children.length; i++){
        	var object3D = editor.scene.children[i];
        	if(object3D.unitData != null){ 
    			allObject3Ds.push(object3D);
        	}
        }
		return allObject3Ds;
	} 
};