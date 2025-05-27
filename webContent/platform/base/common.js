//对话框
function MsgBox() { 
	this.alert = function(p) { 
		p.title = p.title == null || p.title.length == 0 ? "提示" : p.title; 
		this.showInfoWin(p);
	}
	
	this.showInfoWin = function(p){
		var title = cmnPcr.html_encode(p.title);
		var info = p.isHtmlInfo ? p.info : cmnPcr.html_encode(p.info);
		var dialogId = cmnPcr.getRandomValue();
		var dialogLabelId = dialogId + "_label";
		var html = "<div class=\"modal fade\" style=\"z-index:200001;\" id=\"" + dialogId + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"" + dialogLabelId + "\" aria-hidden=\"true\">"
			+ "<div class=\"modal-dialog\">"
			+ "<div class=\"modal-content\">"
			+ "<div class=\"modal-header\">"
			+ "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>"
			+ "<h4 class=\"modal-title\" id=\"" + dialogLabelId + "\">" + title + "</h4>"
			+ "</div>"
			+ "<div class=\"modal-body\">" + info + "</div>"
			+ "<div class=\"modal-footer\">"
			+ "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button>"
			+ "</div>"
			+ "</div><!-- /.modal-content -->"
			+ "</div><!-- /.modal-dialog -->"
			+ "</div><!-- /.modal -->";
		$(document.body).append(html);
		
		//设置高度 added by ls 20230529
		if(p.maxHeight != null){			
			var bodyMaxHeight = p.maxHeight - $("#" + dialogId).find(".modal-header").height() + $("#" + dialogId).find(".modal-footer").height();
			$("#" + dialogId).find(".modal-body").css({
				"max-height": bodyMaxHeight,
				"overflow": "auto"
			});
		}
		
		$("#" + dialogId).modal();
	}
 
	this.warning = function(p) {
		p.title = p.title == null || p.title.length == 0 ? "警告" : p.title; 
		this.showInfoWin(p); 
	}

	this.error = function(p) {
		p.title = p.title == null || p.title.length == 0 ? "错误" : p.title; 
		this.showInfoWin(p);
	}

	//title, info, nextFunc
	this.show = function(p) {

	}

	//title, info, yesFunc, noFunc, yesName, noName
	this.confirm = function(p) {
		return window.confirm(p.info);
	}
	
	this.animationWindow = function(p){
		var message = p.message;
		var duration = p.duration;
		
		var getClientLeft = function(element){
			if(element[0] == document){
			 	return 0;
		 	}
		 	else{
		 		var left = getClientLeft(element.parent());
		 		return left + $(element[0]).position().left;
		 	}	
		}
		var getClientTop = function(element){
			if(element[0] == document){
			 	return 0;
		 	}
		 	else{
		 		var top = getClientTop(element.parent());
		 		return top + $(element[0]).position().top;
		 	}	
		}
		
		var fromLeft = getClientLeft($("#" + p.fromElementId));
		var fromTop = getClientTop($("#" + p.fromElementId));
		var toLeft = getClientLeft($("#" + p.toElementId));
		var toTop = getClientTop($("#" + p.toElementId));
		var fromWidth = $("#" + p.fromElementId).width();
		var fromHeight = $("#" + p.fromElementId).height();
		var toWidth = $("#" + p.toElementId).width();
		var toHeight = $("#" + p.toElementId).height();
		 
		var step = Math.floor(duration / 100);
		var stepWidth = (toWidth - fromWidth) / step;
		var stepHeight = (toHeight - fromHeight) / step;
		var stepLeft = (toLeft - fromLeft) / step;
		var stepTop = (toTop - fromTop) / step;
		
		var setLocationAndSize = function(divId, stepWidth, stepHeight, stepLeft, stepTop){			
			var left = $("#" + divId).position().left + stepLeft;
			var top = $("#" + divId).position().top + stepTop;
			var height = $("#" + divId).height() + stepHeight;
			var width = $("#" + divId).width() + stepWidth;
			if(height > 0 && width > 0){ 
				$("#" + divId).css({left:left +"px", top: top +"px", width: width + "px", height: height + "px"}); 
				setTimeout(function(){
					setLocationAndSize(divId, stepWidth, stepHeight, stepLeft, stepTop);
				}, 50);
			}
			else{
				$("#" + divId).remove(); 
			} 
		}
		
		var divId = cmnPcr.createGuid();
		var divHtml = "<div id=\"" + divId + "\" style=\"filter:alpha(opacity=50);-moz-opacity:0.50;opacity:0.50;position:absolute;background-color: #dddddd;z-index:1000;width:" + fromWidth + "px;left:" + fromLeft + "px;top:" + fromTop + "px;height:" + fromHeight + "px;\">" + message + "</div>";
		$(document.body).append(divHtml);
		setLocationAndSize(divId, stepWidth, stepHeight, stepLeft, stepTop);
	}
	
	//通用对话窗口
	this.htmlWindow = function(p) {
		//p.title
		//p.label
		//p.type
		//p.okFunction
		//p.cancelFunction

		if(p.type == "oneInputText"){
			//p.text
			var popContainer = new PopupContainer( {
				width : 240 ,
				height : 130 ,
				top : 50
			});
			
			popContainer.show();
	  
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var labelId = frameId + "_label";
			var textId = frameId + "_text";
			var buttonContainerId = frameId + "_buttonContainer";
			var okBtnId = frameId + "_ok";
			var cancelBtnId = frameId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
			 	+ "<div id=\"" + labelId + "\" style=\"witdh:100%;height:30px;font-size:11px;\"></div>"
			 	+ "<div style=\"witdh:100%;height:30px;font-size:11px;text-align:center;\"><input id=\"" + textId + "\" type=\"text\" style=\"width:230px;height:20px;\" /></div>"
			 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;\"><input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:60px;height:25px;\" />&nbsp;<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:60px;height:25px;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			$("#" + titleId).text(p.title);
			$("#" + labelId).text(p.label);
			$("#" + textId).val(p.text);
			$("#" + okBtnId).click(function(){
				var text = $("#" + textId).val();
				var succeed = p.okFunction({
					text : text,
					closeWin : function(){
						popContainer.close();
					}
				}); 			
			});
			$("#" + cancelBtnId).click(function(){
				var text = $("#" + textId).val();
				var succeed = p.cancelFunction ==null || p.cancelFunction({text : text});
				if(succeed){
					popContainer.close();
				}					
			});
		}
		else if(p.type == "oneInputTextarea"){
			//p.text
			var popContainer = new PopupContainer( {
				width : 400 ,
				height : 230 ,
				top : 50
			});
			
			popContainer.show();
	  
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var labelId = frameId + "_label";
			var textId = frameId + "_text";
			var buttonContainerId = frameId + "_buttonContainer";
			var okBtnId = frameId + "_ok";
			var cancelBtnId = frameId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:15px;text-align:center;font-weight:800;\"></div>"
			 	+ "<div id=\"" + labelId + "\" style=\"witdh:100%;height:25px;font-size:13px;padding-left:10px;\"></div>"
			 	+ "<div style=\"witdh:100%;height:140px;font-size:11px;text-align:center;\"><textarea id=\"" + textId + "\" style=\"width:390px;height:130px;resize:none;border:1px solid #95B8E7\"></textarea></div>"
			 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:40px;font-size:11px;text-align:right;\"><input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:60px;height:25px;\" />&nbsp;<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:60px;height:25px;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			$("#" + titleId).text(p.title);
			$("#" + labelId).text(p.label);
			$("#" + textId).text(p.text);
			$("#" + okBtnId).click(function(){
				var text = $("#" + textId).val();
				var succeed = p.okFunction({
					text : text,
					closeWin : function(){
						popContainer.close();
					}
				}); 			
			});
			$("#" + cancelBtnId).click(function(){
				var text = $("#" + textId).val();
				var succeed = p.cancelFunction == null || p.cancelFunction({text : text});
				if(succeed){
					popContainer.close();
				}					
			});
		}
	}
	
	this.getMultiRowFromGridWindow = function(windowPageUrl, initRows, listShowFieldName){
	
	}
}

