//增加point2D位置选择功能 added by ls 20220606
js3CommandProcessors["point2D"] = {
	toStatus: "placeLimit2DPoints",		
	pointCount: 1,
	locationType: null,
	paramName: null,
	unitComponentProcessor: null,
	run: function(p){
		var commandJson = js3CommandProcessors["point2D"];
		commandJson.unitComponentProcessor.afterSelectLocation({
			paramName: commandJson.paramName,
			points: p.points,
			locationType: commandJson.locationType
		});
	},
	cancel: function(p){
		var commandJson = js3CommandProcessors["point2D"];
		commandJson.unitComponentProcessor.cancelSelectLocation();
	}
};