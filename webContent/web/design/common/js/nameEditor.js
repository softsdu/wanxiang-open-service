function NameEditor(){
	var thatNameEditor = this;
  
	this.propertyContainerId = null;
	this.moduleContainerId = null;
	this.sourceParameters = null; 
	
	this.init = function(p){ 
		thatNameEditor.moduleContainerId = p.moduleContainerId; 
		thatNameEditor.propertyContainerId = p.propertyContainerId; 
		thatNameEditor.sourceParameters = p.parameters;
		thatNameEditor.initHtml(p.parameters); 
		thatNameEditor.initPropertiesEvent();
	}
	
	this.initPropertiesEvent = function(){
		$("#" + thatNameEditor.propertyContainerId).find(".propertyInput").change(function(){
    		var newValue = $(this).val().trim();
    		if(newValue.length == 0){
    			var oldValue = $(this).attr("sourceValue");
    			$(this).val(oldValue);
    		} 
		}); 
	}
	
	this.getParameters = function(){
		var oldParameters = thatNameEditor.sourceParameters;
		var newParameters = { 
			isNew: oldParameters.isNew,
			id: oldParameters.id
		}; 
		var propertiesDiv = $("#" + thatNameEditor.propertyContainerId + " .propertyList[name='nameProperties']")[0]; 
		var name = $(propertiesDiv).find(".propertyInput[name='nameInput']").val();
		newParameters.name = name;
		return newParameters;
	} 

	this.initHtml = function(parameters){
		var moduleContainer = $("#" + thatNameEditor.moduleContainerId)[0];
		var propertyContainer = $("#" + thatNameEditor.propertyContainerId)[0];
		var propertyEditorModule = $(moduleContainer).find(".propertyList[name='nameProperties']")[0]; 
		var newPropertyEditor = $(propertyEditorModule).clone(); 
		$(newPropertyEditor).find(".propertyInput[name='nameInput']").attr("sourceValue", parameters.name); 
		$(newPropertyEditor).find(".propertyInput[name='nameInput']").val(parameters.name); 
		$(propertyContainer).append(newPropertyEditor); 
	} 
      
}
