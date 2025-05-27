js3CommandProcessors["paste"] = {
	toStatus: "normal",
	icon: "/images/paste.png",
	run: function(p){ 
		var thatCE = p.editor;
		if(thatCE.clipBoard.unitSetting != null){
			var unitSetting = thatCE.clipBoard.unitSetting;
			thatCE.mouse3DPosition = {
				x: unitSetting.position[0],
				y: unitSetting.position[1],
				z: unitSetting.position[2]
			};
			thatCE.pasteObject3D();
        	msgBox.alert({info: "已粘贴完成. 注意: 新组件与原组件重合."});
			
		}
		else{
        	msgBox.alert({info: "请先执行复制."});
		}
	}
};