function ModalDialog(p) {
	var width = p == undefined || p.width == undefined ? 600 : p.width;
	var height = p == undefined || p.height == undefined ? 400 : p.height;
	var divId = cmnPcr.getRandomValue();
	$.modal("<div id=\"" + divId + "\" class=\"\" style=\"width:" + width + "px;height:" + height + "px;\"></div>", {
		opacity : 50,
		overlayCss : {
			backgroundColor : "#AABDFF"
		},
		escClose : p.escClose == undefined ? false : true
	});
	return divId;
}

//等待
function WaitingBar() {
	var that = this;
	this.id = null;
	this.begin = function() {
		var barId = cmnPcr.getRandomValue(); 
		that.id = barId;
		var barHtml = "<div id=\"" + barId + "\" class=\"waitingBarContainer\"><div class=\"waitingBarCenter\"><div class=\"waitingBarCenterAbsolute\"><div class=\"waitingBarObject\"></div><div class=\"waitingBarObject\"></div><div class=\"waitingBarObject\"></div><div class=\"waitingBarObject\"></div><div class=\"waitingBarObject\"></div><div class=\"waitingBarObject\"></div><div class=\"waitingBarObject\"></div><div class=\"waitingBarObject\"></div><div class=\"waitingBarObject\"></div><div class=\"waitingBarObject\"></div></div></div></div>";
		$(document.body).append(barHtml);	
	}

	this.end = function() {
		$("#" + that.id).fadeOut(200);
	}
}

