//模型造型
var expModel= {
		buildStairway: function(height, width, stepCount) {
			var allPoints = new Array();
			var stepCountInt = Math.ceil(stepCount);
			var stepHeight = height / stepCountInt;
			var stepWidth = width / stepCountInt;
			allPoints.push({x: stepWidth / 2, y: 0}); 
			allPoints.push({x: 0, y: 0});
			for(var i = 0; i < stepCountInt; i++){
				var ponitA = {x: i * stepWidth, y: (i + 1) * stepHeight + stepHeight /2};
				allPoints.push(ponitA);
				var ponitB = {x: (i + 1) * stepWidth, y: (i + 1) * stepHeight + stepHeight /2};
				allPoints.push(ponitB);
			} 
			allPoints.push({x: stepCountInt * stepWidth, y: (stepCountInt - 1) * stepHeight + stepHeight /2});
			return expModel.getPointsStr(allPoints);
		},
		buildHandrail: function(height, width, handWidth, railPartType){
			var allPoints = new Array(); 

			switch(railPartType){
				case "middle":{
					allPoints.push({x: 0, y: 0}); 
					allPoints.push({x: 0, y: handWidth});  
					allPoints.push({x: width, y: height + handWidth}); 
					allPoints.push({x: width, y: height}); 
					break;
				} 
				case "bottom":
				default:{
					allPoints.push({x: 0, y: 0}); 
					allPoints.push({x: 0, y: -handWidth}); 
					allPoints.push({x: -handWidth, y: -handWidth}); 
					allPoints.push({x: -handWidth, y: (width * 2* handWidth / height - handWidth) * height / width - handWidth});
					allPoints.push({x: width, y: height + handWidth}); 
					allPoints.push({x: width, y: height}); 
					break;
				} 
			}
			return expModel.getPointsStr(allPoints);
		},
		buildRightTriangle: function(edgeLength1, edgeLength2){
			var allPoints = new Array();  
			allPoints.push({x: 0, y: 0}); 
			allPoints.push({x: 0, y: edgeLength1}); 
			allPoints.push({x: edgeLength2, y: 0});  
			return expModel.getPointsStr(allPoints);
		},
		getPointsStr: function(allPoints){  			
			var s = "";
			for(var i = 0; i < allPoints.length; i++){
				var p = allPoints[i];
				s += (p.x + "," + p.y + ";");
			}
			return s;
		}
}