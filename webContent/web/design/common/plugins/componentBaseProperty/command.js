js3CommandProcessors["componentBaseProperty"] = {
	toStatus: "normal",	
	icon: "/images/componentBaseProperty.png",
	run: function(p){ 
		var editor = p.editor;
		var tab = $("#" + editor.containerId).find(".core3dTabTitle[name='componentBasePropertyList']")[0];
		editor.setTabVisible(tab, true);
	} 
};