//调用服务器端
function ServerAccess() {

	//封装soap
	this.getSoapData = function(funcName, args, namespace) {
		var postdata = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">";
		postdata += "<soap:Body>";
		postdata += "<ns2:" + funcName + " xmlns:ns2=\"http://"
				+ (namespace == undefined ? "service.platform.zlp.com" : namespace)
				+ "/\">";
		for ( var x in args) {
			postdata += "<" + x + ">" + "<![CDATA[" + args[x] + "]]>" + "</"
					+ x + ">";
		}
		postdata += "</ns2:" + funcName + ">";
		postdata += "</soap:Body>";
		postdata += "</soap:Envelope>";
		return postdata;
	}
	//调用服务器，参数timeout、serverUrl、serviceName、funcName、requestParam、beforeFunc、endFunc、successFunc、failFunc、waitingBarParentId
	this.request = function(p) {
		// var that = this;
		//给出默认网址
		$.ajaxSettings.async = p.aysnc == null ? true : p.aysnc;
		if (p.serverUrl == undefined) {
			var href = document.location.href;
			p.serverUrl = href.substr(0, href.indexOf("web",0));
		}

		var waitingBar = p.disableWaitingBar ? null : (new WaitingBar());

		//等待时间
		if (p.timeout == undefined) {
			
			//等待时间由30S修改为600S（10分钟）
			//p.timeout = 30000;
			p.timeout = 600000;
		}
		// var param = null;
		//alert(p.args.requestParam);
		// if (p.args.requestParam != null) {
			// param = cmnPcr.jsonToStr(p.args.requestParam);
		// }

		//alert(p.serverUrl + "/ws/" + p.serviceName+".action"+"===="+p.funcName);

		//ajax异步调用
		$.ajax( {
			type: "POST", 
			//contentType:"text/xml; charset=UTF-8",
			dataType: "json", 
			timeout : p.timeout,
			//url:(p.serverUrl + "ws/" + p.serviceName), 
			url : (p.serverUrl + p.serviceName + "/" + p.funcName+ ".action"),
			//url : (p.serverUrl + "/st/" + p.funcName+ ".action"),
			data: p.args, //that.getSoapData(p.funcName,p.args, p.namespace),   
			beforeSend : function(XMLHttpRequest) {
				if (p.beforeFunc) {
					p.beforeFunc(XMLHttpRequest);
				} else if (waitingBar != null) {
					waitingBar.begin();
				}
			},
			complete : function(XMLHttpRequest, textStatus) {
				if (p.endFunc) {
					p.endFunc(XMLHttpRequest);
				} else if (waitingBar != null) {
					waitingBar.end();
				}
			},
			success : function(result, textStatus) { 
				if (waitingBar != null) {
					waitingBar.end();
				}
				//var text = $(result).text();  
				var obj = result[0];//cmnPcr.strToJson(text)[0];
				//var text = $(result).text();  
				//var obj=cmnPcr.strToJson(text)[0];

				//obj里包含了code、message、result等
				if (obj.code == "000") {
					if (p.successFunc) {
						p.successFunc(obj);
					}
				}
				else {
					if (p.failFunc) {
						p.failFunc(obj);
					} else {
						if(obj.code == "001") {
							msgBox.alert( {
								title : "提示",
								info : "请登录系统后, 再进行此操作!"
							});
						}
						else {
							msgBox.alert( {
								title : "提示",
								info : obj.detailMessage
							});
						}
					}
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (waitingBar != null) {
					waitingBar.end();
				}
				msgBox.error( {
					title : "连接失败",
					info : "调用远程服务失败. " + textStatus
				});
				if (p.errorFunc) {
					p.errorFunc(XMLHttpRequest, textStatus, errorThrown);
				}
			}
			});
		}

	this.getDataTableFromBackInfo = function(serverDt) {
		var dt = new DataTable();
		if (serverDt.rows != null) {
			for ( var i = 0; i < serverDt.rows.length; i++) {
				var serverRow = serverDt.rows[i];
				var row = new DataRow();
				for ( var j = 0; j < serverDt.fields.length; j++) {
					var field = serverDt.fields[j];
					var valueType = field.valueType.toLowerCase();
					var fieldName = field.name;
					var value = cmnPcr.strToObject(cmnPcr.replace(
							serverRow[fieldName], "\\\\\"", "\""), valueType);
					row.setValue(fieldName, value);
				}
				var rowId = cmnPcr.getRandomValue();
				row.rowId = rowId;
				dt.addRow(rowId, row);
			}
		}
		return dt;
	}
}

//通用处理

//一些通用方法
function CommonProcessor() {

	this.checkHtml5 = function(){
		if (typeof(Worker) !== "undefined") {
		   return true;  
		}  
		else {
			return false;  
		}		
	}

	this.checkBrowserVersion = function(rootPath){
		var notSupport = false;
		if($.browser.msie) {
			var ieVersion = $.browser.version;
			if(cmnPcr.strToDecimal(ieVersion) < 8){
				notSupport = true;
			}
			else{
				notSupport = false;
			}
        } 
        else if($.browser.safari) 
        { 
            notSupport = false;
        } 
        else if($.browser.mozilla) 
        { 
            notSupport = false;
        } 
        else if($.browser.opera) { 
            notSupport = false;
        } 
        if(notSupport){
        	window.location.href = rootPath + "/h/home/nonsupportbrowser.jsp";
        }
	}
	
	this.checkMouseLeftButton = function(ev){ 
		if($.browser.msie){
			var ieVersion = $.browser.version;
			if(cmnPcr.strToDecimal(ieVersion) < 9){
				return ev.button == 1;
			}
			else{
				return ev.button == 0;
			}
		} 
        else if($.browser.opera) { 
			var operaVersion = $.browser.version;
			if(cmnPcr.strToDecimal(operaVersion) < 7.60){
				return ev.button == 1;
			}
			else{
				return ev.button == 0;
			} 
        } 
		else{
			return ev.button == 0;
		}
	}
	
	this.checkMouseRightButton = function(ev){ 
		if($.browser.msie){
			var ieVersion = $.browser.version;
			if(cmnPcr.strToDecimal(ieVersion) < 9){
				return ev.button == 0;
			}
			else{
				return ev.button == 2;
			}
		} 
        else if($.browser.opera) { 
			var operaVersion = $.browser.version;
			if(cmnPcr.strToDecimal(operaVersion) < 7.60){
				return ev.button == 0;
			}
			else{
				return ev.button == 2;
			} 
        } 
		else{
			return ev.button == 2;
		} 
	}
	 

	this.checkJsonHasChild = function(obj){
		for(var key in obj){
			return true;
		}
		return false;
	}

	this.createGuid = function() {
	  	function s4() {
	    	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  	}
	  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	//获取随机的值，用于构造于html控件的id值
	this.randomValue = 0;
	this.getRandomValue = function(prefix, suffix) {
		this.randomValue = this.randomValue + 1;
		return (prefix || "ncp") + this.randomValue + (suffix || "");
	}

	this.zIndex = 100000;
	this.getTopZIndex = function() {
		this.zIndex++;
		return this.zIndex;
	}

	//浮点数相加方法，解决浮点数加法不精确问题
	this.floatAdd = function(arg1, arg2) {
		var r1,r2,m;
		try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
		try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
		m=Math.pow(10,Math.max(r1,r2));
		return (arg1*m+arg2*m)/m
	}

	//将带有html保留符号的字符串转义, 使用正则表达式进行转义，加快转义速度
	this.encodeString = function(value) {
		var regxHmtlEncode = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
		var s = (value != undefined) ? value : this.toString();
		return (typeof s != "string") ? s : s.replace(regxHmtlEncode, function(
				$0) {
			var c = $0.charCodeAt(0);
			r = [ "&#" ];
			c = (c == 0x20) ? 0xA0 : c;
			r.push(c);
			r.push(";");
			return r.join("");
		});
	}
	
	this.decodeURI = function(str){
		if(str == null || str.length == 0){
			return "";
		}
		else{
			return decodeURI(str);
		}
	}
	
	this.encodeURI = function(str){
		if(str == null || str.length == 0){
			return "";
		}
		else{
			return encodeURI(str);
		}
	}

	//json对象转字符串
	this.jsonToStr = function(json) { 
		var str = JSON.stringify(json); 
		return str;
	}

	//字符串转json对象
	this.strToJson = function(str) {
		var obj = $.parseJSON(str);
		return obj;
	}

	//获取时间标准格式
	this.getTimeFormat = function() {
		return "yyyy-MM-dd HH:mm:ss";
	}

	//获取日期标准格式
	this.getDateFormat = function() {
		return "yyyy-MM-dd";
	}

	//获取提示用户输入正确格式
	this.getAlertFormatString = function(type) {
		switch (type) {
		case valueType.date:
			return "请输入日期数据, 格式为'" + this.getDateFormat() + "', 例如 2013-01-23";
		case valueType.time:
			return "请输入时间数据, 格式为'" + this.getTimeFormat()
					+ "', 例如 2013-01-23 08:22:59";
		case valueType.boolean:
			return "请输入布尔类型数据, 例如 Y、N、True、False等";
		case valueType.decimal:
			return "请输入数值数据";
		case valueType.string:
			return "请输入字符串";
		case valueType.json:
			return "请输入JSON";
		default:
			return "";
		}
	}

	//获取类型的中文名
	this.getTypeName = function(type) {
		switch (type) {
		case valueType.date:
			return "日期";
		case valueType.time:
			return "时间";
		case valueType.boolean:
			return "是否";
		case valueType.decimal:
			return "数值";
		case valueType.string:
			return "字符串";
		case valueType.json:
			return "JSON";
		default:
			return "";
		}
	}

	//是否可将字符串转换成相应类型
	this.canConvert = function(mystr, type) {
		switch (type) {
		case valueType.date:
			return this.isDateOnly(mystr);
		case valueType.time:
			return this.isDateTime(mystr);
		case valueType.boolean:
			return this.isBoolean(mystr);
		case valueType.decimal:
			return this.isDecimal(mystr);
		case valueType.string:
			return true;
		default:
			return false;
		}
	}

	//判断字符串是否可以转换为数字类型
	this.isBoolean = function(mystr) {
		mystr = mystr.toLowerCase();
		return mystr == "是" || mystr == "否" || mystr == "true"
				|| mystr == "false" || mystr == "y" || mystr == "n"
				|| mystr == "yes" || mystr == "no";
	}

	//判断字符串是否可以转换为数字类型
	this.isDecimal = function(mystr) {
		return !isNaN(mystr);
	}

	//是否为日期，形如 (2003-12-05) 
	this.isDateOnly = function(mystr) {

		var r = mystr.match("/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/");
		if (r == null)
			return false;
		var d = new Date(r[1], r[3] - 1, r[4]);
		return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d
				.getDate() == r[4]);
	}

	// 是否为日期，形如 (2008-02-24 [10:02:24],2008/02/12 [10:02:24], 20080212[100224]  
	this.isDateTime = function(str) {
		var isMatch = str
				.match("/^[0-9]{4}[-|/|](((0[13578]|(10|12))[-|/|](0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)[-|/|](0[1-9]|[1-2][0-9]|30)))($|\s([0-1]\d|[2][0-3])\:[0-5]\d\:[0-5]\d)/");
		if (isMatch != null) {
			return true;
		}else {
			if (str.length == 8){//格式为20080212
				var dateStr = str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2);
				return this.isDateTime(dateStr);
			}else if (str.length == 14){//格式为20080212100224
				var timeStr = str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2) + " " + str.substr(8, 2) + ":" + str.substr(10, 2) + ":"+ str.substr(12, 2);
				return this.isDateTime(timeStr);
			}
			else{
				return false;
			}
		}
	}

	//字符串转简单类型对象
	this.strToObject = function(str, type) {
		if (str == "" || str == undefined || str == null) {
			return null;
		} else {
			switch (type) {
			case valueType.string:
				return str;
			case valueType.decimal:
				return cmnPcr.strToDecimal(str);
			case valueType.boolean:
				return cmnPcr.strToBoolean(str);
			case valueType.time:
				return cmnPcr.strToTime(str);
			case valueType.date:
				return cmnPcr.strToDate(str);
			case valueType.object:
				return cmnPcr.strToJson(str);
			default:
				alert("strToObject, type=" + type + ", str=" + str);
				return null;
			}
		}
	}

	//to decimal
	this.strToDecimal = function(str) {
		if (str.length > 64) {
			return parseFloat(str.replace(/,/gi, ""));
			//return value;
		} else {
			return parseFloat(str.replace(/,/gi, ""));
		}
	}

	//to date
	this.strToDate = function(str) {
		return this.strToTime(str);
	}

	//to time 字符串转时间,字符串必须为3种格式yyyy-MM-dd [HH:mm:ss] 或yyyy/MM/dd [HH:mm:ss]或 yyyyMMdd[HHmmss]
	this.strToTime = function(str) {
		if(str == null || str.length == 0){
			return null;
		}
		else{
			var ss;
			if (str.indexOf("T") > -1) {
				// 2010-02-06T16:04:19+08:00 处理这种日期数据
				str = mystr.substring(0, 10) + " " + str.substring(11, 19);
			}
	
			if (str.indexOf("-") > -1) {
				ss = str.split("-");
			} else if (str.indexOf("/") > -1) {
				ss = str.split("/");
			} else {
				var value = new Date(str.substr(0, 4), str.substr(4, 2) - 1, str
						.substr(6, 2), 0, 0, 0, 0);
				if (isNaN(value)) {
					return null;
				} else {
					return value;
				}
			}
	
			if (ss[2].indexOf(":") > -1) {
				var mytime = ss[2].substr(2);
				stime = mytime.split(":");
				dt = new Date(ss[0], ss[1] - 1, ss[2].substr(0, 2), stime[0],
						stime[1], stime[2])
			} else {
				dt = new Date(ss[0], ss[1] - 1, ss[2].substr(0, 2));
			}
	
			return (isNaN(dt) ? null : dt);
		}
	}

	//to boolean
	this.strToBoolean = function(str) {
		str = str.toUpperCase();
		if (str == "TRUE" || str == "Y") {
			return true;
		} else if (str == "FALSE" || str == "N") {
			return false;
		} else {
			return null;
		}
	}

	//简单对象类型转字符串
	this.objectToStr = function(obj, type) {
		if (obj == undefined || obj == null) {
			return "";
		} else {
			switch (type) {
			case valueType.string:
				return obj.toString();
			case valueType.decimal:
				return this.decimalToStr(obj);
			case valueType.boolean:
				return this.booleanToStr(obj);
			case valueType.time:
				return this.datetimeToStr(obj, "yyyy-MM-dd HH:mm:ss");
			case valueType.date:
				return this.datetimeToStr(obj, "yyyy-MM-dd");
			default:
				alert("objectToStr, type=" + type + ", obj=" + obj.toString());
				return null;
			}
		}
	}

	//decimal
	this.decimalToStr = function(obj, isThousand, fixNum, ignoreZeroDecimal) {
		if (fixNum != undefined) {
			obj = this.toFixed(obj, fixNum);
		}
		var value = obj.toString();
		if (isThousand || fixNum != null) {
			var subValues = value.split(".");
			var newValues = "";
			if(isThousand){
				for ( var i = 0; i < subValues[0].length; i++) {
					if (((i % 3) == (subValues[0].length % 3)) && i != 0) {
						newValues += ",";
					}
					newValues += subValues[0].substr(i, 1);
				}
			}
			else{
				newValues= subValues[0];
			}
			var dotDigitValueLength = subValues.length == 1 ? 0 : subValues[1].length;
			if (dotDigitValueLength > 0) {
				if(!ignoreZeroDecimal || subValues[1].replaceAll("0", "").length != 0){
					newValues += ".";
					newValues += subValues[1];
				}
			} 
			if(fixNum > dotDigitValueLength && !ignoreZeroDecimal){
				if(dotDigitValueLength == 0){
					newValues += ".";
				}
				for(var i = dotDigitValueLength; i < fixNum; i++){
					newValues += "0";
				}
			} 
			value = newValues;
		}
		return value;
	}

	//boolean
	this.booleanToStr = function(obj, trueStr, falseStr) {
		if (obj === true) {
			return trueStr == undefined ? "Y" : trueStr;
		} else if (obj === false) {
			return trueStr == undefined ? "N" : falseStr;
		} else {
			return "";
		}
	}

	//datetime
	this.datetimeToStr = function(obj, datetimeFormat) {
		if(obj == null){
			return "";
		}
		else{
			var compare = {
				'y+' : 'y',
				'M+' : 'M', //格式 月份：01到12
				'o+' : 'o', //格式 月份：1 到12
				'd+' : 'd', //格式 天 ： 01到31
				'D+' : 'D', //格式 天 ： 1 到31
				'h+' : 'h', //格式 小时：00到23
				'H+' : 'H', //格式 小时：0 到23
				'm+' : 'm', //格式 分钟：00到59
				'i+' : 'i', //格式 分钟：0 到59
				's+' : 's', //格式 秒 ： 00到59
				'S+' : 'S', //格式 秒 ： 0到59
				'f+' : 'f', //格式 毫秒 ： 0到999
				'F+' : 'F' //格式 毫秒 ： 0到999
			};
			var result = {
				'y' : obj.getFullYear(),
				'M' : (obj.getMonth() < 9) ? ("0" + (obj.getMonth() + 1)) : (obj
						.getMonth() + 1),
				'o' : (1 + obj.getMonth()),
				'd' : (obj.getDate() < 10) ? ("0" + obj.getDate()) : obj.getDate(),
				'D' : (obj.getDate() < 10) ? ("0" + obj.getDate()) : obj.getDate(),
				'h' : (obj.getHours() < 10) ? ("0" + obj.getHours()) : obj
						.getHours(),
				'H' : (obj.getHours() < 10) ? ("0" + obj.getHours()) : obj
						.getHours(),
				'm' : (obj.getMinutes() < 10) ? ("0" + obj.getMinutes()) : obj
						.getMinutes(),
				'i' : obj.getMinutes(),
				's' : (obj.getSeconds() < 10) ? ("0" + obj.getSeconds()) : obj
						.getSeconds(),
				'S' : (obj.getSeconds() < 10) ? ("0" + obj.getSeconds()) : obj
						.getSeconds(),
				'f' : obj.getMilliseconds(),
				'F' : obj.getMilliseconds()
			};
			var tmp = datetimeFormat;
			for ( var k in compare) {
	
				if (new RegExp('(' + k + ')').test(datetimeFormat)) {
	
					tmp = tmp.replace(RegExp.$1, result[compare[k]]);
				}
				;
			}
			;
			return tmp;
		}
	}
		//整形数字前补齐0，输出固定长度字符串 added by ls 20230804
	this.prefixInteger = function(num, length){
		return (Array(length).join('0') + num).slice(-length);
	}

	//获取类型中文名
	this.getValueTypeName = function(type) {
		var type = type.toLowerCase();
		switch (type) {
		case valueType.string:
			return "字符串";
		case valueType.decimal:
			return "数值";
		case valueType.boolean:
			return "布尔";
		case valueType.time:
			return "时间";
		case valueType.date:
			return "日期";
		default:
			return "未知类型" + type;
			return null;
		}
	}

	// 判断是否为闰年  
	this.isLeapYear = function(myDate) {
		return (0 == myDate.getYear() % 4 && ((myDate.getYear() % 100 != 0) || (myDate
				.getYear() % 400 == 0)));
	}

	//简单对象类型转字符串，param包含obj、type、isThousand是否包含千分位、fixNum小数位数
	this.objectToShowStr = function(p) {
		var obj = p.obj;
		var type = p.type;
		if (obj == undefined || obj == null) {
			return "";
		} else {
			switch (type) {
			case valueType.string:
				return obj.toString();
			case valueType.decimal:
				return this.decimalToStr(obj, p.isThousand, p.fixNum);
			case valueType.boolean:
				return this.booleanToStr(obj, p.trueStr, p.falseStr);
			case valueType.time:
				return this.datetimeToStr(obj, "yyyy-MM-dd HH:mm");
			case valueType.date:
				return this.datetimeToStr(obj, "yyyy-MM-dd");
			default:
				alert("objectToShowStr, type=" + type + ", obj="
						+ obj.toString());
				return null;
			}
		}
	}

	//根据颜色的int值获取颜色值,返回类似#000000
	this.getColorStr = function(colorInt) {
		var color = Number(colorInt) + 16777216;
		var colorStr = color.toString(16);
		var len = colorStr.length;
		for ( var i = 0; i < 6 - len; i++) {
			colorStr = "0" + colorStr;
		}
		colorStr = "#" + colorStr;
		return colorStr;
	}

	//转换成中文大写数字   
	this.toChinese = function(num) {
		if (!/^\d*(\.\d*)?$/.test(num)) {
			alert("Number is wrong!");
			return "Number is wrong!";
		}
		var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
		var BB = new Array("", "拾", "佰", "仟", "萬", "億", "点", "");
		var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
		for ( var i = a[0].length - 1; i >= 0; i--) {
			switch (k) {
			case 0:
				re = BB[7] + re;
				break;
			case 4:
				if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$")
						.test(a[0]))
					re = BB[4] + re;
				break;
			case 8:
				re = B, B[5] + re;
				BB[7] = BB[5];
				k = 0;
				break;
			}
			if (k % 4 == 2 && a[0].charAt(i + 2) != 0
					&& a[0].charAt(i + 1) == 0)
				re = AA[0] + re;
			if (a[0].charAt(i) != 0)
				re = AA[a[0].charAt(i)] + BB[k % 4] + re;
			k++;
		}
		if (a.length > 1) //加上小数部分(如果有小数部分)  
		{
			re += BB[6];
			for ( var i = 0; i < a[1].length; i++)
				re += AA[a[1].charAt(i)];
		}
		return re;
	}

	//保留小数点位数   
	this.toFixed = function(num, len) {
		if (isNaN(len) || len == null) {
			len = 0;
		} else {
			if (len < 0) {
				len = 0;
			}
		}
		return Math.round(num * Math.pow(10, len)) / Math.pow(10, len);
	}

	//转化为大写金额
	this.toMoney = function(num) {
		// 常量:  
		var MAXIMUM_NUMBER = 99999999999.99;
		var CN_ZERO = "零";
		var CN_ONE = "壹";
		var CN_TWO = "贰";
		var CN_THREE = "叁";
		var CN_FOUR = "肆";
		var CN_FIVE = "伍";
		var CN_SIX = "陆";
		var CN_SEVEN = "柒";
		var CN_EIGHT = "捌";
		var CN_NINE = "玖";
		var CN_TEN = "拾";
		var CN_HUNDRED = "佰";
		var CN_THOUSAND = "仟";
		var CN_TEN_THOUSAND = "万";
		var CN_HUNDRED_MILLION = "亿";
		var CN_SYMBOL = "";
		var CN_DOLLAR = "元";
		var CN_TEN_CENT = "角";
		var CN_CENT = "分";
		var CN_INTEGER = "整";
		// Variables:  
		var integral; // 代表整数部分.  
		var dec; // 代表小数部分.  
		var outputCharacters; // 输入结果.  
		var parts;
		var digits, radices, bigRadices, decimals;
		var zeroCount;
		var i, p, d;
		var quotient, modulus;
		if (num > MAXIMUM_NUMBER) {
			return "";
		}
		// 先将小数部分和整数部分分开:  
		parts = (num + "").split(".");
		if (parts.length > 1) {
			integral = parts[0];
			dec = parts[1];
			// Cut down redundant decimal digits that are after the second.  
			dec = dec.substr(0, 2);
		} else {
			integral = parts[0];
			dec = "";
		}
		// Prepare the characters corresponding to the digits:  
		digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE,
				CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
		radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
		bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
		decimals = new Array(CN_TEN_CENT, CN_CENT);

		// 开始处理:  
		outputCharacters = "";
		// 若大于0处理整数部分  
		if (ToNumber(integral) > 0) {
			zeroCount = 0;
			for (i = 0; i < integral.length; i++) {
				p = integral.length - i - 1;
				d = integral.substr(i, 1);
				quotient = p / 4;
				modulus = p % 4;
				if (d == "0") {
					zeroCount++;
				} else {
					if (zeroCount > 0) {
						outputCharacters += digits[0];
					}
					zeroCount = 0;
					outputCharacters += digits[ToNumber(d)] + radices[modulus];
				}

				if (modulus == 0 && zeroCount < 4) {
					outputCharacters += bigRadices[quotient];
				}
			}

			outputCharacters += CN_DOLLAR;
		}
		// 处理小数部分 
		if (dec != "") {
			for (i = 0; i < dec.length; i++) {
				d = dec.substr(i, 1);
				if (d != "0") {
					outputCharacters += digits[ToNumber(d)] + decimals[i];
				}
			}
		}
		if (outputCharacters == "") {
			outputCharacters = CN_ZERO + CN_DOLLAR;
		}
		if (dec == "") {
			outputCharacters += CN_INTEGER;
		}
		outputCharacters = CN_SYMBOL + outputCharacters;
		return outputCharacters;
	}
	//去除字符串两边的空格   
	this.trim = function(value) {
		if (value == null || value == undefined) {
			return null;
		} else {
			return value.replace(/(^\s*)|(\s*$)/g, "");
		}
	}

	//将出现的字串oldStr全部替换为newStr (区分大小写)
	this.replace = function(value, oldStr, newStr) {
		if (value == null || value == undefined) {
			return null;
		} else {
			return value.replace(new RegExp(oldStr, "gm"), newStr);
		}
	}
	
	//将出现的字串oldStr全部替换为newStr (区分大小写)
	this.replaceByRegExp = function(value, oldStr, newStr) {
		if (value == null || value == undefined) {
			return null;
		} else {
			return value.replace(oldStr, newStr);
		}
	}

	//字符串集合拼接成字符串
	this.arrayToString = function(strArray, joinStr) {
		var resultStr = "";
		for ( var i = 0; i < strArray.length; i++) {
			resultStr = resultStr + (i == 0 ? "" : joinStr) + strArray[i];
		}
		return resultStr;
	}

	this.html_encode = function(s) {
		if (s == null || s.length == 0)
			return "";
		s = s.toString();
		s = s.replace(/&/g, "&amp;");
		s = s.replace(/</g, "&lt;");
		s = s.replace(/>/g, "&gt;");
		//s = s.replace(/ /g, "&nbsp;");
		s = s.replace(/ /g, "&ensp;");
		s = s.replace(/\'/g, "&#39;");
		s = s.replace(/\"/g, "&quot;");
		s = s.replace(/\n/g, "<br>");
		return s;
	}

	this.html_decode = function(s) {
		if (s.length == 0)
			return "";
		//s = str.replace(/&gt;/g, "&");
		s = s.replace(/&lt;/g, "<");
		s = s.replace(/&gt;/g, ">");
		//增加对&ensp;的替换 added by ls 20170908
		s = s.replace(/&ensp;/g, " ");
		s = s.replace(/&nbsp;/g, " ");
		s = s.replace(/&#39;/g, "\'");
		s = s.replace(/&quot;/g, "\"");
		s = s.replace(/<br>/g, "\n");
		return s;
	}
	
	//将正则表达式的特殊保留字符转义 added by ls 20170912
	this.encodeRegExpString = function(s){
		if(s.length != 0){
			var newStr = "";
			for(var i = 0; i < s.length; i++){
				switch(s[i]){
					case "*":
					case ".":
					case "?":
					case "+":
					case "$":
					case "^":
					case "[":
					case "]":
					case "(":
					case ")":
					case "{":
					case "}":
					case "|":
					case "\\":
						newStr += "\\"+s[i];
						break;
					default:
						newStr += s[i];
				}
			}
			return newStr;
		}
		else{
			return "";
		}
	}
	
	//获取网页地址中的参数
	this.getQueryStringArgs = function() {
	    var query = document.location.search.substring(1); // 取查询字符串
	    return this.getQueryArgsFromString(query);
	}

	//获取网页地址中的参数
	this.getQueryArgsFromString = function(queryString) { 
	    var args = {};
	    var pairs = queryString.split("&"); // 以 & 符分开成数组 
	    for (var i = 0; i < pairs.length; i++) {
	        var pos = pairs[i].indexOf('='); // 查找 "name=value" 对 
	        if (pos == -1) continue; // 若不成对，则跳出循环继续下一对 
	        var argname = pairs[i].substring(0, pos); // 取参数名 
	        var value = pairs[i].substring(pos + 1); // 取参数值 
	        value = decodeURIComponent(value); // 若需要，则解码 
	        args[argname] = value; // 存成对象的一个属性 
	    }
	    return args; // 返回此对象
	}
	
	//获取对象的属性个数
	this.getObjectPropertyCount = function(obj){
		if(obj == null){
			return null;
		}
		else{
			var num = 0;
			for(var k in obj){
				num++;
			}
			return num;
		}
	}
	this.isEmail = function(strEmail) {
		if(strEmail == null || strEmail.length == 0){
			return false;
		}
		else if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1){
			return true;
		}
		else{
			return false;
		}
	}
	this.accMul = function(arg1, arg2) { 
	    var m=0,s1=arg1.toString(),s2=arg2.toString(); 
	    try{m+=s1.split(".")[1].length}catch(e){} 
	    try{m+=s2.split(".")[1].length}catch(e){} 
	    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m); 
	} 

	//对cookie的操作 added by ls 20210225
	this.setCookie = function(name,value,iDay) {
		var oDate=new Date();
		oDate.setDate(oDate.getDate()+iDay);
		document.cookie=name+'='+value+';expires='+oDate;

	}
	
	this.getCookie = function(name) {
		var arr=document.cookie.split('; ');
		var i=0;
		for(i=0;i<arr.length;i++)
		{
			var arr2=arr[i].split('=');
			
			if(arr2[0]==name)
			{
				return arr2[1];
			}
		}
		
		return null;
	}

	this.removeCookie = function(name) {
		setCookie(name, '1', -1);
	}
	
	//获取哈希表里元素个数 added by ls 20230208
    this.getCountInHash = function(hash){
    	var count = 0;
    	for(var id in hash){
    		count++;
    	}
    	return count;
    }

	//获取哈希表里获取一个元素 added by ls 20230208
    this.getOneElmentInHash = function(hash){
    	for(var id in hash){
    		return hash[id];
    	}
    	return null;
    }
}

