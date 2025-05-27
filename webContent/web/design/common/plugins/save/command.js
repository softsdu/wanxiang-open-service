js3CommandProcessors["save"] = {
	toStatus: "normal",
	icon: "/images/save.png",
	run: function(p){ 
		var thatCE = p.editor;
		thatCE.doBtnClick("save");
	}
};