//因升级threejs r146，更新此代码 modified by ls 20230322
import * as THREE from "three";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import coreEditor from "common/js/coreEditor.js";

let PointControlProcessor = function(){
	var thatPointCtrl = this;
	
	this.editor = null; 
	this.pointTransformCtrl = null;
	
	this.selectedPointCtrlObject3D = null;
	
	this.pointCtrlBoxMaterial = new THREE.MeshBasicMaterial({
    	color: 0xFFFF00,
  		transparent: true,
  		opacity: 0.9,  
		flatShading: true,
    	side: THREE.FrontSide
	});
	this.pointCtrlEdgeMaterial =new THREE.LineBasicMaterial({
		color: 0x666666, 
		linewidth: 1
	});
	
	this.init = function(p){ 
		thatPointCtrl.editor = p.editor;
		var pointInfos = p.editor.componentInfo.points;
		thatPointCtrl.initPointTransformCtrl(); 
		thatPointCtrl.initPointListHtml(pointInfos);
		thatPointCtrl.initAllPointObject3Ds(pointInfos);
		thatPointCtrl.initUnitPropertyInputEvent();
		thatPointCtrl.initToolbarEvent();
	}  
    this.initToolbarEvent = function(){ 
    	$("#" + thatPointCtrl.editor.containerId).find(".sortPointControlBtn").click(function(){ 
    		thatPointCtrl.showPointCtrlSortWindow();
    	});
    }
	
	this.initPointTransformCtrl = function(){
		var control = new TransformControls(thatPointCtrl.editor.camera, thatPointCtrl.editor.renderer2d.domElement); 
		control.addEventListener("objectChange", thatPointCtrl.pointCtrlTransformDrag); 
		control.addEventListener("mouseUp", thatPointCtrl.pointTransformMouseUp);   
		thatPointCtrl.editor.scene.add(control);
		thatPointCtrl.pointTransformCtrl = control;
		thatPointCtrl.refreshPointTransformControlSize();	
	}

    this.pointTransformMouseUp = function(upEv, sysEv){
    	thatPointCtrl.editor.refreshAttachHelpLine();
    }
	
	this.refreshPointTransformControlSize = function(){
    	if(thatPointCtrl.editor.transformControlVisible){
    		thatPointCtrl.pointTransformCtrl.setSize( thatPointCtrl.editor.componentInfo.controlSize * 15 / thatPointCtrl.editor.camera.zoom);
    	}
	}
	
	this.initPointListHtml = function(pointInfos){
		var allPointHtml = "";
		for(var i = 0; i < pointInfos.length; i++){
			var pointInfo = pointInfos[i];
			allPointHtml += thatPointCtrl.getPointCtrlHtml(pointInfo);
		}

    	var allPointCtrlContainer = $("#" + thatPointCtrl.editor.containerId).find(".core3dTabContent[name='pointControlList'] .core3dListContainer");
    	$(allPointCtrlContainer).html(allPointHtml);
	}
	
    this.getPointCtrlHtml = function(pointInfo){ 
    	var html = "<div class=\"pointCtrlItem\" pointCtrlId=\"" + pointInfo.id + "\" pointCtrlName=\"" + pointInfo.name + "\">"
			+ "<input type=\"checkbox\" class=\"pointCtrlItemCheck\"></input>" 
			+ "<div class=\"pointCtrlItemText\"><span class=\"pointCtrlItemName\">" + cmnPcr.html_encode(pointInfo.name) + "</span></div>"
			+ "<div class=\"pointCtrlItemDeleteBtn\" title=\"删除\"></div>"
			+ "</div>";
		return html;
    }  
	
	this.initAllPointObject3Ds = function(pointInfos){
		for(var i = 0; i < pointInfos.length; i++){
			var pointInfo = pointInfos[i];
			thatPointCtrl.createPointObject3D(pointInfo);
			thatPointCtrl.initPointCtrlItemBtnEvent(pointInfo.id);
		}
	}
	
	this.refreshAllPointObject3Ds = function(){ 
		var allPointCtrlInfos = thatPointCtrl.getAllPointCtrlInfoArray();

		for(var i = 0; i < allPointCtrlInfos.length; i++){
			var pointInfo = allPointCtrlInfos[i];
			var object3D = thatPointCtrl.getPointCtrlObject3DById(pointInfo.id);
			thatPointCtrl.editor.scene.remove(object3D);			
		}
		for(var i = 0; i < allPointCtrlInfos.length; i++){
			var pointInfo = allPointCtrlInfos[i];
			thatPointCtrl.createPointObject3D(pointInfo);
		}
	}
	
	this.createPointObject3D = function(pointInfo){
    	var edgeSize = thatPointCtrl.editor.componentInfo.placePointRadius == null ? 0.01 : thatPointCtrl.editor.componentInfo.placePointRadius * 2;    	 
		var pointCtrlMesh= new THREE.Mesh(
	        new THREE.BoxGeometry(edgeSize, edgeSize, edgeSize),
	        thatPointCtrl.pointCtrlBoxMaterial
	    );    	
		pointCtrlMesh.position.set(pointInfo.position[0], pointInfo.position[1], pointInfo.position[2]);  
		pointCtrlMesh.isPointCtrl = true;
		pointCtrlMesh.pointCtrlData = {
			id: pointInfo.id,
			name: pointInfo.name
		};

        var pointCtrlEdges= new THREE.EdgesGeometry(pointCtrlMesh.geometry, 25);
        var pointCtrlLine = new THREE.LineSegments(pointCtrlEdges, thatPointCtrl.pointCtrlEdgeMaterial);
        pointCtrlLine.isEdgeLine = true; 
        pointCtrlMesh.add(pointCtrlLine);
        
		thatPointCtrl.editor.scene.add(pointCtrlMesh);
		return pointCtrlMesh;
	}
	
	this.removePointCtrlByObject3D = function(object3D, notConfirm){ 
		var pointCtrlId = object3D.pointCtrlData.id;
		thatPointCtrl.removePointCtrl(pointCtrlId, notConfirm);
	}
	
	this.removeAllPointCtrl = function(notConfirm){
		if(notConfirm || msgBox.confirm({info: "确定要删除全部辅助点吗?"})){
	    	var allPointCtrlItems = $("#" + thatPointCtrl.editor.containerId).find(".core3dTabContent[name='pointControlList'] .core3dListContainer .pointCtrlItem");
	    	var allPointCtrlIds = [];
	    	for(var i = 0; i < allPointCtrlItems.length; i++){
	    		var pointCtrlItem = allPointCtrlItems[i];
	    		allPointCtrlIds.push($(pointCtrlItem).attr("pointCtrlId"));
	    	}
	    	for(var i = 0; i < allPointCtrlIds.length; i++){
	    		thatPointCtrl.removePointCtrl(allPointCtrlIds[i], true);
	    	}
		}
	}
	
	this.removePointCtrl = function(pointCtrlId, notConfirm){
		if(notConfirm || msgBox.confirm({info: "确定要删除此辅助点吗?"})){
	    	var allPointCtrlContainer = $("#" + thatPointCtrl.editor.containerId).find(".core3dTabContent[name='pointControlList'] .core3dListContainer");
			$(allPointCtrlContainer).find(".pointCtrlItem[pointCtrlId=\"" + pointCtrlId + "\"]").remove();
			var object3D = thatPointCtrl.getPointCtrlObject3DById(pointCtrlId);
			thatPointCtrl.editor.scene.remove(object3D);
			if(object3D == thatPointCtrl.selectedPointCtrlObject3D){
				thatPointCtrl.detachTransformControl();
				thatPointCtrl.selectedPointCtrlObject3D = null;
			}
		}
	}
	
	this.addNewPointCtrl = function(position, name){
		var newIdAndName = thatPointCtrl.getNewPointCtrlIdAndName((name == null ? "辅助点_1" : name), "辅助点");
		var pointInfo = {
			id: newIdAndName.id,
			name: newIdAndName.name,
			position: [position.x, position.y, position.z]
		};
		
    	var allPointCtrlContainer = $("#" + thatPointCtrl.editor.containerId).find(".core3dTabContent[name='pointControlList'] .core3dListContainer");
		var pointHtml = thatPointCtrl.getPointCtrlHtml(pointInfo);
    	$(allPointCtrlContainer).append(pointHtml);

		var object3D = thatPointCtrl.createPointObject3D(pointInfo);
		thatPointCtrl.initPointCtrlItemBtnEvent(pointInfo.id);
		return object3D;
	}
	
    this.getAllPointCtrlNameDic = function(){ 
   	 	var allPointCtrlNameDics = {}; 
    	var mainScene = thatPointCtrl.editor.getMainScene();  
    	for(var i = 0; i < mainScene.children.length; i++){
    		var childObj = mainScene.children[i]; 
    		if(childObj.isPointCtrl){
    			allPointCtrlNameDics[childObj.pointCtrlData.name] = true; 
    		}
    	} 
     	return allPointCtrlNameDics;
    }  
    
    this.hasSameNamePointCtrl = function(allPointCtrlNameDic, name){  
    	return allPointCtrlNameDic[name] ? true : false;  
    }
    
    this.getNewPointCtrlIdAndName = function(defaultName, namePrefix){ 
    	var newId = thatPointCtrl.editor.getGuid();
    	var allPointCtrlNameDic = thatPointCtrl.getAllPointCtrlNameDic();  
    	var i = 0;
    	var newName = defaultName;
    	while(thatPointCtrl.hasSameNamePointCtrl(allPointCtrlNameDic, newName)){
    		i++;
    		newName = namePrefix + "_" + i;
    	} 
     	return {
    		id: newId,
    		name: newName
    	};
    }    

    this.getPointCtrlObject3DById = function(pointCtrlId){
   	 	var mainScene = thatPointCtrl.editor.getMainScene();  
   	 	var allPointInfos = [];
   	 	for(var i = 0; i < mainScene.children.length; i++){
   	 		var object3D = mainScene.children[i];
   	 		if(object3D.isPointCtrl){
			 	if(object3D.pointCtrlData.id == pointCtrlId){
				 	return object3D;
			 	}
		 	} 
	 	}
	 	return null;
    }
    
    this.getAllPointCtrlInfoDic = function(){
    	 var mainScene = thatPointCtrl.editor.getMainScene();  
    	 var allPointInfos = {};
    	 for(var i = 0; i < mainScene.children.length; i++){
    		 var object3D = mainScene.children[i];
    		 if(object3D.isPointCtrl){
    			 var pointInfo = thatPointCtrl.getPointCtrlInfoFromObject3D(object3D); 
    			 allPointInfos[pointInfo.id] = pointInfo;
    		 } 
    	 }
    	 return allPointInfos;
    }
    
    this.getAllPointCtrlInfoArray = function(){ 
    	var allPointInfoDic = thatPointCtrl.getAllPointCtrlInfoDic();
    	var allPointInfoArray = new Array();
    	var allPointCtrlItems = $("#" + thatPointCtrl.editor.containerId).find(".pointCtrlItem"); 
    	for(var i = 0; i < allPointCtrlItems.length; i++){
    		var pointCtrlItem = allPointCtrlItems[i];
    		var pointCtrlId = $(pointCtrlItem).attr("pointCtrlId");
    		allPointInfoArray.push(allPointInfoDic[pointCtrlId]);
    	}
    	return allPointInfoArray;
    }

    this.getPointCtrlInfoFromObject3D = function(object3D){
    	var position = object3D.position; 
		var pointInfo = { 
			id: object3D.pointCtrlData.id,
			name: object3D.pointCtrlData.name, 
			position: [position.x, position.y, position.z] 
		 }; 
    	return pointInfo;
    }

    this.initPointCtrlItemBtnEvent = function(pointCtrlId){
    	var btnContainer = $("#" + thatPointCtrl.editor.containerId).find(".pointCtrlItem[pointCtrlId='" + pointCtrlId + "']")[0];
    	 
    	$(btnContainer).find(".pointCtrlItemDeleteBtn").click(function(){ 
    		if(thatPointCtrl.editor.checkIsNormalStatus()){
	    		var pointCtrlId = $(this).parent().attr("pointCtrlId"); 
	    		thatPointCtrl.removePointCtrl(pointCtrlId);   
    		}
    	}); 
    	$(btnContainer).find(".pointCtrlItemName").click(function(){
    		if(thatPointCtrl.editor.checkIsNormalStatus()){
	    		var pointCtrlId = $(this).parent().parent().attr("pointCtrlId"); 
	    		var object3D = thatPointCtrl.getPointCtrlObject3DById(pointCtrlId);
	    		thatPointCtrl.selectPointCtrlObject(object3D);
    		}
    	});   
    	$(btnContainer).find(".pointCtrlItemCheck").change(function(){ 
    		var noneCheck = $(this).hasClass("pointCtrlItemNoneCheck"); 
    		if(noneCheck){
        		$(this).removeClass("pointCtrlItemNoneCheck"); 
    		}
    		else{
        		$(this).addClass("pointCtrlItemNoneCheck"); 
    		}
    		var checked = noneCheck; 
    		var pointCtrlId = $(this).parent().attr("pointCtrlId");
        	thatPointCtrl.setPointCtrlObjectVisible(pointCtrlId, checked);  
    	});  
    } 

    this.setPointCtrlObjectVisible = function(pointCtrlId, visible){
		var object3D = thatPointCtrl.getPointCtrlObject3DById(pointCtrlId);
		object3D.visible = visible;
		var children = object3D.children;
		if(children != null){
			for(var i = 0; i < children.length; i++){
				var child = children[i];
				child.visible = visible;
			}
		}
    }

    this.renamePointCtrl = function(pointCtrlInfo){
		var pointCtrlItem = $("#" +thatPointCtrl.editor.containerId).find(".pointCtrlItem[pointCtrlId='" + pointCtrlInfo.id + "']");
		$(pointCtrlItem).attr("pointCtrlName", pointCtrlInfo.name);
		$(pointCtrlItem).find(".pointCtrlItemName").text(pointCtrlInfo.name); 
    }    
    
    this.checkHasSameNamePointCtrl = function(pointCtrlInfo){  
    	var mainScene = thatPointCtrl.editor.getMainScene();  
    	for(var i = 0; i < mainScene.children.length; i++){
    		var childObj = mainScene.children[i]; 
    		if(childObj.isPointCtrl){
    			if(childObj.pointCtrlData.name == pointCtrlInfo.name && childObj.pointCtrlData.id != pointCtrlInfo.id){
    				return true;
    			}
    		}
    	}
    	return false;
    }

    this.selectPointCtrlObject = function(object3D){
    	if(thatPointCtrl.editor.status == js3CoreEditorStatus.normal){ 
    		var selectedPointCtrlObject3D = thatPointCtrl.selectedPointCtrlObject3D;
	        if (selectedPointCtrlObject3D != null) {  
	        	thatPointCtrl.editor.selectObjectUnlight(selectedPointCtrlObject3D);  
	        	thatPointCtrl.detachTransformControl();
	        }
	        thatPointCtrl.selectedPointCtrlObject3D = object3D;
	        if(object3D != null){ 
	        	thatPointCtrl.editor.selectObjectLight(object3D); 
	        	thatPointCtrl.attachTransformControl(object3D);  
	        	thatPointCtrl.showPointCtrlInfo(object3D);  
	        }
	        else{	        		 
	        	thatPointCtrl.showPointCtrlInfo(null); 
	        }	
    	}
    	thatPointCtrl.editor.refreshAttachHelpLine2d();
    } 

    this.showPointCtrlInfo = function(object3D){ 
    	thatPointCtrl.selectedPointCtrlObject3D = object3D;
    	thatPointCtrl.editor.attachLines = null;
		var pointCtrlId = null;
		if(object3D == null){
			thatPointCtrl.detachTransformControl();
        	if(thatPointCtrl.editor.unitInfoVisible){
    	    	$("#" + thatPointCtrl.editor.containerId).find(".propertyList[name='multiUnitPropertyList']").removeClass("propertyListSelected");	
		    	$("#" + thatPointCtrl.editor.containerId).find(".propertyList[name='unitPropertyList']").removeClass("propertyListSelected");	 
		    	$("#" + thatPointCtrl.editor.containerId).find(".propertyList[name='pointCtrlPropertyList']").removeClass("propertyListSelected");
		    	$("#" + thatPointCtrl.editor.containerId).find(".propertyList[name='componentPropertyList']").addClass("propertyListSelected");	
        	}
		}
		else{
        	if(thatPointCtrl.editor.unitInfoVisible){
    	    	$("#" + thatPointCtrl.editor.containerId).find(".propertyList[name='multiUnitPropertyList']").removeClass("propertyListSelected");
		    	$("#" + thatPointCtrl.editor.containerId).find(".propertyList[name='componentPropertyList']").removeClass("propertyListSelected");	 
		    	$("#" + thatPointCtrl.editor.containerId).find(".propertyList[name='unitPropertyList']").removeClass("propertyListSelected");	
		    	$("#" + thatPointCtrl.editor.containerId).find(".propertyList[name='pointCtrlPropertyList']").addClass("propertyListSelected");
		    	thatPointCtrl.refreshPointCtrlPropertyValues(object3D);
        	}
        	pointCtrlId = object3D.pointCtrlData.id; 
		}
		if(thatPointCtrl.editor.unitListVisible){
	    	var pointCtrlItems = $("#" + thatPointCtrl.editor.containerId).find(".pointCtrlItem");
	    	for(var i = 0; i < pointCtrlItems.length; i++){
	    		var pointCtrlItem = pointCtrlItems[i]; 
	    		if($(pointCtrlItem).attr("pointCtrlId") == pointCtrlId){
	    			$(pointCtrlItem).addClass("pointCtrlItemSelected");
	    		}
	    		else{
	    			$(pointCtrlItem).removeClass("pointCtrlItemSelected");
	    		}
	    	}
		} 
    }
    
    this.refreshPointCtrlPropertyValues = function(object3D){ 
    	var pointCtrlInfo = thatPointCtrl.getPointCtrlInfoFromObject3D(object3D);  
    	$("#" + thatPointCtrl.editor.containerId).find(".propertyItem").find(".propertyInput[name='pointCtrlName']").val(pointCtrlInfo.name); 
    	$("#" + thatPointCtrl.editor.containerId).find(".propertyItem").find(".propertyInput[name='pointCtrlPosX']").val(thatPointCtrl.editor.getDisplayValueStr(pointCtrlInfo.position[0]));
    	$("#" + thatPointCtrl.editor.containerId).find(".propertyItem").find(".propertyInput[name='pointCtrlPosY']").val(thatPointCtrl.editor.getDisplayValueStr(pointCtrlInfo.position[1]));
    	$("#" + thatPointCtrl.editor.containerId).find(".propertyItem").find(".propertyInput[name='pointCtrlPosZ']").val(thatPointCtrl.editor.getDisplayValueStr(pointCtrlInfo.position[2])); 

    	$("#" + thatPointCtrl.editor.containerId).find(".propertyItem").find(".propertyInput[name='pointCtrlName']").attr("sourceValue", pointCtrlInfo.name); 
    	$("#" + thatPointCtrl.editor.containerId).find(".propertyItem").find(".propertyInput[name='pointCtrlPosX']").attr("sourceValue", thatPointCtrl.editor.getDisplayValueStr(pointCtrlInfo.position[0]));
    	$("#" + thatPointCtrl.editor.containerId).find(".propertyItem").find(".propertyInput[name='pointCtrlPosY']").attr("sourceValue", thatPointCtrl.editor.getDisplayValueStr(pointCtrlInfo.position[1]));
    	$("#" + thatPointCtrl.editor.containerId).find(".propertyItem").find(".propertyInput[name='pointCtrlPosZ']").attr("sourceValue", thatPointCtrl.editor.getDisplayValueStr(pointCtrlInfo.position[2]));   
    } 
    
    this.detachTransformControl = function(){ 
    	if(thatPointCtrl.editor.transformControlVisible){
    		thatPointCtrl.pointTransformCtrl.detach(); 
    	}
    }     
     
    this.attachTransformControl = function(object){
    	if(thatPointCtrl.editor.transformControlVisible){
    		thatPointCtrl.pointTransformCtrl.attach(object); 
    		thatPointCtrl.refreshPointTransformControlSize();
    	}
    } 

    this.initUnitPropertyInputEvent = function(){ 
    	$("#" + thatPointCtrl.editor.containerId).find(".propertyList[name='pointCtrlPropertyList'] .propertyItem").find(".propertyInput").change(function(){
        	var object3D = thatPointCtrl.selectedPointCtrlObject3D;
        	if(object3D != null){
        		var newValue = $(this).val().trim();
        		thatPointCtrl.changePointCtrlPropertyInputValue(newValue, this, object3D)
        	}
    	});
    } 
    
    this.changePointCtrlPropertyInputValue = function(newValue, inputElement, object3D, forceChange){
    	var pointCtrlId = object3D.pointCtrlData.id;
		var propertyName = $(inputElement).attr("name");
		var message = null;
		newValue = newValue.trim();
		var canReValue = true;
		if(!forceChange){
			//如果不是强制修改值，那么如果位置有表达式，那么直接修改位置值无效
			switch(propertyName){
				case "pointCtrlName":{
					canReValue = !thatPointCtrl.checkHasSameNamePointCtrl({id: pointCtrlId, name: newValue});
					if(!canReValue){
						message = "存在重名的辅助点";  
	    			} 
					break;
				}
				case "pointCtrlPosX":
				case "pointCtrlPosY":
				case "pointCtrlPosZ":{
	    			var newDecimalValue = Math.floor(cmnPcr.strToDecimal(newValue));
	    			var canReValue = !isNaN(newDecimalValue);
	    			if(!canReValue){
						message = "录入值不是数值类型";  
	    			}
					break;
				}
			}
		}
		
		if(canReValue){
			if(newValue.length == 0){
				var oldValue = $(inputElement).attr("sourceValue");
				$(inputElement).val(oldValue);
			}
			else{
	    		switch(propertyName){
		    		case "pointCtrlName":{
		    			object3D.pointCtrlData.name = newValue;
		            	$("#" + thatPointCtrl.editor.containerId).find(".pointCtrlItem[pointCtrlId='" + pointCtrlId + "'] .pointCtrlItemName").text(newValue); 
		            	thatPointCtrl.refreshPointCtrlPropertyValues(object3D); 
		    			break;
		    		} 
		    		case "pointCtrlPosX":
		    		case "pointCtrlPosY":
		    		case "pointCtrlPosZ":{
		    			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatPointCtrl.editor.valueMultiply; 
		    			var newPos = [object3D.position.x, object3D.position.y, object3D.position.z];
		    			if(propertyName == "pointCtrlPosX"){
		    				newPos[0] = newDecimalValue;
		    			}
		    			if(propertyName == "pointCtrlPosY"){
		    				newPos[1] = newDecimalValue;
		    			}
		    			if(propertyName == "pointCtrlPosZ"){
		    				newPos[2] = newDecimalValue;
		    			}		    			
		    	       	object3D.position.set(newPos[0], newPos[1], newPos[2]); 
		    	       	thatPointCtrl.attachTransformControl(object3D);
		    	       	thatPointCtrl.refreshPointCtrlPropertyValues(object3D);
		    	       	thatPointCtrl.editor.refreshAttachHelpLine2d(); 
		    	       	thatPointCtrl.rebuildRelatedUnitObject3D(object3D);
		    	       	thatPointCtrl.editor.doEvent("afterPointCtrlChangePosition", {
		    	       		editor: thatPointCtrl.editor,
		    	       		pointCtrlData: object3D.pointCtrlData
		    	       	});
		    			break;
		    		};  
	    		}
			}	 
		}
		else{
			var oldValue = $(inputElement).attr("sourceValue");
			$(inputElement).val(oldValue);
			msgBox.alert({info: message});
		}
	}

    this.pointCtrlTransformDrag = function(transformEv, sysEv){  
    	var object3D = thatPointCtrl.selectedPointCtrlObject3D;
    	if(!sysEv.shiftKey){  
	    	if(thatPointCtrl.editor.attachLines == null){
	    		thatPointCtrl.editor.attachLines = thatPointCtrl.editor.getAttachLines(object3D);
	    	}
	    	
	    	if(transformEv.target.axis == "X"){ 
    			var attachValueObj = thatPointCtrl.editor.calcNearestCenterValue(thatPointCtrl.editor.attachLines.x, null, object3D.position.x, null); 
	    		if(attachValueObj.newValue != null){
	    			object3D.position.set(attachValueObj.newValue, object3D.position.y, object3D.position.z); 
	    		}
	    		thatPointCtrl.editor.refreshAttachHelpLine("X", attachValueObj.helpLineValue);
	    	}
	    	else if(transformEv.target.axis == "Y"){
	    		var attachValueObj = thatPointCtrl.editor.calcNearestCenterValue(thatPointCtrl.editor.attachLines.y, null, object3D.position.y, null);
	    		if(attachValueObj.newValue != null){
	    			object3D.position.set(object3D.position.x, attachValueObj.newValue, object3D.position.z);
	    		}
	    		thatPointCtrl.editor.refreshAttachHelpLine("Y", attachValueObj.helpLineValue);
	    	}
	    	else if(transformEv.target.axis == "Z" ){
	    		var attachValueObj = thatPointCtrl.editor.calcNearestCenterValue(thatPointCtrl.editor.attachLines.z, null, object3D.position.z, null);
	    		if(attachValueObj.newValue != null){
	    			object3D.position.set(object3D.position.x, object3D.position.y, attachValueObj.newValue);
	    		}   
	    		thatPointCtrl.editor.refreshAttachHelpLine("Z", attachValueObj.helpLineValue); 		
	    	} 
	    	else if(transformEv.target.axis == "XZ"){
	    		var attachValueObjX = thatPointCtrl.editor.calcNearestCenterValue(thatPointCtrl.editor.attachLines.x, null, object3D.position.x, null);
	    		var attachValueObjZ = thatPointCtrl.editor.calcNearestCenterValue(thatPointCtrl.editor.attachLines.z, null, object3D.position.z, null);
	    		if(attachValueObjX.newValue != null && attachValueObjZ.newValue != null){
	    			object3D.position.set(attachValueObjX.newValue, object3D.position.y, attachValueObjZ.newValue);
	    		}    		
	    		else if(attachValueObjX.newValue != null){
	    			object3D.position.set(attachValueObjX.newValue, object3D.position.y, object3D.position.z);
	    		}
	    		else  if(attachValueObjZ.newValue != null){
	    			object3D.position.set(object3D.position.x, object3D.position.y, attachValueObjZ.newValue);
	    		}    
	    		thatPointCtrl.editor.refreshAttachHelpLine("X", attachValueObjX.helpLineValue);
	    		thatPointCtrl.editor.refreshAttachHelpLine("Z", attachValueObjZ.helpLineValue);
	    	}
    	}
    	else{
    		thatPointCtrl.editor.refreshAttachHelpLine();
    	}
  
		thatPointCtrl.refreshPointCtrlPropertyValues(object3D); 
		thatPointCtrl.refreshAttachHelpLine2d();
    }

    this.refreshAttachHelpLine2d = function(){
    	if(thatPointCtrl.editor.attachLine2dVisible){
	    	if(thatPointCtrl.selectedPointCtrlObject3D != null){  
	    		var object3D = thatPointCtrl.selectedPointCtrlObject3D;
	    		var textRectWidth = 40;
	    		var textRectHeight = 18; 	
		    	var posXLine = $("#" + thatPointCtrl.editor.containerId).find(".attachHelpLine[name='posX']")[0]; 
		    	var posXPA = thatPointCtrl.editor.get2DPosition(new THREE.Vector3(0, 0, object3D.position.z));   
		    	var posXPB = thatPointCtrl.editor.get2DPosition(new THREE.Vector3(object3D.position.x, 0, object3D.position.z));  
		    	posXLine.setAttribute("x1", posXPA.x);
		    	posXLine.setAttribute("y1", posXPA.y);
		    	posXLine.setAttribute("x2", posXPB.x);
		    	posXLine.setAttribute("y2", posXPB.y); 
		    	$(posXLine).css({display: "block"});
		    	
		    	var posZLine = $("#" + thatPointCtrl.editor.containerId).find(".attachHelpLine[name='posZ']")[0]; 
		    	var posZPA = thatPointCtrl.editor.get2DPosition(new THREE.Vector3(object3D.position.x, 0, 0));   
		    	var posZPB = thatPointCtrl.editor.get2DPosition(new THREE.Vector3(object3D.position.x, 0, object3D.position.z));  
		    	posZLine.setAttribute("x1", posZPA.x);
		    	posZLine.setAttribute("y1", posZPA.y);
		    	posZLine.setAttribute("x2", posZPB.x);
		    	posZLine.setAttribute("y2", posZPB.y); 
		    	$(posZLine).css({display: "block"});  
	
		    	var posXLineLen = Math.sqrt((posXPB.x - posXPA.x) * (posXPB.x - posXPA.x) + (posXPB.y - posXPA.y) * (posXPB.y - posXPA.y));
		    	var posXTextCenter = {
	    			x: (posXPB.x + posXPA.x) / 2,
	    			y: (posXPB.y + posXPA.y) / 2
		    	};    	
		    	var posXArc = posXLineLen == 0 ? 0 : ((posXPB.x > posXPA.x ) ? (Math.asin((posXPB.y - posXPA.y) / posXLineLen) * 180 / Math.PI) : (Math.asin((posXPA.y - posXPB.y) / posXLineLen) * 180 / Math.PI));
		    	var posXText = $("#" + thatPointCtrl.editor.containerId).find(".attachHelpText[name='posX']")[0]; 
		    	$(posXText).css({display: posXLineLen > textRectWidth ? "block" : "none"});
		    	posXText.setAttribute("x", posXTextCenter.x );
		    	posXText.setAttribute("y", posXTextCenter.y );
		    	posXText.setAttribute("transform", "rotate("+posXArc+","+posXTextCenter.x+","+posXTextCenter.y+")");
		    	posXText.textContent = thatPointCtrl.editor.getDisplayValueStr(object3D.position.x);
	
		    	var posZLineLen = Math.sqrt((posZPB.x - posZPA.x) * (posZPB.x - posZPA.x) + (posZPB.y - posZPA.y) * (posZPB.y - posZPA.y));
		    	var posZTextCenter = {
	    			x: (posZPB.x + posZPA.x) / 2,
	    			y: (posZPB.y + posZPA.y) / 2
		    	};    	
		    	var posZArc = posZLineLen == 0 ? 0: ((posZPB.x > posZPA.x ) ? (Math.asin((posZPB.y - posZPA.y) / posZLineLen) * 180 / Math.PI) : (Math.asin((posZPA.y - posZPB.y) / posZLineLen) * 180 / Math.PI));
		    	var posZText = $("#" + thatPointCtrl.editor.containerId).find(".attachHelpText[name='posZ']")[0];  
		    	$(posZText).css({display: posZLineLen > textRectWidth ? "block" : "none"});
		    	posZText.setAttribute("x", posZTextCenter.x );
		    	posZText.setAttribute("y", posZTextCenter.y ); 
		    	posZText.setAttribute("transform", "rotate("+posZArc+","+posZTextCenter.x+","+posZTextCenter.y+")");
		    	posZText.textContent = thatPointCtrl.editor.getDisplayValueStr(object3D.position.z);
	 
		    	var posXRect = $("#" + thatPointCtrl.editor.containerId).find(".attachHelpRect[name='posX']")[0];  
		    	$(posXRect).css({display: posXLineLen > textRectWidth ? "block" : "none"}); 
		    	posXRect.setAttribute("x", posXTextCenter.x - textRectWidth /2 );
		    	posXRect.setAttribute("y", posXTextCenter.y - textRectHeight /2 ); 
		    	posXRect.setAttribute("transform", "rotate("+posXArc+","+posXTextCenter.x+","+posXTextCenter.y+")");
		    	
		    	var posZRect = $("#" + thatPointCtrl.editor.containerId).find(".attachHelpRect[name='posZ']")[0];  
		    	$(posZRect).css({display: posZLineLen > textRectWidth ? "block" : "none"}); 
		    	posZRect.setAttribute("x", posZTextCenter.x - textRectWidth /2 );
		    	posZRect.setAttribute("y", posZTextCenter.y - textRectHeight /2 ); 
		    	posZRect.setAttribute("transform", "rotate("+posZArc+","+posZTextCenter.x+","+posZTextCenter.y+")");
		 
	    	} 
    	}
    }

    this.showPointCtrlSortWindow = function(){ 
    	var allPointCtrlItems = $("#" + thatPointCtrl.editor.containerId).find(".pointCtrlItem");
    	var allPointCtrlInfoDic = thatPointCtrl.getAllPointCtrlInfoDic();
    	var parameters = [];
    	for(var i = 0; i < allPointCtrlItems.length; i++){
    		var pointCtrlItem = allPointCtrlItems[i];
    		var pointCtrlId = $(pointCtrlItem).attr("pointCtrlId");
			var pointCtrlInfo = allPointCtrlInfoDic[pointCtrlId]; 
    		parameters.push({
    			id: pointCtrlId,
    			name: pointCtrlInfo.name
    		});
    	}
    	 
		var popContainer = new PopupContainer( {
			width : 350,
			height : 550,
			top : 50,
			title: "排序"
		});
		
		popContainer.show(); 
		var inputId = cmnPcr.getRandomValue(); 
		var titleId = inputId + "_title";  
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var editorFrameId = inputId + "_frame";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
			+ "<iframe id=\"" + editorFrameId + "\" style=\"position:relative;width:100%;height:100%;border:0px solid #EEEEEE;\" >"
			+ "</iframe>"
			+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml);
		var parameterStr = cmnPcr.jsonToStr(parameters);
		$("#" + editorFrameId).attr("src", "../../design/common/sortEditor.jsp?parameters=" + cmnPcr.encodeURI(parameterStr));
		$("#" + okBtnId).click(function(){  
			var sortedPointCtrlIds = $("#" + editorFrameId)[0].contentWindow.getParameters().sortedItemIds; 
	    	var allPointCtrlInfoDic = thatPointCtrl.getAllPointCtrlInfoDic(); 
	    	$("#" + thatPointCtrl.editor.containerId).find(".pointCtrlItem").remove(); 
	    	var allPointCtrlContainer = $("#" + thatPointCtrl.editor.containerId).find(".core3dTabContent[name='pointControlList'] .core3dListContainer");
	    	for(var i = 0; i < sortedPointCtrlIds.length; i++){
	    		var sortedPointCtrlId = sortedPointCtrlIds[i];
	    		var pointCtrlInfo = allPointCtrlInfoDic[sortedPointCtrlId];
	    		thatPointCtrl.addPointCtrlToList(pointCtrlInfo, allPointCtrlContainer);
	    	}
	    	
			popContainer.close(); 
		});
		$("#" + cancelBtnId).click(function(){   
			popContainer.close(); 
		});
	}    
    
    this.addPointCtrlToList = function(pointCtrlInfo, allPointCtrlContainer){
		var pointCtrlHtml = thatPointCtrl.getPointCtrlHtml(pointCtrlInfo);  
    	$(allPointCtrlContainer).append(pointCtrlHtml);
		thatPointCtrl.initPointCtrlItemBtnEvent(pointCtrlInfo.id);
    }   

    this.pointCtrlPopChangePos = function(){
    	var inputElemnt = $("#" + thatPointCtrl.editor.containerId).find(".popPosSettingInput");
    	var newValue = $(inputElemnt).val().trim();
		if(newValue.length != 0){ 
			var newDecimalValue = cmnPcr.strToDecimal(newValue) / thatPointCtrl.editor.valueMultiply;
			if(!isNaN(newDecimalValue)){
				var object3D = thatPointCtrl.selectedPointCtrlObject3D;
		    	var posName = $(inputElemnt).attr("posName");
				var newPos = [object3D.position.x, object3D.position.y, object3D.position.z];
    	        var box = new THREE.Box3().setFromObject(object3D, true); 
    			if(posName == "posX"){ 
    				newPos[0] = newDecimalValue; 
    			}
    			else if(posName == "posZ"){ 
    				newPos[2] = newDecimalValue; 
    			} 	
    	        object3D.position.set(newPos[0], newPos[1], newPos[2]); 
    	        thatPointCtrl.refreshPointCtrlPropertyValues(object3D); 
    	        thatPointCtrl.attachTransformControl(object3D); 
    	        thatPointCtrl.refreshAttachHelpLine2d();
    	       	return true;
			}
			else{
				msgBox.alert({info: "请输入数值."});
			}
		}
		return false;
    }
    
    this.rebuildRelatedUnitObject3D = function(pointCtrlObject3D){
    	var paramNames = [pointCtrlObject3D.pointCtrlData.name + "_x", pointCtrlObject3D.pointCtrlData.name + "_y", pointCtrlObject3D.pointCtrlData.name + "_z"];
    	var allUnitInfos = thatPointCtrl.editor.getAllUnitInfos();
    	var effectedObject3Ds = new Array();
    	for(var unitId in allUnitInfos){
    		var unitInfo = allUnitInfos[unitId];
    		var effected = false;
    		for(var i = 0; i < paramNames.length; i++){
    			if(thatPointCtrl.editor.checkParameterEffectUnit(unitInfo, paramNames[i])){
    				effected = true;
    				break;
    			}
    		}
    		if(effected){
    			var object3D = thatPointCtrl.editor.getObject3DByUnitId(unitId);
    			effectedObject3Ds.push(object3D);
    		}
    	}
    	if(effectedObject3Ds.length > 0){
    		thatPointCtrl.editor.rebuildUnitObject3Ds(effectedObject3Ds);
    	}
    }
}

export default PointControlProcessor