function ListContainer(p) {
	var that = this;
	this.width = p.width;
	this.height = p.height;
	this.closeWinFunc = p.closeWinFunc;
	this.containerId = cmnPcr.getRandomValue();
	this.overlayId = cmnPcr.getRandomValue();

	this.getWindowOffset = function() {
		var ww = 0, wh = 0;
		// 获取窗口宽度
		if (window.innerWidth)
			ww = window.innerWidth;
		else if ((document.body) && (document.documentElement.clientWidth))
			ww = document.documentElement.clientWidth;
		// 获取窗口高度 
		if (window.innerHeight)
			wh = window.innerHeight;
		else if ((document.body) && (document.documentElement.clientHeight))
			wh = document.documentElement.clientHeight;
		return {
			width : ww,
			height : wh
		}
	}

	this.calculatePos = function(winSize, parentAttr, popSize) {
		var left, top;
		if (that.left == undefined) {
			if (winSize.height >= (parentAttr.top + parentAttr.height + popSize.height))
				top = parentAttr.top + parentAttr.height;
			else {
				if (parentAttr.top - popSize.height >= 0)
					top = parentAttr.top - popSize.height;
				else
					top = 0;
			}
		}
		if (parentAttr.left + parentAttr.width > popSize.width)
			left = parentAttr.left + parentAttr.width - popSize.width;
		else {
			left = 0;
		}
		return {
			"left" : left,
			"top" : top
		};
	}

	this.show = function() {
		var offset = $(p.parentControl).offset();
		offset.height = $(p.parentControl)[0].offsetHeight;
		offset.width = $(p.parentControl)[0].offsetWidth;

		var winOffset = this.getWindowOffset();
		var popSize = {
			"width" : that.width,
			"height" : that.height
		};
		var newPos = this.calculatePos(winOffset, offset, popSize);
		var overlayZIndex = cmnPcr.getTopZIndex();
		var boxZIndex = cmnPcr.getTopZIndex();
		var popHtml = "<div class=\"zlpListOverlay\" id=\"" + this.overlayId
				+ "\" style=\"z-index:" + overlayZIndex + ";\"></div>"
				+ "<div class=\"zlpListBox\" style=\"z-index:" + boxZIndex
				+ ";left:" + newPos.left + "px;top:" + newPos.top + "px;width:"
				+ popSize.width + "px;height:" + popSize.height + "px;\" id=\""
				+ this.containerId + "\"></div>";
		$(document.body).append(popHtml);

		$("#" + this.overlayId).click(function() {
			that.close( {});
		});
	}

	this.close = function(p) {
		if (that.closeWinFunc) {
			that.closeWinFunc(p);
		}
		$("#" + this.containerId).empty();
		$("#" + this.containerId).remove();
		$("#" + this.overlayId).empty();
		$("#" + this.overlayId).remove();
	}
}

