js3CommandProcessors["copy"] = {
	toStatus: "normal",
	icon: "/images/copy.png",
	run: function(p){ 
		var thatCE = p.editor;
    	var object3D = thatCE.selectedUnitObject3D;
    	if(object3D == null){
    		msgBox.alert({info: "请先选中构件"});
    	}
    	else{
    		thatCE.copyObject3D(object3D);
    	}
	}
};