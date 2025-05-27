function ZlpMainTabs(p){
	const that = this;
	this.tabHelperContainerId = p.tabHelperContainerId;
	this.tabPageContainerId = p.tabPageContainerId;
	this.tabPageTitleId = p.tabPageTitleId;
	this.tabPageTabCloseBtnId = p.tabPageTabCloseBtnId;
	this.tabPageTabListBtnId = p.tabPageTabListBtnId;
	this.indexPageAllMenuBtnId = p.indexPageAllMenuBtnId;
	this.mainMenuContainerId = p.mainMenuContainerId;

	$("#" + that.tabPageTabListBtnId).click(function(){
		$("#" + that.tabHelperContainerId).addClass("indexPageTabHelperContainerActive");
	});

	$("#" + that.tabPageTabCloseBtnId).click(function(){
		let tabId = $(this).attr("tabId");
		that.close(tabId);
	});

	$("#" + that.indexPageAllMenuBtnId).click(function(){
		$("#" + that.mainMenuContainerId).css({display: "block"});
	});

	let mainMenuContainer = $("#" + that.mainMenuContainerId);
	$(mainMenuContainer).find(".indexPageHeaderCenterContainerBackground").click(function(){
		$("#" + that.mainMenuContainerId).css({display: "none"});
	});

	$(mainMenuContainer).find(".indexPageCloseMenuBtn").click(function(){
		$("#" + that.mainMenuContainerId).css({display: "none"});
	});

	let tabHelperContainer = $("#" + that.tabHelperContainerId);
	$(tabHelperContainer).click(function(){
		that.hideHelper();
	});

	$(tabHelperContainer).find(".indexPageTabHelper").click(function(){
		return false;
	});

	this.hideHelper = function(){
		$("#" + that.tabHelperContainerId).removeClass("indexPageTabHelperContainerActive");
	}

	this.sortedTabIds = [];
	this.getTabPageElementId = function(id){
		return "tabPage_" + id;
	}
	this.getTabHelperElementId = function(id){
		return "tabHelper_" + id;
	}
	this.getTabCloseBtnId = function(id){
		return "tabCloseBtn_" + id;
	}
	this.getTabIFrameId = function(id){
		return "tabIFrame_" + id;
	}

	this.exist = function(id){
		let tabPages = $("#" + that.tabPageContainerId).find("div[tabid=\"" + id + "\"]");
		return tabPages.length > 0;
	}

	this.addToSortedTabIds = function(id){
		let tabIds = [];
		tabIds.push(id);
		for(let i = 0; i < that.sortedTabIds.length; i++){
			let tabId = that.sortedTabIds[i];
			if(tabId !== id){
				tabIds.push(tabId);
			}
		}
		that.sortedTabIds = tabIds;
	}

	this.removeFromSortedTabIds = function(id){
		let tabIds =[];
		for(let i = 0; i < that.sortedTabIds.length; i++){
			let tabId = that.sortedTabIds[i];
			if(tabId !== id){
				tabIds.push(tabId);
			}
		}
		that.sortedTabIds = tabIds;
	}

	this.getLastTabId = function(){
		return that.sortedTabIds[0];
	}

	this.select = function(id){
		let tabPageId = that.getTabPageElementId(id);
		let tabHelperId = that.getTabHelperElementId(id);
		let allTabPages = $("#" + that.tabPageContainerId).find(".indexPageTabPage");
		for(let i = 0; i < allTabPages.length; i++){
			let tabPage = allTabPages[i];
			if($(tabPage).attr("tabId") === id){
				if(!$(tabPage).hasClass("indexPageTabPageActive")){
					$(tabPage).addClass("indexPageTabPageActive");
				}
			}
			else{
				$(tabPage).removeClass("indexPageTabPageActive");
			}
		}

		let tabHelperContainer = $("#" + that.tabHelperContainerId);
		$(tabHelperContainer).find(".indexPageTabHelperItem").removeClass("indexPageTabHelperItemActive");
		$(tabHelperContainer).find("#" + tabHelperId).addClass("indexPageTabHelperItemActive");
		that.addToSortedTabIds(id);
		that.refreshTitle(id);
	}

	this.refreshTitle = function(id){
		let tabPageId = that.getTabPageElementId(id);
		let tabPage = $("#" + tabPageId);
		let tabName = $(tabPage).attr("tabName");
		let closable = $(tabPage).attr("closable") === "true";
		$("#" + that.tabPageTitleId).html(tabName);
		let tabPageTabCloseBtn = $("#" + that.tabPageTabCloseBtnId);
		$(tabPageTabCloseBtn).css({display: (closable ? "block" : "none")});
		$(tabPageTabCloseBtn).attr("tabId", id);
	}

	this.close = function(id){
		let tabPageId = that.getTabPageElementId(id);
		let tabHelperId = that.getTabHelperElementId(id);
		$("#" + that.tabPageContainerId).find("#" + tabPageId).remove();
		$("#" + that.tabHelperContainerId).find("#" + tabHelperId).remove();
		that.removeFromSortedTabIds(id);
		let lastTabId = that.getLastTabId();
		that.select(lastTabId);
	}

	this.showContent = function(id, name, content, closable){
		let tabPageId = that.getTabPageElementId(id);
		let tabHelperId = that.getTabHelperElementId(id);
		let tabCloseBtnId = that.getTabCloseBtnId(id);
		let tabHelperHtml = "<div class=\"indexPageTabHelperItem\" id=\"" + tabHelperId + "\" tabId=\"" + id + "\">"
			+ "<span class=\"indexPageTabHelperItemImage\"></span>"
			+ (closable || closable == null ? "<span id=\"" + tabCloseBtnId + "\" tabId=\"" + id + "\" class=\"indexPageTabHelperItemCloseBtn\">×</span>" : "")
			+ "<span class=\"indexPageTabHelperItemText\" title=\"" + cmnPcr.html_encode(name) + "\">" + cmnPcr.html_encode(name) + "</span></div>";
		let tabPageHtml = "<div class=\"indexPageTabPage\" id=\"" + tabPageId + "\" tabId=\"" + id + "\" closable=\"" + (closable || closable == null ? "true" : "false") + "\" tabName=\"" + cmnPcr.html_encode(name) + "\">" + content + "</div>";
		$("#" + that.tabPageContainerId).append(tabPageHtml);
		$("#" + that.tabHelperContainerId).find(".indexPageTabHelper").append(tabHelperHtml);
		that.select(id);

		$("#" + tabHelperId).click(function(){
			let tabId = $(this).attr("tabId");
			that.select(tabId);
			that.hideHelper();
			return false;
		});

		$("#" + tabCloseBtnId).click(function(){
			let tabId = $(this).attr("tabId");
			that.close(tabId);
			that.hideHelper();
			return false;
		});
	}

	this.getPageWindow = function (id){
		let tabIFrameId = that.getTabIFrameId(id);
		return $("#" + that.tabPageContainerId).find("#" + tabIFrameId)[0].contentWindow;
	}

	this.showPage = function(id, name, url, closable){
		if(that.exist(id)){
			that.select(id);
		}
		else{
			let iframeId = that.getTabIFrameId(id);
			let content = "<iframe id=\"" + iframeId + "\" class=\"indexPageTabIframe\" src=\"" + url + "\"></iframe>";
			that.showContent(id, name, content, closable);
		}
	}

	this.refreshPage = function(id, url){
		let tabIFrameId = that.getTabIFrameId(id);
		$("#" + that.tabHelperContainerId).find("#" + tabIFrameId).attr("src", url);
	}

	this.addOrUpdate = function(id, name, url, closable){
		if(that.exist(id)){
			that.refreshPage(id, url);
		}
		else{
			that.showPage(id, name, url, closable);
		}
	}

	this.closeAll = function(){
		let allTabPages = $("#" + that.containerId).find(".indexPageTabPage");
		for(let i = 0; i < allTabPages.length; i++){
			let allTabPage = allTabPages[i];
			if($(allTabPage).attr("closable") === "true"){
				let tabId = $(allTabPage).attr("tabId");
				that.close(tabId);
			}
		}
	}
}

