import * as THREE from "three";

js3CommandProcessors["exportS3D"] = {
	toStatus: "normal",	
	icon: "/images/s3d.png",
	editor: null,
	popContainer: null,
	subComGroupInfos: null,
	canExplodeItemTree: null,
	sourceComponentInfo: null,
	publishInfo: null,
	run: function(p){
		let commandProcessor = js3CommandProcessors["exportS3D"];
		commandProcessor.editor = p.editor;
		commandProcessor.showStructureWindow();
	},

	//显示模型的结构
	showStructureWindow: function(){
		let commandProcessor = js3CommandProcessors["exportS3D"];
		commandProcessor.subComGroupInfos = commandProcessor.getComponentGroupInfos();
		commandProcessor.showComponentUnitTree();
	},

	//显示下载窗口
	showDownloadWindow: function(){
		let commandProcessor = js3CommandProcessors["exportS3D"];
		let popContainer = new PopupContainer( {
			width : 400,
			height : 200,
			top : 50,
			title: "第三步，下载S3D文件"
		});

		popContainer.show();
		let innerHtml = "<div style='position:absolute;left:0px;right:0px;top:0px;bottom:40px;color:#444444;padding-top:10px;line-height:40px;font-size:15px;text-align:center;'>"
			+ "<span style='color:#444444;text-align:center;'>请下载S3D文件:</span>"
			+ "<br/>"
			+ "<a name='downloadBtn' style='border:solid 1px #f0f0f0;padding-left:20px;padding-right:20px;padding-top:10px;padding-bottom:10px;border-radius:3px;background-color:#337ab7;color:#ffffff;text-align:center;cursor:pointer;'>" + commandProcessor.sourceComponentInfo.name + ".s3d</a>"
			+ "</div>"
			+ "<div style='position:absolute;left:0px;right:0px;height:40px;bottom:0px;font-size:15px;'>"
			+ "<input style='position:absolute;right:10px;width:80px;height:32px;top:6px;' type='button' name='cancelBtn' value='关 闭' />"
			+ "</div>";
		let container = $("#" + popContainer.containerId);
		$(container).html(innerHtml);
		$(container).find("a[name='downloadBtn']").click(function(e){
			let commandProcessor = js3CommandProcessors["exportS3D"];
			let link = document.createElement("a");
			link.style.display = "none";
			link.href = commandProcessor.publishInfo.downloadUrl;
			link.download = commandProcessor.publishInfo.name + ".s3d";
			link.click();
			return false;
		});
		$(container).find("input[name='cancelBtn']").click(function(){
			let commandProcessor = js3CommandProcessors["exportS3D"];
			commandProcessor.popContainer.close();
		});

		commandProcessor.popContainer = popContainer;
	},

	//显示模型的分解窗口
	showExplodeWindow: function (){
		let commandProcessor = js3CommandProcessors["exportS3D"];
		let popContainer = new PopupContainer( {
			width : 800,
			height : 600,
			top : 50,
			title: "第二步，分解与预览"
		});

		popContainer.show();
		let explodeUrl = basePath + "/web/design/common/plugins/exportS3D/explodeCom/explodeEditor.jsp";
		let innerHtml = "<div style='position:absolute;left:0px;right:0px;top:0px;bottom:40px;font-size:15px;text-align:center;'>"
			+ "<iframe name='innerPage' style='width:100%;height:100%;border:0px;' src='" + explodeUrl + "' frameborder='0'/>"
			+ "</div>"
			+ "<div style='position:absolute;left:0px;right:0px;height:40px;bottom:0px;font-size:15px;'>"
			+ "<input style='position:absolute;right:100px;width:80px;height:32px;top:6px;display:none' type='button' name='okBtn' value='下一步' />"
			+ "<input style='position:absolute;right:10px;width:80px;height:32px;top:6px;' type='button' name='cancelBtn' value='取 消' />"
			+ "</div>";
		let container = $("#" + popContainer.containerId);
		$(container).html(innerHtml);
		$(container).find("input[name='okBtn']").click(function(){
			let commandProcessor = js3CommandProcessors["exportS3D"];
			let container = $("#" + commandProcessor.popContainer.containerId);
			let okBtn = $(container).find("input[name='okBtn']");
			$(okBtn).css({display: "none"});
			let explodePageWindow = $(container).find("iframe[name='innerPage']")[0].contentWindow;
			explodePageWindow.comEditor.generateS3D();
			commandProcessor.checkGenerateS3DStatus();
		});
		$(container).find("input[name='cancelBtn']").click(function(){
			let commandProcessor = js3CommandProcessors["exportS3D"];
			commandProcessor.popContainer.close();
		});

		commandProcessor.popContainer = popContainer;

		commandProcessor.checkExplodeStatus();
	},

	//检测是否已生成S3D文件
	checkGenerateS3DStatus: function(){
		setTimeout(function(){
			let commandProcessor = js3CommandProcessors["exportS3D"];
			let container = $("#" + commandProcessor.popContainer.containerId);
			let explodePageWindow = $(container).find("iframe[name='innerPage']")[0].contentWindow;
			if(explodePageWindow != null && explodePageWindow.comEditor != null && explodePageWindow.comEditor.publishInfo != null){
				commandProcessor.publishInfo = explodePageWindow.comEditor.publishInfo;
				commandProcessor.popContainer.close();
				commandProcessor.showDownloadWindow();
			}
			else{
				commandProcessor.checkGenerateS3DStatus();
			}
		}, 200);
	},

	//检测是否分解完成
	checkExplodeStatus: function(){
		setTimeout(function(){
			let commandProcessor = js3CommandProcessors["exportS3D"];
			let container = $("#" + commandProcessor.popContainer.containerId);
			let explodePageWindow = $(container).find("iframe[name='innerPage']")[0].contentWindow;
			if(explodePageWindow != null && explodePageWindow.comEditor != null && explodePageWindow.comEditor.completeExploded){
				let okBtn = $(container).find("input[name='okBtn']");
				$(okBtn).css({display: "block"});
			}
			else{
				commandProcessor.checkExplodeStatus();
			}
		}, 200);
	},

	//构造构件类型树
	showComponentUnitTree: function(allSubComponentInfoHash){
		let commandProcessor = js3CommandProcessors["exportS3D"];
		let popContainer = new PopupContainer( {
			width : 800,
			height : 600,
			top : 50,
			title: "第一步，模型结构定义"
		});

		popContainer.show();
		let treeConfigUrl = basePath + "/web/design/common/plugins/exportS3D/comUnitTree/comUnitTree.jsp";
		let innerHtml = "<div style='position:absolute;left:0px;right:0px;top:0px;bottom:40px;font-size:15px;text-align:center;'>"
			+ "<iframe name='innerPage' style='width:100%;height:100%;border:0px;' src='" + treeConfigUrl + "' frameborder='0'/>"
			+ "</div>"
			+ "<div style='position:absolute;left:0px;right:0px;height:40px;bottom:0px;font-size:15px;'>"
			+ "<input style='position:absolute;right:100px;width:80px;height:32px;top:6px;' type='button' name='okBtn' value='下一步' />"
			+ "<input style='position:absolute;right:10px;width:80px;height:32px;top:6px;' type='button' name='cancelBtn' value='取 消' />"
			+ "</div>";
		let container = $("#" + popContainer.containerId);
		$(container).html(innerHtml);
		$(container).find("input[name='okBtn']").click(function(){
			let commandProcessor = js3CommandProcessors["exportS3D"];
			let comUnitTreePageWindow = $("#" + commandProcessor.popContainer.containerId).find("iframe[name='innerPage']")[0].contentWindow;
			commandProcessor.canExplodeItemTree = comUnitTreePageWindow.componentUnitTree.getCanExplodeItemTree();
			commandProcessor.sourceComponentInfo =  commandProcessor.editor.getLastComponentInfo();
			commandProcessor.popContainer.close();
			commandProcessor.showExplodeWindow();
		});
		$(container).find("input[name='cancelBtn']").click(function(){
			let commandProcessor = js3CommandProcessors["exportS3D"];
			commandProcessor.popContainer.close();
		});

		commandProcessor.popContainer = popContainer;
	},

	//获取当前模型下级构件的类型列表
	getComponentGroupInfos: function(){
		let commandProcessor = js3CommandProcessors["exportS3D"];
		let editor = commandProcessor.editor;

		let allGroupInfos = editor.getAllGroupInfos();

		let allGroups = [];

		for(let i = 0; i < allGroupInfos.length; i++){
			let groupInfo = allGroupInfos[i];
			let unitIds = groupInfo.units;
			let allSubComUnits = [];
			for(let j = 0; j < unitIds.length; j++) {
				let childObj3D = editor.getObject3DByUnitId(unitIds[j]);
				if (!childObj3D.unitData.code.startWith(js3SysCatAndCom.tagCategoryPre)
					&& !childObj3D.unitData.code.startWith(js3SysCatAndCom.assistPointCategoryPre)) {
					let unitSetting = editor.getUnitSettingFromObject3D(childObj3D);
					allSubComUnits.push({
						id: unitSetting.id,
						name: unitSetting.name,
						code: unitSetting.code,
						versionNum: unitSetting.versionNum
					});
				}
			}
			if(allSubComUnits.length > 0){
				allGroups.push({
					name: groupInfo.name,
					subComUnits: allSubComUnits
				});
			}
		}
		return allGroups;
	}
};