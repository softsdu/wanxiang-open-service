//添加区域标注 added by ls 20220606
js3CommandProcessors["globalProperty"] = {
	toStatus: "normal",	
	icon: "/images/globalProperty.png",
	run: function(p){ 
		var editor = p.editor;
		var tab = $("#" + editor.containerId).find(".core3dTabTitle[name='globalPropertyList']")[0];
		editor.setTabVisible(tab, true);
	} 
};