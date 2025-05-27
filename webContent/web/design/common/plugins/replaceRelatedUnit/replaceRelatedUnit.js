function SelectComponentForm(){
	var thatForm = this; 
	
	this.containerId = null;

	this.fromComCode = null;
	this.fromComVersionNum = null;
	this.mapTypeCode = null;
	
	this.init = function(p){
		thatForm.containerId = p.containerId;
		thatForm.fromComCode = p.code;
		thatForm.fromComVersionNum = p.versionNum;
		thatForm.mapTypeCode = p.mapTypeCode;
		thatForm.initItems(p);
	} 

	this.getRelatedMapComs = function(p){
		let componentCode =  p.code;
		let componentVersionNum = p.versionNum;
		let mapTypeCode = p.mapTypeCode;
		let relatedMapComs = [];
		for(let i = 0; i < js3MapComs.length; i++){
			let mapCom = js3MapComs[i];
			if(mapCom.fromComCode === componentCode
					&& mapCom.fromComVersionNum === componentVersionNum
					&& mapCom.mapTypeCode === mapTypeCode){
				relatedMapComs.push(mapCom);
			}
		}
		return relatedMapComs;
	}
	
	this.initItems = function(p){
		let container = $("#" + thatForm.containerId);
		let relatedMapComs = thatForm.getRelatedMapComs(p);
		let innerHtml = "";
		for(let i = 0; i < relatedMapComs.length; i++){
			let mapCom = relatedMapComs[i];
			innerHtml += ("<div class=\"itemDiv\" comCode=\"" + mapCom.toComCode + "\" comVersionNum=\"" + mapCom.toComVersionNum + "\">" + mapCom.toComName + "<br/>(" + mapCom.toComCode + ", " + mapCom.toComVersionNum + ")</div>");

		}
		$(container).html(innerHtml);
		$(container).find(".itemDiv").click(function(){
			$("#" + thatForm.containerId).find(".itemDiv").removeClass("itemDivActive");
			$(this).addClass("itemDivActive");
		});
		$(container).find(".itemDiv")[0].click();
	}
	
	this.getSelectedComponent = function(){
		let activeItem = $("#" + thatForm.containerId).find(".itemDivActive")[0];
	   	return {
			fromComCode: thatForm.fromComCode,
		   	fromComVersionNum: thatForm.fromComVersionNum,
		   	toComCode: $(activeItem).attr("comCode"),
		   	toComVersionNum: $(activeItem).attr("comVersionNum")
	   	};
	}
}
