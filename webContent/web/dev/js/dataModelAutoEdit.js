var buildInCardModels =[ {
		name: "添加-常用字段",
		description: "添加id、createtime、createuser_xid、createusername、modifytime、 modifyuser_xid、modifyusername、isdeleted、deletetime等字段",
		fields:[{
			name:"id", displayName:"id", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:40, decimalNum:0, isReadonly:false, notNullable: true
		},
		{
			name:"createtime", displayName:"创建时间", valueType:"Time", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:20, decimalNum:3, isReadonly:false, notNullable: true
		},
		{
			name:"createuser_xid", displayName:"创建人id", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:40, decimalNum:0, isReadonly:false, notNullable: true
		},
		{
			name:"createusername", displayName:"创建人", valueType:"String", isSave:false, inputHelpType:"pop", inputHelpName:"/web/pop/view_d_User.jsp", foreignKeyName:"createuser_xid", maps:{"createusername":"name","createuser_xid":"id"}, valueLength:40, decimalNum:0, isReadonly:false, notNullable: false
		},
		{
			name:"modifytime", displayName:"修改时间", valueType:"Time", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:20, decimalNum:3, isReadonly:false, notNullable: false
		},
		{
			name:"modifyuser_xid", displayName:"修改人id", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:40, decimalNum:0, isReadonly:false, notNullable: false
		},
		{
			name:"modifyusername", displayName:"修改人", valueType:"String", isSave:false, inputHelpType:"pop", inputHelpName:"/web/pop/view_d_User.jsp", foreignKeyName:"modifyuser_xid", maps:{"modifyusername":"name","modifyuser_xid":"id"}, valueLength:40, decimalNum:0, isReadonly:false, notNullable: false
		},
		{
			name:"isdeleted", displayName:"已删除", valueType:"Boolean", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:1, decimalNum:0, isReadonly:false, notNullable: true
		},
		{
			name:"deletetime", displayName:"删除时间", valueType:"Time", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:20, decimalNum:3, isReadonly:false, notNullable: true
		}]
	},
	{
		name: "添加-id字段",
		description: "自动添加id字段",
		fields:[{
			name:"id", displayName:"id", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:40, decimalNum:0, isReadonly:false, notNullable: true
		}]
	}, 
	{
		name: "添加-创建相关字段",
		description: "添加createusername、creaeuser_xid、createtime等字段",
		fields:[{
			name:"createusername", displayName:"创建人", valueType:"String", isSave:false, inputHelpType:"pop", inputHelpName:"/web/pop/view_d_User.jsp", foreignKeyName:"createuser_xid", maps:{"createusername":"name","createuser_xid":"id"}, valueLength:40, decimalNum:0, isReadonly:false, notNullable: false
		}, 
		{
			name:"createuser_xid", displayName:"创建人id", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:40, decimalNum:0, isReadonly:false, notNullable: true
		},
		{
			name:"createtime", displayName:"创建时间", valueType:"Time", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:20, decimalNum:3, isReadonly:false, notNullable: true
		}]
	} , 
	{
		name: "添加-修改相关字段",
		description: "添加modifyusername、modifyuser_xid、modifytime等字段",
		fields:[
		{
			name:"modifyusername", displayName:"修改人", valueType:"String", isSave:false, inputHelpType:"pop", inputHelpName:"/web/pop/view_d_User.jsp", foreignKeyName:"modifyuser_xid", maps:{"modifyusername":"name","modifyuser_xid":"id"}, valueLength:40, decimalNum:0, isReadonly:false, notNullable: false
		},
		{
			name:"modifyuser_xid", displayName:"修改人id", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:40, decimalNum:0, isReadonly:false, notNullable: false
		}, 
		{
			name:"modifytime", displayName:"修改时间", valueType:"Time", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:20, decimalNum:3, isReadonly:false, notNullable: false
		}]
	} ,
	{
		name: "添加'已删除字段'",
		description: "自动添加已删除字段",
		fields:[ {
			name:"isdeleted", displayName:"已删除", valueType:"Boolean", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:1, decimalNum:0, isReadonly:false, notNullable: true
		},
		{
			name:"deletetime", displayName:"删除时间", valueType:"Time", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:20, decimalNum:3, isReadonly:false, notNullable: true
		}]
	} ,
	{
		name: "添加'字典类字段'",
		description: "自动添加id、code、name、description字段",
		fields:[{
			name:"id", displayName:"id", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:40, decimalNum:0, isReadonly:false, notNullable: true
		},{
			name:"code", displayName:"code", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:40, decimalNum:0, isReadonly:false, notNullable: true
		},{
			name:"name", displayName:"name", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:40, decimalNum:0, isReadonly:false, notNullable: true
		},{
			name:"description", displayName:"description", valueType:"String", isSave:true, inputHelpType:"input", inputHelpName:"", foreignKeyName:"", valueLength:255, decimalNum:0, isReadonly:false, notNullable: false
		}]
	}
];

