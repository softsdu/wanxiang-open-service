function SettingForm(){
	var thatForm = this;
	
	this.paramWin = null;  
	
	this.containerId = null;
	
	this.init = function(p){
		thatForm.containerId = p.containerId;
		
		//显示级别 added by ls 20230403
		p.parameters.viewLevelText = js3ViewLevelType.getViewLevelText(p.parameters.viewLevel);
		 
		var formUIParameters = thatForm.getFormUIParameters(p.parameters); 
		var paramWin = new NcpParamWin({
			containerId: p.containerId,
			paramWinModel: formUIParameters
		});
		paramWin.addExternalObject({
			beforeDoList: function(param){
				param.rows = param.paramModel.list.rows; 
				paramWin.processListData(param);
				paramWin.afterBaseList(param);
				paramWin.afterDoList(param);
			} 
		});
		paramWin.show(); 
		thatForm.paramWin = paramWin;
	} 
	
	this.getParameters = function(){
		var result = thatForm.paramWin.getParamResult();
		if(result.verified){
			var parameters = {
				detailLevel: parseInt(result.values.detaillevel),
				viewLevel: js3ViewLevelType.getViewLevel(result.values.viewleveltext),
				gridVisible: result.values.gridVisible,
				resBoxVisible: result.values.resBoxVisible,
				materialRenderEffect: result.values.materialRenderEffect,
				backgroundColor: result.values.backgroundColor
			}; 
			return parameters;
		}
		else{
			msgBox.alert({info: result.error});
			return null;
		}
	} 
	  
	this.getFormUIParameters = function(parameters){		
		var uiParameters = {
			id: 0,
			name: "",
			units:{
				//增加显示级别 added by ls 20230403
			    "viewleveltext":{
			    	id:0,
			    	name:"viewleveltext",
			    	label:"显示级别",
			    	valueType:valueType.string, 
					inputHelpType:"list",
					inputHelpName:"viewLevelType",
					decimalNum:"0",
					valueLength:40,
					isMultiValue:false,
					isNullable:false,
			    	unitType:"list",
			    	maps:{"viewleveltext": "name"},
			    	list:{
			    		name:"viewLevelType",
			    		columns:[
			    		         {field:"name", valueType: valueType.string, title:"级别", width:100, hidden:false}
			    		], 
			    		rows: [
				    	    {name: "低"},
				    	    {name: "中"}, 
				    	    {name: "高"}
			    	    ]
			    	},		    	
					defaultValue: parameters.viewLevelText,
					isEditable: true
			    },
			    "detaillevel":{
			    	id:1,
			    	name:"detaillevel",
			    	label:"渲染细节级别",
			    	valueType:valueType.string, 
					inputHelpType:"list",
					inputHelpName:"detailLevelType",
					decimalNum:"0",
					valueLength:40,
					isMultiValue:false,
					isNullable:false,
			    	unitType:"list",
			    	maps:{"detaillevel": "name"},
			    	list:{
			    		name:"detailLevelType",
			    		columns:[
		    		         {field:"name", valueType: valueType.string, title:"级别", width:100, hidden:false}
			    		], 
			    		rows: [
				    	    {name: "1"},
				    	    {name: "2"}, 
				    	    {name: "3"}, 
				    	    {name: "4"}, 
				    	    {name: "5"}, 
				    	    {name: "6"}, 
				    	    {name: "7"}, 
				    	    {name: "8"}
			    	    ]
			    	},		    	
					defaultValue: parameters.detailLevel.toString(),
					isEditable: true
			    },
				//增加地面及网格是否显示 added by liyh 20230110
				"gridVisible":{
					id:2,
					name:"gridVisible",
					label:"是否显示网格",
					valueType:valueType.boolean,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"checkbox",
					defaultValue:"true",
					isEditable: true,
					defaultValue: cmnPcr.objectToStr(parameters.gridVisible, valueType.boolean)
				},
				"resBoxVisible":{
					id:3,
					name:"resBoxVisible",
					label:"外部资源外框",
					valueType:valueType.boolean,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"checkbox",
					defaultValue:"false",
					isEditable: true,
					defaultValue: cmnPcr.objectToStr(parameters.resBoxVisible, valueType.boolean)
				},
				"materialRenderEffect":{
					id:4,
					name:"materialRenderEffect",
					label:"材质渲染效果",
					valueType:valueType.boolean,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"checkbox",
					defaultValue:"false",
					isEditable: true,
					defaultValue: cmnPcr.objectToStr(parameters.materialRenderEffect, valueType.boolean)
				},
				"hasShadow":{
					id:5,
					name:"hasShadow",
					label:"是否有阴影",
					valueType:valueType.boolean,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
					unitType:"checkbox",
					defaultValue:"true",
					isEditable: true,
					defaultValue: cmnPcr.objectToStr(parameters.hasShadow, valueType.boolean)
				},
				"backgroundColor":{
					id:6,
					name:"backgroundColor",
					label:"背景颜色",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:100,
					isMultiValue:false,
					isNullable:true,
					unitType:"text",
					defaultValue:"",
					isEditable: true,
					defaultValue: parameters.backgroundColor
				}
			}
		}	 
		return uiParameters;
	};
}
