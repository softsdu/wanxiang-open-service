js3CommandProcessors["commandRunner"] = {
	toStatus: "normal",	
	icon: "/images/command.png",
	run: function(p){ 
		var editor = p.editor;
		var tab = $("#" + editor.containerId).find(".core3dTabTitle[name='commandPropertyList']")[0];
		editor.setTabVisible(tab, true);
	} 
};