function PopupContainer(p) {
	var thatPopContainer = this;
	this.title = p.title;
	this.width = p.width;
	this.height = p.height;
	this.top = p.top;
	this.left = p.left;
	this.closeWinFunc = p.closeWinFunc;
	this.containerId = cmnPcr.getRandomValue();
	this.boxId = cmnPcr.getRandomValue();
	this.overlayId = cmnPcr.getRandomValue();
	this.isHidden = false;
	this.backdrop = p.backdrop != undefined ? p.backdrop : false;
	this.canClose = p.canClose != undefined ? p.canClose : true;

	//是否可以全屏查看
	this.canFullScreen = p.canFullScreen != undefined ? p.canFullScreen : false;
	this.screenIcons={
		fullScreen:'<svg focusable=\"false\" class=\"\" data-icon=\"fullscreen\" width=\"1em\" height=\"1em\" fill=\"currentColor\" aria-hidden=\"true\" viewBox=\"64 64 896 896\"><path d=\"M290 236.4l43.9-43.9a8.01 8.01 0 00-4.7-13.6L169 160c-5.1-.6-9.5 3.7-8.9 8.9L179 329.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L370 423.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L290 236.4zm352.7 187.3c3.1 3.1 8.2 3.1 11.3 0l133.7-133.6 43.7 43.7a8.01 8.01 0 0013.6-4.7L863.9 169c.6-5.1-3.7-9.5-8.9-8.9L694.8 179c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L600.3 370a8.03 8.03 0 000 11.3l42.4 42.4zM845 694.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L654 600.3a8.03 8.03 0 00-11.3 0l-42.4 42.3a8.03 8.03 0 000 11.3L734 787.6l-43.9 43.9a8.01 8.01 0 004.7 13.6L855 864c5.1.6 9.5-3.7 8.9-8.9L845 694.9zm-463.7-94.6a8.03 8.03 0 00-11.3 0L236.3 733.9l-43.7-43.7a8.01 8.01 0 00-13.6 4.7L160.1 855c-.6 5.1 3.7 9.5 8.9 8.9L329.2 845c6.6-.8 9.4-8.9 4.7-13.6L290 787.6 423.7 654c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.4z\"></path></svg>',
		fullScreenExit:'<svg focusable="false" class="" data-icon="fullscreen-exit" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M391 240.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L200 146.3a8.03 8.03 0 00-11.3 0l-42.4 42.3a8.03 8.03 0 000 11.3L280 333.6l-43.9 43.9a8.01 8.01 0 004.7 13.6L401 410c5.1.6 9.5-3.7 8.9-8.9L391 240.9zm10.1 373.2L240.8 633c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L146.3 824a8.03 8.03 0 000 11.3l42.4 42.3c3.1 3.1 8.2 3.1 11.3 0L333.7 744l43.7 43.7A8.01 8.01 0 00391 783l18.9-160.1c.6-5.1-3.7-9.4-8.8-8.8zm221.8-204.2L783.2 391c6.6-.8 9.4-8.9 4.7-13.6L744 333.6 877.7 200c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.3a8.03 8.03 0 00-11.3 0L690.3 279.9l-43.7-43.7a8.01 8.01 0 00-13.6 4.7L614.1 401c-.6 5.2 3.7 9.5 8.8 8.9zM744 690.4l43.9-43.9a8.01 8.01 0 00-4.7-13.6L623 614c-5.1-.6-9.5 3.7-8.9 8.9L633 783.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L824 877.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L744 690.4z"></path></svg>',
	}
	
	//增加可拖拽操作 added by ls 20210820
	this.dragInfo = {
		distanceX: 0,
		distanceY: 0,
		isDown: false
	};

	this.getWindowOffset = function() {
		var ww = 0, wh = 0;
		// 获取窗口宽度
		if (window.innerWidth)
			ww = window.innerWidth;
		else if ((document.body) && (document.documentElement.clientWidth))
			ww = document.documentElement.clientWidth;
		// 获取窗口高度 
		if (window.innerHeight)
			wh = window.innerHeight;
		else if ((document.body) && (document.documentElement.clientHeight))
			wh = document.documentElement.clientHeight;
		return {
			width : ww,
			height : wh
		}
	}

	this.calculatePos = function(winSize, popSize) {
		var left = thatPopContainer.left;
		var top = thatPopContainer.top;
		if (top == undefined) {
			if (winSize.height >= popSize.height)
				top = (winSize.height - popSize.height) / 2;
			else {
				top = 0;
			}
		}
		if (left == undefined) {
			if (winSize.width > popSize.width)
				left = (winSize.width - popSize.width) / 2;
			else {
				left = 0;
			}
		}
		return {
			"left" : left,
			"top" : top
		};
	}

	this.show = function(callbackFunc) {
		if(thatPopContainer.isHidden){
			$("#" + thatPopContainer.boxId).css("display", "block"); 
			$("#" + thatPopContainer.overlayId).css("display", "block"); 
			thatPopContainer.isHidden = false;
		}
		else{
			var winOffset = thatPopContainer.getWindowOffset();
			var popSize = {
				"width" : thatPopContainer.width,
				"height" : thatPopContainer.height
			};
			var newPos = thatPopContainer.calculatePos(winOffset, popSize);
			var overlayZIndex = cmnPcr.getTopZIndex();
			var boxZIndex = cmnPcr.getTopZIndex();

			//是否可以全屏查看
			var sreenHtml="";
			if(thatPopContainer.canFullScreen){
				sreenHtml='<div class=\"zlpPopScreenBtn\">'+thatPopContainer.screenIcons.fullScreen+'</div>';
			}

			//alert(popSize.width)
			var popHtml = "<div class=\"zlpPopOverlay\" id=\"" + thatPopContainer.overlayId + "\" style=\"display:none;z-index:" + overlayZIndex + ";\">"
				+ "<div class=\"zlpPopBackground\"></div>"
				+ "<div class=\"zlpPopBox\" id=\"" + thatPopContainer.boxId + "\" style=\"z-index:" + boxZIndex + ";left:" + newPos.left + "px;top:" + thatPopContainer.top + "px;width:" + popSize.width + "px;height:" + popSize.height + "px;\">"
				// + "<div class=\"zlpPopTitle\"></div><div class=\"zlpPopCloseBtn\">×</div>"
				+ "<div class=\"zlpPopTitle\"></div>"
				+ sreenHtml
				+ "<div class=\"zlpPopCloseBtn\">x</div>"
				+ "<div class=\"zlpPopInnerBox\" id=\"" + thatPopContainer.containerId + "\"></div>"
				+ "</div></div>";

			$(document.body).append(popHtml);
			$("#" + thatPopContainer.overlayId).css({display: "block"});
			$("#" + thatPopContainer.containerId).css({display: "block"}); 
			$("#" + thatPopContainer.boxId + " .zlpPopTitle").text(thatPopContainer.title);
			$("#" + thatPopContainer.boxId + " .zlpPopCloseBtn").click(function(){
				if(thatPopContainer.canClose){
					thatPopContainer.close({});
				}
				else{
					thatPopContainer.hide({});
				}
			});
			$("#" + thatPopContainer.boxId).click(function(){
				return false;
			});
			$("#" + thatPopContainer.overlayId).click(function(){
				if(thatPopContainer.backdrop){
					thatPopContainer.close({});
				}
			});
			if(callbackFunc != null){
				callbackFunc();
			} 
			
			//增加可拖拽操作 add by ls 20210820
			$("#" + thatPopContainer.boxId + " .zlpPopTitle").mousedown(function(e){
				var dv = $(this).parent();
				var positionDiv = $(dv).offset();
				thatPopContainer.dragInfo.distanceX = e.pageX - positionDiv.left;
				thatPopContainer.dragInfo.distanceY = e.pageY - positionDiv.top;
				thatPopContainer.dragInfo.isDown = true;
			});

			$("#" + thatPopContainer.boxId).mousemove(function(e){
				if(thatPopContainer.dragInfo.isDown){
			        var x = e.pageX - thatPopContainer.dragInfo.distanceX;
			        var y = e.pageY - thatPopContainer.dragInfo.distanceY;
	
			        if (x < 0) {
			            x = 0;
			        }
			        else if (x > $("#" + thatPopContainer.overlayId).width() - $("#" + thatPopContainer.boxId).outerWidth(true)) {
			            x = $("#" + thatPopContainer.overlayId).width() - $("#" + thatPopContainer.boxId).outerWidth(true);
			        }
	
			        if (y < 0) {
			            y = 0;
			        } 
			        else if (y > $("#" + thatPopContainer.overlayId).height() - $("#" + thatPopContainer.boxId).outerHeight(true)) {
			            y = $("#" + thatPopContainer.overlayId).height() - $("#" + thatPopContainer.boxId).outerHeight(true);
			        }
	
			        $("#" + thatPopContainer.boxId).css({
			            'left': x + 'px',
			            'top': y + 'px'
			        });
				}
			});

		    $("#" + thatPopContainer.boxId).mouseup(function() {
				thatPopContainer.dragInfo.isDown = false;
		    });

			//是否可以全屏查看
			if(thatPopContainer.canFullScreen){
				$("#" + thatPopContainer.boxId+" .zlpPopScreenBtn").click(function(){
					thatPopContainer.fullScreenFun();
				});
			}
			
		}
	}

	this.close = function(p) {
		if (thatPopContainer.closeWinFunc) {
			thatPopContainer.closeWinFunc(p);
		}
		$("#" + thatPopContainer.boxId).empty();
		$("#" + thatPopContainer.boxId).remove();
		$("#" + thatPopContainer.overlayId).empty();
		$("#" + thatPopContainer.overlayId).remove();
	}
	
	this.hide = function(){
		if (thatPopContainer.closeWinFunc) {
			thatPopContainer.closeWinFunc(p);
		} 
		$("#" + thatPopContainer.boxId).css("display", "none"); 
		$("#" + thatPopContainer.overlayId).css("display", "none"); 
		thatPopContainer.isHidden = true;
	}

	//是否可以全屏查看
	this.fullScreenFun=function (){
		$("#" + thatPopContainer.boxId + " .zlpPopScreenBtn").html(thatPopContainer.screenIcons.fullScreenExit);
		var winSize=this.getWindowOffset();
		$("#" + thatPopContainer.boxId).css({
			'left': '0px',
			'top':  '0px',
			'width': winSize.width + 'px',
			'height': winSize.height + 'px'
		});
		$("#" + thatPopContainer.boxId+" .zlpPopScreenBtn").click(function(){
			thatPopContainer.fullScreenExitFun();
		});
	}
	this.fullScreenExitFun=function (){
		$("#" + thatPopContainer.boxId + " .zlpPopScreenBtn").html(thatPopContainer.screenIcons.fullScreen);
		var winOffset = thatPopContainer.getWindowOffset();
		var popSize = {
			"width" : thatPopContainer.width,
			"height" : thatPopContainer.height
		};
		var newPos = thatPopContainer.calculatePos(winOffset, popSize);
		$("#" + thatPopContainer.boxId).css({
			'left': newPos.left + 'px',
			'top': newPos.top + 'px',
			'width': popSize.width + 'px',
			'height': popSize.height + 'px'
		});
		$("#" + thatPopContainer.boxId+" .zlpPopScreenBtn").click(function(){
			thatPopContainer.fullScreenFun();
		});
	}
}

