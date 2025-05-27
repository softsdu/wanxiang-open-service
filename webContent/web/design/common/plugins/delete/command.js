js3CommandProcessors["delete"] = {
	toStatus: "normal",
	icon: "/images/delete.png",
	run: function(p){ 
		var thatCE = p.editor;
        if (thatCE.selectedUnitObject3D != null) { 
        	var object3D = thatCE.selectedUnitObject3D;
        	thatCE.removeUnitObject3D(object3D); 
        }
        else if (thatCE.pointCtrlProcessor.selectedPointCtrlObject3D != null) { 
        	var object3D = thatCE.pointCtrlProcessor.selectedPointCtrlObject3D;
        	thatCE.pointCtrlProcessor.removePointCtrlByObject3D(object3D); 
        }
        else{
        	msgBox.alert({info: "请先选中组件."});
        }
	}
};