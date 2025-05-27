js3CommandProcessors["controlInfo"] = {
	toStatus: "normal",	
	icon: "/images/controlInfo.png",
	run: function(p){ 
		var editor = p.editor;
		var tab = $("#" + editor.containerId).find(".core3dTabTitle[name='controlInfoList']")[0];
		editor.setTabVisible(tab, true);
	} 
};