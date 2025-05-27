//增加polyline3D位置选择功能 added by ls 20220606
js3CommandProcessors["polyline3D"] = {
	toStatus: "placeLimit3DPoints",
	locationType: null,
	paramName: null,
	unitComponentProcessor: null,
	run: function(p){
		var commandJson = js3CommandProcessors["polyline3D"];
		commandJson.unitComponentProcessor.afterSelectLocation({
			paramName: commandJson.paramName,
			points: p.points,
			locationType: commandJson.locationType
		});
	},
	cancel: function(p){
		var commandJson = js3CommandProcessors["polyline3D"];
		commandJson.unitComponentProcessor.cancelSelectLocation();
	}
};