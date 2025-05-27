function OnlineModelGrid(){
	var thatEditor = this;

	this.appName = null;

	//新增获取窗口html的方法  added by ls 20210823
	this.getPropertyHtml = function(buttonContainerId, okBtnId, cancelBtnId){
		let innerHtml = "<div style=\"position:absolute;left:10px;top:0px;height:30px;font-size:11px;text-align:center;\">"
			+ "<table class=\"zlpCardMainTable\">"
			+ "<tr style=\"height:35px;\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">名称</td>"
			+ "<td class=\"zlpDispUnitValue\" style=\"width:280px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"name\" style=\"width:280px;\" paramCtrl=\"true\" /></td>"
			+ "</tr>"
			+ "<tr style=\"height:35px;display:none\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">id</td>"
			+ "<td class=\"zlpDispUnitValue\" style=\"width:280px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"id\" style=\"width:280px;\" paramCtrl=\"true\" /></td>"
			+ "</tr>"
		 	+ "</table>"
		 	+ "</div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:35px;bottom:10px;font-size:11px;text-align:right;\">"
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
 			+ "</div>";
		return innerHtml;
	}

	//创建模型
    this.createModel = function(p){
		let popContainer = new PopupContainer( {
			width : 400 ,
            height : 170,
			top : 50, 
			title: "创建项目"
		}); 
		
		popContainer.show();

		let inputId = cmnPcr.getRandomValue();
		let buttonContainerId = inputId + "_buttonContainer";
		let okBtnId = inputId + "_ok";
		let cancelBtnId = inputId + "_cancel";
		let innerHtml = thatEditor.getPropertyHtml(buttonContainerId, okBtnId, cancelBtnId);
		$("#" + popContainer.containerId).html(innerHtml);

		let paramWin = new NcpParamWin({
			containerId: popContainer.containerId,
			paramWinModel: thatEditor.getInputParam()			
		}); 
		paramWin.show();

		$("#" + okBtnId).click(function(){
			let result = paramWin.getParamResult();
			if(result.verified){			
				//新建
				let modelName = result.values["name"];

				let requestParam = {
					appName: thatEditor.appName,
					modelName: modelName
				};
				serverAccess.request({
					serviceName: "s3dModelNcpService",
					funcName: "createModel",
				    args: {requestParam:cmnPcr.jsonToStr(requestParam)},
					successFunc: function(obj) {  
						popContainer.close();
						let modelInfo = obj.result.modelInfo;
						thatEditor.openEditPage(modelInfo.id, modelInfo.name);
						if(p.afterCreateModelFunc){
							p.afterCreateModelFunc({id: modelInfo.id});
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

	//复制模型
    this.copyModel = function(p){
		let popContainer = new PopupContainer( {
			width : 400 ,
            height : 170,
			top : 50, 
			title: "复制场景"
		}); 
		
		popContainer.show();

		let inputId = cmnPcr.getRandomValue();
		let buttonContainerId = inputId + "_buttonContainer";
		let okBtnId = inputId + "_ok";
		let cancelBtnId = inputId + "_cancel";
		let innerHtml = thatEditor.getPropertyHtml(buttonContainerId, okBtnId, cancelBtnId);
		$("#" + popContainer.containerId).html(innerHtml);

		let paramWin = new NcpParamWin({
			containerId: popContainer.containerId,
			paramWinModel: thatEditor.getInputParam()			
		}); 
		paramWin.show();		 
		paramWin.setParamValues({
			name: p.initValues.name,
			id: p.initValues.id
		});
		
		$("#" + okBtnId).click(function(){ 
			let result = paramWin.getParamResult();
			if(result.verified){			 
				//复制组件后更新
				let newModelName = result.values["name"];
				let sourceModelId = result.values["id"];
				var requestParam = {
					appName: thatEditor.appName,
					newModelName: newModelName,
					sourceModelId: sourceModelId
				};
				serverAccess.request({
					serviceName: "s3dModelNcpService",
					funcName: "copyModel",
				    args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
					successFunc: function(obj) {
						popContainer.close();
						let modelInfo = obj.result.modelInfo;
						thatEditor.openEditPage(modelInfo.id, modelInfo.name);
						if(p.afterCopyModelFunc){
							p.afterCopyModelFunc({id: modelInfo.id});
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
		thatEditor.appName = p.appName;
    };

	this.openEditPage = function(id, name){
		let pageUrl = "../editor/apps/exhibitEdit/exhibitEditor.html?modelId=" + id + "&modelName=" + encodeURIComponent(name);
		let winName = "Editor_" + thatEditor.appName + "_" + id;
		window.open(pageUrl, winName);
	}

	this.openPreviewPage = function(id, name){
		let pageUrl = "../editor/apps/exhibitEdit/exhibitViewer.html?modelId=" + id + "&modelName=" + encodeURIComponent(name);
		let winName = "Viewer_" + thatEditor.appName + "_" + id;
		window.open(pageUrl, winName);
	}

	this.openPublishPage = function(userId, modelId){
		let pageUrl = "../publish/module/apps/exhibitView/exhibitViewer.html?user=" + userId + "&model=" + modelId;
		let winName = "Publish_" + thatEditor.appName + "_" + modelId;
		window.open(pageUrl, winName);
	}

    this.getInputParam = function(){
    	let parameterModel= {
    		id: 1,
    		name: "testParamWin",
    		units: {
				id:{
					id: 1,
					name: "id",
					label: "id",
					valueType: valueType.string,
					inputHelpType: "",
					inputHelpName: "",
					decimalNum: "0",
					valueLength: 255,
					isMultiValue: false,
					isNullable: true,
					isEditable: true,
					unitType: "text",
					maps: null,
					view: { },
					defaultValue: "",
				},
				name:{
					id: 1,
					name: "name",
					label: "名称",
					valueType: valueType.string,
					inputHelpType: "",
					inputHelpName: "",
					decimalNum: "0",
					valueLength: 255,
					isMultiValue: false,
					isNullable: false,
					isEditable: true,
					unitType: "text",
					maps: null,
					view: { },
					defaultValue: "",
				}
    		}
		};
    	return parameterModel;
    }

	this.publish = function (id){
		let requestParam = {
			id: id
		};
		serverAccess.request({
			serviceName: "s3dPublishNcpService",
			funcName: "publishModel",
			args: {
				requestParam: cmnPcr.jsonToStr(requestParam)
			},
			successFunc: function(obj) {
				let userId = obj.result.userId;
				let modelId = obj.result.modelId;
				thatEditor.openPublishPage(userId, modelId);
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
	}
}