function getSysParam(p){
	const successFunc = p.successFunc;
	const failFunc = p.failFunc;
	serverAccess.request({
		serviceName:"userNcpService",
		funcName:"getSysParam",
		args:{requestParam:cmnPcr.jsonToStr({})},
		successFunc:function(obj){
			successFunc(obj.result);
		},
		failFunc:function(obj){
			failFunc(obj.result);
		},
		waitingBarParentId: p.containerId
	});
}

function ZplMainMenu(p){
	const that = this;
	this.containerId = p.containerId;
	this.subContainerId = p.subContainerId;

	this.allItemHash = null;

	this.show = function(){
		serverAccess.request({
			serviceName:"userNcpService",
			funcName:"getMenu",
			args:{requestParam:cmnPcr.jsonToStr({})},
			successFunc:function(obj){
				that.initMenuItems(obj.result.menuItems);
			},
			failFunc:function(obj){
				msgBox.alert({title: "提示", info: obj.message});
			},
			waitingBarParentId: p.containerId
		});
	}

	this.initMenuItems = function(menuItems){
		let itemHash = {};
		let allItemHash = {};
		let mainMenuItems = [];
		for(let i = 0; i < menuItems.length; i++){
			let item = menuItems[i];
			allItemHash[item.id] = item;
			if(item.parentId != null && item.parentId.length > 0){
				itemHash[item.id] = item;
			}
			else{
				mainMenuItems.push(item);
			}
		}
		that.allItemHash = allItemHash;

		for(let i = 0; i < mainMenuItems.length; i++){
			let menuItem = mainMenuItems[i];
			that.getChildItems(menuItem, itemHash);
		}
		for(let i = 0; i < mainMenuItems.length; i++){
			let menuItem = mainMenuItems[i];
			let itemId = menuItem.id;
			let subUlId = "subUl_" + itemId;
			let itemName = menuItem.name;
			let actionExp = menuItem.actionExp;
			let itemHtml = "<div class=\"indexPageMainMenuItem\" itemId=\"" + itemId + "\"><span class=\"indexPageMainMenuItemSpan\">" + cmnPcr.html_encode(itemName) + "</span></div>";
			$("#" + that.containerId).find(".indexPageHeaderMainMenuContainer").append(itemHtml);
			that.addSubItemHtml(menuItem);
		}

		$("#" + that.containerId).find(".indexPageMainMenuItem").click(function(){

			setSpliter(false);

			$(".indexPageMainMenuItem").removeClass("indexPageMainMenuItemActive");
			$(this).addClass("indexPageMainMenuItemActive");

			let itemId = $(this).attr("itemId");
			let actionExp = that.allItemHash[itemId].actionExp;
			if(actionExp != null && actionExp.length > 0){
				iocClient.execExp(actionExp);
			}
			let subMenuContainers = $("#" + that.subContainerId).find(".indexPageSubMenuContainer");
			for(let i = 0; i < subMenuContainers.length; i++){
				let subMenuContainer = subMenuContainers[i];
				if($(subMenuContainer).attr("parentId") === itemId){
					if(!$(subMenuContainer).hasClass("indexPageSubMenuContainerActive")){
						$(subMenuContainer).addClass("indexPageSubMenuContainerActive");
					}
				}
				else{
					$(subMenuContainer).removeClass("indexPageSubMenuContainerActive");
				}
			}
		});

		$(".indexPageSubMenuHItemLink").click(function(){
			if(!$(this).hasClass("firstLevelMenu")){
				let subMenuList = $(this).parent().children(".indexPageSubMenuHList");
				if(subMenuList.length > 0){
					let newImageUrl = null;
					if($(subMenuList).hasClass("indexPageSubMenuHListClose")){
						$(subMenuList).removeClass("indexPageSubMenuHListClose");
						newImageUrl = that.getMenuItemImageUrl("e");
					}
					else{
						$(subMenuList).addClass("indexPageSubMenuHListClose")
						newImageUrl = that.getMenuItemImageUrl("c");
					}
					$(this).find(".indexPageSubMenuImage").attr("src", newImageUrl);

				}
				else{
					$("#" + that.containerId).css({display: "none"});
				}

				let itemId = $(this).attr("itemId");
				that.runActionExp(itemId);
			}


		});

		//点击第一个菜单
		$(".indexPageMainMenuItem")[0].click();
	}

	this.runActionExp = function(menuItemId){
		let actionExp = that.allItemHash[menuItemId].actionExp;
		if(actionExp != null && actionExp.length > 0){
			iocClient.execExp(actionExp);
		}
	}

	this.addSubItemHtml = function(parentItem){
		let subMenuHtml = "<div class=\"indexPageSubMenuContainer\" parentId=\"" + parentItem.id + "\">";
		subMenuHtml += that.getChildItemHtml(parentItem, 1);
		subMenuHtml += "</div>";
		$("#" + that.subContainerId).append(subMenuHtml);
	}

	this.getMenuItemImageUrl = function(iconName){
		return "../../images/index/menu/" + iconName + ".png";
	}

	this.getChildItemHtml = function(parentItem, level){
		let childItems = parentItem.childItems;
		if(childItems != null){
			let html = "<div class=\"indexPageSubMenuHList" + (level == 1 ? "" : " nextLevelMenu") + (level <= 2 ? "" : " indexPageSubMenuHListClose") + "\">";
			for(let i = 0; i < childItems.length; i++){
				let childItem = childItems[i];
				let iconName = "";
				if(childItem.childItems == null || childItem.childItems.length === 0 || level === 1){
					iconName = (childItem.icon == null || childItem.icon.length === 0) ? "blank" : childItem.icon;
				}
				else{
					iconName = "c";
				}
				let imageUrl = that.getMenuItemImageUrl(iconName);
				html += "<div class=\"indexPageSubMenuHItem\"><a itemId=\"" + childItem.id + "\" class=\"" + (level === 1 ? "firstLevelMenu " : "") + "indexPageSubMenuHItemLink\" href=\"#\">"
					+ (level === 1 ? "" : "<img src=\"" + imageUrl + "\" class=\"indexPageSubMenuImage\"  alt=\"\" />")
					+ cmnPcr.html_encode(childItem.name) + "</a>";
				if(childItem.childItems != null && childItem.childItems.length > 0){
					html += that.getChildItemHtml(childItem, level + 1);
				}
				html += "</div>";
			}
			html += "</div>";
			return html;
		}
		else{
			return "";
		}
	}

	this.getChildItems = function(parentItem, itemHash){
		let childItems = [];
		let tempItems = [];
		for(let itemId in itemHash){
			let item = itemHash[itemId];
			if(item.parentId === parentItem.id){
				tempItems = childItems;
				childItems = [];
				var added = false;
				for(let i = 0; i < tempItems.length; i++){
					let tempItem = tempItems[i];
					if(!added){
						if(item.code <= tempItem.code){
							childItems.push(item);
							added = true;
						}
					}
					childItems.push(tempItem);
				}
				if(!added){
					childItems.push(item);
				}
			}
		}

		parentItem.childItems = childItems;

		for(let i = 0; i < childItems.length; i++){
			let childItem= childItems[i];
			delete itemHash[childItem.id];
		}

		for(let i = 0; i < childItems.length; i++){
			let childItem= childItems[i];
			that.getChildItems(childItem, itemHash);
		}
	}
}

