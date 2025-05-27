$.fn.popMultiDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.popMultiDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "popMultiDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"zlpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"zlpDispunitCtrl zlpDispunitCtrlWithButton\" ></div><div class=\"zlpDispunitBtn zlpDispunitPop\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("zlpDispunitContent");
		$(this).css("width", ""); 
		$(this).attr("disabled", "disabled");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$("#" + tableId).find(".zlpDispunitBtn").height($("#" + tableId).height());

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("textField", options.textField);
		$(this).attr("idField", options.idField);
		$(this).attr("dispunitType", "popMulti");

		var btn = $("#" + tableId).find(".zlpDispunitBtn")[0];
		var showPop = function(value) {
			options.showPopFunc( {
				value : value,
				options : options.options,
				changeValueFunc : function(rowData) {
					$(that).popMultiDispunit("setValue", rowData);
					if (rowData != null && rowData.length != 0) {
						if (options.options.changeFunc != undefined) {
							options.options.changeFunc(that, rowData, options.options.rowId);
						}
					} else {
						var initValue = $(that).popMultiDispunit("getValue"); //cmnPcr.strToJson($(that).attr("jsonValue"));
						$(that).popMultiDispunit("setValue", initValue);
					}
				}
			});
		}

		$(btn).click(function() {
			var value = $(that).popMultiDispunit("getValue");
			showPop(value);
		});

		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
		$.fn.popMultiDispunit.methods["setValue"](this, {});
	}
	return this;
}

$.fn.popMultiDispunit.methods = {
	getValue : function(jq) {
		var value = cmnPcr.strToJson($(jq).attr("jsonValue"));		
		for(var k in value){
			value[k] = value[k] == null? null : decodeURIComponent(value[k]);
		}
		return value;
	},
	setValue : function(jq, value) {
		if (value == null) {
			value = {};
		}
		var textField = $(jq).attr("textField");

		var textFieldArray = new Array();
		for ( var rowId in value) {
			var oneRow = value[rowId];
			textFieldArray.push(oneRow[textField]);
		}
		var textFieldStr = cmnPcr.arrayToString(textFieldArray, ",");
		$(jq).val(textFieldStr);
		$(jq).attr("initValue", textFieldStr);

		var idField = $(jq).attr("idField");
		if (idField != null) {
			var idFieldArray = new Array();
			for ( var rowId in value) {
				var oneRow = value[rowId];
				idFieldArray.push(oneRow[idField]);
			}
			$(jq).attr("idValue", cmnPcr.arrayToString(idFieldArray, ","));
		}
		
		var encodeValue = {};
		for(var k in value){
			encodeValue[k] = value[k] == null ? null : encodeURIComponent(value[k]);
		}
		
		$(jq).attr("jsonValue", cmnPcr.jsonToStr(encodeValue));
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("isDisabled", "true");
			//只读的背景色改为淡灰色 modified by lxin 20210824
			//$(jq).css("background-color", "#f6f6f6");
			$(jq).parent().css("right", "0px");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).attr("isDisabled", "false");
			//可编辑时的背景色改为透明 modified by lxin 20210824
			//$(jq).css("background-color", "#FFFFFF");
			$(jq).parent().css("right", null);
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("isDisabled") == "true";
	}
}

$.fn.popDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.popDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "popDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"zlpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"zlpDispunitCtrl zlpDispunitCtrlWithButton\" ></div><div class=\"zlpDispunitBtn zlpDispunitPop\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("zlpDispunitContent");
		$(this).css("width", ""); 
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$("#" + tableId).find(".zlpDispunitBtn").height(ctrlHeight);

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("textField", options.textField);
		$(this).attr("idField", options.idField);
		$(this).attr("dispunitType", "pop");

		var btn = $("#" + tableId).find(".zlpDispunitBtn")[0];
		
		//参数改为json，增加eventType的传递 modifed by ls 20220606
		var showPop = function(value, eventType) {
			options.showPopFunc( {
				value : value,
				eventType: eventType,
				options : options.options,
				changeValueFunc : function(rowData) {
					if (rowData != null) {
						var isChanged = false;
						var idField = options.idField;
						var textField = options.textField;
						if (idField == null) {
							isChanged = rowData[textField] != $(that)
									.listDispunit("getValue")[textField];
						} else {
							isChanged = rowData[idField] != $(that)
									.listDispunit("getValue")[idField];
						}

						$(that).popDispunit("setValue", rowData);
						if (isChanged) {
							if (options.options.changeFunc != undefined) {
								options.options.changeFunc(that, rowData, options.options.rowId);
							}
						}
					} else {
						var initValue = $(that).popDispunit("getValue"); //cmnPcr.strToJson($(that).attr("jsonValue"));
						$(that).popDispunit("setValue", initValue);
					}
				}
			});
		}

		$(btn).click(function() {
			//增加eventType的传递 modified by ls 20220606
			//传递过去之前选择的值 modified by ls 20230111
			var value = $(that).listDispunit("getValue");
			showPop(value, "click");
		});
		$(this).change(function() {
			var autoPopAfterChange = $(this).attr("autoPopAfterChange") == "true";
			if(autoPopAfterChange){
				var value = $(this).val();
				//增加eventType的传递 modified by ls 20220606
				showPop(value, "input");
			}
			else{
				var textField = $(this).attr("textField");
				var value = {};
				value[textField] = $(this).val();
				$.fn.popDispunit.methods["setValue"](this, value);
			}
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
		$.fn.popDispunit.methods["setValue"](this, {});
		$.fn.popDispunit.methods["setAutoPopAfterChange"](this, true);
	}
	return this;
}

