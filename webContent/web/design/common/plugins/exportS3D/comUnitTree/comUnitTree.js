import * as THREE from "three";

let ComUnitTree = function(){
	var thatTree = this;
	
	this.firstLevelComGroupInfos = null;

	this.comUnitHash = null;
	
	this.containerId = null;

	this.init = function(p){
		thatTree.containerId = p.containerId;
		thatTree.firstLevelComGroupInfos = p.firstLevelComGroupInfos;
		thatTree.getSubComponentUnitInfos();
	}

	this.getCanExplodeItemTree = function(){
		let comTypeTreeItemContainer = $("#" + thatTree.containerId);
		return thatTree.getCanExplodeSubComUnits(comTypeTreeItemContainer);
	}

	this.getCanExplodeSubComUnits = function (parentContainer){
		let groupItems = $(parentContainer).children(".comTypeTreeItem");
		let canExplodeItems = {};
		for(let i = 0; i < groupItems.length; i++){
			let groupItem = groupItems[i];
			let subItems = $(groupItem).children(".comTypeTreeSubContainer").children(".comTypeTreeItem");
			for(let j = 0; j < subItems.length; j++) {
				let subItem = subItems[j];
				let canExplode = $(subItem).children(".comTypeTreeItemHeader").children(".fieldCanExplode").children(".canExplode").prop("checked");
				let itemInfoElement = $(subItem).children(".comTypeTreeItemHeader").children(".comTypeTreeItemText");
				if(canExplode) {
					let unitId = $(itemInfoElement).attr("unitId");
					let code = $(itemInfoElement).attr("code");
					let versionNum = $(itemInfoElement).attr("versionNum");
					let subGroupContainer = $(subItem).children(".comTypeTreeSubContainer");
					canExplodeItems[unitId] = {
						unitId: unitId,
						code: code,
						versionNum: versionNum,
						children: thatTree.getCanExplodeSubComUnits(subGroupContainer)
					}
				}
			}
		}
		return canExplodeItems;
	}

	this.initTree = function(){
		let treeNodeInfos = thatTree.getTreeNodeInfos();
		let treeHtml = thatTree.getTreeHtml(treeNodeInfos);
		let mainContainer = $("#" + thatTree.containerId);
		$(mainContainer).html(treeHtml);
		$(mainContainer).find(".comTypeTreeItemHeaderImg").click(function(){
			let item = $(this).parent().parent();
			let isCollapsed = $(this).hasClass("imgCollapsed");
			let subContainer = $(item).children(".comTypeTreeSubContainer");
			if(isCollapsed){
				$(this).removeClass("imgCollapsed");
				$(subContainer).removeClass("subContainerCollapsed");
				$(this).addClass("imgExpand");
				$(subContainer).addClass("subContainerExpand");
			}
			else{
				$(this).removeClass("imgExpand");
				$(subContainer).removeClass("subContainerExpand");
				$(this).addClass("imgCollapsed");
				$(subContainer).addClass("subContainerCollapsed");
			}
		});

		$(mainContainer).find(".canExplode").change(function(){
			let checked = $(this).prop("checked");
			if(!checked){
				let item = $(this).parent().parent().parent();
				$(item).find(".canExplode").prop("checked", false);
			}

		});

	}

	this.getTreeHtml = function (treeNodeInfos){
		let treeHtml = "";
		for(let i = 0; i < treeNodeInfos.length; i++){
			let treeNodeInfo = treeNodeInfos[i];
			treeHtml += thatTree.getGroupHtml(treeNodeInfo, true);
		}
		return treeHtml;
	}

	this.getGroupHtml = function (treeNodeInfo, isExpand){
		let nodeHtml = "<div class='comTypeTreeItem'>";
		let hasChild = treeNodeInfo.children != null && treeNodeInfo.children.length > 0;

		//header
		nodeHtml += "<div class='comTypeTreeItemHeader'>";
		nodeHtml += "<div class='comTypeTreeItemText fieldComType' isGroup='true'>" + cmnPcr.html_encode(treeNodeInfo.name) + "</div>";
		if(hasChild){
			nodeHtml += "<div class='comTypeTreeItemHeaderImg " + (isExpand ? "imgExpand" : "imgCollapsed") + "'></div>";
		}
		nodeHtml += "</div>";

		//children
		if (hasChild) {
			nodeHtml += "<div class='comTypeTreeSubContainer " + (isExpand ? "subContainerExpand" : "subContainerCollapsed") + "'>";
			for (let i = 0; i < treeNodeInfo.children.length; i++) {
				let subNodeInfo = treeNodeInfo.children[i];
				nodeHtml += thatTree.getNodeHtml(subNodeInfo, false);
			}
			nodeHtml += "</div>";
		}
		nodeHtml += "</div>"
		return nodeHtml;
	}

	this.getNodeHtml = function (treeNodeInfo, isExpand){
		let nodeHtml = "<div class='comTypeTreeItem'>";
		let hasChild = treeNodeInfo.children != null && treeNodeInfo.children.length > 0;

		//header
		nodeHtml += "<div class='comTypeTreeItemHeader'>";
		nodeHtml += "<div class='comTypeTreeItemText fieldComUnit' isUnit='true' unitId='" + treeNodeInfo.id + "' code='" + treeNodeInfo.code + "' versionNum='" + treeNodeInfo.versionNum + "'>" + cmnPcr.html_encode(treeNodeInfo.name) + "</div>";
		if(hasChild && !treeNodeInfo.hasBooleanCalc){
			nodeHtml += "<div class='comTypeTreeItemHeaderImg " + (isExpand ? "imgExpand" : "imgCollapsed") + "'></div>";
			nodeHtml += "<div class='fieldCanExplode'><input class='canExplode' type='checkbox' /></div>";
		}
		nodeHtml += "</div>";

		//children
		if (hasChild && !treeNodeInfo.hasBooleanCalc) {
			nodeHtml += "<div class='comTypeTreeSubContainer " + (isExpand ? "subContainerExpand" : "subContainerCollapsed") + "'>";
			for (let i = 0; i < treeNodeInfo.children.length; i++) {
				let subNodeInfo = treeNodeInfo.children[i];
				nodeHtml += thatTree.getGroupHtml(subNodeInfo, isExpand);
			}
			nodeHtml += "</div>";
		}
		nodeHtml += "</div>"
		return nodeHtml;
	}

	this.getTreeNodeInfos = function(){
		let treeNodeInfos = [];
		for(let i = 0; i < thatTree.firstLevelComGroupInfos.length; i++){
			let groupInfo = thatTree.firstLevelComGroupInfos[i];
			let subNodeInfos = [];
			for(let j = 0; j < groupInfo.subComUnits.length; j++){
				let subComUnit = groupInfo.subComUnits[j];
				let subKey = subComUnit.code + "_" + subComUnit.versionNum;
				let subComType = thatTree.comUnitHash[subKey];
				subNodeInfos.push({
					id: subComUnit.id,
					name: subComUnit.name,
					code: subComUnit.code,
					versionNum: subComUnit.versionNum,
					hasBooleanCalc: subComType.hasBooleanCalc,
					children: thatTree.getSubComUnits(subComType)
				})
			}
			if(subNodeInfos.length > 0){
				treeNodeInfos.push({
					isGroup: true,
					name: groupInfo.name,
					children: subNodeInfos
				});
			}
		}
		return treeNodeInfos;
	}

	this.getSubComUnits = function(comType){
		let groups = comType.children;
		let groupInfos = [];
		if(groups != null && groups.length > 0){
			for(let i = 0; i < groups.length; i++){
				let group = groups[i];
				let subUnits = group.children;
				if(subUnits != null && subUnits.length > 0){
					let subComUnits = [];
					for(let j = 0; j < subUnits.length; j++){
						let subUnit = subUnits[j];
						if(!subUnit.code.startWith(js3SysCatAndCom.tagCategoryPre)
							&& !subUnit.code.startWith(js3SysCatAndCom.assistPointCategoryPre)) {
							let subKey = subUnit.code + "_" + subUnit.versionNum;
							let subComUnitType = thatTree.comUnitHash[subKey];
							subComUnits.push({
								isUnit: true,
								id: subUnit.id,
								name: subUnit.name,
								code: subUnit.code,
								versionNum: subUnit.versionNum,
								children: thatTree.getSubComUnits(subComUnitType)
							});
						}
					}
					if(subComUnits.length > 0){
						groupInfos.push({
							isGroup: true,
							name: group.name,
							children: subComUnits
						});
					}
				}
			}
		}
		return groupInfos;
	}

	this.getSubComponentUnitInfos = function(){
		let componentTypes = [];
		let componentTypeHash = {};
		for(let i = 0; i < thatTree.firstLevelComGroupInfos.length; i++){
			let subComUnits = thatTree.firstLevelComGroupInfos[i].subComUnits;
			for(let j = 0; j < subComUnits.length; j++) {
				let subComUnit = subComUnits[j];
				let key = subComUnit.code + "_" + subComUnit.versionNum;
				if(componentTypeHash[key] == null) {
					componentTypeHash[key] = true;
					componentTypes.push({
						code: subComUnit.code,
						versionNum: subComUnit.versionNum
					});
				}
			}
		}

		let requestParam = {
			componentTypes: componentTypes
		};
		serverAccess.request({
			serviceName: "mdlExportS3DNcpService",
			funcName: "getSubComponentUnitMap",
			args: {requestParam:cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj) {
				thatTree.comUnitHash = thatTree.decodeSubComponentUnitInfos(obj.result.comUnitJsonMap);
				thatTree.initTree();
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});
	}

	this.decodeSubComponentUnitInfos = function(comTypeJsonMap){
		let subComUnitHash = {};
		for(let key in comTypeJsonMap){
			let comTypeJson = comTypeJsonMap[key];
			let subComType = {
				code: comTypeJson.code,
				versionNum: comTypeJson.versionNum,
				name: decodeURIComponent(comTypeJson.name),
				hasBooleanCalc: comTypeJson.hasBooleanCalc
			};
			let groupChildren = [];
			for(let i = 0; i < comTypeJson.children.length; i++){
				let groupJson = comTypeJson.children[i];

				let subUnitJsons = groupJson.children;
				let subUnits = [];
				for(let j = 0; j < subUnitJsons.length; j++){
					let subUnitJson = subUnitJsons[j];
					subUnits.push({
						id: subUnitJson.id,
						name: decodeURIComponent(subUnitJson.name),
						code: subUnitJson.code,
						versionNum: subUnitJson.versionNum
					});
				}

				groupChildren.push({
					name: decodeURIComponent(groupJson.name),
					children: subUnits
				});
			}
			subComType.children = groupChildren;
			subComUnitHash[key] = subComType;
		}
		return subComUnitHash;
	}
}
export default ComUnitTree