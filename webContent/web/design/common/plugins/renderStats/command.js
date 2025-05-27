//几何统计 added by ls 20220606
js3CommandProcessors["renderStats"] = {
	toStatus: "normal",	
	icon: "/images/renderStats.png",
	run: function(p){ 
		var editor = p.editor;
		if(editor.stats.domElement.style.display == "none"){
			editor.stats.domElement.style.display = "block";
		}
		else{
			editor.stats.domElement.style.display = "none";
		}
	} 
};