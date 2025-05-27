function CoreGrid(){
	var thatGrid = this; 

    this.openView = function(id, code, name, versionNum){
		var pageUrl = "../view/viewer.jsp?id=" + id + "&code=" + encodeURIComponent(code) + "&name=" + encodeURIComponent(name) + "&versionnum=" + encodeURIComponent(versionNum);
		var winName = "View_" + code + "_" + versionNum;
		window.open(pageUrl, winName);    	 
    }   
    
    this.openPage = function(id, code, name, versionNum){
		var pageUrl = basePath + "/web/design/common/editor.jsp?id=" + id + "&code=" + encodeURIComponent(code) + "&name=" + encodeURIComponent(name) + "&versionnum=" + encodeURIComponent(versionNum);
		var winName = "Edit_" + code + "_" + versionNum;
		window.open(pageUrl, winName);    	 
    }   
    
    this.openInstanceView = function(id, code, name, versionNum){
		var pageUrl = "../instanceView/index.jsp?id=" + id + "&code=" + encodeURIComponent(code) + "&name=" + encodeURIComponent(name) + "&versionnum=" + encodeURIComponent(versionNum);
		var winName = "InstanceView_" + code + "_" + versionNum;
		window.open(pageUrl, winName);    	 
    }

	//发布 added by ls 20230723
    this.doPublish = function(p){
    	var changeToPublishedStatus = true;
    	if(p.initValues.isPublished){
    		if(msgBox.confirm({info: "\"" + p.initValues.name + "\"已发布，请问要修改为未发布状态吗?"})){
    			changeToPublishedStatus = false;
    		}
    		else{
    			return;
    		}
    	}
    	else {
    		if(msgBox.confirm({info: "确定发布\"" + p.initValues.name + "\"吗?"})){
    			changeToPublishedStatus = true;
    		}
    		else{
    			return;
    		}
    	}

		var requestParam = {
			id: p.initValues.id,
			code: p.initValues.code,
			name: p.initValues.name,
			changeToPublishedStatus: changeToPublishedStatus
		};
		serverAccess.request({
			serviceName:"mdlComponentNcpService",
			funcName:"changePublishStatus",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj) {
				//增加个执行成功提示 added by ls 20230811
				msgBox.alert({info: "执行成功!"});
				if(p.afterDoPublishFunc){
					p.afterDoPublishFunc({id: p.id});
				}
			},
			failFunc: function(obj) {
				msgBox.error({title:"提示", info: obj.message});
			}
		});  
    }
};