function setSpliter(close){
	let splitter = $(".indexPageCloseMenuButton").parent();
	if(!close){
		//执行展开
		$(splitter).removeClass("indexPageVSplitterClosed");
		$(".indexPageHMenuContainer").removeClass("indexPageHMenuContainerHidden");
		$(".indexPageMainContainer").removeClass("indexPageMainContainerMax");
	}
	else{
		//执行折叠
		$(splitter).addClass("indexPageVSplitterClosed");
		$(".indexPageHMenuContainer").addClass("indexPageHMenuContainerHidden");
		$(".indexPageMainContainer").addClass("indexPageMainContainerMax");
	}
}

//校验首次登录
function checkDefaultConfig(){
	serverAccess.request({
		serviceName:"userNcpService",
		funcName:"checkDefaultConfig",
		args:{
			requestParam:cmnPcr.jsonToStr({})
		},
		successFunc:function(obj){
			if(obj.result.isDefault){
				setTimeout(function (){
					showChangePwdPage()
				},1000)
			}
		}
	});
}
function showChangePwdPage(res){
	let info=msgBox.confirm({info:"首次登录必须修改默认密码,点击确定进行修改！"});
	if(info){
		iocClient.mainPageTab().showPage("changePassword", "密码修改", "../user/changePassword.jsp", false);
	}else {
		window.location.reload();
	}
}

