js3CommandProcessors["publish"] = {
	toStatus: "normal",
	editor: null,
	run: function(p){ 
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;  
		thatCommandJson.doPublish(p);
	},
	doPublish: function(p){
		var thatCE = p.editor;
		thatCE.beginPublishFile(); 
	}
};