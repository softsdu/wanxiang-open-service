//BIM客户端命令 added by ls 20220905
var expBimClientCommon = { 
	editor: null,
	//根据名称模糊匹配获取构件
	nameGet: function(name){
		var editor = expBimClientCommon.editor;
		var allObject3Ds = editor.getAllUnitObject3Ds();
		var selectedNames = new Array();
		for(var i = 0; i < allObject3Ds.length; i++){
			var object3D = allObject3Ds[i];
			var unitName = object3D.unitData.name; 
			if(unitName.indexOf(name) > -1){
				selectedNames.push(unitName);
			}		 
		}
		return cmnPcr.arrayToString(selectedNames, ";");
	},
	//根据名称模糊匹配，选择构件
	nameSel: function(name, fuzzy){
		var editor = expBimClientCommon.editor;
		var allObject3Ds = editor.getAllUnitObject3Ds();
		var selectedIds = new Array();
		var selectedNames = new Array();
		for(var i = 0; i < allObject3Ds.length; i++){
			var object3D = allObject3Ds[i];
			var unitName = object3D.unitData.name; 
			if(fuzzy || fuzzy == null){
				if(unitName.indexOf(name) > -1){
					selectedIds.push(object3D.unitData.id);
					selectedNames.push(unitName);
				}	
			}
			else{
				if(unitName == name){
					selectedIds.push(object3D.unitData.id);
					selectedNames.push(unitName);
				}	
			}
		}
		editor.selectUnitObject(null);
		editor.cancelAllMultiSelectUnitObjects();
		if(selectedIds.length == 0){
			//不做操作
		}
		else if(selectedIds.length == 1){
			var object3D = editor.getObject3DByUnitId(selectedIds[0]);
			editor.selectUnitObject(object3D);
		}
		else{
			editor.multiSelectUnitObjects(selectedIds);
		}
		return cmnPcr.arrayToString(selectedNames, ";");
	},
	
	//根据分组名称模糊匹配，选择构件 added by ls 20221206
	groupSel: function(name, fuzzy){
		var editor = expBimClientCommon.editor;
		var allGroupInfos = editor.getAllGroupInfos();
		var allUnitInfos = editor.getAllUnitInfos();
		var selectedIds = new Array();
		var selectedNames = new Array();
		for(var i = 0; i < allGroupInfos.length; i++){
			var groupInfo = allGroupInfos[i]; 
			var matchedGroupName = false;
			if(fuzzy || fuzzy == null){
				if(groupInfo.name.indexOf(name) > -1){
					matchedGroupName = true;
				}	
			}
			else{
				if(groupInfo.name == name){
					matchedGroupName = true;
				}	
			}
			if(matchedGroupName){
				for(var j = 0; j < groupInfo.units.length; j++){
					var unitId = groupInfo.units[j];
					selectedIds.push(unitId);
					var unitInfo = allUnitInfos[unitId];
					selectedNames.push(unitInfo.name);
				}
			}
		}
		editor.selectUnitObject(null);
		editor.cancelAllMultiSelectUnitObjects();
		if(selectedIds.length == 0){
			//不做操作
		}
		else if(selectedIds.length == 1){
			var object3D = editor.getObject3DByUnitId(selectedIds[0]);
			editor.selectUnitObject(object3D);
		}
		else{
			editor.multiSelectUnitObjects(selectedIds);
		}
		return cmnPcr.arrayToString(selectedNames, ";");
	},
	
	//根据分组名称模糊匹配，获取构件 added by ls 20221206
	groupGet: function(name, fuzzy){
		var editor = expBimClientCommon.editor;
		var allGroupInfos = editor.getAllGroupInfos();
		var allUnitInfos = editor.getAllUnitInfos();
		var selectedIds = new Array();
		var selectedNames = new Array();
		for(var i = 0; i < allGroupInfos.length; i++){
			var groupInfo = allGroupInfos[i]; 
			var matchedGroupName = false;
			if(fuzzy || fuzzy == null){
				if(groupInfo.name.indexOf(name) > -1){
					matchedGroupName = true;
				}	
			}
			else{
				if(groupInfo.name == name){
					matchedGroupName = true;
				}	
			}
			if(matchedGroupName){
				for(var j = 0; j < groupInfo.units.length; j++){
					var unitId = groupInfo.units[j];
					selectedIds.push(unitId);
					var unitInfo = allUnitInfos[unitId];
					selectedNames.push(unitInfo.name);
				}
			}
		}
		return cmnPcr.arrayToString(selectedNames, ";");
	},
	
	//根据构件类型名称模糊匹配获取构件
	catGet: function(name){
		var editor = expBimClientCommon.editor;
		var allObject3Ds = editor.getAllUnitObject3Ds(); 
		var selectedNames = new Array();
		for(var i = 0; i < allObject3Ds.length; i++){
			var object3D = allObject3Ds[i];
			var unitName = object3D.unitData.name; 
			var refComponentKey = object3D.unitData.code + "_" + object3D.unitData.versionNum;
			var refComponentInfo = editor.componentInfo.refComponents[refComponentKey]; 
			if(refComponentInfo.name.indexOf(name) > -1){ 
				selectedNames.push(unitName);
			}	 
		} 
		return cmnPcr.arrayToString(selectedNames, ";");
		
	},
	//根据构件类型名称模糊匹配，选择构件
	catSel: function(name, fuzzy){
		var editor = expBimClientCommon.editor;
		var allObject3Ds = editor.getAllUnitObject3Ds();
		var selectedIds = new Array();
		var selectedNames = new Array();
		for(var i = 0; i < allObject3Ds.length; i++){
			var object3D = allObject3Ds[i];
			var unitName = object3D.unitData.name; 
			var refComponentKey = object3D.unitData.code + "_" + object3D.unitData.versionNum;
			var refComponentInfo = editor.componentInfo.refComponents[refComponentKey];
			if(fuzzy || fuzzy == null){
				if(refComponentInfo.name.indexOf(name) > -1){
					selectedIds.push(object3D.unitData.id);
					selectedNames.push(unitName);
				}	
			}
			else{
				if(refComponentInfo.name == name){
					selectedIds.push(object3D.unitData.id);
					selectedNames.push(unitName);
				}	
			}
		}
		editor.selectUnitObject(null);
		editor.cancelAllMultiSelectUnitObjects();
		if(selectedIds.length == 0){
			//不做操作
		}
		else if(selectedIds.length == 1){
			var object3D = editor.getObject3DByUnitId(selectedIds[0]);
			editor.selectUnitObject(object3D);
		}
		else{
			editor.multiSelectUnitObjects(selectedIds);
		}
		return cmnPcr.arrayToString(selectedNames, ";");
	},
	//获取选中的构件
	getSel: function(){
		var editor = expBimClientCommon.editor;
		var selectedNames = new Array();
		if(editor.multiSelectedUnitObject3Ds != null && editor.multiSelectedUnitObject3Ds.length > 0){
			for(var i = 0; i < editor.multiSelectedUnitObject3Ds.length; i++){
				var object3D = editor.multiSelectedUnitObject3Ds[i];
				selectedNames.push(object3D.unitData.name);
			}
		}
		else if(editor.selectedUnitObject3D != null){
			selectedNames.push(editor.selectedUnitObject3D.unitData.name);
		}
		return cmnPcr.arrayToString(selectedNames, ";");
	},
	//修改构件属性值
	//修改函数名 modified by ls 20230217
	changeVal: function(namesStr, propertyName, propertyValue){
		var editor = expBimClientCommon.editor;
		//先取消选中
		editor.cancelAllMultiSelectUnitObjects();
		
		var propertyValueStr = propertyValue + "";
		var names = namesStr.split(";");
		
		//获取构件对象
		var object3Ds = [];
		for(var i = 0; i < names.length; i++){
			var name = names[i];
			var object3D = editor.getObject3DByUnitName(name);
			if(object3D == null){
				throw "不存在名为 '" + name + "' 的构件";
			}
			else{
				object3Ds.push(object3D);
			}
		}
		
		//检测是否存在此属性
		for(var i = 0; i < object3Ds.length; i++){
			var object3D = object3Ds[i];
			//更改判断属性是否存在的方法  modified by ls 20230217
			var refComponentKey = object3D.unitData.code + "_" + object3D.unitData.versionNum;
			var refComponentInfo = editor.componentInfo.refComponents[refComponentKey];
			var parameter = refComponentInfo.parameters[propertyName];
			if(parameter == null){
				throw "构件 '" + object3D.unitData.name + "' 没有名为 '" + propertyName + "' 的属性";
			}
		}
		
		//检测属性值是否合法
		for(var i = 0; i < object3Ds.length; i++){
			var object3D = object3Ds[i];
			var refComponentKey = object3D.unitData.code + "_" + object3D.unitData.versionNum;
			var refComponentInfo = editor.componentInfo.refComponents[refComponentKey];
			var parameter = refComponentInfo.parameters[propertyName];
			var valueType = getValueTypeByParameterType(parameter.paramType);
			if(!cmnPcr.canConvert(propertyValueStr, valueType)){
				throw "无法将 '" + propertyValueStr + "' 转换为 '" + valueType + "' 类型";
			}			
		}
		
		//修改属性值
		for(var i = 0; i < object3Ds.length; i++){
			var object3D = object3Ds[i];
			var refComponentKey = object3D.unitData.code + "_" + object3D.unitData.versionNum;
			var refComponentInfo = editor.componentInfo.refComponents[refComponentKey];
			var parameter = refComponentInfo.parameters[propertyName];
			var valueType = getValueTypeByParameterType(parameter.paramType);
			var newPropertyValue = cmnPcr.strToObject(propertyValueStr, valueType);
			
			//如果是新增的属性，原构件没有这个属性，需要特殊处理 modified by ls 20230217
			if(object3D.unitData.parameters[propertyName] != null){
				object3D.unitData.parameters[propertyName].value = newPropertyValue;
			}
			else{
				object3D.unitData.parameters[propertyName] = {value: newPropertyValue};
			}
		}		
		
		//重新构造模型
	    editor.rebuildUnitObject3Ds(object3Ds);
	},
	//清除构件的位置表达式 added by ls 20221206
	clearPosExp: function(namesStr){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		//先取消选中
		editor.cancelAllMultiSelectUnitObjects();
		
		//获取构件对象
		var hasSelectedObject3D = false;
		var object3Ds = [];
		for(var i = 0; i < names.length; i++){
			var name = names[i];
			var object3D = editor.getObject3DByUnitName(name);
			if(object3D == null){
				throw "不存在名为 '" + name + "' 的构件";
			}
			else{
				object3Ds.push(object3D);
				if(editor.selectedUnitObject3D == object3D){
					hasSelectedObject3D = true;
				}
			}
		} 
		
		//删除位置表达式
		for(var i = 0; i < object3Ds.length; i++){
			var object3D = object3Ds[i]; 
			object3D.unitData.positionExps = {};
		}
		
		//如果包含当前选中的构件，那么刷新属性显示值
		if(hasSelectedObject3D){
			editor.refreshUnitPropertyValues(editor.selectedUnitObject3D);
		}
	},
	
	//根据name批量获取构件对象 added by ls 20221206
	getObject3DsByNames: function(names){
		var editor = expBimClientCommon.editor;
		var object3Ds = [];
		for(var i = 0; i < names.length; i++){
			var name = names[i];
			var object3D = editor.getObject3DByUnitName(name);
			if(object3D == null){
				throw "不存在名为 '" + name + "' 的构件";
			}
			else{
				object3Ds.push(object3D);
			}
		}
		return object3Ds;
	},
	//左右移动构件 added by ls 20221206
	moveX: function(namesStr, moveDistance){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		var mMoveDistance = js3CommonFunction.mm2m(moveDistance);
		editor.moveObject3Ds(object3Ds, "x", mMoveDistance);
	},
	//上下移动构件 added by ls 20221206
	moveY: function(namesStr, moveDistance){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		var mMoveDistance = js3CommonFunction.mm2m(moveDistance);
		editor.moveObject3Ds(object3Ds, "y", mMoveDistance);
	},
	//前后移动构件 added by ls 20221206
	moveZ: function(namesStr, moveDistance){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		var mMoveDistance = js3CommonFunction.mm2m(moveDistance);
		editor.moveObject3Ds(object3Ds, "z", mMoveDistance);
	},
	//左对齐 added by ls 20221206
	alignLeft: function(namesStr){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		editor.alignObject3Ds(object3Ds, "unitMinX");
	},
	//右对齐 added by ls 20221206
	alignRight: function(namesStr){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		editor.alignObject3Ds(object3Ds, "unitMaxX");
	},
	//上对齐 added by ls 20221206
	alignTop: function(nameStr){
		var editor = expBimClientCommon.editor;
		var names = nameStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		editor.alignObject3Ds(object3Ds, "unitMaxY");
	},
	//下对齐 added by ls 20221206
	alignBottom: function(namesStr){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		editor.alignObject3Ds(object3Ds, "unitMinY");
	},
	//前对齐 added by ls 20221206
	alignFront: function(namesStr){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		editor.alignObject3Ds(object3Ds, "unitMaxZ");
	},
	//后对齐 added by ls 20221206
	alignBack: function(namesStr){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		editor.alignObject3Ds(object3Ds, "unitMinZ");
	},
	//X方向均匀分布 added by ls 20221209
	equipartitionX: function(nameStr){
		var editor = expBimClientCommon.editor;
		var names = nameStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		editor.equipartitionObject3Ds(object3Ds, "x");
	},
	//Y方向均匀分布 added by ls 20221209
	equipartitionY: function(namesStr){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		editor.equipartitionObject3Ds(object3Ds, "y");
	},
	//Z方向均匀分布 added by ls 20221209
	equipartitionZ: function(namesStr){
		var editor = expBimClientCommon.editor;
		var names = namesStr.split(";");
		editor.cancelAllMultiSelectUnitObjects();
		var object3Ds = expBimClientCommon.getObject3DsByNames(names);
		editor.equipartitionObject3Ds(object3Ds, "z");
	}
}