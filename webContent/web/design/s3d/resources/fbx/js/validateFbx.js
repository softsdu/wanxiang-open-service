import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {FBXLoader} from "three/addons/loaders/FBXLoader.js";

let FbxValidator = function(){
	var thatFbxValidator = this;

    this.renderer;
    this.camera;
    this.scene;
    this.ambientLight;
    this.directionalLight;
    this.controls;
    
    this.previewContainerId;
    this.endImportFbxBtnId;
    this.accessoryIds;
    this.fbxName;
    this.assistName;
    this.size = null;
    this.previewError = false;
    this.resFbxId = null;
	
	this.init = function(p){
		thatFbxValidator.previewContainerId = p.previewContainerId;
		thatFbxValidator.endImportFbxBtnId = p.endImportFbxBtnId;
		thatFbxValidator.accessoryIds = p.accessoryIds;
		thatFbxValidator.fbxName = p.fbxName;
		thatFbxValidator.assistName = p.assistName;

		$("#" + thatFbxValidator.previewContainerId).html("预览加载中...");
		
		if(thatFbxValidator.accessoryIds == null){
			msgBox.alert({info: "网页地址错误"});
		}
		else{
			var requestParam = {accessoryIds: thatFbxValidator.accessoryIds};
			serverAccess.request({
				serviceName:"/resourceFileNcpService", 
				funcName:"importFbx", 
				args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
				successFunc:function(obj){ 
					var statusStr = "请点击下一步，即可完成导入.";
					thatFbxValidator.resFbxId = obj.result.resFbxId;
					thatFbxValidator.getFbxPreviewFile(thatFbxValidator.resFbxId);
					thatFbxValidator.showImportedLog(statusStr); 
				},
				failFunc:function(obj){
					thatFbxValidator.previewError = true;
					thatFbxValidator.showImportedLog(cmnPcr.jsonToStr(obj));
				}
			});
		}
		$("#" + thatFbxValidator.endImportFbxBtnId).click(function(){
			thatFbxValidator.endImportFbx();
		});
	}; 
	
	this.endImportFbx = function(){
		if(thatFbxValidator.size != null){
			var requestParam = {
				id: thatFbxValidator.resFbxId,
				sizeX: thatFbxValidator.size.x,
				sizeY: thatFbxValidator.size.y,
				sizeZ: thatFbxValidator.size.z, 
			};
			serverAccess.request({
				serviceName:"/resourceFileNcpService", 
				funcName:"endImportFbx", 
				args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
				successFunc:function(obj){ 
					window.location = "succeed.jsp?id=" + thatFbxValidator.resFbxId;
				},
				failFunc:function(obj){
					thatFbxValidator.previewError = true;
					thatFbxValidator.showImportedLog(cmnPcr.jsonToStr(obj));
				}
			});
		}
		else if(thatFbxValidator.previewError){
			msgBox.alert({info: "存在错误，无法完成导入."})
		}
		else{
			msgBox.alert({info: "等待预览，请稍候."})
		}
	}

	this.getFbxZipPreviewFileUrl = function(resFbxId){
		var zipPreivewFileUrl = basePath + "/resource/getFbxZip?id=" + resFbxId; 
		return zipPreivewFileUrl;
	}

	this.getFbxFileUrl = function(resFbxId, fbxName){
		return basePath + "/resource/getFbx?resFbxId=" + resFbxId + "&fbxName=" + encodeURIComponent(fbxName);
	}

	this.getImgFileUrl = function(resFbxId, imgName){
		return basePath + "/resource/getFbxImg?resFbxId=" + resFbxId + "&imgName=" + imgName;
	}

	this.getAssistFileUrl = function(assistName){
		var assistFileUrl = assistName == null || assistName.length == 0 ? "" : (basePath + "/resource/getAssist?name=" + encodeURIComponent(assistName)); 
		return assistFileUrl;
	}

	this.getFbxPreviewFile = function(resFbxId){
		var zipPreivewFileUrl = thatFbxValidator.getFbxZipPreviewFileUrl(resFbxId);
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
					let fbxFileUrl = thatFbxValidator.getFbxFileUrl(thatFbxValidator.resFbxId, fbxName);
	    		    THREE.Cache.remove(fbxFileUrl);
				}
				else if(entryName.endWith(".assist")){
					assistEntry = entry;
					assistName = entryName;
					var assistFileUrl = thatFbxValidator.getAssistFileUrl(assistName);
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
						let fileInfo = event.target.fileInfo;
						let fbxName = fileInfo.fbxName;
						const fbxFileUrl = thatFbxValidator.getFbxFileUrl(thatFbxValidator.resFbxId, fbxName);
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
								thatFbxValidator.afterUnzipFbx(fileInfo.fbxName, fileInfo.assistName);
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
		    	    	var assistFileUrl = thatFbxValidator.getAssistFileUrl(assistName);
		    		    THREE.Cache.add(assistFileUrl, base64);
		    		    thatFbxValidator.afterUnzipFbx(fileInfo.fbxName, fileInfo.assistName);
		    		};
		    		reader.readAsArrayBuffer(blob);     	    		
		    	},
		    	function(progress){
		    	}, fbxEntry.crc32);
	    	}
		}, function(er){
			thatFbxValidator.previewError = true;
			throw er;
		});
	}

	this.afterUnzipFbx = function(fbxFileName, assistFileName){
    	let canLoadFbxObject3D = true;
		let fbxFileUrl = thatFbxValidator.getFbxFileUrl(thatFbxValidator.resFbxId, fbxFileName);
		let fbxArray = THREE.Cache.get(fbxFileUrl);
    	if(fbxArray == null){
    		canLoadFbxObject3D = false;
    	}
		let assistInfo = null;
		if(assistFileName.length > 0){
			let assistFileUrl = thatFbxValidator.getAssistFileUrl(assistFileName);
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
			let loader = new FBXLoader();
			let imgPath = thatFbxValidator.getImgFileUrl(thatFbxValidator.resFbxId, "");
			let fbxObject3D = loader.parse(fbxArray, imgPath);
			//支持scene包含多个object3d modified by ls 20231204
			let object3D = new THREE.Object3D();
			let sizeBox = new THREE.Box3().setFromObject(fbxObject3D, true);
			thatFbxValidator.size = {
				x: sizeBox.max.x - sizeBox.min.x,
				y: sizeBox.max.y - sizeBox.min.y,
				z: sizeBox.max.z - sizeBox.min.z
			};
			let shiftValues = {
				x: -(sizeBox.max.x + sizeBox.min.x) / 2,
				y: -(sizeBox.max.y + sizeBox.min.y) / 2,
				z: -(sizeBox.max.z + sizeBox.min.z) / 2
			};
			fbxObject3D.position.set(
				fbxObject3D.position.x + shiftValues.x,
				fbxObject3D.position.y + shiftValues.z,
				fbxObject3D.position.y + shiftValues.z
			);
			object3D.add(fbxObject3D);
			$("#" + thatFbxValidator.previewContainerId).empty();
			thatFbxValidator.draw(object3D);
		}
	}

	this.showImportedLog = function(statusStr){  
		$(".processStatusDiv").html(statusStr);
	}
	
    this.initRender = function(containerId) {
    	var containerDom = $("#" + thatFbxValidator.previewContainerId)[0];
        var width = $(containerDom).width();
        var height = $(containerDom).height(); 
        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(width, height);
		renderer.setClearColor(0xFFFFFF);
        containerDom.appendChild(renderer.domElement);
        thatFbxValidator.renderer = renderer;
    }

    this.initCamera = function(){
    	var containerDom = $("#" + thatFbxValidator.previewContainerId)[0];
        var width = $(containerDom).width();
        var height = $(containerDom).height(); 
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 4, 10);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        thatFbxValidator.camera = camera;
    }

    this.initScene = function() {
        var scene = new THREE.Scene();
        thatFbxValidator.scene = scene;
    } 
    
    this.initLight = function() { 
    	var ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        thatFbxValidator.ambientLight = ambientLight;
    	thatFbxValidator.scene.add(ambientLight);  
    	
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
        
        thatFbxValidator.directionalLight = directionalLight;

        thatFbxValidator.scene.add(directionalLight);
    } 
 
    this.initControls = function(){

        var controls = new OrbitControls(thatFbxValidator.camera, thatFbxValidator.renderer.domElement); 
        thatFbxValidator.controls = controls;
    }

    this.render = function() {
    	thatFbxValidator.renderer.render(thatFbxValidator.scene, thatFbxValidator.camera);
    }

    //窗口变动触发的函数
    this.onWindowResize = function() {
    	var containerDom = $("#" + thatFbxValidator.previewContainerId)[0];
        var width = $(containerDom).width();
        var height = $(containerDom).height(); 
    	thatFbxValidator.camera.aspect = width / height;
    	thatFbxValidator.camera.updateProjectionMatrix();
    	thatFbxValidator.render();
    	thatFbxValidator.renderer.setSize(width, height);
    }

    this.animate = function() {
        //更新控制器
    	thatFbxValidator.render();
    	thatFbxValidator.controls.update();
        requestAnimationFrame(thatFbxValidator.animate);
    }

    this.draw = function(object3D) { 
    	thatFbxValidator.initRender();
    	thatFbxValidator.initScene();
    	thatFbxValidator.initCamera();
    	thatFbxValidator.initLight();
    	thatFbxValidator.initControls();
    	thatFbxValidator.animate();
        window.onresize = thatFbxValidator.onWindowResize;
        thatFbxValidator.addObject3D(object3D);
    }
    
    this.addObject3D = function(object3D){
    	thatFbxValidator.scene.add(object3D);
    }
}
export default FbxValidator