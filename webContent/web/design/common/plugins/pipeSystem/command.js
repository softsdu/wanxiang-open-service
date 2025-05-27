//管道系统 added by ls 20220810
js3CommandProcessors["pipeSystem"] = {
	toStatus: "normal",	 
	icon: "/images/pipeSystem.png",
	editor: null,
	popWin: null,
	crossesJson: null,
	jointInfos: null,
	name2PipeObject3Ds: null,
	needAddPipeCount: 0,
	addedPipeCount: 0,
	run: function(p){
		js3CommandProcessors["pipeSystem"].editor = p.editor;
		var allPipeSolidObject3Ds = js3CommandProcessors["pipeSystem"].getAllPipeSoildObject3Ds(p);
		if(allPipeSolidObject3Ds.length == 0){
			msgBox.alert({info: "没找到管道组件."});
		}
		else{
			p.commandJson.showBuildWindow({
				editor: p.editor,
				commandJson: p.commandJson,
				allPipeSolidObject3Ds: allPipeSolidObject3Ds
			}); 
		}
	},	
	getAllPipeSoildObject3Ds: function(p){
		var editor = js3CommandProcessors["pipeSystem"].editor; 
		var allPipeSolidObject3Ds = new Array();
        for(var i = 0; i < editor.scene.children.length; i++){
        	var object3D = editor.scene.children[i];
        	if(object3D.unitData != null){ 
        		if(object3D.unitData.code.startWith(js3SysCatAndCom.pipe.pipeSolidCategoryCodePre)){
        			allPipeSolidObject3Ds.push(object3D);
        		} 
        	}
        }
        return allPipeSolidObject3Ds;
	},
	showBuildWindow: function(p){
		var popContainer = new PopupContainer( {
			width : 600 ,
			height :500,
			top : 50,
			title: "管道设置"
		});		
		popContainer.show(); 
		var inputId = cmnPcr.getRandomValue(); 
		var titleId = inputId + "_title";  
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var innerContainerId = inputId + "_innerContainer";
		var innerHtml = "<div style=\"position:absolute;left:10px;right:10px;top:0px;bottom:45px;font-size:11px;text-align:center;\">"
		 	+ "<div class=\"innerContainer\" style=\"position:relative;width:100%;height:100%;\" >"    
		 	+ "<div class=\"itemHeader\" style=\"position:absolute;top:0px;left:0px;width:100%;height:30px;border-bottom:1px solid #EEEEEE;font-weight:600;\" >" 
			+ "<div style=\"position:absolute;left:0px;top:0px;height:30px;width:50px;text-align:center;line-height:30px;\">序号</div>"
			+ "<div style=\"position:absolute;left:50px;top:0px;height:30px;width:250px;text-align:left;line-height:30px;\">水管</div>"
			+ "<div style=\"position:absolute;left:300px;top:0px;height:30px;width:300px;text-align:left;line-height:30px;\">说明</div>"   
		 	+ "</div>"  
		 	+ "<div class=\"itemContainer\" style=\"position:absolute;top:30px;left:0px;width:100%;bottom:0px;overflow:auto;\"></div>"    
		 	+ "</div>"  
		 	+ "</div>" 
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:45px;bottom:0px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"生 成\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
			+ "</div>";
		$("#" + popContainer.containerId).html(innerHtml); 
		js3CommandProcessors["pipeSystem"].popWin = popContainer;
		$("#" + okBtnId).click(function(){ 
			var innerContainer = $("#" + js3CommandProcessors["pipeSystem"].popWin.containerId).find(".innerContainer")[0];
			var crossesJson = js3CommandProcessors["pipeSystem"].crossesJson;
			var jointInfos = js3CommandProcessors["pipeSystem"].jointInfos;
			js3CommandProcessors["pipeSystem"].createPipeSystem({
				crossesJson: crossesJson,
				jointInfos: jointInfos
			});
			
		});
		$("#" + cancelBtnId).click(function(){   
			js3CommandProcessors["pipeSystem"].popWin.close();
		}); 
		
		//调用服务器端，获取pipeSystem的参数，然后让用户手工调整，最后利用调整后的数据进行造型生成pipeSystem
		js3CommandProcessors["pipeSystem"].getPipeSystemParameters({
			editor: p.editor,
			commandJson: p.commandJson,
			allPipeSolidObject3Ds: p.allPipeSolidObject3Ds
		});		
	},
	addPipeSystemObject3D: function(p){
		var pipesJsonStr = cmnPcr.jsonToStr(p.pipes);
		var connectorsJsonStr = cmnPcr.jsonToStr(p.connectors);
    	var idAndName = editor.getNewUnitIdAndName("pipeSystem_1", "pipeSystem"); 
    	var unitSetting = {
			name: idAndName.name,
			id: idAndName.id,
			code: js3SysCatAndCom.pipe.pipeSystemComponentCode, 
			versionNum: "1.0",
			mixType: js3UnitMixType.none,
			
			//显示级别 added by ls 20230403
			viewLevel: js3ViewLevelType.always,
			
			useWorldPosition: true,
			position: [0, 0, 0],
			rotation: [0, 0, 0],
			count: 1,
			countExp: null,
			materials: null,
			parameters: {
				pipes: {
					value: pipesJsonStr
				},
				connectors: {
					value: connectorsJsonStr
				}
			},
			positionExps: {},
			rotationExps: {},
			uvs: null,
			otherInfo: {
				needSelect: false
			}
		};	
    	editor.createNewObject3DByUser(unitSetting);	
	},
	getPipeSystemParameters: function(p){
		var allPipeSolidObject3Ds = p.allPipeSolidObject3Ds;
		//name2PipeObject3Ds
		var name2PipeObject3Ds = {};
		for(var i = 0; i < allPipeSolidObject3Ds.length; i++){
			var pipeSolidObject3D = allPipeSolidObject3Ds[i];
			name2PipeObject3Ds[pipeSolidObject3D.unitData.name] = pipeSolidObject3D;
		} 
		js3CommandProcessors["pipeSystem"].name2PipeObject3Ds = name2PipeObject3Ds;
		
		//构造pipeSystem参数
		var pipesJson = {pipes: []};
		var pipeJsons = pipesJson.pipes;
		for(var i = 0; i < allPipeSolidObject3Ds.length; i++){
			var pipeSolidObject3D = allPipeSolidObject3Ds[i];
			var pipeUnitData = pipeSolidObject3D.unitData;
			var pipeParameters = pipeUnitData.parameters;
			var pipeJson = {
				name: pipeUnitData.name,
				parameters: {}
			};
			for(var paramName in pipeParameters){
				pipeJson.parameters[paramName] = pipeParameters[paramName].value;
			}
			pipeJsons.push(pipeJson);
		}
		var requestParam = {
			pipes: pipeJsons
		};

		serverAccess.request({
			serviceName:"buildingDesignNcpService",
			funcName:"getCrossesByPipeSolids",  
		    args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj) { 
				var crossesJson = obj.result.crosses;
				js3CommandProcessors["pipeSystem"].showCrossInfos({
					crossesJson: crossesJson
				});
			},
			failFunc: function(obj) { 
				msgBox.error({title:"提示", info: obj.message}); 
			}
		});
	},
	showCrossInfos: function(p){
		var allPipeSolidObject3Ds = js3CommandProcessors["pipeSystem"].getAllPipeSoildObject3Ds(p);
		var name2PipeObject3Ds = {};
		for(var i = 0; i < allPipeSolidObject3Ds.length; i++){
			var pipeSolidObject3D = allPipeSolidObject3Ds[i];
			name2PipeObject3Ds[pipeSolidObject3D.unitData.name] = pipeSolidObject3D;
		}
		
		js3CommandProcessors["pipeSystem"].crossesJson = p.crossesJson;
		
		//相交点信息
		var jointInfos = {};
		js3CommandProcessors["pipeSystem"].jointInfos = jointInfos;
				
		var jointIndex = 0;
		//处理返回结果
		for(var crossName in p.crossesJson){
			var crossJson = p.crossesJson[crossName];
			var pipeAObject3D = name2PipeObject3Ds[crossJson.pipeAName];
			var pipeBObject3D = name2PipeObject3Ds[crossJson.pipeBName];
			crossJson.processsType = "none";
			if(crossJson.distance > 0){
				//有距离，但是存在碰撞，那么提醒碰撞问题
				if(crossJson.isCollision){
					crossJson.processsType = "collision";
					crossJson.message = "存在碰撞, 管道轴心距离" + crossJson.distance + "mm, 请手工调整.";
				}
			}
			else{
				//距离为0
				if(crossJson.intersectAInLine && crossJson.intersectBInLine){
					//两个pipe相交
					if(!crossJson.intersectAIsTerminal && !crossJson.intersectBIsTerminal){
						//两个pipe交叉
						crossJson.processsType = "breakTwo";
						crossJson.breakPoint = crossJson.intersectA;
						crossJson.message = "水管交叉, 需断开, <span class=\"pipeSystemAutoProcess\" style=\"cursor:pointer;text-decoration:underline;\">点击此处自动执行</span>";
					}
					else if(crossJson.intersectAIsTerminal && crossJson.intersectBIsTerminal){
						crossJson.processsType = "joint";
						var jointPointStr = crossJson.jointPoint[0] + "_" + crossJson.jointPoint[1] + "_" + crossJson.jointPoint[2];
						var jointInfo = jointInfos[jointPointStr];
						if(jointInfo == null){
							jointIndex++;
							
							jointInfo = {
								name: "joint_" + jointIndex,
								crossNames: [],
								jointType: crossJson.jointType, 
								message: "",
								point: {
									x: crossJson.jointPoint[0],
									y: crossJson.jointPoint[1],
									z: crossJson.jointPoint[2]
								}
							};
							jointInfos[jointPointStr] = jointInfo;
						}
						jointInfo.crossNames.push(crossName);
						
						var jointType = crossJson.jointType;
						switch(jointType){
							case "coincide": {
								//重合，这种连接是错误的
								crossJson.message = "水管重合, 请手工调整.";
								break;
							}
							case "direct":{ //直连
								crossJson.message = "水管直连";
								break;
							}
							case "elbow45":{ //45度角
								crossJson.message = "使用45度弯头连接";
								break;
							}
							case "elbow90":{ //直角
								crossJson.message = "使用直角弯头连接";
								break;
							}
							case "elbow135":{ //135度角
								crossJson.message = "使用135度弯头连接";
								break;
							}
							case "angleError":{ //角度错误
								crossJson.message = "水管夹角为" + crossJson.jointAngle + "度, 系统不支持, 请手工调整";
								break;
							}
						}
					}
					else if(!crossJson.intersectAIsTerminal){
						//pipeA需要断开
						crossJson.processsType = "breakA";
						crossJson.breakPoint = crossJson.intersectA;
						crossJson.message = "需要断开'" + crossJson.pipeAName + "', <span class=\"pipeSystemAutoProcess\" style=\"cursor:pointer;text-decoration:underline;\">点击此处自动执行</span>";
					}
					else if(!crossJson.intersectBIsTerminal){
						//pipeA需要断开
						crossJson.processsType = "breakB";
						crossJson.breakPoint = crossJson.intersectA;
						crossJson.message = "需要断开'" + crossJson.pipeBName + "', <span class=\"pipeSystemAutoProcess\" style=\"cursor:pointer;text-decoration:underline;\">点击此处自动执行</span>";
					} 
				} 
			}			
		}
		
		for(var jointName in jointInfos){
			var jointInfo = jointInfos[jointName];
			if(jointInfo.crossNames.length > 1){ 
				var angle90Count = 0;
				var angle180Count = 0;
				for(var i = 0; i < jointInfo.crossNames.length; i++){
					var crossName = jointInfo.crossNames[i];
					var crossJson = p.crossesJson[crossName];
					var jointType = crossJson.jointType;
					crossJson.isMultiJoint = true;
					if(jointType != "direct" && jointType != "elbow90") {
						//两个以上的管连接，如果出现了非直连和直角的情况，都是错误的
						jointInfo.jointType = "error";
						jointInfo.message = crossJson.pipeAName + "" + crossJson.pipeBName + crossJson.message;
						break;
					}
					else{
						switch(jointType){
							case "direct":{ //直连
								angle180Count++;
								break;
							}
							case "elbow90":{ //直角
								angle90Count++;
								break;
							} 
						}
					}
				}
				
				if(jointInfo.crossNames.length == 3){
					//三个管连接，应该包含两个90，一个180度的连接
					if(angle90Count == 2 && angle180Count == 1){
						jointInfo.jointType = "tee";
						jointInfo.message = "使用三通连接";
					}
					else{
						jointInfo.jointType = "error";
						jointInfo.message = "不支持的连接方式, 请手工调整";
					}
				}
				else if(jointInfo.crossNames.length == 6){
					//四个管连接，应该包含四个90，两个180度的连接
					if(angle90Count == 4 && angle180Count == 2){
						jointInfo.jointType = "cross";
						jointInfo.message = "使用十字四通连接";
					}
					else{
						jointInfo.jointType = "error";
						jointInfo.message = "不支持的连接方式, 请手工调整";
					}					
				}
				else {
					//超过四个管连接，没法实现
					jointInfo.jointType = "error";
					jointInfo.message = "无法同时连接的管数量过多, 系统不支持";
				}
			}
			else{
				//仅仅是两个管连接
			}
		}
		
		//显示管与管的关系情况
		var allCrossHtml = "";
		var itemIndex = 0;
		
		//显示两个以上的管连接情况
		for(var jointName in jointInfos){
			var jointInfo = jointInfos[jointName];
			if(jointInfo.crossNames.length > 1){ 
				itemIndex++;
				var pipeNameDic = {};
				var jointAllPipeNames = [];
				
				for(var i = 0; i < jointInfo.crossNames.length; i++){
					var crossName = jointInfo.crossNames[i];
					var crossJson = p.crossesJson[crossName];
					if(pipeNameDic[crossJson.pipeAName] == null){
						pipeNameDic[crossJson.pipeAName] = true;
					}
					if(pipeNameDic[crossJson.pipeBName] == null){
						pipeNameDic[crossJson.pipeBName] = true;
					}
				}
				for(var pipeName in pipeNameDic){
					jointAllPipeNames.push(pipeName);
				}
				var crossHtml = "<div style=\"position:relative;height:31px;border-bottom:solid 1px #EEEEEE;\" itemType=\"joint\" jointName=\"" + jointName + "\">"
				+ "<div style=\"position:absolute;left:0px;top:0px;height:30px;width:50px;text-align:center;line-height:30px;\">" + itemIndex + "</div>"
				+ "<div style=\"position:absolute;left:50px;top:7px;height:30px;width:250px;text-align:left;line-height:15px;\">" + cmnPcr.arrayToString(jointAllPipeNames, ", ") + "</div>"
				+ "<div style=\"position:absolute;left:300px;top:7px;height:30px;right:0px;text-align:left;line-height:15px;\">" + jointInfo.message + "</div>"
				+ "</div>";
				allCrossHtml += crossHtml;
			}			
		}
		
		//显示两个管相交、连接情况
		for(var crossName in p.crossesJson){
			var crossJson = p.crossesJson[crossName]; 
			if(!crossJson.isMultiJoint && crossJson.processsType != "none"){
				itemIndex++;
				var crossHtml = "<div style=\"position:relative;height:31px;border-bottom:solid 1px #EEEEEE;\" itemType=\"cross\" crossName=\"" + crossName + "\">"
					+ "<div style=\"position:absolute;left:0px;top:0px;height:30px;width:50px;text-align:center;line-height:30px;\">" + itemIndex + "</div>"
					+ "<div style=\"position:absolute;left:50px;top:7px;height:30px;width:250px;text-align:left;line-height:15px;\">" + crossJson.pipeAName + ", " + crossJson.pipeBName + "</div>"
					+ "<div style=\"position:absolute;left:300px;top:7px;height:30px;right:0px;text-align:left;line-height:15px;\">" + crossJson.message + "</div>"
					+ "</div>";
				allCrossHtml += crossHtml;
			}
		}
		var itemContainer = $("#" + js3CommandProcessors["pipeSystem"].popWin.containerId).find(".itemContainer")[0];
		$(itemContainer).html(allCrossHtml);
		
		//自动执行按钮
		$("#" + js3CommandProcessors["pipeSystem"].popWin.containerId).find(".pipeSystemAutoProcess").click(function(event){
			var crossName = $(this).parent().parent().attr("crossName");
			js3CommandProcessors["pipeSystem"].autoProcessPipe(crossName);
		});
		
	},
	getPipePoints: function(pipeObject3D){
		var beginPointXZStrs = pipeAObject3D.unitData.parameters["起点坐标"].value.split(",");
		var endPointXZStrs = pipeAObject3D.unitData.parameters["终点坐标"].value.split(",");
		var beginPointY = pipeAObject3D.unitData.parameters["起点高度"].value;
		var endPointY = pipeAObject3D.unitData.parameters["终点高度"].value;
		return {
			begin: {
				x: parseFloat(beginPointXZStrs[0]),
				y: beginPointY,
				z: parseFloat(beginPointXZStrs[1])
			},
			end: {
				x: parseFloat(endPointXZStrs[0]),
				y: endPointY,
				z: parseFloat(endPointXZStrs[1])
			}
		}
	},
	
	//获取创建构件需要的参数
	getCreateParameters: function(parameters){
		var createParameters = {};
		for(var paramName in parameters){
			var parameter = parameters[paramName];
			createParameters[paramName] = {
				value: parameter.value
			};
		}
		return createParameters;
	},
	
	autoProcessPipe: function(crossName){
		var editor = js3CommandProcessors["pipeSystem"].editor;
		var crossJson = js3CommandProcessors["pipeSystem"].crossesJson[crossName];
		var name2PipeObject3Ds = js3CommandProcessors["pipeSystem"].name2PipeObject3Ds;
		var pipeAObject3D = name2PipeObject3Ds[crossJson.pipeAName];
		var pipeBObject3D = name2PipeObject3Ds[crossJson.pipeBName];
		var breakPoint = crossJson.breakPoint;
		switch(crossJson.processsType){
			case "breakTwo":{
				var unitSettings = [];
				
				//构造截断pipeA的属性
				var nameAPrefix = editor.getNewNamePrefix(pipeAObject3D.unitData.name);
				var pipeAGroupId = editor.getUnitGroupId(pipeAObject3D.unitData.id);
				var pipeAPoints = expGeometry.getXYZs(pipeAObject3D.unitData.parameters["位置"].value);
				var pipeAFirstPoint = pipeAPoints[0];
				var pipeALastPoint = pipeAPoints[pipeAPoints.length - 1];
				var pipeAPart1Parameters = js3CommandProcessors["pipeSystem"].getCreateParameters(pipeAObject3D.unitData.parameters);
				pipeAPart1Parameters["终点坐标"].value = breakPoint[0] + "," + breakPoint[2];
				pipeAPart1Parameters["终点高度"].value = breakPoint[1];
				pipeAPart1Parameters["位置"].value = pipeAFirstPoint[0] + "," + pipeAFirstPoint[1] + "," + pipeAFirstPoint[2] + ";" + breakPoint[0] + "," + breakPoint[1] + "," + breakPoint[2];
				var pipeAPart2Parameters = js3CommandProcessors["pipeSystem"].getCreateParameters(pipeAObject3D.unitData.parameters);
				pipeAPart2Parameters["起点坐标"].value = breakPoint[0] + "," + breakPoint[2];
				pipeAPart2Parameters["起点高度"].value = breakPoint[1];	
				pipeAPart2Parameters["位置"].value = breakPoint[0] + "," + breakPoint[1] + "," + breakPoint[2] + ";" + pipeALastPoint[0] + "," + pipeALastPoint[1] + "," + pipeALastPoint[2];			
				unitSettings.push({
					name: nameAPrefix + "_" + 1,
					
					//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
					id: editor.getGuid(),
					
					code: pipeAObject3D.unitData.code, 
					versionNum: pipeAObject3D.unitData.versionNum,
					mixType: js3UnitMixType.none,

					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,
					
					useWorldPosition: pipeAObject3D.unitData.useWorldPosition,
					position: pipeAObject3D.unitData.position,
					rotation: pipeAObject3D.unitData.rotation,
					count: 1,
					materials: null,
					parameters: pipeAPart1Parameters,
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: pipeAGroupId,
						needSelect: false
					}
				}); 
				unitSettings.push({
					name: nameAPrefix + "_" + 2,
					
					//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
					id: editor.getGuid(),
					
					code: pipeAObject3D.unitData.code, 
					versionNum: pipeAObject3D.unitData.versionNum,
					mixType: js3UnitMixType.none,

					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,
					
					useWorldPosition: pipeAObject3D.unitData.useWorldPosition,
					position: pipeAObject3D.unitData.position,
					rotation: pipeAObject3D.unitData.rotation,
					count: 1,
					materials: null,
					parameters: pipeAPart2Parameters,
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: pipeAGroupId,
						needSelect: false
					}
				}); 
				
				//构造截断pipeB的属性
				var nameBPrefix = editor.getNewNamePrefix(pipeBObject3D.unitData.name);
				var pipeBGroupId = editor.getUnitGroupId(pipeBObject3D.unitData.id);
				var pipeBPart1Parameters = js3CommandProcessors["pipeSystem"].getCreateParameters(pipeBObject3D.unitData.parameters);
				var pipeBPoints = expGeometry.getXYZs(pipeBObject3D.unitData.parameters["位置"].value);
				var pipeBFirstPoint = pipeBPoints[0];
				var pipeBLastPoint = pipeBPoints[pipeBPoints.length - 1];
				pipeBPart1Parameters["终点坐标"].value = breakPoint[0] + "," + breakPoint[2];
				pipeBPart1Parameters["终点高度"].value = breakPoint[1];
				pipeBPart1Parameters["位置"].value = pipeBFirstPoint[0] + "," + pipeBFirstPoint[1] + "," + pipeBFirstPoint[2] + ";" + breakPoint[0] + "," + breakPoint[1] + "," + breakPoint[2];
				var pipeBPart2Parameters = js3CommandProcessors["pipeSystem"].getCreateParameters(pipeBObject3D.unitData.parameters);
				pipeBPart2Parameters["起点坐标"].value = breakPoint[0] + "," + breakPoint[2];
				pipeBPart2Parameters["起点高度"].value = breakPoint[1];	
				pipeBPart2Parameters["位置"].value = breakPoint[0] + "," + breakPoint[1] + "," + breakPoint[2] + ";" + pipeBLastPoint[0] + "," + pipeBLastPoint[1] + "," + pipeBLastPoint[2];			
				unitSettings.push({
					name: nameBPrefix + "_" + 1,
					
					//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
					id: editor.getGuid(),
					
					code: pipeBObject3D.unitData.code, 
					versionNum: pipeBObject3D.unitData.versionNum,
					mixType: js3UnitMixType.none,

					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,					
					
					useWorldPosition: pipeBObject3D.unitData.useWorldPosition,
					position: pipeBObject3D.unitData.position,
					rotation: pipeBObject3D.unitData.rotation,
					count: 1,
					materials: null,
					parameters: pipeBPart1Parameters,
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: pipeBGroupId,
						needSelect: false
					}
				}); 
				unitSettings.push({
					name: nameBPrefix + "_" + 2,
					
					//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
					id: editor.getGuid(),
					
					code: pipeBObject3D.unitData.code, 
					versionNum: pipeBObject3D.unitData.versionNum,
					mixType: js3UnitMixType.none,

					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,					
					
					useWorldPosition: pipeBObject3D.unitData.useWorldPosition,
					position: pipeBObject3D.unitData.position,
					rotation: pipeBObject3D.unitData.rotation,
					count: 1,
					materials: null,
					parameters: pipeBPart2Parameters,
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: pipeBGroupId,
						needSelect: false
					}
				}); 				

				
				//删除原有管道
				editor.removeUnitObject3D(pipeAObject3D, true);
				editor.removeUnitObject3D(pipeBObject3D, true);
				
				//添加阶段后的管道
				js3CommandProcessors["pipeSystem"].needAddPipeCount = 4;
				js3CommandProcessors["pipeSystem"].addedPipeCount = 0;
				editor.createNewObject3DsByUser(unitSettings, function(){ 
					js3CommandProcessors["pipeSystem"].addedPipeCount = js3CommandProcessors["pipeSystem"].addedPipeCount + 1;
					if(js3CommandProcessors["pipeSystem"].needAddPipeCount == js3CommandProcessors["pipeSystem"].addedPipeCount){
						js3CommandProcessors["pipeSystem"].popWin.close();
						js3CommandProcessors["pipeSystem"].run({
							editor: js3CommandProcessors["pipeSystem"].editor,
							commandJson: js3CommandProcessors["pipeSystem"]
						});
					}
				});
				break;
			}
			case "breakA":{
				var unitSettings = [];
				
				//构造截断pipeA的属性
				var nameAPrefix = editor.getNewNamePrefix(pipeAObject3D.unitData.name);
				var pipeAGroupId = editor.getUnitGroupId(pipeAObject3D.unitData.id);
				var pipeAPart1Parameters = js3CommandProcessors["pipeSystem"].getCreateParameters(pipeAObject3D.unitData.parameters);
				var pipeAPoints = expGeometry.getXYZs(pipeAObject3D.unitData.parameters["位置"].value);
				var pipeAFirstPoint = pipeAPoints[0];
				var pipeALastPoint = pipeAPoints[pipeAPoints.length - 1];
				pipeAPart1Parameters["终点坐标"].value = breakPoint[0] + "," + breakPoint[2];
				pipeAPart1Parameters["终点高度"].value = breakPoint[1];
				pipeAPart1Parameters["位置"].value = pipeAFirstPoint[0] + "," + pipeAFirstPoint[1] + "," + pipeAFirstPoint[2] + ";" + breakPoint[0] + "," + breakPoint[1] + "," + breakPoint[2];
				var pipeAPart2Parameters = js3CommandProcessors["pipeSystem"].getCreateParameters(pipeAObject3D.unitData.parameters);
				pipeAPart2Parameters["起点坐标"].value = breakPoint[0] + "," + breakPoint[2];
				pipeAPart2Parameters["起点高度"].value = breakPoint[1];	
				pipeAPart2Parameters["位置"].value = breakPoint[0] + "," + breakPoint[1] + "," + breakPoint[2] + ";" + pipeALastPoint[0] + "," + pipeALastPoint[1] + "," + pipeALastPoint[2];						
				unitSettings.push({
					name: nameAPrefix + "_" + 1,
					
					//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
					id: editor.getGuid(),
					
					code: pipeAObject3D.unitData.code, 
					versionNum: pipeAObject3D.unitData.versionNum,
					mixType: js3UnitMixType.none,

					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,					
					
					useWorldPosition: pipeAObject3D.unitData.useWorldPosition,
					position: pipeAObject3D.unitData.position,
					rotation: pipeAObject3D.unitData.rotation,
					count: 1,
					materials: null,
					parameters: pipeAPart1Parameters,
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: pipeAGroupId,
						needSelect: false
					}
				}); 
				unitSettings.push({
					name: nameAPrefix + "_" + 2,
					
					//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
					id: editor.getGuid(),
					
					code: pipeAObject3D.unitData.code, 
					versionNum: pipeAObject3D.unitData.versionNum,
					mixType: js3UnitMixType.none,

					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,					
					
					useWorldPosition: pipeAObject3D.unitData.useWorldPosition,
					position: pipeAObject3D.unitData.position,
					rotation: pipeAObject3D.unitData.rotation,
					count: 1,
					materials: null,
					parameters: pipeAPart2Parameters,
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: pipeAGroupId,
						needSelect: false
					}
				}); 
				//删除原有管道
				editor.removeUnitObject3D(pipeAObject3D, true);
				
				//添加阶段后的管道
				js3CommandProcessors["pipeSystem"].needAddPipeCount = 2;
				js3CommandProcessors["pipeSystem"].addedPipeCount = 0;
				editor.createNewObject3DsByUser(unitSettings, function(){ 
					js3CommandProcessors["pipeSystem"].addedPipeCount = js3CommandProcessors["pipeSystem"].addedPipeCount + 1;
					if(js3CommandProcessors["pipeSystem"].needAddPipeCount == js3CommandProcessors["pipeSystem"].addedPipeCount){
						js3CommandProcessors["pipeSystem"].popWin.close();
						js3CommandProcessors["pipeSystem"].run({
							editor: js3CommandProcessors["pipeSystem"].editor,
							commandJson: js3CommandProcessors["pipeSystem"]
						});
					}
				});
				break;
			}
			case "breakB":{
				var unitSettings = [];
				
				//构造截断pipeB的属性
				var nameBPrefix = editor.getNewNamePrefix(pipeBObject3D.unitData.name);
				var pipeBGroupId = editor.getUnitGroupId(pipeBObject3D.unitData.id);
				var pipeBPart1Parameters = js3CommandProcessors["pipeSystem"].getCreateParameters(pipeBObject3D.unitData.parameters);
				var pipeBPoints = expGeometry.getXYZs(pipeBObject3D.unitData.parameters["位置"].value);
				var pipeBFirstPoint = pipeBPoints[0];
				var pipeBLastPoint = pipeBPoints[pipeBPoints.length - 1];
				pipeBPart1Parameters["终点坐标"].value = breakPoint[0] + "," + breakPoint[2];
				pipeBPart1Parameters["终点高度"].value = breakPoint[1];
				pipeBPart1Parameters["位置"].value = pipeBFirstPoint[0] + "," + pipeBFirstPoint[1] + "," + pipeBFirstPoint[2] + ";" + breakPoint[0] + "," + breakPoint[1] + "," + breakPoint[2];
				var pipeBPart2Parameters = js3CommandProcessors["pipeSystem"].getCreateParameters(pipeBObject3D.unitData.parameters);
				pipeBPart2Parameters["起点坐标"].value = breakPoint[0] + "," + breakPoint[2];
				pipeBPart2Parameters["起点高度"].value = breakPoint[1];	
				pipeBPart2Parameters["位置"].value = breakPoint[0] + "," + breakPoint[1] + "," + breakPoint[2] + ";" + pipeBLastPoint[0] + "," + pipeBLastPoint[1] + "," + pipeBLastPoint[2];			
				unitSettings.push({
					name: nameBPrefix + "_" + 1,
					
					//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
					id: editor.getGuid(),
					
					code: pipeBObject3D.unitData.code, 
					versionNum: pipeBObject3D.unitData.versionNum,
					mixType: js3UnitMixType.none,

					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,					
					
					useWorldPosition: pipeBObject3D.unitData.useWorldPosition,
					position: pipeBObject3D.unitData.position,
					rotation: pipeBObject3D.unitData.rotation,
					count: 1,
					materials: null,
					parameters: pipeBPart1Parameters,
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: pipeBGroupId,
						needSelect: false
					}
				}); 
				unitSettings.push({
					name: nameBPrefix + "_" + 2,
					
					//不再使用cmnPcr.getRandomValue()返回id，改成guid modified by ls 20220906
					id: editor.getGuid(),
					
					code: pipeBObject3D.unitData.code, 
					versionNum: pipeBObject3D.unitData.versionNum,
					mixType: js3UnitMixType.none,

					//显示级别 added by ls 20230403
					viewLevel: js3ViewLevelType.always,					
					
					useWorldPosition: pipeBObject3D.unitData.useWorldPosition,
					position: pipeBObject3D.unitData.position,
					rotation: pipeBObject3D.unitData.rotation,
					count: 1,
					materials: null,
					parameters: pipeBPart2Parameters,
					positionExps: {},
					rotationExps: {},
					uvs: null,
					otherInfo:{
						groupId: pipeBGroupId,
						needSelect: false
					}
				}); 				

				
				//删除原有管道
				editor.removeUnitObject3D(pipeBObject3D, true);
				
				//添加阶段后的管道
				js3CommandProcessors["pipeSystem"].needAddPipeCount = 2;
				js3CommandProcessors["pipeSystem"].addedPipeCount = 0;
				editor.createNewObject3DsByUser(unitSettings, function(){ 
					js3CommandProcessors["pipeSystem"].addedPipeCount = js3CommandProcessors["pipeSystem"].addedPipeCount + 1;
					if(js3CommandProcessors["pipeSystem"].needAddPipeCount == js3CommandProcessors["pipeSystem"].addedPipeCount){
						js3CommandProcessors["pipeSystem"].popWin.close();
						js3CommandProcessors["pipeSystem"].run({
							editor: js3CommandProcessors["pipeSystem"].editor,
							commandJson: js3CommandProcessors["pipeSystem"]
						});
					}
				}); 
				
				
				break;
			}			
		}	
	},
	
	createPipeSystem: function(p){
		var editor = js3CommandProcessors["pipeSystem"].editor; 
		var crossesJson = p.crossesJson;
		var jointInfos = p.jointInfos;
		var errorCount = 0;
		for(var jointName in jointInfos){
			var jointInfo = jointInfos[jointName]; 
			if(jointInfo.jointType == "error"){
				errorCount++;
			}
		} 
		for(var crossName in p.crossesJson){
			var crossJson = crossesJson[crossName]; 
			if(crossJson.processsType != "none"){
				if(crossJson.processsType == "joint"){
					switch(crossJson.jointType){
						case "coincide":
						case "angleError":{
							errorCount++;
							break;
						}
					}
				}
				else{
					errorCount++;
				}
			}
		}
		if(errorCount > 0){
			msgBox.alert({info: "存在" + errorCount + "个问题, 请处理后再生成管道系统."});
		}
		else{
			var pipe2HollowPoints = {};
			var pipe2OuterDiameters = {};
			var pipeJsons = [];
			var connectorJsons = [];
			var pipe2JsonDic = {};
			var name2PipeObject3Ds = js3CommandProcessors["pipeSystem"].name2PipeObject3Ds;
			for(var pipeName in name2PipeObject3Ds){
				var pipeObject3D = name2PipeObject3Ds[pipeName];
				var parameters = pipeObject3D.unitData.parameters;
				var outerDiameter = parameters["外径"].value;
				var cutLength = outerDiameter / 2;
				var beginPointXZStrs = parameters["起点坐标"].value.split(",");
				var solidBeginPoint = {
					x: parseFloat(beginPointXZStrs[0]),
					y: parameters["起点高度"].value,
					z: parseFloat(beginPointXZStrs[1])
				};
				var endPointXZStrs = parameters["终点坐标"].value.split(",");
				var solidEndPoint = {
					x: parseFloat(endPointXZStrs[0]),
					y: parameters["终点高度"].value,
					z: parseFloat(endPointXZStrs[1])
				};

				/*
				var pipeLength = Math.sqrt((solidEndPoint.x - solidBeginPoint.x) * (solidEndPoint.x - solidBeginPoint.x) 
					+ (solidEndPoint.y - solidBeginPoint.y) * (solidEndPoint.y - solidBeginPoint.y)
					+ (solidEndPoint.z - solidBeginPoint.z) * (solidEndPoint.z - solidBeginPoint.z));

				//生成的空心管道，因为需要连接件连接，所有实际长度会短
				var hollowBeginPoint = {
					x: solidBeginPoint.x + (solidEndPoint.x - solidBeginPoint.x) * cutLength / pipeLength,
					y: solidBeginPoint.y + (solidEndPoint.y - solidBeginPoint.y) * cutLength / pipeLength,
					z: solidBeginPoint.z + (solidEndPoint.z - solidBeginPoint.z) * cutLength / pipeLength,
				};
				var hollowEndPoint =  {
					x: solidEndPoint.x - (solidEndPoint.x - solidBeginPoint.x) * cutLength / pipeLength,
					y: solidEndPoint.y - (solidEndPoint.y - solidBeginPoint.y) * cutLength / pipeLength,
					z: solidEndPoint.z - (solidEndPoint.z - solidBeginPoint.z) * cutLength / pipeLength,
				};
				*/
				
				pipe2HollowPoints[pipeName] = {
					beginPoint: solidBeginPoint,
					endPoint: solidEndPoint,
				};
				pipe2OuterDiameters[pipeName] = outerDiameter;
				var pipeJson = {
					name: pipeName,
					parameters:{
						"内径": parameters["内径"].value,
						"外径": outerDiameter,
						"材质": parameters["材质"].value,
						"路径": parameters["路径"].value,
						"转折点": parameters["转折点"].value,
						"起点X": solidBeginPoint.x,
						"终点X": solidEndPoint.x,
						"起点Y": solidBeginPoint.y,
						"终点Y": solidEndPoint.y,
						"起点Z": solidBeginPoint.z,
						"终点Z": solidEndPoint.z
						/*
						"起点高度": hollowBeginPoint.y,
						"终点高度": hollowEndPoint.y,
						"起点坐标": hollowBeginPoint.x + "," + hollowBeginPoint.z,
						"终点坐标": hollowEndPoint.x + "," + hollowEndPoint.z
						*/
					}
				};
				pipe2JsonDic[pipeName] = pipeJson;
			}

			for(var jointName in jointInfos){
				var jointInfo = jointInfos[jointName];

				var pipeAName = "";
				var pipeBName = "";
				if(jointInfo.crossNames.length == 1){
					//直连或弯头
					var crossName = jointInfo.crossNames[0];
					var crossJson = crossesJson[crossName];
					pipeAName = crossJson.pipeAName;
					pipeBName = crossJson.pipeBName;

					js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[pipeAName], "A");
					js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[pipeBName], "B");
				}
				else if(jointInfo.crossNames.length == 3){
					//三通 
					for(var i = 0; i < jointInfo.crossNames.length; i++){
						var crossName = jointInfo.crossNames[i];
						var crossJson = crossesJson[crossName];
						//先找到直管部分
						if(crossJson.jointType == "direct"){
							pipeAName = crossJson.pipeAName;
							pipeBName = crossJson.pipeBName;
							break;
						}
					}
					for(var i = 0; i < jointInfo.crossNames.length; i++){
						var crossName = jointInfo.crossNames[i];
						var crossJson = crossesJson[crossName];
						if(crossJson.jointType == "elbow90"){
							//再把弯管的分支作为pipeB
							if(crossJson.pipeAName == pipeAName || crossJson.pipeAName == pipeBName){
								pipeBName = crossJson.pipeBName;
							}
							else{
								pipeBName = crossJson.pipeAName;
							} 
							break;
						}
					}
					
					//处理三通端口和管子的端口的对应关系，用于计算管子要裁掉的长度
					for(var i = 0; i < jointInfo.crossNames.length; i++){
						var crossName = jointInfo.crossNames[i];
						var crossJson = crossesJson[crossName];
						if(crossJson.jointType == "direct"){
							js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeAName], "A");
							js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeBName], "A");
						}
						else{
							if(crossJson.pipeAName == pipeAName){
								js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeAName], "A");
								js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeBName], "B");
							}
							else if(crossJson.pipeAName == pipeBName){
								js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeAName], "B");
								js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeBName], "A");
							} 
						}
					}
				}
				else if(jointInfo.crossNames.length == 6){
					//十字四通
					for(var i = 0; i < jointInfo.crossNames.length; i++){
						var crossName = jointInfo.crossNames[i];
						var crossJson = crossesJson[crossName];
						if(crossJson.jointType == "elbow90"){
							pipeAName = crossJson.pipeAName;
							pipeBName = crossJson.pipeBName;
							break;
						}
					}
					
					//处理四通端口和管子的端口的对应关系，用于计算管子要裁掉的长度
					for(var i = 0; i < jointInfo.crossNames.length; i++){
						var crossName = jointInfo.crossNames[i];
						var crossJson = crossesJson[crossName];
						if(crossJson.jointType == "direct"){
							if(crossJson.pipeAName == pipeAName){
								js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeAName], "A");
								js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeBName], "A");
							}
							else{
								js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeAName], "B");
								js3CommandProcessors["pipeSystem"].getPipeToJoint(jointInfo, pipe2JsonDic[crossJson.pipeBName], "B");
							} 
						}
					}
				}
				
				//找到距离JointPoint较远的点
				var jointPoint = jointInfo.point;
				var pipeABeginPoint = pipe2HollowPoints[pipeAName].beginPoint;
				var pipeAEndPoint = pipe2HollowPoints[pipeAName].endPoint;
				var pipeBBeginPoint = pipe2HollowPoints[pipeBName].beginPoint;
				var pipeBEndPoint = pipe2HollowPoints[pipeBName].endPoint;				
				var distanceJointToABegin = Math.sqrt((pipeABeginPoint.x - jointPoint.x) * (pipeABeginPoint.x - jointPoint.x) 
						+ (pipeABeginPoint.y - jointPoint.y) * (pipeABeginPoint.y - jointPoint.y) 
						+ (pipeABeginPoint.z - jointPoint.z) * (pipeABeginPoint.z - jointPoint.z));
				var distanceJointToAEnd = Math.sqrt((pipeAEndPoint.x - jointPoint.x) * (pipeAEndPoint.x - jointPoint.x) 
						+ (pipeAEndPoint.y - jointPoint.y) * (pipeAEndPoint.y - jointPoint.y) 
						+ (pipeAEndPoint.z - jointPoint.z) * (pipeAEndPoint.z - jointPoint.z));
				var pipeAPoint = distanceJointToABegin > distanceJointToAEnd ? pipeABeginPoint : pipeAEndPoint;				
				var distanceJointToBBegin = Math.sqrt((pipeBBeginPoint.x - jointPoint.x) * (pipeBBeginPoint.x - jointPoint.x) 
						+ (pipeBBeginPoint.y - jointPoint.y) * (pipeBBeginPoint.y - jointPoint.y) 
						+ (pipeBBeginPoint.z - jointPoint.z) * (pipeBBeginPoint.z - jointPoint.z));
				var distanceJointToBEnd = Math.sqrt((pipeBEndPoint.x - jointPoint.x) * (pipeBEndPoint.x - jointPoint.x) 
						+ (pipeBEndPoint.y - jointPoint.y) * (pipeBEndPoint.y - jointPoint.y) 
						+ (pipeBEndPoint.z - jointPoint.z) * (pipeBEndPoint.z - jointPoint.z));
				var pipeBPoint = distanceJointToBBegin > distanceJointToBEnd ? pipeBBeginPoint : pipeBEndPoint;
				
				var connectorJson = {
					name: jointInfo.name,
					jointType: jointInfo.jointType,
					jointPoint: jointPoint,
					pipeAPoint: pipeAPoint,
					pipeBPoint: pipeBPoint,
					pipeADiameter: pipe2OuterDiameters[pipeAName],
					pipeBDiameter: pipe2OuterDiameters[pipeBName]
				};
				connectorJsons.push(connectorJson);
			} 

			for(var pipeName in name2PipeObject3Ds){
				var pipeJson = pipe2JsonDic[pipeName];
				pipeJsons.push(pipeJson);	
			}
			

			var unitSettings = []; 
			var pipeSystemParameters = {
				pipes: {
					value: cmnPcr.jsonToStr({pipes: pipeJsons})
				},
				connectors: {
					value: cmnPcr.jsonToStr({connectors: connectorJsons})
				}
			};				
			var pipeSystemCode = js3SysCatAndCom.pipe.pipeSystemComponentCode;
			var pipeSystemName = "管道系统";
	    	var idAndName = editor.getNewUnitIdAndName(pipeSystemName + "_1", pipeSystemName); 
			unitSettings.push({
				name: idAndName.name,
				id: idAndName.id,
				code: pipeSystemCode, 
				versionNum: "1.0",
				mixType: js3UnitMixType.none,

				//显示级别 added by ls 20230403
				viewLevel: js3ViewLevelType.always,					
				
				useWorldPosition: true,
				position: [0, 0, 0],
				rotation: [0, 0, 0],
				count: 1,
				materials: null,
				parameters: pipeSystemParameters,
				positionExps: {},
				rotationExps: {},
				uvs: null,
				otherInfo:{
					needSelect: true
				}
			});  
			
			//添加管道系统
			editor.createNewObject3DsByUser(unitSettings, function(){
				//关闭窗口
				js3CommandProcessors["pipeSystem"].popWin.close();
			}); 
		}
	},
	getPipeToJoint: function(jointInfo, pipeJson, jointPort){
		//获取pipe与joint的关系，记录pipe的A/B端与joint的A/B的对应关系
		if(pipeJson.parameters["起点X"] == jointInfo.point.x
			&& pipeJson.parameters["起点Y"] == jointInfo.point.y
			&& pipeJson.parameters["起点Z"] == jointInfo.point.z){
			pipeJson["beginJoint"] = jointInfo.name;
			pipeJson["beginJointPort"] = jointPort;
		}
		else if(pipeJson.parameters["终点X"] == jointInfo.point.x
				&& pipeJson.parameters["终点Y"] == jointInfo.point.y
				&& pipeJson.parameters["终点Z"] == jointInfo.point.z){
			pipeJson["endJoint"] = jointInfo.name;
			pipeJson["endJointPort"] = jointPort;
		}
		
	}
};