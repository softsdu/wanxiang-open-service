import CoreEditor from "common/js/coreEditor.js";
import Object3DPreviewCreator from "common/js/object3DPreviewCreator.js";

let CorePreview = function(){
	var thatCE = this; 
	
	this.base = CoreEditor;
	
	this.base();
	
	//模型  
	this.componentInfo = null;
	
	//编辑界面的环境变量 added by ls 20230607
	this.editorSettings = null;

	//背景颜色 added by liyh 20230907
	this.backgroundColor = 0x111111;
	
    //初始化,入口方法
	this.init = function(p) {  
		thatCE.containerId = p.containerId;  
		thatCE.previewComponentInfo = p.previewComponentInfo;
		thatCE.transformControlVisible = p.transformControlVisible == null ? true : p.transformControlVisible;
		thatCE.attachLine2dVisible = p.attachLine2dVisible == null ? true : p.attachLine2dVisible;
		thatCE.unitInfoVisible = p.unitInfoVisible == null ? true : p.unitInfoVisible;		
		thatCE.unitListVisible = p.unitListVisible == null ? true : p.unitListVisible;
		thatCE.groupVisible = p.groupVisible == null ? true : p.groupVisible;
		thatCE.groundPlaneVisible = p.groundPlaneVisible == null ? true : p.groundPlaneVisible;
		thatCE.gridVisible = p.gridVisible == null ? true : p.gridVisible;
		thatCE.groundContextMenuVisible = p.groundContextMenuVisible == null ? true : p.groundContextMenuVisible;
		thatCE.componentContextMenuVisible = p.componentContextMenuVisible == null ? true : p.componentContextMenuVisible;
		thatCE.titleVisible = p.titleVisible == null ? true : p.titleVisible;
		
		thatCE.afterSelectUnitFunc = p.afterSelectUnitFunc;
		thatCE.afterShowUnitFunc = p.afterShowUnitFunc; 

		thatCE.containerPos = {
			x: $("#" + p.containerId).find(".coreContainer").offset().left,
			y: $("#" + p.containerId).find(".coreContainer").offset().top
		};  

		//编辑界面的环境变量 added by ls 20230607
		thatCE.editorSettings = p.settings;

		//添加背景颜色的传递和设置 added by liyh 20230907
		thatCE.backgroundColor = p.settings.backgroundColor;
    };    
    
    this.initObject3DCreator = function(){
    	var object3DCreator = new Object3DPreviewCreator();
    	object3DCreator.init({
    		editor: thatCE
    	});
    	
    	//设置为与编辑界面相同 added by ls 20230607
    	object3DCreator.viewLevel = thatCE.editorSettings.viewLevel;
    	object3DCreator.detailLevel = thatCE.editorSettings.detailLevel;
    	thatCE.object3DCreator = object3DCreator;
    }

    this.load = function(componentInfo) {
    	thatCE.componentInfo = componentInfo;
    	thatCE.initTabEvent(); 
    	thatCE.initScene();
    	thatCE.initRender();
    	thatCE.initRender2D();
    	thatCE.initCamera();
    	thatCE.initControls();  
        thatCE.initLight();
    	thatCE.initTransformControl(componentInfo); 
    	thatCE.initRaycaster(); 
        thatCE.setInitViewport(); 
        thatCE.initObject3DCreator(); 
    	thatCE.initPointCtrlProcessor();
        
        thatCE.showPreview(componentInfo);
    	
    	thatCE.animate(); 
    	thatCE.initToolbar(); 
    	thatCE.initToolbarEvent();
    	thatCE.initTabEvent();
        window.addEventListener('resize', thatCE.onWindowResize, false); 
        $("#" + thatCE.containerId).find(".coreContainer").mousedown(thatCE.onMouseDown);
        $("#" + thatCE.containerId).mousemove(thatCE.onMouseMove);
        $("#" + thatCE.containerId).find(".coreContainer").mouseup(thatCE.onMouseUp); 
        $("#" + thatCE.containerId).find(".coreContainer").focus();        
    }; 
    
    this.showPreview = function(componentInfo){ 
    	thatCE.initLoadingProgress(1);
		thatCE.object3DCreator.createPreviewObject3D(componentInfo, thatCE.afterBuildPreviewObject3D);
    }
    
    this.afterBuildPreviewObject3D = function(unit3DInfo){
    	thatCE.afterBuildObject3D(unit3DInfo);
        thatCE.refreshLoadingProgress(0, 0); 
        thatCE.setCenterObject(unit3DInfo.object3D); 
    }
    /* 循环渲染 */
    thatCE.animate = function(time) { 
        thatCE.renderer.render(thatCE.scene, thatCE.camera);  
        thatCE.renderer2d.render(thatCE.scene, thatCE.camera);  
        
        requestAnimationFrame( thatCE.animate ); 
        thatCE.doEvent("afterAnimate", {editor: thatCE, time: time});
    }; 
}

export default CorePreview