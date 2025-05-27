import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {FBXLoader} from "three/addons/loaders/FBXLoader.js";

//fbx查看 added by ls 20230828
let FbxViewer = function(){
	var thatFbxViewer = this;

    this.renderer;
    this.camera;
    this.scene;
    this.ambientLight;
    this.directionalLight;
    this.controls;
    this.viewContainerId;
    this.fbxName;
    this.assistName;
    this.resFbxId = null;
    
    //边线颜色 modified by ls 20231024
	this.edgeMaterial = new THREE.LineBasicMaterial({
		color: 0xAAAAAA,
		linewidth: 1
	});
	
	this.init = function(p){
		thatFbxViewer.viewContainerId = p.viewContainerId;
		thatFbxViewer.resFbxId = p.resFbxId;
		thatFbxViewer.getFbxPreviewFile(thatFbxViewer.resFbxId);
	};

	this.getFbxZipPreviewFileUrl = function(resFbxId){
		var zipPreivewFileUrl = basePath + "/resource/getFbxZip?id=" + resFbxId; 
		return zipPreivewFileUrl;
	}

	this.getImgFileUrl = function(resFbxName, imgName){
		return basePath + "/resource/getFbxImg?resFbxName=" + resFbxName + "&imgName=" + imgName;
	}
	
	this.getFbxFileUrl = function(resFbxName, fbxName){
		return basePath + "/resource/getFbx?resFbxName=" + encodeURIComponent(resFbxName) + "&fbxName=" + encodeURIComponent(fbxName);
	}

	this.getAssistFileUrl = function(assistName){
		var assistFileUrl = assistName == null || assistName.length == 0 ? "" : (basePath + "/resource/getAssist?name=" + encodeURIComponent(assistName)); 
		return assistFileUrl;
	}

	this.getFbxPreviewFile = function(resFbxId){
		$("#" + thatFbxViewer.viewContainerId).html("预览加载中...");
		var zipPreivewFileUrl = thatFbxViewer.getFbxZipPreviewFileUrl(resFbxId);
    	THREE.Cache.enabled = true;
		var zipFs = new zip.fs.FS(); 
		zipFs.importHttpContent(zipPreivewFileUrl, false, function(zipFs, entries){
			var fbxEntry = null;
			var fbxName = "";
			var assistEntry = null;
			var assistName = "";
			for(var i = 0; i < zipFs.children.length; i++){
				var entry = zipFs.children[i];
				var entryName = entry.name.toLowerCase()
				if(entryName.endWith(".fbx")){
	    			fbxEntry = entry;
	    			fbxName = entryName;
					let dotIndex = fbxName.lastIndexOf(".");
					let fbxZipCode = fbxName.substr(0, dotIndex);
					let fbxFileUrl = thatFbxViewer.getFbxFileUrl(fbxZipCode, fbxName);
	    		    THREE.Cache.remove(fbxFileUrl);
				}
				else if(entryName.endWith(".assist")){
					assistEntry = entry;
	    			assistName = entryName;
	    	    	var assistFileUrl = thatFbxViewer.getAssistFileUrl(assistName);
	    		    THREE.Cache.remove(assistFileUrl);
				}
			} 
			
			const fileInfo = {
				fbxName: fbxName,
				assistName: assistName
			};
			
			//fbx
	    	var fbxBlobWriter = new zip.BlobWriter(zip.getMimeType(fbxName));
	    	fbxBlobWriter.fileInfo = fileInfo;
	    	fbxEntry.getData(fbxBlobWriter, function(blob){
	    		var reader = new FileReader();
	    		reader.fileInfo = blob.fileInfo;
	    		reader.onloadend = function(event) {
	    		    var base64 = reader.result;
	    		    var fileInfo = event.target.fileInfo;
	    		    var fbxName = fileInfo.fbxName;
					let dotIndex = fbxName.lastIndexOf(".");
					let fbxZipCode = fbxName.substr(0, dotIndex);
					const fbxFileUrl = thatFbxViewer.getFbxFileUrl(fbxZipCode, fbxName);
					fetch(fbxFileUrl)
						.then(response => {
							// 检查网络请求是否成功
							if (!response.ok) {
								let error = "Network response was not ok: " + response.statusText;
								msgBox.alert({info: error});
								throw new Error(error);
							}
							else{
								return response.arrayBuffer();
							}
						})
						.then(data => {
							THREE.Cache.add(fbxFileUrl, data);
							thatFbxViewer.afterUnzipFbx(fileInfo.fbxName, fileInfo.assistName);
						})
						.catch(error => {
							msgBox.alert({info: error});
							console.error('Error during fetch:', error);
						});
	    		};
	    		reader.readAsArrayBuffer(blob);     	    		
	    	},
	    	function(progress){
	    	}, fbxEntry.crc32); 

			//assist file
	    	if(assistEntry != null){ 
		    	var assistBlobWriter = new zip.BlobWriter(zip.getMimeType(assistName));
		    	assistBlobWriter.fileInfo = fileInfo;
		    	assistEntry.getData(assistBlobWriter, function(blob){
		    		var reader = new FileReader();
		    		reader.fileInfo = blob.fileInfo;
		    		reader.onloadend = function(event) {
		    		    var base64 = reader.result;
		    		    var fileInfo = event.target.fileInfo;
		    		    var assistName = fileInfo.assistName;
		    	    	var assistFileUrl = thatFbxViewer.getAssistFileUrl(assistName);
		    		    THREE.Cache.add(assistFileUrl, base64);
		    		    thatFbxViewer.afterUnzipFbx(fileInfo.fbxName, fileInfo.assistName);
		    		};
		    		reader.readAsArrayBuffer(blob);     	    		
		    	},
		    	function(progress){
		    	}, fbxEntry.crc32);
	    	}
		}, function(er){
			thatFbxViewer.previewError = true;
			throw er;
		});
	}

	//增加轮廓线 added by ls 20231024
    this.addEdges = function(object3D){
        var childObject3Ds = thatFbxViewer.getChildObject3Ds(object3D);
    	if(childObject3Ds.length == 0){
    		if(object3D.isLine){
    			//如果本身就是线，那么不用加边了
    		}
    		else if(object3D.geometry == null){
    			//当geometry为空时，不加轮廓线
    		}
    		else{
	            var edges= new THREE.EdgesGeometry(object3D.geometry, 60);
	            var line = new THREE.LineSegments(edges, thatFbxViewer.edgeMaterial);
	            line.isEdgeLine = true; 
	            object3D.add(line);
    		}
    	}
    	else{
    		for(var i = 0; i < childObject3Ds.length; i++){
    			var childObj = childObject3Ds[i];
    			thatFbxViewer.addEdges(childObj);
    		}
    	}
	}

	this.getChildObject3Ds = function(object3D){
		var childObject3Ds = [];
		for(var i = 0; i < object3D.children.length; i++){
			var childObject3D = object3D.children[i];
			if(!childObject3D.isEdgeLine){
				childObject3Ds.push(childObject3D);
			}
		}
		return childObject3Ds;
	} 
    

	this.afterUnzipFbx = function(fbxFileName, assistFileName){
    	let canLoadFbxObject3D = true;
		let dotIndex = fbxFileName.lastIndexOf(".");
		let fbxZipCode = fbxFileName.substr(0, dotIndex);
		let fbxFileUrl = thatFbxViewer.getFbxFileUrl(fbxZipCode, fbxFileName);
		let fbxArray = THREE.Cache.get(fbxFileUrl);
    	if(fbxArray == null){
    		canLoadFbxObject3D = false;
    	}
		let assistInfo = null;
		if(assistFileName != null && assistFileName.length > 0){
			let assistFileUrl = thatFbxViewer.getAssistFileUrl(assistFileName);
			let assistArray = THREE.Cache.get(assistFileUrl);
	    	if(assistArray == null){
	    		canLoadFbxObject3D = false;
	    	}
	    	else{
				let assistText = (new TextDecoder('utf-8')).decode(assistArray);
	    		assistInfo = cmnPcr.strToJson(assistText);
	    	}
		}
		
		if(canLoadFbxObject3D) {
			let dotIndex = fbxFileName.lastIndexOf(".");
			let fbxName = fbxFileName.substr(0, dotIndex);
			let loader = new FBXLoader();
			let fbxObject3D = loader.parse(fbxArray, thatFbxViewer.getImgFileUrl(fbxName, ""));
			let sizeBox = new THREE.Box3().setFromObject(fbxObject3D, true);
			fbxObject3D.position.set(
				-(sizeBox.max.x + sizeBox.min.x) / 2,
				-(sizeBox.max.y + sizeBox.min.y) / 2,
				-(sizeBox.max.z + sizeBox.min.z) / 2
			);
			let object3D = new THREE.Object3D();
			object3D.add(fbxObject3D);
			$("#" + thatFbxViewer.viewContainerId).empty();
			thatFbxViewer.draw(object3D);
		}
	}

	this.showImportedLog = function(statusStr){  
		$(".processStatusDiv").html(statusStr);
	}
	
    this.initRender = function(containerId) {
    	var containerDom = $("#" + thatFbxViewer.viewContainerId)[0];
        var width = $(containerDom).width();
        var height = $(containerDom).height(); 
        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(width, height);
		renderer.setClearColor(0xFFFFFF);
        containerDom.appendChild(renderer.domElement);
        thatFbxViewer.renderer = renderer;
    }

    this.initCamera = function(){
    	var containerDom = $("#" + thatFbxViewer.viewContainerId)[0];
        var width = $(containerDom).width();
        var height = $(containerDom).height(); 
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 20, 20);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        thatFbxViewer.camera = camera;
    }

    this.initScene = function() {
        var scene = new THREE.Scene();
        thatFbxViewer.scene = scene;
    } 
    
    this.initLight = function() { 
    	var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        thatFbxViewer.ambientLight = ambientLight;
    	thatFbxViewer.scene.add(ambientLight);  
    	
    	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(-40, 60, -10);

        directionalLight.shadow.camera.near = 20; //产生阴影的最近距离
        directionalLight.shadow.camera.far = 200; //产生阴影的最远距离
        directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
        directionalLight.shadow.camera.right = 50; //最右边
        directionalLight.shadow.camera.top = 50; //最上边
        directionalLight.shadow.camera.bottom = -50; //最下面
 
        //这两个值决定使用多少像素生成阴影 默认512
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.mapSize.width = 1024;  
        
        thatFbxViewer.directionalLight = directionalLight;

        thatFbxViewer.scene.add(directionalLight);
    } 
 
    this.initControls = function(){

        var controls = new OrbitControls(thatFbxViewer.camera, thatFbxViewer.renderer.domElement); 
        thatFbxViewer.controls = controls;
    }

    this.render = function() {
    	thatFbxViewer.renderer.render(thatFbxViewer.scene, thatFbxViewer.camera);
    }

    //窗口变动触发的函数
    this.onWindowResize = function() {
    	var containerDom = $("#" + thatFbxViewer.viewContainerId)[0];
        var width = $(containerDom).width();
        var height = $(containerDom).height(); 
    	thatFbxViewer.camera.aspect = width / height;
    	thatFbxViewer.camera.updateProjectionMatrix();
    	thatFbxViewer.render();
    	thatFbxViewer.renderer.setSize(width, height);
    }

    this.animate = function() {
        //更新控制器
    	thatFbxViewer.render();
    	thatFbxViewer.controls.update();
        requestAnimationFrame(thatFbxViewer.animate);
    }

    this.draw = function(object3D) { 
    	thatFbxViewer.initRender();
    	thatFbxViewer.initScene();
    	thatFbxViewer.initCamera();
    	thatFbxViewer.initLight();
    	thatFbxViewer.initControls();
    	thatFbxViewer.animate();
        window.onresize = thatFbxViewer.onWindowResize;
        thatFbxViewer.addObject3D(object3D);
        
        //thatFbxViewer.addEdges(object3D);
    }
    
    this.addObject3D = function(object3D){
    	thatFbxViewer.scene.add(object3D);
    }
}
export default FbxViewer