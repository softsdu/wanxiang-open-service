function MdlComponent(){
	var thatMdlComponent = this;
	this.id;
	
	//增加所属类型id added by ls 20210824
	this.categoryId;

	//增加元数据扩展信息 added by yay 20221109
	this.metadata;

	this.name;
	this.code;
	this.versionNum;
	this.controlSize;
	this.gridSpace;
	this.attachDistance;
	this.placePointRadius;
	
	//轴网字体大小 added by ls 20230313
	this.axisFontSize;
	
	this.size;
	this.sizeExp;
	this.camera;
	this.parameters = {};
	this.units = {};
	this.groups = [];
	this.points = [];
	
	//扩展信息
	this.additions = {}
	
	//引用的组件
	this.refComponents = {}; 
	
	//轴网
	this.axes = {};
	
	//基准面 added by ls 20230609
	this.workPlanes = {
		xy: {
			name: "xy",
			visible: false,
			position: 0
		},
		xz: {
			name: "xz",
			visible: true,
			position: 0
		},
		yz: {
			name: "yz",
			visible: false,
			position: 0
		}
	};
	
	//初始化方式 added by ls 20230612
	this.init = {
		//位置
		locationType:{
			//使用世界坐标 add by ls 20231117
			worldPosition: false,
			
			assistPoint: null,
			parameter: null
		},
		//弹窗
		popWindow: true
	}
	
	this.parse = function(id, categoryId, jsonStr){
		var json = cmnPcr.strToJson(jsonStr);
		
		thatMdlComponent.id = id;
		thatMdlComponent.categoryId = categoryId;
		thatMdlComponent.name = json.name;
		thatMdlComponent.code = json.code;
		thatMdlComponent.versionNum = json.versionNum;
		thatMdlComponent.controlSize = json.controlSize;
		thatMdlComponent.attachDistance = json.attachDistance;
		thatMdlComponent.gridSpace = json.gridSpace;
		thatMdlComponent.placePointRadius = json.placePointRadius;
		
		//轴网字体大小 added by ls 20230313
		thatMdlComponent.axisFontSize = json.axisFontSize == null ? 0.02 : json.axisFontSize;
		
		thatMdlComponent.size = json.size;		 	
		thatMdlComponent.sizeExp = {};
		thatMdlComponent.camera = json.camera;  
		thatMdlComponent.sortedRunExpParameters = json.sortedRunExpParameters;
		thatMdlComponent.additions = json.additions == null ? {} : json.additions;
		
		//轴网
		thatMdlComponent.axes = json.axes == null ? {} : json.axes;
		
		//基准面 added by ls 20230609
		if(json.workPlanes != null){
			thatMdlComponent.workPlanes = json.workPlanes;
		}
		
		//初始化位置方式 added by ls 20230609
		if(json.init != null){			
			if(json.init.locationType != null){
				thatMdlComponent.init.locationType = json.init.locationType;
			}	
			if(json.init.popWindow != null){
				thatMdlComponent.init.popWindow = json.init.popWindow;
			}
		}
		
		if(json.sizeExp != null){
			if(json.sizeExp.x != null && json.sizeExp.x.pim != null && json.sizeExp.x.pim.length > 0){
				thatMdlComponent.sizeExp.x = {
					pim: json.sizeExp.x.pim,
					js: json.sizeExp.x.js
				};
			}
			if(json.sizeExp.y != null && json.sizeExp.y.pim != null && json.sizeExp.y.pim.length > 0){
				thatMdlComponent.sizeExp.y = {
					pim: json.sizeExp.y.pim,
					js: json.sizeExp.y.js
				};
			}
			if(json.sizeExp.z != null && json.sizeExp.z.pim != null && json.sizeExp.z.pim.length > 0){
				thatMdlComponent.sizeExp.z = {
					pim: json.sizeExp.z.pim,
					js: json.sizeExp.z.js
				};
			}
		}

		for(var j = 0; j < json.groups.length; j++){
			var jsonGroup = json.groups[j];  
			var group = {
				id: jsonGroup.id, 
				name: jsonGroup.name,
				isDefault: jsonGroup.isDefault,
				units: jsonGroup.units
			};
			thatMdlComponent.groups.push(group);
		} 
		
		if(json.points != null){
			for(var j = 0; j < json.points.length; j++){
				var jsonPoint = json.points[j];  
				var point = {
					id: jsonPoint.id, 
					name: jsonPoint.name, 
					position: jsonPoint.position
				};
				thatMdlComponent.points.push(point);
			} 
		}
		
		for(var parameterName in json.parameters){
			var jsonParameter = json.parameters[parameterName];  
			var parameter = {
				id: jsonParameter.id,
				name: jsonParameter.name,
				paramType: jsonParameter.paramType,
				isNullable: jsonParameter.isNullable,
				isEditable: jsonParameter.isEditable, 
				defaultValue: jsonParameter.defaultValue,
				minValue: jsonParameter.minValue,
				maxValue: jsonParameter.maxValue,
				isGeo: jsonParameter.isGeo == null ? true : jsonParameter.isGeo,
				listValues: jsonParameter.listValues,
				
				//构件参数分类
				categoryName: jsonParameter.categoryName,

				//组内序号 added by ls 20230804
				indexInGroup: jsonParameter.indexInGroup == null ? 1 : jsonParameter.indexInGroup,
				
				//增加分组属性 added by ls 20210823
				groupName: jsonParameter.groupName,
				//增加对应统计指标 added by liyh 20211125
                statisticIndex:jsonParameter.statisticIndex,
                statisticIndexType:jsonParameter.statisticIndexType,
				//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
				orderNumber:jsonParameter.orderNumber,
				designVisible:jsonParameter.designVisible,
				//paramType为array类型的标题名称 added by yay 20240103
				arrayDescription: jsonParameter.arrayDescription||"",
			};
			if(jsonParameter.exp != null && jsonParameter.exp.pim != null && jsonParameter.exp.pim.length > 0){
				parameter.exp = {
					pim: jsonParameter.exp.pim,
					js: jsonParameter.exp.js,
					ps: jsonParameter.exp.ps
				};
			}
			thatMdlComponent.parameters[jsonParameter.name] = parameter;
		}
	
		for(var unitId in json.units){
			var jsonUnit = json.units[unitId];
			var unit = { 
				id: jsonUnit.id,
				code: jsonUnit.code,
				name: jsonUnit.name,
				versionNum: jsonUnit.versionNum, 
				mixType: jsonUnit.mixType,
				
				//显示级别 added by ls 20230403
				viewLevel: jsonUnit.viewLevel == null ? js3ViewLevelType.always : jsonUnit.viewLevel,
				
				useWorldPosition: jsonUnit.useWorldPosition == null ? false : jsonUnit.useWorldPosition,
				position: jsonUnit.position,
				rotation: jsonUnit.rotation,
				parameters: jsonUnit.parameters, 
				uvs: jsonUnit.uvs,
				positionExps: {},
				rotationExps: {},

				//是否支持展开BOM added by ls 20230726
				hasBOM: jsonUnit.hasBOM == null ? true : jsonUnit.hasBOM,
			};
			
			if(jsonUnit.count != null){
				unit.count = jsonUnit.count;
			}
			if(jsonUnit.countExp != null){
				unit.countExp = jsonUnit.countExp;
			}
			
			if(jsonUnit.positionExps != null){
				for(var posName in jsonUnit.positionExps){
					var posExp = jsonUnit.positionExps[posName];
					if(posExp.pim != null && posExp.pim.length > 0){
						unit.positionExps[posName] = {
							pim: posExp.pim,
							js: posExp.js,
							ps: posExp.ps
						};
					}
				}
			}
			
			if(jsonUnit.rotationExps != null){
				for(var rotName in jsonUnit.rotationExps){
					var rotExp = jsonUnit.rotationExps[rotName];
					if(rotExp.pim != null && rotExp.pim.length > 0){
						unit.rotationExps[rotName] = {
							pim: rotExp.pim,
							js: rotExp.js,
							ps: rotExp.ps
						};
					}
				}
			}
			if(jsonUnit.countExp != null){
				if(jsonUnit.countExp.pim != null && jsonUnit.countExp.pim.length > 0){
					unit.countExp = {
						pim: jsonUnit.countExp.pim,
						js: jsonUnit.countExp.js,
						ps: jsonUnit.countExp.ps
					};
				}
			}
			thatMdlComponent.units[unitId] = unit;
		}
		
		for(var refComponentKey in json.refComponents){
			var jsonRefComponent = json.refComponents[refComponentKey];
			var refComponent = {
				name: jsonRefComponent.name,
				code: jsonRefComponent.code,
				versionNum: jsonRefComponent.versionNum,
				size: jsonRefComponent.size,
				groups: [],
				parameters: {},
				units: {},
				sortedRunExpParameters: jsonRefComponent.sortedRunExpParameters,
				
				//初始化位置方式 added by ls 20230613
				init: {
					locationType: {
						//使用世界坐标 add by ls 20231117
						worldPosition: false,
						
						assistPoint: null,
						parameter: null
					},
					popWindow: true
					
				}
			}

			//初始化位置方式 modified by ls 20230615
			if(jsonRefComponent.init != null){
				if(jsonRefComponent.init.locationType != null){
					//使用世界坐标 add by ls 20231117
					refComponent.init.locationType.worldPosition = jsonRefComponent.init.locationType.worldPosition;
					
					refComponent.init.locationType.assistPoint = jsonRefComponent.init.locationType.assistPoint;
					refComponent.init.locationType.parameter = jsonRefComponent.init.locationType.parameter;
				}
				if(jsonRefComponent.init.popWindow != null){
					refComponent.init.popWindow = jsonRefComponent.init.popWindow;
				}
			}
 
			for(var k = 0; k < jsonRefComponent.groups.length; k++){
				var jsonGroup = jsonRefComponent.groups[k]; 
				var group = {
					id: jsonGroup.id,
					name: jsonGroup.name,
					isDefault: jsonGroup.isDefault,
					units: jsonGroup.units
				};
				refComponent.groups.push(group);
			}
			for(var parameterName in jsonRefComponent.parameters){
				var jsonParameter = jsonRefComponent.parameters[parameterName];  
				var parameter = {
					id: jsonParameter.id,
					name: jsonParameter.name,
					paramType: jsonParameter.paramType,
					isNullable: jsonParameter.isNullable,
					isEditable: jsonParameter.isEditable, 
					defaultValue: jsonParameter.defaultValue,
					minValue: jsonParameter.minValue,
					maxValue: jsonParameter.maxValue,
					listValues: jsonParameter.listValues,
					isGeo: jsonParameter.isGeo == null ? true : jsonParameter.isGeo,
							
					//构件参数分类 added by ls 20230731
					categoryName: jsonParameter.categoryName,

					//组内序号 added by ls 20230804
					indexInGroup: jsonParameter.indexInGroup == null ? 1 : jsonParameter.indexInGroup,
							
					//增加分组属性 added by ls 20210823
					groupName: jsonParameter.groupName,
                    //增加对应统计指标 added by liyh 20211125
                    statisticIndex:jsonParameter.statisticIndex,
                    statisticIndexType:jsonParameter.statisticIndexType,
					//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
					orderNumber:jsonParameter.orderNumber,
					designVisible:jsonParameter.designVisible,
					//paramType为array类型的标题名称 added by yay 20240103
					arrayDescription: jsonParameter.arrayDescription||"",
				};
				if(jsonParameter.exp != null && jsonParameter.exp.pim != null && jsonParameter.exp.pim.length > 0){
					parameter.exp = {
						pim: jsonParameter.exp.pim,
						js: jsonParameter.exp.js,
						ps: jsonParameter.exp.ps
					};
				}
				refComponent.parameters[parameterName] = parameter;
			}
			
			for(var unitId in jsonRefComponent.units){
				var jsonUnit = jsonRefComponent.units[unitId];
				var unit = { 
					id: jsonUnit.id,
					code: jsonUnit.code,
					name: jsonUnit.name,
					versionNum: jsonUnit.versionNum, 
					mixType: jsonUnit.mixType,

					//显示级别 added by ls 20230403
					viewLevel: jsonUnit.viewLevel == null ? js3ViewLevelType.always : jsonUnit.viewLevel,
					
					useWorldPosition: jsonUnit.useWorldPosition == null ? false : jsonUnit.useWorldPosition,
					position: jsonUnit.position,
					rotation: jsonUnit.rotation,
					parameters: jsonUnit.parameters, 
					positionExps: {},
                    //增加旋转表达式 added by liyh 20210928
                    rotationExps: {},
                    
                    //是否支持展开BOM added by ls 20230726
                    hasBOM: jsonUnit.hasBOM == null ? true : jsonUnit.hasBOM
				};
				
				if(jsonUnit.count != null){
					unit.count = jsonUnit.count;
				}
				if(jsonUnit.countExp != null){
					unit.countExp = jsonUnit.countExp;
				}
				
				if(jsonUnit.positionExps != null){
					for(var posName in jsonUnit.positionExps){
						var posExp = jsonUnit.positionExps[posName];
						if(posExp.pim != null && posExp.pim.length > 0){
							unit.positionExps[posName] = {
								pim: posExp.pim,
								js: posExp.js,
								ps: posExp.ps
							};
						}
					}
				}
                //增加旋转表达式 added by liyh 20210928
                if(jsonUnit.rotationExps != null){
                    for(var rotName in jsonUnit.rotationExps){
                        var rotExp = jsonUnit.rotationExps[rotName];
                        if(rotExp.pim != null && rotExp.pim.length > 0){
                            unit.rotationExps[rotName] = {
                                pim: rotExp.pim,
                                js: rotExp.js
                            };
                        }
                    }
                }
				refComponent.units[unitId] = unit;
			}
			thatMdlComponent.refComponents[refComponentKey] = refComponent;
		}		
	} 
	
	this.toString = function(){
		var json = {
			name: thatMdlComponent.name,
			code: thatMdlComponent.code,
			versionNum: thatMdlComponent.versionNum, 
			controlSize: thatMdlComponent.controlSize, 
			gridSpace: thatMdlComponent.gridSpace, 
			attachDistance: thatMdlComponent.attachDistance,  
			placePointRadius: thatMdlComponent.placePointRadius,
			
			//轴号字体大小  added by ls 20230313
			axisFontSize: thatMdlComponent.axisFontSize,
			
			camera: thatMdlComponent.camera,
			size: thatMdlComponent.size,
			sizeExp: {},
			groups: [],
			points: [],
			units: {},
			parameters: {},
			sortedRunExpParameters: thatMdlComponent.sortedRunExpParameters,
			additions: thatMdlComponent.additions,
			
			//轴网
			axes: thatMdlComponent.axes,
			
			//基准面 added by ls 20230609
			workPlanes: thatMdlComponent.workPlanes,
			
			//初始化位置方式 added by ls 20230609
			init: {
				locationType: thatMdlComponent.init.locationType,
				popWindow: thatMdlComponent.init.popWindow
			}
		};      
		
		if(thatMdlComponent.sizeExp != null){
			if(thatMdlComponent.sizeExp.x != null && thatMdlComponent.sizeExp.x.pim != null && thatMdlComponent.sizeExp.x.pim.length > 0){
				json.sizeExp.x = {
					pim: thatMdlComponent.sizeExp.x.pim,
					js: thatMdlComponent.sizeExp.x.js
				};
			}
			if(thatMdlComponent.sizeExp.y != null && thatMdlComponent.sizeExp.y.pim != null && thatMdlComponent.sizeExp.y.pim.length > 0){
				json.sizeExp.y = {
					pim: thatMdlComponent.sizeExp.y.pim,
					js: thatMdlComponent.sizeExp.y.js
				};
			}
			if(thatMdlComponent.sizeExp.z != null && thatMdlComponent.sizeExp.z.pim != null && thatMdlComponent.sizeExp.z.pim.length > 0){
				json.sizeExp.z = {
					pim: thatMdlComponent.sizeExp.z.pim,
					js: thatMdlComponent.sizeExp.z.js
				};
			}
		}
		
		for(var i = 0; i < thatMdlComponent.groups.length; i++){
			var group = thatMdlComponent.groups[i];
			var jsonGroup = {
				id: group.id,
				name: group.name,
				isDefault: group.isDefault,
				units: group.units
			};
			json.groups.push(jsonGroup);
		} 
				
		for(var i = 0; i < thatMdlComponent.points.length; i++){
			var point = thatMdlComponent.points[i];
			var jsonPoint = {
				id: point.id,
				name: point.name, 
				position: point.position
			};
			json.points.push(jsonPoint);
		} 
		
		for(var parameterName in thatMdlComponent.parameters){
			var parameter = thatMdlComponent.parameters[parameterName];
			var jsonParameter = {
				id: parameter.id,
				name: parameter.name,
				paramType: parameter.paramType,
				isNullable: parameter.isNullable,
				isEditable: parameter.isEditable ,
				defaultValue: parameter.defaultValue,
				minValue: parameter.minValue,
				maxValue: parameter.maxValue,
				listValues: parameter.listValues,
				isGeo: parameter.isGeo == null ? true : parameter.isGeo,
						
				//构件参数分类 added by ls 20230731
				categoryName: parameter.categoryName,

				//组内序号 added by ls 20230804
				indexInGroup: parameter.indexInGroup,
						
				//增加分组属性 added by ls 20210823
				groupName: parameter.groupName,
                //增加对应统计指标 added by liyh 20211125
                statisticIndex:parameter.statisticIndex,
                statisticIndexType:parameter.statisticIndexType,
				//增加排序和 设计（被引用）时是否显示 added by liyh 20221024
				orderNumber:parameter.orderNumber,
				designVisible:parameter.designVisible,
				//paramType为array类型的标题名称 added by yay 20240103
				arrayDescription:parameter.arrayDescription||""
			};
			if(parameter.exp != null && parameter.exp.pim != null && parameter.exp.pim.length > 0){
				jsonParameter.exp = {
					pim: parameter.exp.pim,
					js: parameter.exp.js,
					ps: parameter.exp.ps
				};
			}
			json.parameters[parameterName] = jsonParameter;
		}
		
		for(var unitId in thatMdlComponent.units){
			var unit = thatMdlComponent.units[unitId]; 
			var jsonUnit = { 
				id: unit.id,
				code: unit.code,
				name: unit.name,
				versionNum: unit.versionNum, 
				mixType: unit.mixType,

				//显示级别 added by ls 20230403
				viewLevel: unit.viewLevel == null ? js3ViewLevelType.always : unit.viewLevel,
				
				useWorldPosition: unit.useWorldPosition == null ? false : unit.useWorldPosition,
				position: unit.position,
				rotation: unit.rotation,
				parameters: unit.parameters, 
				uvs: unit.uvs,
				positionExps: {},
				rotationExps: {},
				count: unit.count,
				countExp: null,
				
				//是否支持展开BOM added by ls 20230726
				hasBOM: unit.hasBOM == null ? false : unit.hasBOM
			};  
			
			if(unit.count != null){
				jsonUnit.count = unit.count;
			}
			if(jsonUnit.countExp != null){
				jsonUnit.countExp = unit.countExp;
			}
			
			if(unit.positionExps != null){
				for(var posName in unit.positionExps){
					var posExp = unit.positionExps[posName];
					if(posExp.pim != null && posExp.pim.length > 0){
						jsonUnit.positionExps[posName] = {
							pim: posExp.pim,
							js: posExp.js,
							ps: posExp.ps
						};
					}
				}
			}
			
			if(unit.rotationExps != null){
				for(var rotName in unit.rotationExps){
					var rotExp = unit.rotationExps[rotName];
					if(rotExp.pim != null && rotExp.pim.length > 0){
						jsonUnit.rotationExps[rotName] = {
							pim: rotExp.pim,
							js: rotExp.js,
							ps: rotExp.ps
						};
					}
				}
			}
			if(unit.countExp != null){
				if(unit.countExp.pim != null && unit.countExp.pim.length > 0){
					jsonUnit.countExp = {
						pim: unit.countExp.pim,
						js: unit.countExp.js,
						ps: unit.countExp.ps
					};
				}
			}
			json.units[unitId] = unit;
		}
		return cmnPcr.jsonToStr(json);
	}
}