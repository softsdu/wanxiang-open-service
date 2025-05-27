js3CommandProcessors["saveSnapshot"] = {
	toStatus: "normal",
	icon: "/images/saveSnapshot.webp",
	run: function(p){ 
		var thatCE = p.editor;
		var image = thatCE.getComponentImage(true, 256, 0x000000, 0);
		var requestParam = {
			componentId: thatCE.componentInfo.id,
			imageBase64: encodeURIComponent(image)
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"saveImage",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj) {  
    			msgBox.alert({info: "保存缩略图成功."});
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
	}
};