var autoAddFields = function(btnIndex){
	var buildInCardModel = buildInCardModels[btnIndex];	
	if(msgBox.confirm({info: "确定添加吗?\r\n" + buildInCardModel.description})){	
		 
		//添加子表记录	
		var fieldGrid = sheetCtrl.getPartCardCtrl("line");	
		var newRows = new Array(); 
		for (var i = 0; i < buildInCardModel.fields.length; i++) {
			var fieldInfo = buildInCardModel.fields[i];
			var fieldValues = {}
			fieldValues["name"] = fieldInfo.name;
			fieldValues["description"] = fieldInfo.displayName;
			fieldValues["displayname"] = fieldInfo.displayName;
			fieldValues["valuetype"] = fieldInfo.valueType;
			fieldValues["issave"] = fieldInfo.isSave;
			fieldValues["inputhelptype"] = fieldInfo.inputHelpType;
			fieldValues["inputhelpname"] = fieldInfo.inputHelpName;
			fieldValues["foreignkeyname"] = fieldInfo.foreignKeyName;
			fieldValues["valuelength"] = fieldInfo.valueLength;
			fieldValues["decimalnum"] = fieldInfo.decimalNum;
			fieldValues["isreadonly"] = fieldInfo.isReadonly;
			fieldValues["notnullable"] = fieldInfo.notNullable;
			newRows.push({fieldValues: fieldValues});
		} 
		var param = {
			rows: newRows
		};
		fieldGrid.doAdd(param); 

		//添加子表的子表记录
		var fieldMapGrid = sheetCtrl.getPartCardCtrl("lineline");	
		for (var i = 0; i < buildInCardModel.fields.length; i++) {
			var fieldInfo = buildInCardModel.fields[i];
			for(var rowId in param.newRowsTable.allRows()){
				var row = fieldGrid.datatable.rows(rowId); 
				if(row.getValue("name") == fieldInfo.name && fieldInfo.maps != null){
					fieldGrid.selectRowInGrid(rowId);

					var newMapRows = new Array(); 
					for(var destFieldName in fieldInfo.maps){
						var fieldValues = {}
						fieldValues["destfield"] = destFieldName;
						fieldValues["sourcefield"] = fieldInfo.maps[destFieldName]; 
						newMapRows.push({fieldValues: fieldValues});
					} 
					var paramMap = {
						rows: newMapRows
					};
					fieldMapGrid.doAdd(paramMap); 
				}
			}
		}			
	}
}

var sheetWin = null;
var sheetCtrl = null;

$(document).ready(function(){ 
	var firstBuildInCardModel = buildInCardModels[0]; 
	var divInnerHtml = "";
	for(var i = 0; i < buildInCardModels.length; i++){ 
		divInnerHtml += ("<li><a id=\"autoAddFieldModelBtnId_" + i + "\" href=\"#\"></a></li>");
	}
	$("#autoAddFieldModelSubBtnContainerId").html(divInnerHtml);
	
	for(var i = 0; i < buildInCardModels.length; i++){
		var buildInCardModel = buildInCardModels[i];
		var name = buildInCardModel.name;
		var description = buildInCardModel.description;
		$("#autoAddFieldModelBtnId_" + i).text(name);
		$("#autoAddFieldModelBtnId_" + i).attr("btnIndex", i);
		$("#autoAddFieldModelBtnId_" + i).attr("title", description);
		$("#autoAddFieldModelBtnId_" + i).click(function(){
			var i = parseInt($(this).attr("btnIndex"));
			 autoAddFields(i);
			 return false;
		});
	}	 
	
	var initParam = window.parent.multiStyleWinInitParam; 
	initParam.containerId = "testSheetContainer";
	sheetWin = new NcpMultiStyleSheetWin(initParam); 
	sheetWin.show();	
	sheetCtrl = sheetWin.sheetCtrl;


	$("#generateJsBtn").click(function(){
		var mainCard = sheetCtrl.getMainCardCtrl();
	 	var idValue = mainCard.getCurrentIdValue();
	 	if(idValue == null){
	 		msgBox.alert({info:"没有记录."});
	 	}
	 	else{
	 		mainCard.doOtherAction({
				actionName:"generateJs",
				customParam:{dataId: idValue},
				successFunc: function(obj){ 
					if(obj.result.succeed == "true"){
						alert( "生成JS模型成功.");
					}
					else{
						var errors = obj.result.errors;
						var errorStr = cmnPcr.arrayToString(errors, "\r\n");							
						alert("提示:\r\n" + errorStr);								
					}
				},
				failFunc:function(obj){
					alert("生成JS模型失败.\r\n" + obj.code + ": " + obj.message);
				}
			});
	 	}
	}); 

	$("#updateDBStrucureBtn").click(function(){
		var mainCard = sheetCtrl.getMainCardCtrl();
	 	var idValue = mainCard.getCurrentIdValue();
	 	if(idValue == null){
	 		msgBox.alert({info:"没有记录."});
	 	}
	 	else{
	 		mainCard.doOtherAction({
				actionName:"updateDBStrucure",
				customParam:{dataId: idValue},
				successFunc: function(obj){
					if(obj.result.succeed == "true"){
						alert( "更新表结构成功.");
					}
					else{
						var errors = obj.result.errors;
						var errorStr = cmnPcr.arrayToString(errors, "\r\n");							
						alert("提示:\r\n" + errorStr);								
					}
				},
				failFunc:function(obj){
					alert("更新表结构失败.\r\n" + obj.code + ": " + obj.message);
				}
			});
	 	}
	}); 
});  