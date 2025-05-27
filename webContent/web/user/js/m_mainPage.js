function MainPortal(){
	var that = this;

	this.portalSetting = null;

	this.s3dAppName = "ExhibitEditor";
	
	this.init = function(p){
		that.portalSetting = p.portalSetting;
		that.initS3dModuleList();
		that.initS3dModelList();
	}

	this.initS3dModuleList = function(){
		let moduleHtml = "";
		for(let i = 0; i < that.portalSetting.s3dModules.length; i++){
			let moduleInfo = that.portalSetting.s3dModules[i];
			if(moduleInfo.type === "splitter"){
				moduleHtml += ("<div class=\"imageItem imageItemSplitter\"><div class=\"imageItemSplitterInner\"></div></div>");
			}
			else {
				moduleHtml += ("<div class=\"imageItem\" moduleCode=\"" + moduleInfo.code + "\" moduleName=\"" + moduleInfo.title + "\">"
					+ "	<img class=\"imageItemImage\" src=\"../design/s3d/image/module/" + moduleInfo.code + ".png\" />"
					+ "	<div class=\"imageItemTitle\">" + moduleInfo.title + "</div>"
					+ "</div>");
			}
		}
		let itemContainer = $(".s3dModuleContainer .blockItemContainer");
		$(itemContainer).html(moduleHtml);

		$(itemContainer).find(".imageItem").click(function(){
			let moduleCode = $(this).attr("moduleCode");
			let moduleName = $(this).attr("moduleName")
			that.showCreateModelWindow(moduleCode, moduleName);
		});
	}

	this.showCreateModelWindow = function (moduleCode, moduleName){
		let modelName = moduleName + "_" + cmnPcr.datetimeToStr(new Date(), "yyyyMMdd_HHmmss");
		let popContainer = new PopupContainer( {
			width : 350 ,
			height : 170,
			top : 50,
			title: "创建项目"
		});

		popContainer.show();

		let inputId = cmnPcr.getRandomValue();
		let buttonContainerId = inputId + "_buttonContainer";
		let okBtnId = inputId + "_ok";
		let cancelBtnId = inputId + "_cancel";
		let innerHtml = that.getCreateModelHtml(buttonContainerId, okBtnId, cancelBtnId);
		$("#" + popContainer.containerId).html(innerHtml);

		let paramWin = new NcpParamWin({
			containerId: popContainer.containerId,
			paramWinModel: that.getCreateModelInputParam()
		});
		paramWin.show();
		paramWin.setParamValues({
			modelname: modelName,
			modulecode: moduleCode
		});

		$("#" + okBtnId).click(function(){
			let result = paramWin.getParamResult();
			if(result.verified){
				//新建
				let moduleCode = result.values["modulecode"];
				let modelName = result.values["modelname"];

				let requestParam = {
					appName: that.s3dAppName,
					moduleCode: moduleCode,
					modelName: modelName
				};
				serverAccess.request({
					serviceName:"s3dModelNcpService",
					funcName:"createModel",
					args:{requestParam:cmnPcr.jsonToStr(requestParam)},
					successFunc: function(obj) {
						let modelInfo = obj.result.modelInfo;
						let pageUrl = "../design/s3d/editor/apps/exhibitEdit/exhibitEditor.html?modelId=" + modelInfo.id + "&modelName=" + encodeURIComponent(modelInfo.name);
						let winName = "Editor_" + that.s3dAppName + "_" + modelInfo.id;
						window.open(pageUrl, winName);
						popContainer.close();
						that.initS3dModelList({});
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

	//新增获取窗口html的方法  added by ls 20210823
	this.getCreateModelHtml = function(buttonContainerId, okBtnId, cancelBtnId){
		let innerHtml = "<div style=\"position:absolute;left:10px;top:15px;height:30px;font-size:11px;text-align:center;\">"
			+ "<table class=\"zlpCardMainTable\">"
			+ "<tr style=\"height:35px;\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">名称</td>"
			+ "<td class=\"zlpDispUnitValue\" style=\"width:240px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"modelname\" style=\"width:240px;\" paramCtrl=\"true\" /></td>"
			+ "</tr>"
			+ "<tr style=\"height:35px;display:none\">"
			+ "<td class=\"zlpDispUnitTitle\" style=\"width:70px;\">模板编码</td>"
			+ "<td class=\"zlpDispUnitValue\" style=\"width:240px;\"><input type=\"text\" class=\"zlpDispUnitInput\" autocomplete=\"off\" name=\"modulecode\" style=\"width:240px;\" paramCtrl=\"true\" /></td>"
			+ "</tr>"
			+ "</table>"
			+ "</div>"
			+ "<div id=\"" + buttonContainerId + "\" style=\"position:absolute;left:0px;right:0px;height:35px;bottom:10px;font-size:11px;text-align:right;\">"
			+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" class=\"commonBtn\" />"
			+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" class=\"commonBtn\" />"
			+ "</div>";
		return innerHtml;
	}

	this.getCreateModelInputParam = function(){
		let parameterModel = {
			id: 1,
			name: "testParamWin",
			units: {
				modulecode:{
					id: 1,
					name: "modulecode",
					label: "模板编码",
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
				modelname:{
					id: 1,
					name: "modelname",
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

	this.initS3dModelList = function(p){
		let requestParam = {
			appName: that.s3dAppName,
			rowCount: 24
		};
		serverAccess.request({
			serviceName:"s3dModelNcpService",
			funcName:"getLastModels",
			args:{requestParam:cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj) {
				let modelInfos = [];
				let models = obj.result.models;
				for(let i = 0; i < models.length; i++){
					let model = models[i];
					modelInfos.push({
						id: model.id,
						name: decodeURIComponent(model.name),
						createTime: cmnPcr.strToTime(model.createTime),
						modifyTime: cmnPcr.strToTime(model.modifyTime),
						imgAccessoryId: model.imgAccessoryId
					});
				}
				that.updateS3dModelList(modelInfos);
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});


		$(".s3dModelContainer .blockHeaderMore .itemBtnLink").click(function(){
			let s3dModelSystemInfo = that.portalSetting.s3dModelSystem;
			window.parent.sysMenu.runActionExp(s3dModelSystemInfo.gridMenuId);
			return false;
		});
	}

	this.updateS3dModelList = function(modelInfos){
		let modelHtml = "";
		if(modelInfos.length === 0){
			modelHtml += ("<div class=\"modelItem blockItemNone\">没有找到模型.</div>");
		}
		else{
			for(let i = 0; i < modelInfos.length; i++){
				let modelInfo = modelInfos[i];
				let imgUrl = modelInfo.imgAccessoryId == null ? (basePath + "/web/user/img/noImage.png") : (basePath + "/cms/getCMSImage?id=" + modelInfo.imgAccessoryId);
				modelHtml += ("<div class=\"imageItemBig\" title=\"" + modelInfo.name + "\" modelId=\"" + modelInfo.id + "\" modelName=\"" + modelInfo.name + "\">"
					+ "	<div class=\"imageItemBigImageContainer\">"
					+ "  <img class=\"imageItemBigImage\" src=\"" + imgUrl + "\" />"
					+ "  <div class=\"imageItemLinkBtn imageItemLinkBtnEdit\" title=\"编辑\">&#x270E;编辑</div>"
					+ "  <div class=\"imageItemLinkBtn imageItemLinkBtnPreview\" title=\"预览\">&#x25B6;预览</div>"
					+ "</div>"
					+ "	<div class=\"imageItemBigTitle\">" + cmnPcr.html_encode(modelInfo.name) + "</div>"
					+ "	<div class=\"imageItemBigTime\">" + cmnPcr.datetimeToStr(modelInfo.modifyTime, "MM-dd HH:mm") + "</div>"
					+ "</div>");
			}
		}
		$(".s3dModelContainer .blockItemContainer").html(modelHtml);

		$(".s3dModelContainer .blockItemContainer .imageItemBig .imageItemLinkBtnEdit").click(function(){
			let imageItemBig = $(this).parent().parent();
			let modelId = $(imageItemBig).attr("modelId");
			let modelName = $(imageItemBig).attr("modelName");
			let linkUrl = basePath + "/web/design/s3d/editor/apps/exhibitEdit/exhibitEditor.html?modelId=" + modelId
				+ "&modelName=" + encodeURIComponent(modelName);
			window.open(linkUrl, linkUrl);
		});
		$(".s3dModelContainer .blockItemContainer .imageItemBig .imageItemLinkBtnPreview").click(function(){
			let imageItemBig = $(this).parent().parent();
			let modelId = $(imageItemBig).attr("modelId");
			let modelName = $(imageItemBig).attr("modelName");
			let linkUrl = basePath + "/web/design/s3d/editor/apps/exhibitEdit/exhibitPreviewer.html?modelId=" + modelId
				+ "&modelName=" + encodeURIComponent(modelName);
			window.open(linkUrl, linkUrl);
		});
		$(".s3dModelContainer .blockItemContainer .imageItemBig").click(function(){
			let modelId = $(this).attr("modelId");
			let modelName = $(this).attr("modelName");
			let linkUrl = basePath + "/web/design/s3d/editor/apps/exhibitEdit/exhibitEditor.html?modelId=" + modelId
				+ "&modelName=" + encodeURIComponent(modelName);
			window.open(linkUrl, linkUrl);
		});
	}
}