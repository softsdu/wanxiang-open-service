function ZlpMainTabs(p){
	var that = this;
	this.tabHelperContainerId = p.tabHelperContainerId;
	this.tabPageContainerId = p.tabPageContainerId;
	this.tabPageTitleId = p.tabPageTitleId;
	this.tabPageTabCloseBtnId = p.tabPageTabCloseBtnId;
	this.tabPageTabListBtnId = p.tabPageTabListBtnId;

	$("#" + that.tabPageTabListBtnId).click(function(){
		$("#" + that.tabHelperContainerId).addClass("indexPageTabHelperContainerActive");
	});
	
	$("#" + that.tabPageTabCloseBtnId).click(function(){
		var tabId = $(this).attr("tabId"); 
		that.close(tabId); 
	});
	
	$("#" + that.tabHelperContainerId).click(function(){
		that.hideHelper();
	});
	
	$("#" + that.tabHelperContainerId).find(".indexPageTabHelper").click(function(){
		return false;
	});
	
	this.hideHelper = function(){
		$("#" + that.tabHelperContainerId).removeClass("indexPageTabHelperContainerActive");
	}
	
	this.sortedTabIds = new Array();
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
		var tabPages = $("#" + that.tabPageContainerId).find("div[tabid=\"" + id + "\"]");
		return tabPages.length > 0;
	}
	
	this.addToSortedTabIds = function(id){
		var tabIds = new Array();
		tabIds.push(id);
		for(var i = 0; i < that.sortedTabIds.length; i++){
			var tabId = that.sortedTabIds[i];
			if(tabId != id){
				tabIds.push(tabId);
			}
		}
		that.sortedTabIds = tabIds;
	}
	
	this.removeFromSortedTabIds = function(id){
		var tabIds = new Array();
		for(var i = 0; i < that.sortedTabIds.length; i++){
			var tabId = that.sortedTabIds[i];
			if(tabId != id){
				tabIds.push(tabId);
			}
		}
		that.sortedTabIds = tabIds; 
	}
	
	this.getLastTabId = function(){
		return that.sortedTabIds[0];
	}

	this.select = function(id){
		var tabPageId = that.getTabPageElementId(id);
		var tabHelperId = that.getTabHelperElementId(id);
		var allTabPages = $("#" + that.tabPageContainerId).find(".indexPageTabPage");
		for(var i = 0; i < allTabPages.length; i++){
			var tabPage = allTabPages[i];
			if($(tabPage).attr("tabId") == id){
				if(!$(tabPage).hasClass("indexPageTabPageActive")){
					$(tabPage).addClass("indexPageTabPageActive");
				}
			}
			else{
				$(tabPage).removeClass("indexPageTabPageActive");
			}
		}
		
		$("#" + that.tabHelperContainerId).find(".indexPageTabHelperItem").removeClass("indexPageTabHelperItemActive");
		$("#" + that.tabHelperContainerId).find("#" + tabHelperId).addClass("indexPageTabHelperItemActive");
		that.addToSortedTabIds(id);	
		that.refreshTitle(id);
	}
	
	this.refreshTitle = function(id){
		var tabPageId = that.getTabPageElementId(id);
		var tabName = $("#" + tabPageId).attr("tabName");
		var closable = $("#" + tabPageId).attr("closable") == "true";
		$("#" + that.tabPageTitleId).html(tabName);
		$("#" + that.tabPageTabCloseBtnId).css({display: (closable ? "block" : "none")});
		$("#" + that.tabPageTabCloseBtnId).attr("tabId", id);
	}

	this.close = function(id){
		var tabPageId = that.getTabPageElementId(id);
		var tabHelperId = that.getTabHelperElementId(id);
		$("#" + that.tabPageContainerId).find("#" + tabPageId).remove();
		$("#" + that.tabHelperContainerId).find("#" + tabHelperId).remove();
		that.removeFromSortedTabIds(id);
		var lastTabId = that.getLastTabId();
		that.select(lastTabId);
	}
	
	this.showContent = function(id, name, content, closable){
		var tabPageId = that.getTabPageElementId(id);
		var tabHelperId = that.getTabHelperElementId(id);
		var tabCloseBtnId = that.getTabCloseBtnId(id);
		var tabHelperHtml = "<div class=\"indexPageTabHelperItem\" id=\"" + tabHelperId + "\" tabId=\"" + id + "\">"
			+ "<span class=\"indexPageTabHelperItemImage\"></span>"
			+ (closable || closable == null ? "<span id=\"" + tabCloseBtnId + "\" tabId=\"" + id + "\" class=\"indexPageTabHelperItemCloseBtn\">×</span>" : "")
			+ "<span class=\"indexPageTabHelperItemText\" title=\"" + cmnPcr.html_encode(name) + "\">" + cmnPcr.html_encode(name) + "</span></div>";
		var tabPageHtml = "<div class=\"indexPageTabPage\" id=\"" + tabPageId + "\" tabId=\"" + id + "\" closable=\"" + (closable || closable == null ? "true" : "false") + "\" tabName=\"" + cmnPcr.html_encode(name) + "\">" + content + "</div>";
		$("#" + that.tabPageContainerId).append(tabPageHtml);
		$("#" + that.tabHelperContainerId).find(".indexPageTabHelper").append(tabHelperHtml);
		that.select(id);

		$("#" + tabHelperId).click(function(){
			var tabId = $(this).attr("tabId");
			that.select(tabId);
			that.hideHelper();
			return false;
		});
		
		$("#" + tabCloseBtnId).click(function(){
			var tabId = $(this).attr("tabId");
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
		var tabIFrameId = that.getTabIFrameId(id);
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
		var allTabPages = $("#" + that.containerId).find(".indexPageTabPage");
		for(var i = 0; i < allTabPages.length; i++){
			var allTabPage = allTabPages[i];
			if($(allTabPage).attr("closable") == "true"){
				var tabId = $(allTabPage).attr("tabId");
				that.close(tabId);
			}
		}
	}
	
	this.popPage = function(webUrl){
		window.open(webUrl);
	}
}

function showSysParam(p){
	serverAccess.request({
        serviceName:"userNcpService",
        funcName:"getSysParam",
        args:{requestParam:cmnPcr.jsonToStr({})},
        successFunc:function(obj){ 
            $("#" + p.containerId).text(obj.result.username);
        },
        failFunc:function(obj){
            msgBox.alert({title: "提示", info: obj.message});
        },
        waitingBarParentId: p.containerId
    });
} 

function ZplMainMenu(p){
	var that = this;
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
		var itemHash = new Object(); 
		var allItemHash = new Object(); 		
		var mainMenuItems = new Array();
		for(var i = 0; i < menuItems.length; i++){
			var item = menuItems[i];
			allItemHash[item.id] = item;
			if(item.parentId != null && item.parentId.length > 0){
				itemHash[item.id] = item;
			}
			else{
				mainMenuItems.push(item); 
			}
		}
		that.allItemHash = allItemHash;
		
		for(var i = 0; i < mainMenuItems.length; i++){
			var menuItem = mainMenuItems[i];
			that.getChildItems(menuItem, itemHash);
		}		
		for(var i = 0; i < mainMenuItems.length; i++){
			var menuItem = mainMenuItems[i];
			var itemId = menuItem.id;
			var subUlId = "subUl_" + itemId;
			var itemName = menuItem.name;
			var actionExp = menuItem.actionExp;
			var itemHtml = "<div class=\"indexPageMainMenuItem\" itemId=\"" + itemId + "\"><span class=\"indexPageMainMenuItemSpan\">" + cmnPcr.html_encode(itemName) + "</span></div>";			
			$("#" + that.containerId).append(itemHtml);
			that.addSubItemHtml(menuItem);			
		}
		
		$(".indexPageMainMenuItem").click(function(){
			
			setSpliter(false);
			
			$(".indexPageMainMenuItem").removeClass("indexPageMainMenuItemActive");
			$(this).addClass("indexPageMainMenuItemActive");

			var itemId = $(this).attr("itemId");
			var actionExp = that.allItemHash[itemId].actionExp;
			if(actionExp != null && actionExp.length > 0){ 
				iocClient.execExp(actionExp);
			}
			var subMenuContainers = $("#" + that.subContainerId).find(".indexPageSubMenuContainer");
			for(var i = 0; i < subMenuContainers.length; i++){
				var subMenuContainer = subMenuContainers[i]; 
				if($(subMenuContainer).attr("parentId") == itemId){
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
				var subMenuList = $(this).parent().children(".indexPageSubMenuHList");
				if(subMenuList.length > 0){
					var newImageUrl = null;
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

				var itemId = $(this).attr("itemId");
				that.runActionExp(itemId);
			}
			
			
		});
		
		//点击第一个菜单
		$(".indexPageMainMenuItem")[0].click();
	}
	
	this.runActionExp = function(menuItemId){ 
		var actionExp = that.allItemHash[menuItemId].actionExp;
		if(actionExp != null && actionExp.length > 0){ 
			iocClient.execExp(actionExp);
		}
	}
	
	this.addSubItemHtml = function(parentItem){
		var subMenuHtml = "<div class=\"indexPageSubMenuContainer\" parentId=\"" + parentItem.id + "\">";	
		subMenuHtml += that.getChildItemHtml(parentItem, 1);
		subMenuHtml += "</div>";	
		$("#" + that.subContainerId).append(subMenuHtml);
	}
	
	this.getMenuItemImageUrl = function(iconName){
		var imageUrl = "../../images/index/menu/" + iconName + ".png";
		return imageUrl;
	}
	
	this.getChildItemHtml = function(parentItem, level){
		var childItems = parentItem.childItems;
		if(childItems != null){
			var html = "<div class=\"indexPageSubMenuHList" + (level == 1 ? "" : " nextLevelMenu") + (level <= 2 ? "" : " indexPageSubMenuHListClose") + "\">";
			for(var i = 0; i < childItems.length; i++){
				var childItem = childItems[i];
				var iconName = "";
				if(childItem.childItems == null || childItem.childItems.length == 0 || level == 1){
					iconName = (childItem.icon == null || childItem.icon.length  == 0) ? "blank" : childItem.icon;
				} 
				else{
					iconName = "c";
				}
				var imageUrl = that.getMenuItemImageUrl(iconName);
				html += "<div class=\"indexPageSubMenuHItem\"><a itemId=\"" + childItem.id + "\" title=\"" + childItem.name + "\" style=\"margin: 0 auto;\" class=\"" + (level == 1 ? "firstLevelMenu " : "") + "indexPageSubMenuHItemLink\" href=\"#\">"
				+ (level == 1 ? "" : "<img src=\"" + imageUrl + "\" class=\"indexPageSubMenuImage\" />") 
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
		var childItems = new Array();
		var tempItems = new Array();
		for(var itemId in itemHash){
			var item = itemHash[itemId];
			if(item.parentId == parentItem.id){
				tempItems = childItems;
				childItems = new Array();
				var added = false;
				for(var i = 0; i < tempItems.length; i++){
					var tempItem = tempItems[i];
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
		
		for(var i = 0; i < childItems.length; i++){
			var childItem= childItems[i];
			delete itemHash[childItems.id];
		}
		
		for(var i = 0; i < childItems.length; i++){
			var childItem= childItems[i];
			that.getChildItems(childItem, itemHash);
		} 
	}
}

function setSpliter(close){ 
	var spliter = $(".indexPageCloseMenuButton").parent();
	if(!close){
		//执行展开
		$(spliter).removeClass("indexPageVSpliterClosed");
		$(".indexPageHMenuContainer").removeClass("indexPageHMenuContainerHidden");
		$(".indexPageMainContainer").removeClass("indexPageMainContainerMax");
	}
	else{
		//执行折叠
		$(spliter).addClass("indexPageVSpliterClosed");
		$(".indexPageHMenuContainer").addClass("indexPageHMenuContainerHidden");
		$(".indexPageMainContainer").addClass("indexPageMainContainerMax");
	}
}


var sysMenu = null;
$(document).ready(function(){	
	var mainTabs = new ZlpMainTabs({
		tabHelperContainerId: "indexPageTabHelperContainerId",
		tabPageContainerId: "indexPageTabPageContainerId",
		tabPageTitleId: "indexPageTabPageTitleId",
		tabPageTabCloseBtnId: "indexPageTabPageTabCloseBtnId",
		tabPageTabListBtnId: "indexPageTabPageTabListBtnId"
	});	
	iocClient.addEntity("mainPageTab", mainTabs); 
	iocClient.mainPageTab().showPage("mainPage", "", "../user/mainPage.jsp", false);
	
	showSysParam({
		containerId: "sysParamUserInfoId"
	});
	
	sysMenu = new ZplMainMenu({
		containerId: "mainMenuContainerId",
		subContainerId: "indexPageHMenuInnerContainerId"
	});
	sysMenu.show();
	
	$(".indexPageCloseMenuButton").click(function(){
		var spliter = $(this).parent();
		var closed = $(spliter).hasClass("indexPageVSpliterClosed");
		setSpliter(!closed); 
	})
});