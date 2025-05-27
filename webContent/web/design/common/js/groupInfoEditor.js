function GroupInfoEditor(){
	var thatGroupInfoEditor = this;
  
	this.propertyContainerId = null;
	this.moduleContainerId = null;
	this.sourceParameters = null; 
	
	this.init = function(p){ 
		thatGroupInfoEditor.moduleContainerId = p.moduleContainerId; 
		thatGroupInfoEditor.propertyContainerId = p.propertyContainerId; 
		thatGroupInfoEditor.sourceParameters = p.parameters;
		thatGroupInfoEditor.initHtml(p.parameters); 
		thatGroupInfoEditor.initPropertiesEvent();
	}
	
	this.initPropertiesEvent = function(){
		$("#" + thatGroupInfoEditor.propertyContainerId).find(".propertyInput").change(function(){
    		var newValue = $(this).val().trim();
    		if(newValue.length == 0){
    			var oldValue = $(this).attr("sourceValue");
    			$(this).val(oldValue);
    		} 
		}); 
	}
	
	this.getParameters = function(){
		var oldParameters = thatGroupInfoEditor.sourceParameters;
		var newParameters = { 
			isNewGroup: oldParameters.isNewGroup,
			id: oldParameters.id
		}; 
		var groupInfoPropertiesDiv = $("#" + thatGroupInfoEditor.propertyContainerId + " .propertyList[name='groupInfoProperties']")[0]; 
		var groupName = $(groupInfoPropertiesDiv).find(".propertyInput[name='groupNameInput']").val();
		newParameters.name = groupName;
		return newParameters;
	} 

	this.initHtml = function(parameters){
		var moduleContainer = $("#" + thatGroupInfoEditor.moduleContainerId)[0];
		var propertyContainer = $("#" + thatGroupInfoEditor.propertyContainerId)[0];
		var groupInfoPropertyEditorModule = $(moduleContainer).find(".propertyList[name='groupInfoProperties']")[0]; 
		var newGroupInfoPropertyEditor = $(groupInfoPropertyEditorModule).clone(); 
		$(newGroupInfoPropertyEditor).find(".propertyInput[name='groupNameInput']").attr("sourceValue", parameters.name); 
		$(newGroupInfoPropertyEditor).find(".propertyInput[name='groupNameInput']").val(parameters.name); 
		$(propertyContainer).append(newGroupInfoPropertyEditor); 
	} 
      
}
