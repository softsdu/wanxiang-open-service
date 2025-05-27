js3CommandProcessors["sideContainer"] = {
	toStatus: "normal",
	icon: "/images/sideContainer.png",
	run: function(p){ 
		var thatCE = p.editor;
		var leftClosed = $("#" + thatCE.containerId).find(".core3dLeftContainer").hasClass("tabContainerClosed");
		var rightClosed = $("#" + thatCE.containerId).find(".core3dRightContainer").hasClass("tabContainerClosed");
		if(leftClosed || rightClosed){
			//打开
			if(leftClosed){
    	    	var leftContainer = $("#" + thatCE.containerId).find(".core3dTabTitleContainerLeft")[0];
    	    	var tabName =  thatCE.leftSideStatus.lastTabNames[thatCE.leftSideStatus.groupName];
    	    	var tab = $(leftContainer).find(".core3dTabTitle[name='" + tabName + "']")[0];
    			thatCE.setTabContainerVisible(tab, true);
			}
			if(rightClosed){
    	    	var rightContainer = $("#" + thatCE.containerId).find(".core3dTabTitleContainerRight")[0];
    	    	var tabName =  thatCE.rightSideStatus.lastTabNames[thatCE.rightSideStatus.groupName];
    	    	var tab = $(rightContainer).find(".core3dTabTitle[name='" + tabName + "']")[0];
    			thatCE.setTabContainerVisible(tab, true);
			}
		}
		else {
			//关闭
			if(!leftClosed){
				var tab = $("#" + thatCE.containerId).find(".core3dLeftContainer .core3dTabTitleTop")[0];
    			thatCE.setTabContainerVisible(tab, false);				
			}
			if(!rightClosed){
				var tab = $("#" + thatCE.containerId).find(".core3dRightContainer .core3dTabTitleTop")[0];
    			thatCE.setTabContainerVisible(tab, false);				
			}
		}
	}
};