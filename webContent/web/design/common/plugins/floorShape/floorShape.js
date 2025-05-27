function DeployForm(){
	var thatForm = this;
	
	this.points = null;
	
	this.paramWin = null;  
	
	this.containerId = null;
	
	this.init = function(p){
		thatForm.containerId = p.containerId; 
		thatForm.points = p.points; 
		 
		var formUIParameters = thatForm.getFormUIParameters(); 
		var paramWin = new NcpParamWin({
			containerId: p.containerId,
			paramWinModel: formUIParameters
		});
		paramWin.show(); 
		paramWin.addExternalObject({
			beforeDoList: function(param){
				param.rows = param.paramModel.list.rows; 
				paramWin.processListData(param);
				paramWin.afterBaseList(param);
				paramWin.afterDoList(param);
			},		 
			onUnitValueChange: function(param){
				var jq = param.jq;
				switch($(jq).attr("name")){
					case "startpointname":{
						thatForm.paramWin.doCtrlMethodByParamName("startpointvalue", "setValue", param.newValue == null ? "" : param.newValue.pointvalue);
						break;
					}
				}
			},
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
				startPointName: result.values.startpointname,
				startPointValue: result.values.startpointvalue,
				layoutType: result.values.layouttype,
				directionType: result.values.directiontype,
				ignoreDistance: result.values.ignoredistance
			}; 
			return parameters;
		}
		else{
			msgBox.alert({info: result.error});
			return null;
		}
	} 

	this.getPointListRows = function(){
		var rows = new Array();
		for(var i = 0; i < thatForm.points.length; i++){
			var point = thatForm.points[i];
			rows.push({
				name: point.name,
				pointvalue: js3CommonFunction.m2mm(point.position[0]) + "," + js3CommonFunction.m2mm(point.position[2])
			});
		}
		return rows;
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
			    		"versionnum": "versionnum" 
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
			    "startpointname":{
			    	id:4,
			    	name:"startpointname",
			    	label:"起铺点",
			    	valueType:valueType.string,
			    	inputHelpType:"list",
			    	inputHelpName:"pointCtrlList",
			    	decimalNum:"0",
			    	valueLength:100,
			    	isMultiValue:false,
			    	isNullable:false,
			    	unitType:"list",
			    	maps:{"startpointname": "name", "startpointvalue": "pointvalue"},
			    	list:{
			    		name:"pointCtrlList",
			    		columns:[
		    		         {field:"name", valueType: valueType.string, title:"名称", width:10, hidden:false},
		    		         {field:"pointvalue", valueType: valueType.string, title:"坐标", width:10, hidden:false}
			    		],
			    		
			    		//改为统一定义系统支持的参数类型下拉行 modified by ls 20210823
			    		rows: thatForm.getPointListRows()
			    	},		    	 
					isEditable: true,
					defaultValue: ""
			    },
			    "startpointvalue":{
			    	id:5,
			    	name:"startpointvalue",
			    	label:"起铺点坐标",
			    	valueType:valueType.string,
			    	inputHelpType:"",
			    	inputHelpName:"",
			    	decimalNum:"0",
			    	valueLength:100,
			    	isMultiValue:false,
			    	isNullable:false,
			    	unitType:"text",
			    	maps: null,
			    	list: null,		    	 
					isEditable: false,
					defaultValue: ""
			    },
				"layouttype":{
					id:6,
					name:"layouttype",
					label:"排布方式",
					valueType:valueType.string,
					inputHelpType:"list",
					inputHelpName:"floorShapeLayoutType",
					decimalNum:"0",
					valueLength:40,
					isMultiValue:false,
					isNullable:false,
			    	unitType:"list",
			    	maps:{"layouttype": "name"},
			    	list:{
			    		name:"floorShapeLayoutType",
			    		columns:[
		    		         {field:"name", valueType: valueType.string, title:"类型", width:100, hidden:false}
			    		], 
			    		rows: [
				    	    {name: "charRen"},
				    	    {name: "charTian"}, 
				    	    {name: "charGong"}, 
				    	    {name: "fish"}, 
				    	    {name: "369"}
			    	    ]
			    	},		    	
					defaultValue: "charGong",
					isEditable: true
			    }, 
				"directiontype":{
					id:7,
					name:"directiontype",
					label:"排布方向",
					valueType:valueType.string,
					inputHelpType:"list",
					inputHelpName:"floorShapeDirectionType",
					decimalNum:"0",
					valueLength:40,
					isMultiValue:false,
					isNullable:false,
			    	unitType:"list",
			    	maps:{"directiontype": "name"},
			    	list:{
			    		name:"floorShapeDirectionType",
			    		columns:[
		    		         {field:"name", valueType: valueType.string, title:"方向", width:100, hidden:false}
			    		], 
			    		rows: [
				    	    {name: "0"},
				    	    {name: "45"}, 
				    	    {name: "90"},
				    	    {name: "180"}, 
				    	    {name: "270"}
			    	    ]
			    	},		    	
					defaultValue: "0",
					isEditable: true
			    } , 
				"ignoredistance":{
					id:80,
					name:"ignoredistance",
					label:"忽略距离",
					valueType:valueType.decimal,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:10,
					isMultiValue:false,
					isNullable:false,
			    	unitType:"decimal",
			    	maps:null,
			    	list:null,		    	
					defaultValue: "0",
					isEditable: true
			    } 
			}
		}	 
		return uiParameters;
	};
}
