function DeployForm(){
	var thatForm = this;
	
	this.paramWin = null;  
	
	this.containerId = null;
	
	this.init = function(p){
		thatForm.containerId = p.containerId;  
		 
		var formUIParameters = thatForm.getFormUIParameters(); 
		var paramWin = new NcpParamWin({
			containerId: p.containerId,
			paramWinModel: formUIParameters
		});
		paramWin.show();
		paramWin.addExternalObject({
			afterDoPop: function(param){
				for(var paramName in param.paramModel.maps){
					if(param.paramModel.name != paramName){
						var sourceName = param.paramModel.maps[paramName];
						var paramValue = param.selectedRows == null ? null : param.selectedRows[sourceName];
						thatForm.paramWin.doCtrlMethodByParamName(paramName, "setValue", paramValue);
					}						
				}
			}
		});
		thatForm.paramWin = paramWin;
	} 
	
	this.getParameters = function(){
		var result = thatForm.paramWin.getParamResult();
		if(result.verified){
			var parameters = {
				componentCode: result.values.componentcode,
				versionNum: result.values.versionnum,
				imgId: result.values.imgid,
				startX: result.values.startx / 1000,
				startY: result.values.starty / 1000,
				startZ: result.values.startz / 1000,
				spaceX: result.values.spacex / 1000,
				spaceZ: result.values.spacez / 1000
			}; 
			return parameters;
		}
		else{
			msgBox.alert({info: result.error});
			return null;
		}
	} 
	  
	this.getFormUIParameters = function(){		
		var uiParameters = {
			id: 0,
			name: "",
			units:{
			    "componentname":{
			    	id:1,
			    	name:"componentname",
			    	label:"组件",
			    	valueType:valueType.string,
			    	inputHelpType:"pop",
			    	inputHelpName:"web/pop/view_mdl_Component.jsp?w=700&h=380&t=10",
			    	decimalNum:"",
			    	valueLength:100,
			    	isMultiValue:false,
			    	isNullable:false,
			    	unitType:"pop",
			    	maps:{
			    		"componentname": "name",
			    		"componentcode": "code",
			    		"versionnum": "versionnum",
			    		"imgid": "imgid"
		    		}, 
			    	defaultValue:"",
					isEditable: true
			    },
			    "componentcode":{
			    	id:2,
			    	name:"componentcode",
			    	label:"组件编码",
			    	valueType:valueType.string,
			    	inputHelpType:"",
			    	inputHelpName:"",
			    	decimalNum:"",
			    	valueLength:100,
			    	isMultiValue:false,
			    	isNullable:false,
			    	unitType:"text",
			    	maps:null, 
			    	defaultValue:"",
					isEditable: false
			    },
			    "versionnum":{
			    	id:3,
			    	name:"versionnum",
			    	label:"组件版本",
			    	valueType:valueType.string,
			    	inputHelpType:"",
			    	inputHelpName:"",
			    	decimalNum:"",
			    	valueLength:100,
			    	isMultiValue:false,
			    	isNullable:false,
			    	unitType:"text",
			    	maps:null, 
			    	defaultValue:"",
					isEditable: false
			    }, 
			    "imgid":{
			    	id:4,
			    	name:"imgid",
			    	label:"imgid",
			    	valueType:valueType.string,
			    	inputHelpType:"",
			    	inputHelpName:"",
			    	decimalNum:"",
			    	valueLength:100,
			    	isMultiValue:false,
			    	isNullable:true,
			    	unitType:"text",
			    	maps:null, 
			    	defaultValue:"",
					isEditable: false
			    }, 
				"startx":{
					id:5,
					name:"startx",
					label:"X边距",
					valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"4",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"decimal",
					defaultValue:"",
					isEditable: true
			    }, 
				"starty":{
					id:6,
					name:"starty",
					label:"Y边距",
					valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"4",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"decimal",
					defaultValue:"",
					isEditable: true
			    }, 
				"startz":{
					id:7,
					name:"startz",
					label:"Z边距",
					valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"4",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"decimal",
					defaultValue:"",
					isEditable: true
			    }, 
				"spacex":{
					id:8,
					name:"spacex",
					label:"X间隔",
					valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"4",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"decimal",
					defaultValue:"",
					isEditable: true
			    },
				"spacez":{
					id:9,
					name:"spacez",
					label:"Z间隔",
					valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"4",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"decimal",
					defaultValue:"",
					isEditable: true
			    }
			}
		}	 
		return uiParameters;
	};
}
