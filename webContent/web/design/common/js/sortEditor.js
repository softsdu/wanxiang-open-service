function SortEditor(){
	var thatEditor = this;
  
	this.containerId = null; 
	this.sourceParameters = null;
	
	this.init = function(p){ 
		thatEditor.containerId = p.containerId;  
		thatEditor.sourceParameters = p.parameters;
		thatEditor.initHtml(p.parameters); 
	} 
	
	this.getParameters = function(){ 
		var mainContainer = $("#" + thatEditor.containerId)[0];
		var allItemElements = $(mainContainer).find(".sortItem");
		var sortedItemIds = [];
		for(var i = 0; i < allItemElements.length; i++){
			var itemElement = allItemElements[i];
			sortedItemIds.push($(itemElement).attr("itemId"));
		}
		return {
			sortedItemIds: sortedItemIds
		};
	} 

	this.initHtml = function(parameters){
		var mainContainer = $("#" + thatEditor.containerId)[0];
		for(var i = 0; i < parameters.length; i++){
			var parameter = parameters[i];
			var html = "<div class=\"sortItem\" itemId=\"" + parameter.id + "\">"
				+ "<div class=\"sortItemText\">" + cmnPcr.html_encode(parameter.name) + "</div>"
				+ "<div class=\"sortItemUp\"></div>"
				+ "<div class=\"sortItemDown\"></div>"
				+ "</div>";
			$(mainContainer).append(html);			
		}
		
		$(mainContainer).find(".sortItem .sortItemUp").click(function(){
			var itemElement = $(this).parent();
			var prevElement = $(itemElement).prev();
			if(prevElement.length == 0){
				msgBox.alert({info: "已经是第一个了"});
			}
			else{
				itemElement.insertBefore(prevElement);
			}			
		});
		
		$(mainContainer).find(".sortItem .sortItemDown").click(function(){
			var itemElement = $(this).parent();
			var nextElement = $(itemElement).next();
			if(nextElement.length == 0){
				msgBox.alert({info: "已经是最后一个了"});
			}
			else{
				itemElement.insertAfter(nextElement);
			}
		});
	}      
}
