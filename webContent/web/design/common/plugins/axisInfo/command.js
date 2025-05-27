js3CommandProcessors["axisInfo"] = {
	toStatus: "normal",	
	icon: "/images/axisInfo.png",
	run: function(p){ 
		var editor = p.editor;
		var tab = $("#" + editor.containerId).find(".core3dTabTitle[name='axisInfoList']")[0];
		editor.setTabVisible(tab, true);
	} 
};