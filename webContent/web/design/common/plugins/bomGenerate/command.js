js3CommandProcessors["bomGenerate"] = {
	toStatus: "normal",
	icon: "/images/bomInfo.png",
	run: function(p){
		var thatCE = p.editor;
		var thatCommandJson = p.commandJson;
		thatCommandJson.showGenerateBomWindow(p);
	},
	showGenerateBomWindow: function(p) {
		var thatCE = p.editor;
		//var currHost = window.location.protocol + '//' + window.location.host;
		var ajaxParams = {
			apiKey: "9Dg22AAZWuoYCjJ/GuNe2Q==",
			detailLevel:1,//added by liyh 20231114
			code: cmnPcr.html_encode(thatCE.componentInfo.code),
			versionNum: cmnPcr.html_encode(thatCE.componentInfo.versionNum),
			componentName: cmnPcr.html_encode(thatCE.componentInfo.name),
			isReGenerateBomInfo:true
		};

		$("#" + thatCE.containerId).find(".loadingText").text("正在生成BOM...");
		$("#" + thatCE.containerId).find(".loadingContainer").css({display: "block"});

		$.ajax({
			type: "get",
			
	        //修改获取地址的方式 added by ls 20230920
	        url: basePath + "/geometry3DNcpService/getInstanceParameters.action",
			//url: currHost + "/geometry3DNcpService/getInstanceParameters.action",
			
			data: {
				requestParam: JSON.stringify(ajaxParams)
			},
			dataType: "json",
			success: function (data) {
				$("#" + thatCE.containerId).find(".loadingText").text("BOM生成完毕...");
				$("#" + thatCE.containerId).find(".loadingContainer").css({display: "none"});
				alert("BOM生成完毕")
			},
			error: function (data, status, e) {
				$("#" + thatCE.containerId).find(".loadingContainer").css({display: "none"});
				alert("BOM生成错误，请重试")
			}
		})
	}
};