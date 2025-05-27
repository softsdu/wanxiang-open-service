//增加line3D位置选择功能 added by ls 20230613
js3CommandProcessors["line3D"] = {
	toStatus: "placeLimit3DPoints",
	pointCount: 2,
	locationType: null,
	paramName: null,
	unitComponentProcessor: null,
	run: function(p){
		var commandJson = js3CommandProcessors["line3D"];
		commandJson.unitComponentProcessor.afterSelectLocation({
			paramName: commandJson.paramName,
			points: p.points,
			locationType: commandJson.locationType
		});
	},
	cancel: function(p){
		var commandJson = js3CommandProcessors["line3D"];
		commandJson.unitComponentProcessor.cancelSelectLocation();
	}
};