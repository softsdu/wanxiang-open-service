function CdsGrid(){
	var thatGrid = this;
	
	this.base = CoreGrid;
	
	this.base();  
	
	this.mdlType = "component";

	//新增获取窗口html的方法  added by ls 20210823
	this.getComponentPropertyHtml = function(buttonContainerId, okBtnId, cancelBtnId){
		var innerHtml = "<div style=\"position:absolute;left:10px;top:0px;height:30px;font-size:14px;text-align:center;\">"
			+ "<table class=\"zlpCardMainTable\">"
			+ "<tr style=\"height:35px;display:none;\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">组件Id</td>"
		 	+ "<td class=\"zlpDispUnitValue\" style=\"width:190px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"id\" style=\"width:190px;\" paramCtrl=\"true\" /></td>"
		 	+ "</tr>"
			+ "<tr style=\"height:35px;display:none;\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">元数据</td>"
			+ "<td class=\"zlpDispUnitValue\" style=\"width:190px;\">"
			+ "<input paramCtrl='true' name='m_900'/><input paramCtrl='true' name='goods_mid'/><input paramCtrl='true' name='s_base_mid'/><input paramCtrl='true' name='m_904'/><input paramCtrl='true' name='metadata'/>"
			+ "</td>"
			+ "</tr>"
			+ "<tr style=\"height:35px;\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">组件编码</td>"
		 	+ "<td class=\"zlpDispUnitValue\" style=\"width:190px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"code\" style=\"width:190px;\" paramCtrl=\"true\" /></td>"
		 	+ "</tr>" 
			+ "<tr style=\"height:35px;\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">组件名称</td>"
		 	+ "<td class=\"zlpDispUnitValue\" style=\"width:190px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"name\" style=\"width:190px;\" paramCtrl=\"true\" /></td>"
		 	+ "</tr>"
            + "<tr style=\"height:35px;\">"
            + "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">国标码</td>"
            + "<td class=\"zlpDispUnitValue\" style=\"width:190px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"gbcode\" style=\"width:190px;\" paramCtrl=\"true\" /></td>"
            + "</tr>"
            + "<tr style=\"height:35px;\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">版本号</td>"
		 	+ "<td class=\"zlpDispUnitValue\" style=\"width:190px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"versionnum\" style=\"width:190px;\" paramCtrl=\"true\" /></td>"
		 	+ "</tr>"
            + "<tr style=\"height:35px;\">"
            + "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">共享范围</td>"
            + "<td class=\"zlpDispUnitValue\" style=\"width:190px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"sharetype\" style=\"width:190px;\" paramCtrl=\"true\" /></td>"
            + "</tr>"
			+ "<tr style=\"height:35px;\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">所属类型</td>"
		 	+ "<td class=\"zlpDispUnitValue\" style=\"width:190px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"categoryname\" style=\"width:190px;\" paramCtrl=\"true\" /></td>"
		 	+ "</tr>"
            + "<tr style=\"height:70px;\">"
            + "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">备注</td>"
            + "<td class=\"zlpDispUnitValue\" style=\"width:190px;\"><textarea type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"note\" style=\"width:190px;height:70px;\" paramCtrl=\"true\"></textarea></td>"
            + "</tr>"
            + "</table>"
		 	+ "</div>"
			+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:35px;bottom:10px;font-size:11px;text-align:right;\">"
			+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
			+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
			+ "</div>";
		return innerHtml;
	}

	//新增场景组件方法  added by ls 20210823
    this.createComponent= function(p){
		var popContainer = new PopupContainer( {
			width : 320 ,
            height : 390,//height : 320,//height : 250,
			top : 50, 
			title: "创建组件模型"
		}); 
		
		popContainer.show();

		var inputId = cmnPcr.getRandomValue(); 
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var innerHtml = thatGrid.getComponentPropertyHtml(buttonContainerId, okBtnId, cancelBtnId);
		$("#" + popContainer.containerId).html(innerHtml); 
		 
		var paramWin = new NcpParamWin({
			containerId: popContainer.containerId,
			paramWinModel: thatGrid.getInputParam()			
		}); 
		paramWin.show();
		if(typeof(popIcon) != "undefined"){
			popIcon();//弹出图标
		}
		$("#" + okBtnId).click(function(){ 
			var result = paramWin.getParamResult();
			if(result.verified){			
				//新建 
				var code = result.values["code"]; 
				var name = result.values["name"];
                var note = result.values["note"];//20220222
                var shareType = result.values["sharetype"];//20220329
                var gbCode = result.values["gbcode"];//20220408
                var versionNum = result.values["versionnum"];
				var categoryId = result.values["categoryid"];

				var m900 = result.values["m_900"];
				var m904 = result.values["m_904"];
				var goodsMid = result.values["goods_mid"];
				var sBaseMid = result.values["s_base_mid"];
				var metadata = result.values["metadata"];

				var requestParam = {
					code: code,
					name: name,
                    note: note,//20220222
                    shareType: shareType,//20220329
                    gbCode: gbCode,//20220408
					versionNum: versionNum,
					categoryId: categoryId,
					mdlType: thatGrid.mdlType,
					m900: m900,
					m904: m904,
					goodsMid: goodsMid,
					sBaseMid: sBaseMid,
					metadata: metadata,
				};
				serverAccess.request({
					serviceName:"mdlComponentNcpService",
					funcName:"createComponent",
				    args:{requestParam:cmnPcr.jsonToStr(requestParam)},
					successFunc: function(obj) {
						popContainer.close();
						var id = obj.result.id;
						var code = decodeURIComponent(obj.result.code);
						var name = decodeURIComponent(obj.result.name);
						var versionNum = decodeURIComponent(obj.result.versionNum)
						thatGrid.openPage(id, code, name, versionNum);
						if(p.afterCreateComponentFunc){
							p.afterCreateComponentFunc({id: id});
						}
					},
					failFunc: function(obj) {
						msgBox.error({title:"提示", info: obj.message});
					}
				});
			}
			else{
				msgBox.alert({info: result.error});
			}
		});
		$("#" + cancelBtnId).click(function(){  
			popContainer.close(); 
		});
	}

	//修改编辑属性方法  modified by ls 20210823
    this.editComponentProperty= function(p){
		var popContainer = new PopupContainer( {
			width : 320 ,
            height : 390,//height : 320,//height : 250,
			top : 50, 
			title: "编辑组件属性"
		}); 
		
		popContainer.show();

		var inputId = cmnPcr.getRandomValue(); 
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var innerHtml = thatGrid.getComponentPropertyHtml(buttonContainerId, okBtnId, cancelBtnId);
		$("#" + popContainer.containerId).html(innerHtml); 
		 
		var paramWin = new NcpParamWin({
			containerId: popContainer.containerId,
			paramWinModel: thatGrid.getInputParam()			
		}); 
		paramWin.show();

		//修改类型中的 pop页按钮
		popIcon();
		paramWin.setParamValues({
			id: p.initValues.id,
			code: p.initValues.code,
			name: p.initValues.name,
            note: p.initValues.note,//20220222
            sharetype:{description:p.initValues.shareType}, //p.initValues.shareType,//20220329
            gbcode: p.initValues.gbCode,//20220408
			versionnum: p.initValues.versionNum,
			categoryid: p.initValues.categoryId,
			categoryname: {id: p.initValues.categoryId, name: p.initValues.categoryName},
			m_900: p.initValues.m900,
			m_904: p.initValues.m904,
			goods_mid: p.initValues.goodsMid,
			s_base_mid: p.initValues.sBaseMid,
			metadata: p.initValues.metadata,
		});
		
		$("#" + okBtnId).click(function(){ 
			var result = paramWin.getParamResult();
			if(result.verified){			 
				//编辑属性后更新
				var id = result.values["id"]; 
				var code = result.values["code"]; 
				var name = result.values["name"];
                var note = result.values["note"];//20220222
                var shareType = result.values["sharetype"];//20220329
                var gbCode = result.values["gbcode"];//20220408
                var versionNum = result.values["versionnum"];
				var categoryId = result.values["categoryid"];

				var m900 = result.values["m_900"];
				var m904 = result.values["m_904"];
				var goodsMid = result.values["goods_mid"];
				var sBaseMid = result.values["s_base_mid"];
				var metadata = result.values["metadata"];
				var requestParam = {
					id: id,
					code: code,
					name: name,
                    note: note,//20220222
                    shareType: shareType,//20220329
                    gbCode: gbCode,//20220408
					versionNum: versionNum,
					categoryId: categoryId,
					m900: m900,
					m904: m904,
					goodsMid: goodsMid,
					sBaseMid: sBaseMid,
					metadata: metadata,
				};
				serverAccess.request({
					serviceName:"mdlComponentNcpService",
					funcName:"changeComponentProperty",
				    args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
					successFunc: function(obj) {  
						popContainer.close();  
						if(p.afterEditComponentPropertyFunc){
							p.afterEditComponentPropertyFunc({id: id});
						}
					},
					failFunc: function(obj) {
						msgBox.error({title:"提示", info: obj.message});
					}
				});  
			}
			else{
				msgBox.alert({info: result.error});
			}
		});
		$("#" + cancelBtnId).click(function(){  
			popContainer.close(); 
		});

	}
	//增加复制组件的方法  added by ls 20210823
    this.copyComponent= function(p){
		var popContainer = new PopupContainer( {
			width : 300 ,
            height : 390,//height : 320,//height : 250,
			top : 50, 
			title: "复制组件"
		}); 
		
		popContainer.show();

		var inputId = cmnPcr.getRandomValue(); 
		var buttonContainerId = inputId + "_buttonContainer";
		var okBtnId = inputId + "_ok";
		var cancelBtnId = inputId + "_cancel";
		var innerHtml = thatGrid.getComponentPropertyHtml(buttonContainerId, okBtnId, cancelBtnId);
		$("#" + popContainer.containerId).html(innerHtml); 
		 
		var paramWin = new NcpParamWin({
			containerId: popContainer.containerId,
			paramWinModel: thatGrid.getInputParam()			
		}); 
		paramWin.show();		 
		paramWin.setParamValues({
			id: p.initValues.id,
			code: p.initValues.code + "_1",
			name: p.initValues.name + "_1",
            note: "",//增加备注 added by liyh 20220225
            sharetype:{description:p.initValues.shareType}, //p.initValues.shareType,//20220329
            gbcode: "",//国标码 added by liyh 20220408
			versionnum: p.initValues.versionNum,
			categoryid: p.initValues.categoryId,
			categoryname: {id: p.initValues.categoryId, name: p.initValues.categoryName}
		}); 
		
		$("#" + okBtnId).click(function(){ 
			var result = paramWin.getParamResult();
			if(result.verified){			 
				//复制组件后更新
				var id = result.values["id"]; 
				var code = result.values["code"]; 
				var name = result.values["name"];
                var note = result.values["note"];//增加备注 added by liyh 20220225
                var shareType = result.values["sharetype"];//20220329
                var gbCode = result.values["gbcode"];//20220408
                var versionNum = result.values["versionnum"];
				var categoryId = result.values["categoryid"]; 
				var requestParam = {
					copiedId: id,
					code: code,
					name: name,
                    note: note,//增加备注 added by liyh 20220225
                    shareType: shareType,//增加共享范围 20220329
                    gbCode: gbCode,//20220408
					versionNum: versionNum,
					categoryId: categoryId,
					mdlType: thatGrid.mdlType
				};
				serverAccess.request({
					serviceName:"mdlComponentNcpService",
					funcName:"copyComponent",
				    args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
					successFunc: function(obj) {  
						popContainer.close();  
						var id = obj.result.id;
						var code = decodeURIComponent(obj.result.code);
						var name = decodeURIComponent(obj.result.name);
						var versionNum = decodeURIComponent(obj.result.versionNum)
						thatGrid.openPage(id, code, name, versionNum);
						if(p.afterCopyComponentFunc){
							p.afterCopyComponentFunc({id: id});
						}
					},
					failFunc: function(obj) {
						msgBox.error({title:"提示", info: obj.message});
					}
				});  
			}
			else{
				msgBox.alert({info: result.error});
			}
		});
		$("#" + cancelBtnId).click(function(){  
			popContainer.close(); 
		});
	}
     
    //初始化,入口方法
    this.init = function(p) { 
    }; 
    
    this.getInputParam = function(){
    	var parameterModel = {
    		id:2,
    		name:"testParamWin",
    		units:{
				id:{
					id:0,
				    name:"id",
				    label:"ID",
				    valueType:valueType.string,
				    inputHelpType:"",
				    inputHelpName:"",
				    decimalNum:"0",
				    valueLength:40,
				    isMultiValue:false,
				    isNullable: true,
				    isEditable: true,
				    unitType:"text",
				    maps:null,
				    view:{
				    },
				    defaultValue:"",
			    },
			    code:{
					id:1,
				    name:"code",
				    label:"编码",
				    valueType:valueType.string,
				    inputHelpType:"",
				    inputHelpName:"",
				    decimalNum:"0",
				    valueLength:255,
				    isMultiValue:false,
				    isNullable:false,
				    isEditable: true,
				    unitType:"text",
				    maps:null,
				    view:{
				    },
				    defaultValue:"",
			    },
			    name:{
					id:2,
				    name:"name",
				    label:"名称",
				    valueType:valueType.string,
				    inputHelpType:"",
				    inputHelpName:"",
				    decimalNum:"0",
				    valueLength:255,
				    isMultiValue:false,
				    isNullable:false,
				    isEditable: true,
				    unitType:"text",
				    maps:null,
				    view:{
				    },
				    defaultValue:"",
			    },
				versionnum:{
					id:3,
				    name:"versionnum",
				    label:"版本号",
				    valueType:valueType.string,
				    inputHelpType:"",
				    inputHelpName:"",
				    decimalNum:"0",
				    valueLength:50,
				    isMultiValue:false,
				    isNullable:false,
				    isEditable: true,
				    unitType:"text",
				    maps:null,
				    view:{
				    },
				    defaultValue:"1.0",
			    } ,
				categoryid:{
					id:4,
				    name:"categoryid",
				    label:"所属类型Id",
				    valueType:valueType.string,
				    inputHelpType:"",
				    inputHelpName:"",
				    decimalNum:"0",
				    valueLength:50,
				    isMultiValue:false,
				    isNullable:false,
				    isEditable: true,
				    unitType:"text",
				    maps:null,
				    view:{
				    },
				    defaultValue:"1.0",
			    } ,
				categoryname:{
					id:5,
				    name:"categoryname",
				    label:"所属类型",
				    valueType:valueType.string,
					inputHelpType:"pop",
					inputHelpName:"/web/design/cds/cdsPopCategory.jsp",
				    decimalNum:"0",
				    valueLength:100,
				    isMultiValue:false,
				    isNullable:false,
				    isEditable: true,
				    unitType:"pop",
				 	maps:{"categoryname":"name","categoryid":"id"},
				    view:{
				    },
				    defaultValue:null,
			    } ,
                note:{
                    id:6,
                    name:"note",
                    label:"备注",
                    valueType:valueType.string,
                    inputHelpType:"",
                    inputHelpName:"",
                    decimalNum:"0",
                    valueLength:500,
                    isMultiValue:false,
                    isNullable:true,
                    isEditable: true,
                    unitType:"text",
                    maps:null,
                    view:{
                    },
                    defaultValue:"",
                },
				//新增部品共享范围 added by liyh 20220329
                sharetype:{
                    id:7,
                    name:"sharetype",
                    label:"共享范围",
                    valueType:valueType.string,
                    inputHelpType:"list",
                    inputHelpName:"bsp.sharetype",
                    decimalNum:"0",
                    valueLength:20,
                    isMultiValue:false,
                    isNullable:false,
                    isEditable: true,
                    unitType:"list",
                    maps:{"sharetype":"description"},
                    list:{
                        name:"bsp.sharetype",
                        columns:[{field:"description",valueType:valueType.string,title:"description",width:150,hidden:false},
                            {field:"id",valueType:valueType.string,title:"id",width:0,hidden:true},
                            {field:"name",valueType:valueType.string,title:"name",width:0,hidden:true}
                        ]
                    },
                    defaultValue:"个人",
                },
                gbcode:{
                    id:1,
                    name:"gbcode",
                    label:"国标码",
                    valueType:valueType.string,
                    inputHelpType:"",
                    inputHelpName:"",
                    decimalNum:"0",
                    valueLength:255,
                    isMultiValue:false,
                    isNullable:true,
                    isEditable: true,
                    unitType:"text",
                    maps:null,
                    view:{
                    },
                    defaultValue:"",
                },
				m_900:{
					id:11,
					name:"m_900",
					label:"物料名称",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:255,
					isMultiValue:false,
					isNullable:true,
					isEditable: true,
					unitType:"text",
					maps:null,
					view:{
					},
					defaultValue:"",
				},
				m_904:{
					id:12,
					name:"m_904",
					label:"辅计量单位",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:255,
					isMultiValue:false,
					isNullable:true,
					isEditable: true,
					unitType:"text",
					maps:null,
					view:{
					},
					defaultValue:"",
				},
				s_base_mid:{
					id:13,
					name:"s_base_mid",
					label:"基础属性编码",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:255,
					isMultiValue:false,
					isNullable:true,
					isEditable: true,
					unitType:"text",
					maps:null,
					view:{
					},
					defaultValue:"",
				},
				goods_mid:{
					id:14,
					name:"goods_mid",
					label:"商品流水码",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:255,
					isMultiValue:false,
					isNullable:true,
					isEditable: true,
					unitType:"text",
					maps:null,
					view:{
					},
					defaultValue:"",
				},
				metadata:{
					id:15,
					name:"metadata",
					label:"基础属性",
					valueType:valueType.string,
					inputHelpType:"",
					inputHelpName:"",
					decimalNum:"0",
					valueLength:255,
					isMultiValue:false,
					isNullable:true,
					isEditable: true,
					unitType:"text",
					maps:null,
					view:{
					},
					defaultValue:"",
				}

    		}
		};
    	return parameterModel;
    }
};