function OpacityContainer(p) {
	var thatOpacityContainer = this;
	this.title = p.title;  
	this.style = p.style;
	this.closeWinFunc = p.closeWinFunc;
	this.containerId = cmnPcr.getRandomValue();
	this.boxId = cmnPcr.getRandomValue(); 
	this.isHidden = false;
	this.backdrop = p.backdrop != undefined ? p.backdrop : false;
	this.canClose = p.canClose != undefined ? p.canClose : true; 

	this.show = function(callbackFunc) {
		if(thatOpacityContainer.isHidden){
			$("#" + thatOpacityContainer.boxId).css("display", "block");  
			thatOpacityContainer.isHidden = false;
		}
		else{  
			var boxZIndex = cmnPcr.getTopZIndex();
			var popHtml = "<div class=\"zlpOpacityBox\" id=\"" + thatOpacityContainer.boxId + "\" style=\"" + thatOpacityContainer.style + "\">"
				+ "<div class=\"zlpOpacityBackground\"></div>"
				+ "<div class=\"zlpOpacityTitle\"></div><div class=\"zlpOpacityCloseBtn\">×</div>"
				+ "<div class=\"zlpOpacityInnerBox\" id=\"" + thatOpacityContainer.containerId + "\"></div>"
				+ "</div>";
			$(document.body).append(popHtml);
			$("#" + thatOpacityContainer.boxId + " .zlpOpacityTitle").text(thatOpacityContainer.title);
			$("#" + thatOpacityContainer.boxId + " .zlpOpacityCloseBtn").click(function(){
				if(thatOpacityContainer.canClose){
					thatOpacityContainer.close({});
				}
				else{
					thatOpacityContainer.hide({});
				}
			});
			$("#" + thatOpacityContainer.boxId).click(function(){
				return false;
			}); 
			
			if(callbackFunc != null){
				callbackFunc();
			}			
		}
	}

	this.close = function(p) {
		if (thatOpacityContainer.closeWinFunc) {
			thatOpacityContainer.closeWinFunc(p);
		}
		$("#" + thatOpacityContainer.boxId).empty();
		$("#" + thatOpacityContainer.boxId).remove(); 
	}
	
	this.hide = function(){
		if (thatOpacityContainer.closeWinFunc) {
			thatOpacityContainer.closeWinFunc(p);
		} 
		$("#" + thatOpacityContainer.boxId).css("display", "none");  
		thatOpacityContainer.isHidden = true;
	}
}