$.fn.popDispunit.methods = {
	setAutoPopAfterChange:function(jq, autoPopAfterChange){
		$(jq).attr("autoPopAfterChange", autoPopAfterChange);
	},
	getValue : function(jq) {
		var value = cmnPcr.strToJson($(jq).attr("jsonValue"));
		for(var k in value){
			value[k] = value[k] == null? null : decodeURIComponent(value[k]);
		}
		return value;
	},
	setValue : function(jq, value) {
		if (value == null) {
			value = {};
		}
		var textField = $(jq).attr("textField");
		$(jq).val(value[textField]);
		$(jq).attr("initValue", value[textField]);

		var idField = $(jq).attr("idField");
		if (idField != null) {
			$(jq).attr("idValue", value[idField]);
		} 
		
		var encodeValue = {};
		for(var k in value){
			encodeValue[k] = value[k] == null ? null : encodeURIComponent(value[k]);
		}
		
		$(jq).attr("jsonValue", cmnPcr.jsonToStr(encodeValue));
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("disabled", "disabled");
			//只读的背景色改为淡灰色 modified by lxin 20210824
			//$(jq).css("background-color", "#f6f6f6");
			$(jq).parent().css("right", "0px");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).removeAttr("disabled");
			//可编辑时的背景色改为透明 modified by lxin 20210824
			//$(jq).css("background-color", "#FFFFFF");
			$(jq).parent().css("right", null);
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.listDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.listDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "listDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"zlpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"zlpDispunitCtrl zlpDispunitCtrlWithButton\" ></div><div class=\"zlpDispunitBtn zlpDispunitList\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("zlpDispunitContent");
		$(this).css("width", ""); 
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$("#" + tableId).find(".zlpDispunitBtn").height(ctrlHeight);

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("textField", options.textField);
		$(this).attr("idField", options.idField);
		$(this).attr("dispunitType", "list");

		//只允许选取，不允许手工录入
		if(options.onlySelect){
			$(this).attr("disabled", "disabled");
			//$(this).css("background-color", "#ffffff");
			//$("#" + tableId).css("background-color", "#ffffff");
		}

		var btn = $("#" + tableId).find(".zlpDispunitBtn")[0];
		
		//增加eventType的传递 modifed by ls 20220606
		var showList = function(value, eventType) {
			var inputTable = $(that).parent().parent();//.parent();
			var width = 0;
			var height = 100;
			for ( var i = 0; i < options.columns[0].length; i++) {
				var column = options.columns[0][i];
				width += (column.hidden ? 0 : column.width);
			}
			
			var tableColumnConfig = {};
			for ( var i = 0; i < options.columns[0].length; i++) {
				var column = options.columns[0][i];
				var cWidth = (column.hidden ? 0 : column.width);
				tableColumnConfig[column.field] = cWidth / width;				
			}
			
			//修改下拉宽度等于所属父级input宽度
			var inputWidth = $(inputTable).width();
			   if(inputWidth > width){
			    width = inputWidth;
		    }
			 
			//最小宽度200
			if(width < 200){
				width = 200;
			}
			
			var listContainer = new ListContainer( {
				parentControl : inputTable,
				width : width,
				height : height,
				closeWinFunc : function(p) {
					if (p.selected == undefined) {
						var initValue =$(that).listDispunit("getValue");
						$(that).listDispunit("setValue", initValue);
					}
				}
			});
			listContainer.show();
			var listCtrlId = listContainer.containerId + "_List";
			var tableHtml = "<table style=\"width:100%;height:auto;\" class=\"zlpListTable\" id=\"" + listCtrlId + "\"></table>";
			$("#" + listContainer.containerId).html(tableHtml);
			$("#" + listCtrlId).attr("columnsWidth", cmnPcr.jsonToStr(tableColumnConfig));
			$(that).attr("listContainerId", listContainer.containerId);
			$(that).attr("listCtrlId", listCtrlId);
			

			$("#" + listCtrlId).click(function(event){ 
				var tempElement = event.target;
				var trElement = null;
				while(!$(tempElement).hasClass("zlpListTable")){
					tempElement = $(tempElement).parent();
					if($(tempElement).hasClass("zlpListTr")){
						trElement = tempElement;
					}
				}
				if(trElement != null){
					listContainer.close( {
						selected : true
					});
					var rowData = {};
					var value = cmnPcr.strToJson($(trElement).attr("jsonValue"));

					for(var k in value){
						//增加类型判断 modified by ls 20230510
						rowData[k] = value[k] == null? null : (typeof(value[k]) == "string" ? decodeURIComponent(value[k]) : value[k]);
					} 
					var isChanged = false;
					var idField = options.idField;
					var textField = options.textField;
					if (idField == null) {
						isChanged = rowData[textField] != $(
								that).listDispunit(
								"getValue")[textField];
					} else {
						isChanged = rowData[idField] != $(
								that).listDispunit(
								"getValue")[idField];
					}

					$(that).listDispunit("setValue",
							rowData);
					if (isChanged) {
						if (options.options.changeFunc != undefined) {
							options.options.changeFunc(that, rowData, options.options.rowId);
						}
					} 
				}
			});
			
			//改在构造了grid控件后执行
			options.getListFunc( {
				value : value,
				options : options.options
			});
		}

		$(btn).click(function() {
			//增加eventType的传递 modified by ls 20220606
			showList(null, "click");
		});
		$(this).change(function() {
			var value = $(this).val();
			//增加eventType的传递 modified by ls 20220606
			showList(value, "input");
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
		$.fn.listDispunit.methods["setValue"](this, {});
	}
	return this;
}

$.fn.listDispunit.methods = {
	getValue : function(jq) {
		var value = cmnPcr.strToJson($(jq).attr("jsonValue"));

		for(var k in value){
			//增加类型判断 modified by ls 20230510
			value[k] = value[k] == null? null : (typeof(value[k]) == "string" ? decodeURIComponent(value[k]) : value[k]);
		}
		return value;
	},
	setValue : function(jq, value) {
		if (value == null) {
			value = {};
		}
		var textField = $(jq).attr("textField");
		$(jq).val(value[textField]);
		$(jq).attr("initValue", value[textField]);

		var idField = $(jq).attr("idField");
		if (idField != null) {
			$(jq).attr("idValue", value[idField]);
		}
		
		var encodeValue = {};
		for(var k in value){
			//增加类型判断 modified by ls 20230510
			encodeValue[k] = value[k] == null ? null : (typeof(value[k]) == "string" ? encodeURIComponent(value[k]) : value[k]);
		}
		$(jq).attr("jsonValue", cmnPcr.jsonToStr(encodeValue));
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("disabled", "disabled");
			//只读的背景色改为淡灰色 modified by lxin 20210824
			//$(jq).css("background-color", "#f6f6f6");
			$(jq).parent().css("right", "0px");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).removeAttr("disabled");
			//可编辑时的背景色改为透明 modified by lxin 20210824
			//$(jq).css("background-color", "#FFFFFF");
			$(jq).parent().css("right", null);
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	showList : function(jq, data) {
		var height = 31 * (data.length > 4 ? 4 : data.length);
		var listContainerId = $(jq).attr("listContainerId");
		var listCtrlId = $(jq).attr("listCtrlId");
		$("#" + listContainerId).height(height);
		var columnsWidth = cmnPcr.strToJson($("#" + listCtrlId).attr("columnsWidth"));
		
		//构造一行行的数据
		var listTrHtml = "";
		for(var i = 0; i < data.length; i++){
			var listRowId = listCtrlId + "_row" + i;
			listTrHtml += "<tr id=\"" + listRowId + "\" class=\"zlpListTr\">";
			var row = data[i];
			for(var f in columnsWidth){
				var cWidth = columnsWidth[f];
				var v = cmnPcr.html_encode(row[f]);
				if(cWidth != 0){
					listTrHtml += ("<td class=\"zlpListTd\" title=\"" + v + "\" style=\"width:" + (cWidth * 100) + "%;\">" + (v.length == 0 ? "&nbsp;" : v) + "</td>");
				}
			}
			
			listTrHtml += "</tr>";
		}
		$("#" + listCtrlId).html(listTrHtml);

		for(var i = 0; i < data.length; i++){
			var listRowId = listCtrlId + "_row" + i; 
			var row = data[i];
			var jsonValue = {};
			for(var f in row){
				//增加类型判断 modified by ls 20230510
				jsonValue[f] = (typeof(row[f]) == "string" ? encodeURIComponent(row[f]) : row[f]); 
			} 
			$("#" + listRowId).attr("jsonValue", cmnPcr.jsonToStr(jsonValue));
		}		 
		$("#" + listCtrlId).focus();
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.checkboxDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.checkboxDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "checkboxDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var html = "<div id=\"" + tableId + "\" class=\"zlpDispunitTable\" ></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + tableId);
		$(this).addClass("zlpDispunitContent"); 
		$("#" + tableId).attr("style", style);		
		$("#" + tableId).css("border", "0px");
		$("#" + tableId).css("height", "auto");
		
		//style=\"height:auto;padding-top:5px;\"
		$(this).css("margin", "0px");
		$(this).css("width", "18px");
		$(this).css("height", "18px");
		$(this).css("line-height", $("#" + tableId).height() + "px");
		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("dispunitType", "checkbox");
		
		$(this).click(function(event){ 
		    //阻止事件冒泡
		    event.stopPropagation();
		    if ($(this).is(":checked")) {
		        $(this).prop("checked", true);
		    } else {
		        $(this).prop("checked", false);
		    } 
		});

		$(this).change(function() {
			if (!$(this).checkboxDispunit("getReadonly")) {
				if (options.options.changeFunc != undefined) {
					var newValue = $(that).checkboxDispunit("getValue");
					//增加rowId参数传递 modified by ls 20190723
					options.options.changeFunc(that, newValue, options.options.rowId);
				}
			}
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.checkboxDispunit.methods = {
	getValue : function(jq) {
		return $(jq).prop("checked");
	},
	setValue : function(jq, value) { 
		$(jq).prop("checked", value); 
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			//只读的背景色改为淡灰色 modified by lxin 20210824
			//$(jq).css("background-color", "#f6f6f6");
			$(jq).attr("disabled", "disabled");
		} else {
			//可编辑时的背景色改为透明 modified by lxin 20210824
			//$(jq).css("background-color", "#FFFFFF");
			$(jq).removeAttr("disabled");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.timeDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.timeDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "timeDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"zlpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"zlpDispunitCtrl zlpDispunitCtrlWithButton\" ></div><div class=\"zlpDispunitBtn zlpDispunitDateTime\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		var that = this;
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("zlpDispunitContent");
		$(this).css("width", ""); 
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$("#" + tableId).find(".zlpDispunitBtn").height($("#" + tableId).height());

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("dispunitType", "time");
		
		//弹出编辑时间
		var btn = $("#" + tableId).find(".zlpDispunitBtn")[0];
		var showPop = function(btn, value) {
			var valueStr = cmnPcr.datetimeToStr(value, "yyyy-MM-dd HH:mm:ss");
			var rd = new Rolldate({
				value: valueStr, 
				format: 'YYYY-MM-DD hh:mm:ss',
				confirm: function(dateStr){
					var value = cmnPcr.strToTime(dateStr);
					$(that).timeDispunit("setValue", value);
					if (options.options.changeFunc != undefined) {
						//增加rowId参数传递 modified by ls 20190723
						options.options.changeFunc(that, $(that).val(), options.options.rowId);
					}
				}
			});
			rd.show();
		}
		$(btn).click(function() {
			var value = $(that).timeDispunit("getValue");
			showPop(this, value);
		});

		$(this).change(
			function() {
				if (!$(this).timeDispunit("getReadonly")) {
					var newValue = null;
					var str = $(this).val();
					if (cmnPcr.trim(str) == "") {
						newValue = null;
					} else {
						newValue = cmnPcr.strToDate(str);
					}
					if (cmnPcr.objectToStr(newValue, valueType.time) != $(
							this).attr("initValue")) {
						$(this).timeDispunit("setValue", newValue);
						if (options.options.changeFunc != undefined) {
							options.options.changeFunc(that, newValue, options.options.rowId);
						}
					}
				}
			});

		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.timeDispunit.methods = {
	getValue : function(jq) {
		var str = $(jq).val();
		return cmnPcr.strToObject(str, valueType.time);
	},
	setValue : function(jq, value) {
		var str = cmnPcr.objectToStr(value, valueType.time)
		$(jq).val(str);
		$(jq).attr("initValue", str);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("disabled", "disabled");
			//只读的背景色改为淡灰色 modified by lxin 20210824
			//$(jq).css("background-color", "#f6f6f6");
			$(jq).parent().css("right", "0px");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).removeAttr("disabled");
			//可编辑时的背景色改为透明 modified by lxin 20210824
			//$(jq).css("background-color", "#FFFFFF");
			$(jq).parent().css("right", null);
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.dateDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.dateDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "datelDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"zlpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"zlpDispunitCtrl zlpDispunitCtrlWithButton\" ></div><div class=\"zlpDispunitBtn zlpDispunitDateTime\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		var that = this;
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("zlpDispunitContent");
		$(this).css("width", ""); 
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$("#" + tableId).find(".zlpDispunitBtn").height(
				$("#" + tableId).height());

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("dispunitType", "date");

		//弹出编辑日期
		var btn = $("#" + tableId).find(".zlpDispunitBtn")[0];
		var showPop = function(btn, value) {
			var valueStr = cmnPcr.datetimeToStr(value, "yyyy-MM-dd");
			var rd = new Rolldate({
				value: valueStr, 
				format: 'YYYY-MM-DD',
				confirm: function(dateStr){
					var value = cmnPcr.strToTime(dateStr);
					$(that).dateDispunit("setValue", value);
					if (options.options.changeFunc != undefined) {
						options.options.changeFunc(that, $(that).val(), options.options.rowId);
					}
				}
			});
			rd.show();
		}
		$(btn).click(function() {
			var value = $(that).timeDispunit("getValue");
			showPop(this, value);
		});

		$(this).change(
			function() {
				if (!$(this).dateDispunit("getReadonly")) {
					var newValue = null;
					var str = $(this).val();
					if (cmnPcr.trim(str) == "") {
						newValue = null;
					} else {
						newValue = cmnPcr.strToDate(str);
					}
					if (cmnPcr.objectToStr(newValue, valueType.time) != $(
							this).attr("initValue")) {
						$(this).dateDispunit("setValue", newValue);
						if (options.options.changeFunc != undefined) {
							//增加rowId参数传递 modified by ls 20190723
							options.options.changeFunc(that, newValue, options.options.rowId);
						}
					}
				}
			});

		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.dateDispunit.methods = {
	getValue : function(jq) {
		var str = $(jq).val();
		return cmnPcr.strToObject(str, valueType.date);
	},
	setValue : function(jq, value) {
		var str = cmnPcr.objectToStr(value, valueType.date);
		$(jq).val(str);
		$(jq).attr("initValue", str);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("disabled", "disabled");
			//只读的背景色改为淡灰色 modified by lxin 20210824
			//$(jq).css("background-color", "#f6f6f6");
			$(jq).parent().css("right", "0px");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).removeAttr("disabled");
			//可编辑时的背景色改为透明 modified by lxin 20210824
			//$(jq).css("background-color", "#FFFFFF");
			$(jq).parent().css("right", null);
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.decimalDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.decimalDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "decimalDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"zlpDispunitTable\"></div>";

		var that = this;
		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		var ctrlWidth = Math.floor($(this).width()) - 2;
		$(this).width(ctrlWidth);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + tableId);
		$(this).addClass("zlpDispunitContent"); 
		$(this).css("ime-mode", "disabled");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);	
		$(this).attr("fieldName", options.options.fieldName);
		$(this)
				.attr("onkeypress",
						"return event.key >= '0' && event.key <= '9' || event.key == '.' || event.key == '-';");
		$(this).attr("onpaste",
				"return !clipboardData.getData('text').match(/\D/)");
		$(this).attr("ondragenter", "return false;");
		$(this).attr("dispunitType", "decimal");

		if (options.options.changeFunc != undefined) {
			if (!$(this).decimalDispunit("getReadonly")) {
				$(this)
						.change(
								function() {
									var newValue = null;
									var str = $(this).val();
									if (cmnPcr.trim(str) == "") {
										newValue = null;
									} else {
										newValue = cmnPcr.strToDecimal(str);
										if (isNaN(newValue)) {
											newValue = null;
										} else {
											newValue = cmnPcr.toFixed(newValue,
													options.precision);
										}
									}
									if (cmnPcr.objectToStr(newValue,
											valueType.decimal) != $(this).attr(
											"initValue")) {
										$(this).decimalDispunit("setValue",
												newValue);
										if (options.options.changeFunc != undefined) {
											//增加rowId参数传递 modified by ls 20190723
											options.options.changeFunc(that, newValue, options.options.rowId);
										}
									} else {
										$(this).decimalDispunit("setValue",
												newValue);
									}
								});
			}
		}
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.decimalDispunit.methods = {
	getValue : function(jq) {
		var str = $(jq).val();
		return cmnPcr.strToObject(str, valueType.decimal);
	},
	setValue : function(jq, value) {
		var str = cmnPcr.objectToStr(value, valueType.decimal);
		$(jq).val(str);
		$(jq).attr("initValue", str);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			//只读的背景色改为淡灰色 modified by lxin 20210824
			//$(jq).css("background-color", "#f6f6f6");
			$(jq).attr("disabled", "disabled");
		} else {
			//可编辑时的背景色改为透明 modified by lxin 20210824
			//$(jq).css("background-color", "#FFFFFF");
			$(jq).removeAttr("disabled");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.textDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.textDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "textDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var html = "<div id=\"" + tableId
				+ "\" class=\"zlpDispunitTable\" ></div>";

		var style = $(this).attr("style");
		//var ctrlHeight=$(parent).height();
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		var ctrlWidth = Math.floor($(this).width()) - 2;
		$(this).width(ctrlWidth);
		$(parent).append(html).height(ctrlHeight);
		$("#" + tableId).height(ctrlHeight);	
		$(this).appendTo("#" + tableId);
		$(this).addClass("zlpDispunitContent"); 
		$(this).css("resize", "none");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("dispunitType", "text");
		
		$(this).change(function() {
			if (!$(this).textDispunit("getReadonly")) {
				if (options.options.changeFunc != undefined) {
					//增加rowId参数传递 modified by ls 20190723
					options.options.changeFunc(that, $(that).val(), options.options.rowId);
				}
			}
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.textDispunit.methods = {
	getValue : function(jq) {
		return $(jq).val();
	},
	setValue : function(jq, value) {
		$(jq).val(value);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			//只读的背景色改为淡灰色 modified by lxin 20210824
			//$(jq).css("background-color", "#f6f6f6");
			$(jq).attr("disabled", "disabled");
		} else {
			//可编辑时的背景色改为透明 modified by lxin 20210824
			//$(jq).css("background-color", "#FFFFFF");
			$(jq).removeAttr("disabled");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.textareaDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.textareaDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "textareaDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		
		//缺少了一个>号 modify by ls 20190627
		var html = "<div id=\"" + tableId + "\" class=\"zlpDispunitTable\" ></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);

		//应该appendTo tableId modify by ls 20190627
		$(this).appendTo("#" + tableId);
		
		$(this).addClass("zlpDispunitContent"); 
		$(this).css("resize", "none");
		$(this).attr("dispunitType", "textarea");

		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("spellcheck", false);
		$(this).change(function() {
			if (!$(this).textareaDispunit("getReadonly")) {
				if (options.options.changeFunc != undefined) {
					//增加rowId参数传递 modified by ls 20190723
					options.options.changeFunc(that, $(that).val(), options.options.rowId);
				}
			}
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.textareaDispunit.methods = {
	getValue : function(jq) {
		return $(jq).val();
	},
	setValue : function(jq, value) {
		$(jq).val(value);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			//只读的背景色改为淡灰色 modified by lxin 20210824
			//$(jq).css("background-color", "#f6f6f6");
			$(jq).attr("disabled", "disabled");
		} else {
			//可编辑时的背景色改为透明 modified by lxin 20210824
			//$(jq).css("background-color", "#FFFFFF");
			$(jq).removeAttr("disabled");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.dispunit = function(options, value) {
	if (typeof options == "string") {

	} else {

	}
	return this;
}

$.fn.dispunit.methods = {
	getValue : function(jq) {
	},
	setValue : function(jq, value) {
	},
	setReadonly : function(jq, isReadonly) {
	}
}