function gotoMainPage(p){
	let roleList = p.roleList;
	let isDeveloper = false;
	let isAdmin = false;
	let isUserS = false;

	for(let i = 0; i < roleList.length; i++){
		let role = roleList[i];
		switch(role.code){
			case "developer":{
				isDeveloper = true;
				break;
			}
			case "admin":{
				isAdmin = true;
				break;
			}
			case "userS":{
				isUserS = true;
				break;
			}
		}
	}
	let mainPageUrl = "../user/m_mainPage.jsp";
	if(isDeveloper){
		mainPageUrl = "../user/m_mainPage_dev.jsp";
	}
	else if(isAdmin){
		mainPageUrl = "../user/m_mainPage_admin.jsp";
	}
	else if(isUserS){
		mainPageUrl = "../user/m_mainPage_userS.jsp";
	}

	iocClient.mainPageTab().showPage("mainPage", "首页", mainPageUrl, false);
}


var sysMenu = null;
$(document).ready(function(){

	getSysParam({
		containerId: "sysParamUserInfoId",
		successFunc: function (p){
			$("#" + p.containerId).text(p.userName);

			let mainTabs = new ZlpMainTabs({
				tabHelperContainerId: "indexPageTabHelperContainerId",
				tabPageContainerId: "indexPageTabPageContainerId",
				tabPageTitleId: "indexPageTabPageTitleId",
				tabPageTabCloseBtnId: "indexPageTabPageTabCloseBtnId",
				tabPageTabListBtnId: "indexPageTabPageTabListBtnId",
				indexPageAllMenuBtnId: "indexPageAllMenuBtnId",
				mainMenuContainerId: "mainMenuContainerId"
			});
			iocClient.addEntity("mainPageTab", mainTabs);

			gotoMainPage(p);

			sysMenu = new ZplMainMenu({
				containerId: "mainMenuContainerId",
				subContainerId: "indexPageHMenuInnerContainerId"
			});
			sysMenu.show();

			$(".indexPageCloseMenuButton").click(function(){
				let splitter = $(this).parent();
				let closed = $(splitter).hasClass("indexPageVSplitterClosed");
				setSpliter(!closed);
			})

			checkDefaultConfig();
		},
		failFunc: function (p){
			location.href = basePath + "/web/user/login.html";
		}
	});
});