//String类型数据新增判断是否以str开头
String.prototype.startWith = function(str) {
	str = str.replace("*", "\\u002A");
	var reg = new RegExp("^" + str);
	return reg.test(this);
}

//String类型数据新增判断是否以str结尾
String.prototype.endWith = function(str) {
	str = str.replace("*", "\\u002A");
	var reg = new RegExp(str + "$");
	return reg.test(this);
}

//判断数组内是否包含某个元素
Array.prototype.contains = function(element) {
	for ( var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			return true;
		}
	}
	return false;
}  

function dateFormater(cellvalue, options, rowObject){
	//return cellvalue == null ? "" : cmnPcr.datetimeToStr(cellvalue, cmnPcr.getDateFormat());
	//[2016-12-28]yucx:修复日期编辑时，点取消后，日期域不隐藏的bug
	return cellvalue == null ? "" : Object.prototype.toString.call(cellvalue) === "[object String]"? cellvalue :cmnPcr.datetimeToStr(cellvalue, cmnPcr.getDateFormat());
}

function timeFormater(cellvalue, options, rowObject){
	//return cellvalue == null ? "" : cmnPcr.datetimeToStr(cellvalue, cmnPcr.getTimeFormat()); 
	//[2016-12-28]yucx:修复日期编辑时，点取消后，日期域不隐藏的bug
	return cellvalue == null ? "" : Object.prototype.toString.call(cellvalue) === "[object String]"? cellvalue :cmnPcr.datetimeToStr(cellvalue, cmnPcr.getTimeFormat());
}

