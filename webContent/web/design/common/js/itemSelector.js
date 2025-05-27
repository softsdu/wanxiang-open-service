function ItemSelector(){
	var thatSelector = this;
  
	this.containerId = null; 
	this.sourceParameters = null;
	
	this.init = function(p){ 
		thatSelector.containerId = p.containerId;  
		thatSelector.sourceParameters = p.parameters;
		thatSelector.initHtml(p.parameters); 
	} 
	
	this.getParameters = function(){ 
		var mainContainer = $("#" + thatSelector.containerId)[0];
		var selectedItemId = $(mainContainer).find(".itemActive").attr("itemId"); 
		return {
			selectedItemId: selectedItemId
		};
	} 

	this.initHtml = function(parameters){
		var mainContainer = $("#" + thatSelector.containerId)[0];
		for(var i = 0; i < parameters.length; i++){
			var parameter = parameters[i];
			var html = "<div class=\"item" + (parameter.isActive ? " itemActive" : "" ) + "\" itemId=\"" + parameter.id + "\">"
				+ "<div class=\"itemText\">" + cmnPcr.html_encode(parameter.name) + "</div>" 
				+ "</div>";
			$(mainContainer).append(html);			
		} 
		$(mainContainer).find(".item").click(function(){
			$("#" + thatSelector.containerId).find(".item").removeClass("itemActive");
			$(this).addClass("itemActive");
		});
	}      
}
