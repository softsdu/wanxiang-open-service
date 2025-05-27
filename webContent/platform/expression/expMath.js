//数学
var expMath = {
	floor: function(var1){
		return Math.floor(var1);
	},

	ceil: function(var1){
		return Math.ceil(var1);
	},

	round: function(var1){
		return Math.round(var1);
	},

	sqrt: function(var1){
		return Math.sqrt(var1);
	},
	sin: function(param){ 
		var value = Math.sin(param);
		return value;
	},
	cos: function(param){ 
		var value = Math.cos(param);
		return value;
	},
	tan: function(param){ 
		var value = Math.tan(param);
		return value;
	},
	arcsin: function(param){ 
		var value = Math.asin(param);
		return value;
	},
	arccos: function(param){ 
		var value = Math.acos(param);
		return value;
	},
	arctan: function(param){ 
		var value = Math.atan(param);
		return value;
	},
	pi: function(){
		return Math.PI;
	},
	//取绝对值 added by ls 20230307
	abs: function(param1){
		return Math.abs(param1);
	}
}