//单据编辑状态类型
var formStatusType={disable:"disable",browse:"browse",add:"add",edit:"edit"}; 

//ToolBar按钮类型
var toolBarButtonType={add:"add",save:"save",remove:"remove",print:"print",edit:"edit",cancel:"cancel",
		find:"find",first:"first",previous:"previous",next:"next",last:"last",refresh:"refresh",
		accessory:"accessory",spaceLine:"spaceLine"};

//字段类型
var valueType={string:"string",decimal:"decimal",boolean:"boolean",date:"date",time:"time"};

//附件类型
var accessoryType={word:"*.doc;*.docx;",excel:"*.xlsx;xls;",jpg:"*.jpg;",gif:"*.gif;",png: "*.png;"};

function mainMenu(){
	this.index = 0;
	mainMenu.prototype.array=[];
}


var mainTab = {
	select: function (id) {
		var allTabs = this.p.tabs("tabs");
		for (var i = 0; i < allTabs.length; i++) {
			if ($(allTabs[i]).attr("id") == id) {
				var index = this.p.tabs("getTabIndex", allTabs[i]);
				this.p.tabs("select", index);
			}
		}
	},
	exist: function (id) {
		var allTabs = this.p.tabs("tabs");
		for (var i = 0; i < allTabs.length; i++) {
			if ($(allTabs[i]).attr("id") == id) {
				return true;
			}
		}
		return false;
	},
	showPage: function (id, name, url, closable) {
		if (this.exist(id)) {
			this.select(id);
		} else {
			var iframeId = cmnPcr.getRandomValue();
			var path = basePath + url;
			var innerHtml = "<div style=\"width:100%;height:100%;overflow:hidden;\"><iframe id=\"" + iframeId + "\" style=\"width:100%;height:100%;border:0px;\" src=\"" + path + "\" frameborder=\"0\" /></div>";
			this.p.tabs("add", {
				id: id,
				title: name,
				content: innerHtml,
				closable: closable == undefined ? true : closable
			});
			var tab = this.p.tabs('getSelected');
			$(tab).attr("id", id);
		}
	},
	flushTab: function (name) {
		this.p.tabs('select', name);
		var currTab = this.p.tabs('getSelected'); //获得当前tab
		var url = $(currTab.find('iframe')[0]).attr('src');
		$(currTab.find('iframe')[0]).attr("src", url);

	},
	closeTab: function (name) {
		this.p.tabs("close", name);
	}
}